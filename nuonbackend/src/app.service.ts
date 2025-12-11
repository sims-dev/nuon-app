import { Injectable } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AppService {
    constructor(private readonly prisma: PrismaService) {}

    getHello(): object {
        //return 'Hello from NestJS + Docker!';
        return {
            message: 'Hello, world!',
            success: true,
            data: {
                timestamp: new Date()
            }
        };
    }

    // Ensure an admin user exists on startup
    async ensureAdminUser(): Promise<void> {
        try {
            console.log('⏳ Checking for admin user...');
            const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nuonhub.com').toLowerCase();
            const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123';
            console.log('🔑 Admin password from env or default:', adminPassword);

            // Find or create admin role
            let adminRole = await this.prisma.role.findFirst({
                where: { name: 'admin' }
            });

            if (!adminRole) {
                adminRole = await this.prisma.role.create({
                    data: { name: 'admin' }
                });
            }

            // Check if admin user already exists
            const existing = await this.prisma.user.findFirst({
                where: {
                    email: adminEmail
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    password: true
                }
            });

            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            if (existing) {
                // Always update password to ensure it's correct
                await this.prisma.user.update({
                    where: { id: existing.id },
                    data: {
                        password: hashedPassword,
                        role_id: Number(adminRole.id),
                        active: true
                    }
                });
                console.log('🔄 Admin password updated');
                console.log('✅ Admin user exists:', adminEmail);
                return;
            }

            // Create admin user
            const admin = await this.prisma.user.create({
                data: {
                    name: 'System Administrator',
                    email: adminEmail,
                    password: hashedPassword,
                    role_id: Number(adminRole.id),
                    active: true
                } as any
            });

            console.log('🎉 Admin user created:', adminEmail);
            console.log('🔑 Admin login credentials:');
            console.log('   Email:', adminEmail);
            console.log('   Password:', adminPassword);
        } catch (err) {
            console.log('⚠️ Unable to ensure admin user:', (err as Error).message);
        }
    }
}
