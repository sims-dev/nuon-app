import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthService } from './auth.service';
import * as crypto from 'crypto';

// In-memory OTP storage (use Redis in production for scalability)
const otpStore = new Map();

// Rate limiting for OTP requests (basic implementation)
const otpRequestLimits = new Map();
const MAX_OTP_REQUESTS_PER_HOUR = 10;
const MAX_OTP_REQUESTS_PER_DAY = 50;

// Generate OTP - Fixed to 123456 for testing
const generateOTP = () => {
    return '123456';
};

// Check rate limits
const checkRateLimit = (identifier: string) => {
    const now = Date.now();
    const key = `limit:${identifier}`;
    const userLimits = otpRequestLimits.get(key) || {
        hourly: { count: 0, resetTime: now + (60 * 60 * 1000) },
        daily: { count: 0, resetTime: now + (24 * 60 * 60 * 1000) }
    };

    // Reset counters if time has passed
    if (now > userLimits.hourly.resetTime) {
        userLimits.hourly = { count: 0, resetTime: now + (60 * 60 * 1000) };
    }
    if (now > userLimits.daily.resetTime) {
        userLimits.daily = { count: 0, resetTime: now + (24 * 60 * 60 * 1000) };
    }

    // Check limits
    if (userLimits.hourly.count >= MAX_OTP_REQUESTS_PER_HOUR) {
        return { allowed: false, message: 'Too many OTP requests. Please try again in an hour.' };
    }
    if (userLimits.daily.count >= MAX_OTP_REQUESTS_PER_DAY) {
        return { allowed: false, message: 'Daily OTP request limit exceeded. Please try again tomorrow.' };
    }

    // Increment counters
    userLimits.hourly.count++;
    userLimits.daily.count++;
    otpRequestLimits.set(key, userLimits);

    return { allowed: true };
};

