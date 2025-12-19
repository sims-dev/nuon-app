import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { firebaseAdmin } from '../config/firebase-admin';
import { PrismaService } from '../services/prisma.service';

export interface AuthenticatedRequest extends Request {
    user?: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly prisma: PrismaService) {}

    async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const raw = req.header('Authorization') || '';
            const token = raw.replace('Bearer ', '').trim();

            // Development bypass header
            if (!token && process.env.NODE_ENV !== 'production') {
                const devBypass = req.header('x-dev-bypass');
                if (devBypass) {
                    const expected = process.env.DEV_BYPASS_SECRET || 'dev_secret';
                    if (devBypass === expected) {
                        const adminEmail = process.env.DEV_BYPASS_ADMIN_EMAIL || 'admin@nuonclub.com';
                        const adminUser = await this.prisma.user.findFirst({
                            where: { email: adminEmail }
                        });
                        if (adminUser) {
                            req.user = adminUser;
                            return next();
                        }
                    }
                }
            }

            if (!token) {
                console.warn('[auth] No Authorization header present');
                return res.status(401).json({ message: 'No token, authorization denied' });
            }

            // Try Firebase verification first
            try {
                const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
                let user = await this.prisma.user.findFirst({
                    where: { email: decodedToken.email }
                });

                if (!user) {
                    const nurseRole = await this.prisma.role.findFirst({ where: { name: 'nurse' } });
                    if (!nurseRole) {
                        throw new Error('Nurse role not found');
                    }
                    user = await this.prisma.user.create({
                        data: {
                            name: decodedToken.name || decodedToken.email || 'Firebase User',
                            email: decodedToken.email || `${decodedToken.email || decodedToken.uid}@firebase.local`,
                            userRole: { connect: { id: nurseRole.id } },
                            bio: 'Firebase authenticated user'
                        }
                    });
                }

                req.user = user;
                return next();
            } catch (fbErr) {
                // Not a valid Firebase token, fall through to JWT
            }

            // Fallback: legacy JWT tokens
            try {
                const secret = process.env.JWT_SECRET || 'fallback_secret';
                const decoded = jwt.verify(token, secret) as any;
                console.log('[auth] Decoded JWT:', decoded);

                const user = await this.prisma.user.findUnique({
                    where: { id: BigInt(decoded.id) }
                });

                if (!user) {
                    console.warn('[auth] No user found for decoded id:', decoded.id);
                    return res.status(401).json({ message: 'Token is not valid' });
                }

                console.log('[auth] User found for token:', user.email || user.id);
                req.user = user;
                return next();
            } catch (err) {
                return res.status(401).json({ message: 'Token is not valid' });
            }
        } catch (error) {
            console.error('[auth] Unexpected auth error:', error);
            res.status(401).json({ message: 'Token is not valid' });
        }
    }
}