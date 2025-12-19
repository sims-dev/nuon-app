import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllUsers(): Promise<any> {
        try {
            const users = await this.prisma.user.findMany({
                include: {
                    userRole: { select: { name: true } }
                },
                orderBy: { createdAt: 'desc' }
            });

            // Transform to include full profile data
            const transformedUsers = users.map(user => ({
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
                active: user.active,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }));

            return {
                success: true,
                users: transformedUsers
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateUserRole(userId: bigint, role: string): Promise<any> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Get role id from role name
            const roleRecord = await this.prisma.role.findFirst({
                where: { name: role }
            });
            if (!roleRecord) {
                throw new Error('Invalid role specified');
            }

            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: { userRole: { connect: { id: roleRecord.id } } }
            });

            // Transform to include roleId
            const transformedUser = {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                roleId: updatedUser.roleId
            };

            return {
                success: true,
                message: 'User role updated successfully',
                user: transformedUser
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getDashboardStats(): Promise<any> {
        try {
            const [userCount, courseCount, bookingCount, eventCount] = await Promise.all([
                this.prisma.user.count(),
                this.prisma.course.count(),
                this.prisma.booking.count(),
                this.prisma.event.count()
            ]);

            return {
                success: true,
                stats: {
                    totalUsers: userCount,
                    totalCourses: courseCount,
                    totalBookings: bookingCount,
                    totalEvents: eventCount
                }
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deactivateUser(userId: bigint): Promise<any> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw new Error('User not found');
            }

            await this.prisma.user.update({
                where: { id: userId },
                data: { active: false }
            });

            return {
                success: true,
                message: 'User deactivated successfully'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getStats(): Promise<any> {
        try {
            const [totalUsers, totalMentors, totalNurses, totalBookings, totalPayments, totalRevenue] = await Promise.all([
                this.prisma.user.count(),
                this.prisma.user.count({ where: { userRole: { id: 2 } } }), // Assuming mentor role id = 2
                this.prisma.user.count({ where: { userRole: { id: 1 } } }), // Assuming nurse role id = 1
                this.prisma.booking.count(),
                this.prisma.payment.count(),
                this.prisma.payment.aggregate({
                    where: { status: 'completed' },
                    _sum: { amount: true }
                })
            ]);

            return {
                totalUsers,
                totalMentors,
                totalNurses,
                totalBookings,
                totalPayments,
                totalRevenue: totalRevenue._sum.amount || 0
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getUsers(options: { page: number; limit: number; q?: string; role?: string }): Promise<any> {
        try {
            const { page, limit, q, role } = options;
            const filter: any = {};

            if (q) {
                filter.OR = [
                    { name: { contains: q, mode: 'insensitive' } },
                    { email: { contains: q, mode: 'insensitive' } }
                ];
            }

            if (role) {
                filter.userRole = { name: role };
            }

            const [users, total] = await Promise.all([
                this.prisma.user.findMany({
                    where: filter,
                    include: {
                        userRole: { select: { name: true } }
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                }),
                this.prisma.user.count({ where: filter })
            ]);

            return { users, total, page, limit };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async createUser(data: any): Promise<any> {
        try {
            const {
                name,
                email,
                role = 'nurse',
                phoneNumber,
                qualification,
                department,
                hospital,
                bio,
                hourlyRate,
                availability,
                specialization,
                experience,
                location,
                password
            } = data;

            let rawPassword = password;
            if (!rawPassword) {
                rawPassword = Math.random().toString(36).slice(-8);
            }

            const hashedPassword = await bcrypt.hash(rawPassword, 10);

            // Get role id from role name
            const roleRecord = await this.prisma.role.findFirst({
                where: { name: role }
            });
            if (!roleRecord) {
                throw new Error('Invalid role specified');
            }

            const userData: any = {
                name,
                email: email ? email.toLowerCase() : null,
                userRole: { connect: { id: roleRecord.id } },
                password: hashedPassword,
                phoneNumber,
                qualification,
                department,
                hospital,
                bio,
                hourlyRate: hourlyRate ? parseFloat(hourlyRate) : 0,
                availability: availability || 'available',
                specialization,
                experience: experience ? parseInt(experience.toString(), 10) : 0,
                location,
                isProfileComplete: true
            };

            const user = await this.prisma.user.create({
                data: userData,
                include: {
                    userRole: { select: { name: true } }
                } as any
            });

            // Transform to include role name
            const transformedUser = {
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
                isProfileComplete: user.isProfileComplete,
                profilePicture: user.profilePicture
            };

            return { user: transformedUser, tempPassword: rawPassword };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateUser(userId: bigint, updates: any): Promise<any> {
        try {
            if (updates.password) {
                updates.passwordHash = await bcrypt.hash(updates.password, 10);
                delete updates.password;
            }

            const user = await this.prisma.user.update({
                where: { id: userId },
                data: updates,
                include: {
                    userRole: { select: { name: true } }
                }
            });

            return user;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deleteUser(userId: bigint): Promise<any> {
        try {
            await this.prisma.user.delete({
                where: { id: userId }
            });

            return { message: 'User deleted successfully' };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getBookings(): Promise<any> {
        try {
            const bookings = await this.prisma.booking.findMany({
                include: {
                    nurse: { select: { id: true, name: true, email: true } },
                    mentor: { select: { id: true, name: true, email: true } }
                }
            });

            return bookings;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getPayments(): Promise<any> {
        try {
            const payments = await this.prisma.payment.findMany({
                include: {
                    user: { select: { id: true, name: true, email: true } }
                }
            });

            return payments;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getFeedback(): Promise<any> {
        try {
            const feedback = await this.prisma.feedback.findMany({
                include: {
                    mentor: { select: { id: true, name: true, email: true } },
                    nurse: { select: { id: true, name: true, email: true } }
                }
            });

            return feedback;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getAnalytics(): Promise<any> {
        try {
            // Note: Prisma doesn't support aggregation like MongoDB, so simplified version
            const usersByType = await this.prisma.user.groupBy({
                by: ['roleId'],
                _count: { roleId: true }
            });

            const userTypeData: Record<string, number> = {};
            usersByType.forEach((item: any) => {
                userTypeData[item.roleId] = item._count.roleId;
            });

            // Monthly bookings - simplified
            const monthlyBookings = await this.prisma.$queryRaw`
                SELECT MONTH(created_at) as month, COUNT(*) as bookings
                FROM bookings
                GROUP BY MONTH(created_at)
                ORDER BY month
            `;

            // Payment trends - simplified
            const paymentTrends = await this.prisma.$queryRaw`
                SELECT MONTH(created_at) as month, SUM(amount) as amount
                FROM payments
                WHERE status = 'completed'
                GROUP BY MONTH(created_at)
                ORDER BY month
            `;

            return {
                usersByType: userTypeData,
                monthlyBookings,
                paymentTrends
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }


    async getMessages(mentorId: bigint): Promise<any> {
        try {
            // For now, return empty array since we're using real-time messaging
            return { messages: [] };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async sendMessage(mentorId: bigint, adminId: bigint, message: string): Promise<any> {
        try {
            // Validate mentor exists
            const mentor = await this.prisma.user.findUnique({
                where: { id: mentorId }
            });

            if (!mentor || (mentor as any).userRole?.name !== 'mentor') {
                throw new Error('Mentor not found');
            }

            // TODO: Implement socket messaging
            // For now, just return success
            return { success: true, message: 'Message sent successfully' };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async createMentor(data: { name: string; email: string; hourlyRate?: number }): Promise<any> {
        try {
            const { name, email, hourlyRate = 0 } = data;

            const mentor = await this.prisma.user.create({
                data: {
                    name,
                    email: email.toLowerCase(),
                    experience: 0,
                    hourlyRate,
                    isMentor: true,
                    isApproved: true,
                    active: true,
                    role: 'mentor',
                    roles: { connect: { id: 2 } } // Assuming role id 2 is mentor
                } as any
            });

            return { success: true, message: 'Mentor created successfully', mentor };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateMentor(mentorId: bigint, updates: any): Promise<any> {
        try {
            const mentor = await this.prisma.user.update({
                where: { id: mentorId, isMentor: true },
                data: updates
            });

            return { success: true, message: 'Mentor updated successfully', mentor };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deleteMentor(mentorId: bigint): Promise<any> {
        try {
            await this.prisma.user.delete({
                where: { id: mentorId, isMentor: true }
            });

            return { success: true, message: 'Mentor deleted successfully' };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async addMentor(data: {
        name: string;
        email: string;
        specialization?: string;
        experience?: number;
        hourlyRate?: number;
    }): Promise<any> {
        try {
            const { name, email, specialization, experience, hourlyRate } = data;

            // Get mentor role id
            const mentorRole = await this.prisma.role.findFirst({
                where: { name: 'mentor' }
            });
            if (!mentorRole) {
                throw new Error('Mentor role not found');
            }

            const mentor = await this.prisma.user.create({
                data: {
                    name,
                    email: email.toLowerCase(),
                    specialization,
                    experience: experience || 0,
                    hourlyRate: hourlyRate || 0,
                    userRole: { connect: { id: mentorRole.id } },
                    isMentor: true,
                    isApproved: true,
                    active: true,
                    password: await bcrypt.hash('mentor123', 10) // Default password
                }
            });

            return { success: true, message: 'Mentor added successfully', mentor, tempPassword: 'mentor123' };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getEngageActivities(options: { page: number; limit: number; category?: string }): Promise<any> {
        try {
            const { page, limit, category } = options;
            const filter: any = {};

            if (category) {
                filter.category = category;
            }

            const [activities, total] = await Promise.all([
                this.prisma.engageActivity.findMany({
                    where: filter,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        instructor: { select: { id: true, name: true, email: true } },
                        creator: { select: { id: true, name: true, email: true } }
                    }
                }),
                this.prisma.engageActivity.count({ where: filter })
            ]);

            return { data: activities, total, page, limit };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async createEngageActivity(data: any, creatorId: bigint): Promise<any> {
        try {
            // Validate required fields
            if (!data.title || data.title.trim() === '') {
                throw new Error('Title is required');
            }
            if (!data.description || data.description.trim() === '') {
                throw new Error('Description is required');
            }
            if (!data.category) {
                throw new Error('Category is required');
            }

            // Validate category
            const validCategories = ['wellness', 'fitness', 'event'];
            if (!validCategories.includes(data.category)) {
                throw new Error('Invalid category. Must be one of: wellness, fitness, event');
            }

            // Parse and validate numeric fields from strings
            const price = data.price ? parseFloat(data.price) : 0;
            if (isNaN(price) || price < 0) {
                throw new Error('Price must be a valid non-negative number');
            }

            const points = data.points ? parseInt(data.points, 10) : 0;
            if (isNaN(points) || points < 0) {
                throw new Error('Points must be a valid non-negative integer');
            }

            const capacity = data.capacity ? parseInt(data.capacity, 10) : 0;
            if (isNaN(capacity) || capacity < 0) {
                throw new Error('Capacity must be a valid non-negative integer');
            }

            const videoDuration = data.videoDuration ? parseInt(data.videoDuration, 10) : 0;
            if (isNaN(videoDuration) || videoDuration < 0) {
                throw new Error('Video duration must be a valid non-negative integer');
            }

            // Handle instructorId - convert empty strings to null
            let instructorId = null;
            if (data.instructorId && data.instructorId.trim() !== '') {
                const parsedInstructorId = parseInt(data.instructorId, 10);
                if (isNaN(parsedInstructorId)) {
                    throw new Error('Instructor ID must be a valid number');
                }
                instructorId = BigInt(parsedInstructorId);

                // Validate instructor exists
                const instructor = await this.prisma.user.findUnique({
                    where: { id: instructorId }
                });
                if (!instructor) {
                    throw new Error('Instructor not found');
                }
            }

            // Validate and parse date
            let date = null;
            if (data.date && data.date.trim() !== '') {
                const parsedDate = new Date(data.date);
                if (isNaN(parsedDate.getTime())) {
                    throw new Error('Invalid date provided');
                }
                date = parsedDate;
            }

            // Create parsed data without spreading original data to avoid overriding processed fields
            const parsedData = {
                title: data.title,
                description: data.description,
                category: data.category,
                type: data.type,
                date,
                time: data.time,
                duration: data.duration,
                location: data.location,
                price,
                points,
                capacity,
                instructorName: data.instructorName,
                instructorId,
                videoUrl: data.videoUrl,
                videoTitle: data.videoTitle,
                videoQuality: data.videoQuality,
                videoDuration,
                videoThumbnail: data.videoThumbnail,
                image: data.image,
                thumbnail: data.thumbnail,
                tags: data.tags,
                creatorId,
                registeredCount: 0,
                status: 'active',
                isActive: true
            };

            const activity = await this.prisma.engageActivity.create({
                data: parsedData,
                include: {
                    instructor: { select: { id: true, name: true, email: true } },
                    creator: { select: { id: true, name: true, email: true } }
                }
            });

            return {
                success: true,
                message: 'Activity created successfully',
                activity
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateEngageActivity(activityId: bigint, data: any): Promise<any> {
        try {
            // Validate fields if they are being updated
            if (data.title !== undefined && (!data.title || data.title.trim() === '')) {
                throw new Error('Title cannot be empty');
            }
            if (data.description !== undefined && (!data.description || data.description.trim() === '')) {
                throw new Error('Description cannot be empty');
            }
            if (data.category !== undefined) {
                const validCategories = ['wellness', 'fitness', 'event'];
                if (!validCategories.includes(data.category)) {
                    throw new Error('Invalid category. Must be one of: wellness, fitness, event');
                }
            }
            if (data.status !== undefined) {
                const validStatuses = ['active', 'upcoming', 'completed', 'archived'];
                if (!validStatuses.includes(data.status)) {
                    throw new Error('Invalid status. Must be one of: active, upcoming, completed, archived');
                }
            }

            // Create parsed data object without spreading to avoid overriding processed fields
            const parsedData: any = {};

            // Assign non-numeric fields conditionally
            if (data.title !== undefined) parsedData.title = data.title;
            if (data.description !== undefined) parsedData.description = data.description;
            if (data.category !== undefined) parsedData.category = data.category;
            if (data.type !== undefined) parsedData.type = data.type;
            if (data.date !== undefined) {
                if (data.date) {
                    const parsedDate = new Date(data.date);
                    if (isNaN(parsedDate.getTime())) {
                        throw new Error('Invalid date provided');
                    }
                    parsedData.date = parsedDate;
                } else {
                    parsedData.date = null;
                }
            }
            if (data.time !== undefined) parsedData.time = data.time;
            if (data.duration !== undefined) parsedData.duration = data.duration;
            if (data.location !== undefined) parsedData.location = data.location;
            if (data.instructorName !== undefined) parsedData.instructorName = data.instructorName;
            if (data.videoUrl !== undefined) parsedData.videoUrl = data.videoUrl;
            if (data.videoTitle !== undefined) parsedData.videoTitle = data.videoTitle;
            if (data.videoQuality !== undefined) parsedData.videoQuality = data.videoQuality;
            if (data.videoThumbnail !== undefined) parsedData.videoThumbnail = data.videoThumbnail;
            if (data.image !== undefined) parsedData.image = data.image;
            if (data.thumbnail !== undefined) parsedData.thumbnail = data.thumbnail;
            if (data.tags !== undefined) parsedData.tags = data.tags;
            if (data.status !== undefined) parsedData.status = data.status;

            if (data.price !== undefined) {
                const price = parseFloat(data.price);
                if (isNaN(price) || price < 0) {
                    throw new Error('Price must be a valid non-negative number');
                }
                parsedData.price = price;
            }

            if (data.points !== undefined) {
                const points = parseInt(data.points, 10);
                if (isNaN(points) || points < 0) {
                    throw new Error('Points must be a valid non-negative integer');
                }
                parsedData.points = points;
            }

            if (data.capacity !== undefined) {
                const capacity = parseInt(data.capacity, 10);
                if (isNaN(capacity) || capacity < 0) {
                    throw new Error('Capacity must be a valid non-negative integer');
                }
                parsedData.capacity = capacity;
            }

            if (data.videoDuration !== undefined) {
                const videoDuration = parseInt(data.videoDuration, 10);
                if (isNaN(videoDuration) || videoDuration < 0) {
                    throw new Error('Video duration must be a valid non-negative integer');
                }
                parsedData.videoDuration = videoDuration;
            }

            // Handle instructorId - convert empty strings to null
            if (data.instructorId !== undefined) {
                if (data.instructorId !== null && data.instructorId.trim() !== '') {
                    const parsedInstructorId = parseInt(data.instructorId, 10);
                    if (isNaN(parsedInstructorId)) {
                        throw new Error('Instructor ID must be a valid number');
                    }
                    const instructorIdBigInt = BigInt(parsedInstructorId);

                    // Validate instructor exists
                    const instructor = await this.prisma.user.findUnique({
                        where: { id: instructorIdBigInt }
                    });
                    if (!instructor) {
                        throw new Error('Instructor not found');
                    }

                    parsedData.instructorId = instructorIdBigInt;
                } else {
                    parsedData.instructorId = null;
                }
            }

            // Remove undefined values
            Object.keys(parsedData).forEach(key => {
                if (parsedData[key] === undefined) {
                    delete parsedData[key];
                }
            });

            const activity = await this.prisma.engageActivity.update({
                where: { id: activityId },
                data: parsedData,
                include: {
                    instructor: { select: { id: true, name: true, email: true } },
                    creator: { select: { id: true, name: true, email: true } }
                }
            });

            return {
                success: true,
                message: 'Activity updated successfully',
                activity
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deleteEngageActivity(activityId: bigint): Promise<any> {
        try {
            await this.prisma.engageActivity.delete({
                where: { id: activityId }
            });

            return {
                success: true,
                message: 'Activity deleted successfully'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}