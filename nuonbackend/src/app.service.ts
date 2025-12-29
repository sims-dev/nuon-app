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
                        roleId: adminRole.id,
                        active: true
                    }
                });
                console.log('🔄 Admin password updated');
                console.log('✅ Admin user exists:', adminEmail);
            } else {
                // Create admin user
                const adminData: any = {
                    name: 'System Administrator',
                    email: adminEmail,
                    password: hashedPassword,
                    roleId: adminRole.id,
                    active: true,
                    experience: null,
                    hourlyRate: null,
                    specialization: null,
                    qualification: null,
                    registrationNumber: null,
                    department: null,
                    hospital: null,
                    bio: null,
                    availability: null,
                    rating: 0,
                    reviewCount: 0,
                    lastLogin: null,
                    loginAttempts: 0,
                    city: null,
                    location: null,
                    deviceToken: null,
                    deviceType: null,
                    appVersion: null,
                    organization: null,
                    state: null,
                    profilePicture: null
                };

                // Only add adminLevel if the column exists (to avoid schema mismatch errors)
                try {
                    await this.prisma.$queryRaw`SELECT adminLevel FROM users LIMIT 1`;
                    adminData.adminLevel = 'super';
                } catch (error) {
                    // Column doesn't exist, skip it
                    console.log('⚠️ adminLevel column not found, skipping...');
                }

                const admin = await this.prisma.user.create({
                    data: adminData
                });

                console.log('🎉 Admin user created:', adminEmail);
            }

            console.log('🔑 Admin login credentials:');
            console.log('   Email:', adminEmail);
            console.log('   Password:', adminPassword);

            // Also ensure mentor user exists
            // await this.ensureMentorUser(); // Commented out to remove demo user

            // Also ensure nurse role exists
            await this.ensureNurseRole();

            // Also ensure mentor role exists
            await this.ensureMentorRole();

        } catch (err) {
            console.log('⚠️ Unable to ensure admin user:', (err as Error).message);
        }
    }

    // Ensure a mentor user exists on startup
    async ensureMentorUser(): Promise<void> {
        try {
            console.log('⏳ Checking for mentor user...');
            const mentorEmail = 'mentor@nuonhub.com';
            const mentorPassword = 'mentor@123';

            // Find or create mentor role
            let mentorRole = await this.prisma.role.findFirst({
                where: { name: 'mentor' }
            });

            if (!mentorRole) {
                mentorRole = await this.prisma.role.create({
                    data: { name: 'mentor' }
                });
            }

            // Check if mentor user already exists
            const existing = await this.prisma.user.findFirst({
                where: {
                    email: mentorEmail
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    password: true
                }
            });

            const hashedPassword = await bcrypt.hash(mentorPassword, 10);

            if (existing) {
                // Always update password to ensure it's correct
                await this.prisma.user.update({
                    where: { id: existing.id },
                    data: {
                        password: hashedPassword,
                        roleId: mentorRole.id,
                        active: true,
                        isMentor: true,
                        isApproved: true,
                        isProfileComplete: true
                    }
                });
                console.log('🔄 Mentor password updated');
                console.log('✅ Mentor user exists:', mentorEmail);
                return;
            }

            // Create mentor user
            const mentor = await this.prisma.user.create({
                data: {
                    name: 'Demo Mentor',
                    email: mentorEmail,
                    password: hashedPassword,
                    roleId: mentorRole.id,
                    active: true,
                    isMentor: true,
                    isApproved: true,
                    isProfileComplete: true,
                    specialization: 'Nursing Education',
                    experience: 5,
                    bio: 'Experienced nursing mentor with 5+ years in healthcare education.'
                }
            });

            console.log('🎉 Mentor user created:', mentorEmail);
            console.log('🔑 Mentor login credentials:');
            console.log('   Email:', mentorEmail);
            console.log('   Password:', mentorPassword);
        } catch (err) {
            console.log('⚠️ Unable to ensure mentor user:', (err as Error).message);
        }
    }

    // Ensure a nurse role exists on startup
    async ensureNurseRole(): Promise<void> {
        try {
            console.log('⏳ Checking for nurse role...');

            // Find or create nurse role
            let nurseRole = await this.prisma.role.findFirst({
                where: { name: 'nurse' }
            });

            if (!nurseRole) {
                nurseRole = await this.prisma.role.create({
                    data: { name: 'nurse' }
                });
                console.log('🎉 Nurse role created');
            } else {
                console.log('✅ Nurse role exists');
            }
        } catch (err) {
            console.log('⚠️ Unable to ensure nurse role:', (err as Error).message);
        }
    }

    // Ensure a mentor role exists on startup
    async ensureMentorRole(): Promise<void> {
        try {
            console.log('⏳ Checking for mentor role...');

            // Find or create mentor role
            let mentorRole = await this.prisma.role.findFirst({
                where: { name: 'mentor' }
            });

            if (!mentorRole) {
                mentorRole = await this.prisma.role.create({
                    data: { name: 'mentor' }
                });
                console.log('🎉 Mentor role created');
            } else {
                console.log('✅ Mentor role exists');
            }
        } catch (err) {
            console.log('⚠️ Unable to ensure mentor role:', (err as Error).message);
        }
    }
}
