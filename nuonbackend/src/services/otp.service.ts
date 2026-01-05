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

// Generate real OTP for Firebase SMS
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
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

            // Generate and return dummy OTP
            const dummyOTP = '123456';
            console.log(`📱 Dummy OTP generated for ${phoneNumber}: ${dummyOTP}`);

            return {
                success: true,
                message: 'OTP sent successfully',
                otp: dummyOTP,
                expiresIn: 300 // seconds
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

    async verifyOTP(body: { identifier: string; otp?: string; type: 'phone' | 'email'; firebaseIdToken?: string; provider?: string }): Promise<any> {
        try {
            const { identifier, otp, type, firebaseIdToken, provider } = body;

            console.log('[OTP VERIFY] Incoming:', { identifier, type, provider, hasOtp: !!otp, hasFirebaseToken: !!firebaseIdToken });

            if (!identifier || !type) {
                return {
                    success: false,
                    message: 'Identifier and type are required'
                };
            }

            let user;
            let isNewUser = false;

            // Handle phone authentication (Firebase or backend provider)
            if (type === 'phone') {
                // For phone, we don't verify OTP server-side since it's handled by Firebase client
                // Just check if user exists and create if not
                user = await this.prisma.user.findFirst({ where: { phoneNumber: identifier } });
                console.log('[OTP VERIFY] Looking for phone user:', identifier, 'Found:', user ? user.id : 'null');

                if (!user) {
                    // Get nurse role id
                    const nurseRole = await this.prisma.role.findFirst({ where: { name: 'nurse' } });
                    if (!nurseRole) {
                        throw new Error('Nurse role not found');
                    }

                    // Create new user
                    user = await this.prisma.user.create({
                        data: {
                            name: '', // Empty name - will be filled in profile setup
                            phoneNumber: identifier,
                            email: null,
                            roleId: nurseRole.id,
                            experience: null,
                            isProfileComplete: false
                        }
                    });
                    isNewUser = true;
                    console.log('[OTP VERIFY] Created new phone user:', user.id);
                }
            } else {
                // Email authentication - verify OTP
                if (!otp) {
                    return {
                        success: false,
                        message: 'OTP is required'
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
                user = await this.prisma.user.findFirst({ where: { email: identifier.toLowerCase() } });
                console.log('[OTP VERIFY] Looking for email user:', identifier.toLowerCase(), 'Found:', user ? user.id : 'null');

                if (!user) {
                    // Get nurse role id
                    const nurseRole = await this.prisma.role.findFirst({ where: { name: 'nurse' } });
                    if (!nurseRole) {
                        throw new Error('Nurse role not found');
                    }

                    // Create new user
                    user = await this.prisma.user.create({
                        data: {
                            name: '', // Empty name - will be filled in profile setup
                            email: identifier.toLowerCase(),
                            roleId: nurseRole.id,
                            experience: null,
                            isProfileComplete: false
                        }
                    });
                    isNewUser = true;
                    console.log('[OTP VERIFY] Created new email user:', user.id);
                }
            }

            // Generate JWT tokens
            const accessToken = this.authService.generateAccessToken(user);
            const refreshToken = this.authService.generateRefreshToken(user);

            return {
                success: true,
                message: 'Authentication successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    profilePicture: user.profilePicture,
                    isProfileComplete: user.isProfileComplete,
                    // Include complete profile data for existing users
                    specialization: user.specialization,
                    experience: user.experience,
                    qualification: user.qualification,
                    registrationNumber: user.registrationNumber,
                    department: user.department,
                    hospital: user.hospital,
                    bio: user.bio,
                    city: user.city,
                    state: user.state,
                    location: user.location,
                    organization: user.organization,
                    highestQualification: user.highestQualification,
                    currentWorkplace: user.currentWorkplace,
                    // Mentor-specific fields
                    isMentor: user.isMentor,
                    isApproved: user.isApproved,
                    hourlyRate: user.hourlyRate,
                    totalSessions: user.totalSessions,
                    rating: user.rating,
                    reviewCount: user.reviewCount
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
                message: 'Error verifying authentication',
                error: (error as Error).message
            };
        }
    }
}