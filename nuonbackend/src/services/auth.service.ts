import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { UserDto } from '../dto/user.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    // Generate JWT tokens
    generateAccessToken(user: any): string {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                mobile: user.mobile || null,
                role: user.roles?.name || 'user'
            },
            process.env.ACCESS_SECRET || 'access-secret-key',
            { expiresIn: '24h' }
        );
    }

    generateRefreshToken(user: any): string {
        return jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.REFRESH_SECRET || 'refresh-secret-key',
            { expiresIn: '7d' }
        );
    }

    async login(email: string, password: string): Promise<Record<string, unknown>> {
        password = password.trim(); // Trim whitespace
        console.log('[LOGIN] DEBUG: Looking for user with email:', email.toLowerCase());
        const user = await this.prisma.user.findFirst({
            where: { email: email.toLowerCase() }
        });

        console.log('[LOGIN] DEBUG: User found:', !!user);
        if (user) {
            console.log('[LOGIN] DEBUG: User id:', user.id, 'email:', user.email, 'active:', user.active, 'hasPassword:', !!user.password);
        }

        if (!user) {
            throw new HttpException(
                { success: false, message: 'Invalid credentials' },
                HttpStatus.UNAUTHORIZED
            );
        }

        if (!user.password) {
            throw new HttpException(
                { success: false, message: 'Account not fully registered. Please complete your profile first.' },
                HttpStatus.UNAUTHORIZED
            );
        }

        console.log('[LOGIN] DEBUG: Comparing password');
        console.log('[LOGIN] DEBUG: Input password length:', password.length);
        console.log('[LOGIN] DEBUG: Stored hash length:', user.password.length);
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('[LOGIN] DEBUG: Password valid:', isValidPassword);
        // Additional debug: check against default admin password
        const defaultAdminPass = 'admin@123';
        const isDefaultValid = await bcrypt.compare(defaultAdminPass, user.password);
        console.log('[LOGIN] DEBUG: Default admin password valid:', isDefaultValid);
        if (!isValidPassword) {
            throw new HttpException(
                { success: false, message: 'Invalid credentials' },
                HttpStatus.UNAUTHORIZED
            );
        }

        // Get role name from roleId
        const role = await this.prisma.role.findUnique({
            where: { id: (user as any).roleId },
            select: { name: true }
        });

        const accessToken = this.generateAccessToken({
            id: user.id,
            email: user.email,
            //mobile: user.mobile || null,
            role: role?.name || 'user'
        });
        const refreshToken = this.generateRefreshToken({
            id: user.id,
            email: user.email
        });

        return {
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                //mobile: user.mobile,
                role: role?.name || 'user'
            },
            accessToken,
            refreshToken
        };
    }

    async register(data: {
        name: string;
        email?: string;
        password?: string; // Made optional for profile completion
        phoneNumber: string;
        specialization?: string;
        experience?: number;
        organization?: string;
        city?: string;
        state?: string;
        location?: string;
        role?: string;
        isProfileComplete?: boolean;
        profileIncomplete?: boolean;
        highestQualification?: string;
        registrationNumber?: string;
    }): Promise<Record<string, unknown>> {
        // Check for existing user by phone number
        const existingUserByPhone = await this.prisma.user.findUnique({
            where: { phoneNumber: data.phoneNumber }
        });

        if (existingUserByPhone) {
            // Always allow profile completion/update
            const updateData: any = {
                name: data.name,
                email: data.email ? data.email.toLowerCase() : null,
                specialization: data.specialization || '',
                experience: data.experience || 0,
                organization: data.organization || '',
                city: data.city || '',
                state: data.state || '',
                location: data.location || '',
                hospital: data.organization || '', // Map organization to hospital
                qualification: data.highestQualification || '',
                registrationNumber: data.registrationNumber || '',
                isProfileComplete: data.isProfileComplete !== undefined ? data.isProfileComplete : true
            };

            // Only update password if provided (for profile completion, password might not be provided)
            if (data.password) {
                updateData.password = await bcrypt.hash(data.password, 10);
            }

            const updatedUser = await this.prisma.user.update({
                where: { id: existingUserByPhone.id },
                data: updateData,
                include: {
                    userRole: true
                } as any
            });

            const accessToken = this.generateAccessToken(updatedUser);
            const refreshToken = this.generateRefreshToken(updatedUser);
            return {
                success: true,
                message: 'Profile completed successfully',
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phoneNumber: updatedUser.phoneNumber,
                    role: updatedUser.role,
                    specialization: updatedUser.specialization,
                    experience: updatedUser.experience,
                    organization: updatedUser.organization,
                    city: updatedUser.city,
                    state: updatedUser.state,
                    location: updatedUser.location,
                    isProfileComplete: updatedUser.isProfileComplete,
                    profilePicture: updatedUser.profilePicture
                },
                accessToken,
                refreshToken
            };
        }

        // Check email uniqueness if provided
        if (data.email) {
            const existingUserByEmail = await this.prisma.user.findUnique({
                where: { email: data.email.toLowerCase() }
            });
            if (existingUserByEmail) {
                throw new HttpException(
                    { success: false, message: 'User already exists with this email address' },
                    HttpStatus.BAD_REQUEST
                );
            }
        }

        // Get role id
        const role = await this.prisma.role.findFirst({
            where: { name: data.role || 'nurse' }
        });
        if (!role) {
            throw new HttpException(
                { success: false, message: 'Invalid role' },
                HttpStatus.BAD_REQUEST
            );
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email ? data.email.toLowerCase() : null,
                phoneNumber: data.phoneNumber,
                password: hashedPassword,
                roleId: role.id,
                specialization: data.specialization || '',
                experience: data.experience || 0,
                organization: data.organization || '',
                city: data.city || '',
                state: data.state || '',
                location: data.location || '',
                bio: 'Registered user',
                isProfileComplete: true
            } as any,
            include: {
                userRole: true
            } as any
        });

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);
        return {
            success: true,
            message: 'Registration successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: (user as any).userRole?.name || 'user',
                specialization: user.specialization,
                experience: user.experience,
                organization: user.organization,
                city: user.city,
                state: user.state,
                location: user.location,
                isProfileComplete: user.isProfileComplete,
                profilePicture: user.profilePicture
            },
            accessToken,
            refreshToken
        };
    }

    async updateProfile(userId: bigint, data: {
        name?: string;
        email?: string;
        specialization?: string;
        experience?: number;
        currentWorkplace?: string;
        registrationNumber?: string;
        highestQualification?: string;
        city?: string;
        state?: string;
        organization?: string;
        location?: string;
    }): Promise<Record<string, unknown>> {
        // Check if email is being changed and if it's already taken by another user
        if (data.email) {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    email: data.email.toLowerCase(),
                    id: { not: userId } // Exclude current user
                }
            });
            if (existingUser) {
                throw new HttpException(
                    { success: false, message: 'Email address is already in use by another user' },
                    HttpStatus.BAD_REQUEST
                );
            }
        }

        // Check if profile is complete based on required fields
        const isProfileComplete: boolean =
            !!(data.name &&
            data.specialization &&
            data.experience !== undefined &&
            data.currentWorkplace &&
            data.registrationNumber &&
            data.highestQualification);

        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email ? data.email.toLowerCase() : undefined,
                specialization: data.specialization,
                experience: data.experience,
                hospital: data.currentWorkplace, // Map to hospital field
                registrationNumber: data.registrationNumber,
                qualification: data.highestQualification,
                city: data.city,
                state: data.state,
                organization: data.organization,
                location: data.location,
                isProfileComplete: isProfileComplete
            }
        });

        return {
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: (user as any).userRole?.name || 'user',
                specialization: user.specialization,
                experience: user.experience,
                currentWorkplace: user.hospital,
                registrationNumber: user.registrationNumber,
                highestQualification: user.qualification,
                city: user.city,
                state: user.state,
                organization: user.organization,
                location: user.location,
                isProfileComplete: user.isProfileComplete,
                profilePicture: user.profilePicture
            }
        };
    }

    async getCurrentProfile(userId: bigint): Promise<Record<string, unknown>> {
        // Reuse getProfile logic but ensure consistent response shape
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new HttpException(
                { success: false, message: 'User not found' },
                HttpStatus.NOT_FOUND
            );
        }
        return {
            success: true,
            user: {
                _id: user.id.toString(),
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: (user as any).userRole?.name || 'user',
                specialization: user.specialization,
                experience: user.experience,
                location: user.location,
                profilePicture: user.profilePicture || null,
                isProfileComplete: user.isProfileComplete
            }
        };
    }

    async createOrUpdateProfile(userId: bigint, data: { name?: string; specialization?: string; experience?: number; location?: string; profilePicture?: string }): Promise<Record<string, unknown>> {
        try {
            const updated = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    name: data.name,
                    specialization: data.specialization,
                    experience: data.experience,
                    location: data.location,
                    profilePicture: data.profilePicture,
                    isProfileComplete: true
                }
            });
            return {
                success: true,
                message: 'Profile saved',
                user: {
                    _id: updated.id.toString(),
                    id: updated.id.toString(),
                    name: updated.name,
                    email: updated.email,
                    phoneNumber: updated.phoneNumber,
                    profilePicture: updated.profilePicture
                }
            };
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getProfile(userId: bigint): Promise<Record<string, unknown>> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new HttpException(
                { success: false, message: 'User not found' },
                HttpStatus.NOT_FOUND
            );
        }

        return {
            success: true,
            user
        };
    }

    // OTP methods (keeping for compatibility)
    async loginOtp(data: UserDto): Promise<Record<string, unknown>> {
        try {
            let user = await this.prisma.user.findUnique({
                where: { phoneNumber: data.mobile?.toString() }
            });
            let userId: bigint;
            if (user) {
                userId = BigInt(user.id);
            } else {
                const role = await this.prisma.role.findFirst({
                    where: { name: 'nurse' }
                });
                if (!role) {
                    throw new HttpException(
                        { success: false, message: 'Role not found' },
                        HttpStatus.INTERNAL_SERVER_ERROR
                    );
                }
                user = await this.prisma.user.create({
                    data: {
                        name: 'OTP User',
                        email: null,
                        phoneNumber: data.mobile?.toString() || '',
                        role_id: role.id,
                        bio: 'OTP authenticated user'
                    } as any
                });
                userId = BigInt(user.id);
            }

            const otpCode = Math.floor(100000 + Math.random() * 900000);

            await this.prisma.otp.deleteMany({
                where: { userId }
            });

            await this.prisma.otp.create({
                data: {
                    otpCode,
                    userId,
                    verified: false,
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
                }
            });
            return {
                data: user,
                status: 'success',
                error: false
            };
        } catch (e: unknown) {
            throw new HttpException(
                {
                    message: 'Some database issue occurred',
                    status: 'error',
                    error: (e as Error).message
                },
                HttpStatus.UNPROCESSABLE_ENTITY
            );
        }
    }

    async createRole(data: { name: string }): Promise<Record<string, unknown>> {
        try {
            const role = await this.prisma.role.create({
                data: { name: data.name }
            });
            return {
                data: role,
                status: 'success',
                error: false
            };
        } catch (e: unknown) {
            throw new HttpException(
                {
                    message: 'Some database issue occurred',
                    status: 'error',
                    error: (e as Error).message
                },
                HttpStatus.UNPROCESSABLE_ENTITY
            );
        }
    }

    /*async login(
        data: UserDto
    ): Promise<{ accessToken: string; refreshToken: string; maxAge: number }> {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user) {
            throw new HttpException(
                { message: 'User not found', status: 'error' },
                HttpStatus.UNAUTHORIZED
            );
        }

        const localUserId = user.id;

        const { rememberMe } = data;
        const accessSecret = process.env.ACCESS_SECRET || 'accessSecret';
        const refreshSecret = process.env.REFRESH_SECRET || 'refreshSecret';

        let playerDetail: Record<string, unknown> = await this.gameProviderFactory
            .getService('betwarrior')
            .loginUser(data);

        playerDetail = playerDetail.data as Record<string, unknown>;
        //console.log('Player Detail:', playerDetail);

        const accessToken = jwt.sign(
            {
                userId: playerDetail.partyId as string,
                localUserId: localUserId as bigint,
                sessionKey: playerDetail.sessionKey as string
            },
            accessSecret,
            {
                expiresIn: '15m'
            }
        );

        const refreshToken = jwt.sign(
            {
                userId: playerDetail.partyId as string,
                sessionKey: playerDetail.sessionKey as string
            },
            refreshSecret,
            {
                expiresIn: rememberMe ? '30d' : '1h'
            }
        );

        const maxAge = rememberMe ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60;

        return { accessToken, refreshToken, maxAge };
    }*/

    async mentorLogin(email: string, password: string): Promise<Record<string, unknown>> {
        const mentor = await this.prisma.user.findFirst({
            where: {
                email: email.toLowerCase(),
                OR: [
                    { isMentor: true },
                    { userRole: { name: 'mentor' } }
                ]
            },
            include: {
                userRole: true
            } as any
        });

        if (!mentor) {
            throw new HttpException(
                { success: false, message: 'Invalid credentials' },
                HttpStatus.UNAUTHORIZED
            );
        }

        if (!mentor.password) {
            throw new HttpException(
                { success: false, message: 'Account not fully registered. Please complete your profile first.' },
                HttpStatus.UNAUTHORIZED
            );
        }

        const isValidPassword = await bcrypt.compare(password, mentor.password);
        if (!isValidPassword) {
            throw new HttpException(
                { success: false, message: 'Invalid credentials' },
                HttpStatus.UNAUTHORIZED
            );
        }

        const accessToken = this.generateAccessToken({
            id: mentor.id,
            email: mentor.email,
            role: 'mentor'
        });
        const refreshToken = this.generateRefreshToken({
            id: mentor.id,
            email: mentor.email
        });

        return {
            success: true,
            message: 'Login successful',
            user: {
                id: mentor.id,
                name: mentor.name,
                email: mentor.email,
                role: 'mentor'
            },
            accessToken,
            refreshToken
        };
    }



    async refresh(refreshToken: string): Promise<{ status: string; accessToken: string }> {
        if (!refreshToken) {
            throw new HttpException(
                { message: 'Refresh token is required', status: 'error' },
                HttpStatus.BAD_REQUEST
            );
        }

        try {
            // Verify the refresh token
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'refresh-secret-key') as any;

            // Find the user
            const user = await this.prisma.user.findUnique({
                where: { id: BigInt(decoded.id) }
            });

            if (!user) {
                throw new HttpException(
                    { message: 'User not found', status: 'error' },
                    HttpStatus.UNAUTHORIZED
                );
            }

            // Generate new access token
            const accessToken = this.generateAccessToken(user);

            return {
                status: 'success',
                accessToken
            };
        } catch (error) {
            throw new HttpException(
                { message: 'Invalid refresh token', status: 'error' },
                HttpStatus.UNAUTHORIZED
            );
        }
    }
}