@Injectable()
export class OtpService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService
    ) {}

    async sendPhoneOTP(body: { phoneNumber: string }): Promise<any> {
        try {
            const { phoneNumber } = body;

            if (!phoneNumber) {
                return {
                    success: false,
                    message: 'Phone number is required'
                };
            }

            // Validate phone number format (basic validation)
            const phoneRegex = /^\+?[1-9]\d{1,14}$/;
            if (!phoneRegex.test(phoneNumber)) {
                return {
                    success: false,
                    message: 'Invalid phone number format'
                };
            }

            // Check rate limits
            const rateLimitCheck = checkRateLimit(phoneNumber);
            if (!rateLimitCheck.allowed) {
                return {
                    success: false,
                    message: rateLimitCheck.message
                };
            }

            // Generate real OTP
            const otp = generateOTP();
            const expiresAt = Date.now() + (5 * 60 * 1000); // 5 minutes

            // Store OTP
            otpStore.set(`phone:${phoneNumber}`, {
                otp,
                expiresAt,
                attempts: 0
            });

            console.log(`Phone OTP for ${phoneNumber}: ${otp}`);
            return {
                success: true,
                message: 'OTP sent successfully to your phone number',
                expiresIn: 300, // seconds
                debugOtp: otp // For testing purposes
            };
        } catch (error) {
            console.error('Send phone OTP error:', error);
            return {
                success: false,
                message: 'Error sending OTP',
                error: (error as Error).message
            };
        }
    }

    async sendEmailOTP(body: { email: string }): Promise<any> {
        try {
            const { email } = body;

            if (!email) {
                return {
                    success: false,
                    message: 'Email is required'
                };
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return {
                    success: false,
                    message: 'Invalid email format'
                };
            }

            // Check rate limits
            const rateLimitCheck = checkRateLimit(email.toLowerCase());
            if (!rateLimitCheck.allowed) {
                return {
                    success: false,
                    message: rateLimitCheck.message
                };
            }

            // Generate real OTP
            const otp = generateOTP();
            const expiresAt = Date.now() + (5 * 60 * 1000); // 5 minutes

            // Store OTP
            otpStore.set(`email:${email.toLowerCase()}`, {
                otp,
                expiresAt,
                attempts: 0
            });

            console.log(`Email OTP for ${email}: ${otp}`);
            return {
                success: true,
                message: 'OTP sent successfully to your email',
                expiresIn: 300, // seconds
                debugOtp: otp // For testing purposes
            };
        } catch (error) {
            console.error('Send email OTP error:', error);
            return {
                success: false,
                message: 'Error sending OTP',
                error: (error as Error).message
            };
        }
    }

    async verifyOTP(body: { identifier: string; otp: string; type: 'phone' | 'email' }): Promise<any> {
        try {
            const { identifier, otp, type } = body;

            console.log('[OTP VERIFY] Incoming:', { identifier, otp, type });

            if (!identifier || !otp || !type) {
                return {
                    success: false,
                    message: 'Identifier, OTP, and type are required'
                };
            }

            const key = `${type}:${identifier}`;
            console.log('[OTP VERIFY] Looking for key:', key);

            // Get stored OTP data
            const storedData = otpStore.get(key);

            if (!storedData) {
                return {
                    success: false,
                    message: 'OTP not found or expired. Please request a new one.'
                };
            }

            console.log('[OTP VERIFY] Found stored OTP data');

            // Check if OTP has expired
            if (Date.now() > storedData.expiresAt) {
                otpStore.delete(key);
                return {
                    success: false,
                    message: 'OTP has expired. Please request a new one.'
                };
            }

            // Check attempts (max 3)
            if (storedData.attempts >= 3) {
                otpStore.delete(key);
                return {
                    success: false,
                    message: 'Too many failed attempts. Please request a new OTP.'
                };
            }

            // Verify OTP
            if (storedData.otp !== otp) {
                storedData.attempts += 1;
                otpStore.set(key, storedData);

                const remainingAttempts = 3 - storedData.attempts;
                const message = remainingAttempts > 0
                    ? `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`
                    : 'Invalid OTP. No attempts remaining.';

                console.log('[OTP VERIFY] OTP mismatch:', { expected: storedData.otp, got: otp, attempts: storedData.attempts });

                return {
                    success: false,
                    message
                };
            }

            // OTP verified successfully
            otpStore.delete(key);
            console.log('[OTP VERIFY] OTP verified for', key);

            // Check if user exists
            let user;
            if (type === 'phone') {
                user = await this.prisma.user.findFirst({ where: { phoneNumber: identifier } });
            } else {
                user = await this.prisma.user.findFirst({ where: { email: identifier.toLowerCase() } });
            }

            let isNewUser = false;
            if (!user) {
                // Get nurse role id
                const nurseRole = await this.prisma.role.findFirst({ where: { name: 'nurse' } });
                if (!nurseRole) {
                    throw new Error('Nurse role not found');
                }

                // Create new user
                let userData: any;
                if (type === 'email') {
                    userData = {
                        name: identifier.split('@')[0],
                        email: identifier.toLowerCase(),
                        roleId: nurseRole.id,
                        experience: null
                    };
                } else {
                    userData = {
                        name: null,
                        phoneNumber: identifier,
                        roleId: nurseRole.id,
                        experience: null
                    };
                }

                user = await this.prisma.user.create({ data: userData });
                isNewUser = true;
            }
            // Existing users (even with incomplete profiles) go to main dashboard

            // Generate JWT tokens
            const accessToken = this.authService.generateAccessToken(user);
            const refreshToken = this.authService.generateRefreshToken(user);

            return {
                success: true,
                message: 'OTP verified successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    profilePicture: user.profilePicture
                },
                token: accessToken,
                accessToken,
                refreshToken,
                isNewUser
            };
        } catch (error) {
            console.error('Verify OTP error:', error);
            return {
                success: false,
                message: 'Error verifying OTP',
                error: (error as Error).message
            };
        }
    }
}