import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { getSocket } from '../lib/socket';

@Injectable()
export class MentorService {
    constructor(private readonly prisma: PrismaService) {}

    private async getRoleId(roleName: string): Promise<bigint> {
        const role = await this.prisma.role.findFirst({
            where: { name: roleName }
        });
        if (!role) {
            throw new Error(`${roleName} role not found`);
        }
        return role.id;
    }

    async getAllMentors(): Promise<any> {
        try {
            const mentorRole = await this.prisma.role.findFirst({
                where: { name: 'mentor' }
            });
            if (!mentorRole) {
                throw new Error('Mentor role not found');
            }

            const mentors = await this.prisma.user.findMany({
                where: { userRole: { id: mentorRole.id } },
                orderBy: { createdAt: 'desc' }
            });

            // Add availability status for each mentor
            const mentorsWithAvailability = await Promise.all(
                mentors.map(async (mentor) => {
                    const hasAvailableSlots = await this.prisma.mentorAvailability.findFirst({
                        where: {
                            mentorId: mentor.id,
                            isActive: true,
                            currentBookings: { lt: this.prisma.mentorAvailability.fields.maxBookings }
                        }
                    });
                    return {
                        ...mentor,
                        available: !!hasAvailableSlots
                    };
                })
            );

            return {
                success: true,
                mentors: mentorsWithAvailability
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getMentorById(mentorId: bigint): Promise<any> {
        try {
            const mentorRoleId = await this.getRoleId('mentor');
            const mentor = await this.prisma.user.findUnique({
                where: { id: mentorId, userRole: { id: mentorRoleId } }
            });

            if (!mentor) {
                throw new Error('Mentor not found');
            }

            return {
                success: true,
                mentor
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async createMentor(mentorData: any): Promise<any> {
        try {
            // Get role id
            const role = await this.prisma.role.findFirst({
                where: { name: mentorData.role || 'mentor' }
            });
            if (!role) {
                throw new Error('Role not found');
            }

            const mentor = await this.prisma.user.create({
                data: {
                    name: mentorData.name,
                    email: mentorData.email || '',
                    experience: mentorData.experience || 0,
                    hourlyRate: mentorData.hourlyRate || 0,
                    specialization: mentorData.specialization || '',
                    qualification: mentorData.qualification || '',
                    department: mentorData.department || '',
                    hospital: mentorData.hospital || '',
                    organization: mentorData.organization || '',
                    phoneNumber: mentorData.phoneNumber || '',
                    bio: mentorData.bio || '',
                    profilePicture: mentorData.profilePicture || '',
                    isMentor: mentorData.isMentor || true,
                    isApproved: mentorData.isApproved || false,
                    active: mentorData.isActive || true,
                    userRole: { connect: { id: role.id } },
                    isProfileComplete: mentorData.isProfileComplete || false
                }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) {
                io.emit('mentor-created', mentor);
            }

            return {
                success: true,
                message: 'Mentor created successfully',
                mentor
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateMentor(mentorId: bigint, mentorData: any): Promise<any> {
        try {
            const mentorRoleId = await this.getRoleId('mentor');
            const mentor = await this.prisma.user.findUnique({
                where: { id: mentorId, userRole: { id: mentorRoleId } }
            });

            if (!mentor) {
                throw new Error('Mentor not found');
            }

            const updatedMentor = await this.prisma.user.update({
                where: { id: mentorId },
                data: {
                    name: mentorData.name,
                    isMentor: mentorData.isMentor,
                    isApproved: mentorData.isApproved,
                    active: mentorData.isActive,
                    isProfileComplete: mentorData.isProfileComplete
                }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) {
                io.emit('mentor-updated', updatedMentor);
            }

            return {
                success: true,
                message: 'Mentor updated successfully',
                mentor: updatedMentor
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deleteMentor(mentorId: bigint): Promise<any> {
        try {
            const mentorRoleId = await this.getRoleId('mentor');
            const mentor = await this.prisma.user.findUnique({
                where: { id: mentorId, userRole: { id: mentorRoleId } }
            });

            if (!mentor) {
                throw new Error('Mentor not found');
            }

            await this.prisma.user.delete({
                where: { id: mentorId }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) {
                io.emit('mentor-deleted', { id: mentorId });
            }

            return {
                success: true,
                message: 'Mentor deleted successfully'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getPublicMentors(): Promise<any> {
        try {
            const mentorRoleId = await this.getRoleId('mentor');
            const mentors = await this.prisma.user.findMany({
                where: {
                    userRole: { id: mentorRoleId },
                    active: true
                    // Note: isPublic field doesn't exist in current schema
                }
            });

            return mentors;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getMentorAvailabilityPublic(mentorId: bigint): Promise<any> {
        try {
            const availability = await this.prisma.mentorAvailability.findMany({
                where: { mentorId }
            });

            return availability;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getAvailableSlots(mentorId: bigint): Promise<any> {
        try {
            const slots = await this.prisma.mentorAvailability.findMany({
                where: {
                    mentorId,
                    isActive: true,
                    currentBookings: { lt: 1 } // Less than maxBookings (assuming maxBookings = 1)
                }
            });

            return {
                success: true,
                slots
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getStats(mentorId: bigint): Promise<any> {
        try {
            const [totalSessions, upcomingSessions, attendedSessions, pendingSessions, totalNurses, feedbackData] = await Promise.all([
                this.prisma.booking.count({ where: { mentorId } }),
                this.prisma.booking.count({
                    where: {
                        mentorId,
                        status: 'confirmed',
                        dateTime: { gte: new Date() }
                    }
                }),
                this.prisma.booking.count({
                    where: { mentorId, status: 'completed' }
                }),
                this.prisma.booking.count({
                    where: {
                        mentorId,
                        status: { in: ['confirmed', 'pending'] },
                        dateTime: { gte: new Date() }
                    }
                }),
                this.prisma.booking.findMany({
                    where: { mentorId },
                    select: { nurseId: true },
                    distinct: ['nurseId']
                }).then(bookings => bookings.length),
                this.prisma.feedback.findMany({
                    where: { mentorId }
                })
            ]);

            const averageRating = feedbackData.length > 0
                ? feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length
                : 0;

            return {
                totalSessions,
                upcomingSessions,
                attendedSessions,
                pendingSessions,
                totalNurses,
                averageRating
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getBookings(mentorId: bigint): Promise<any> {
        try {
            const bookings = await this.prisma.booking.findMany({
                where: { mentorId },
                include: {
                    nurse: { select: { id: true, name: true, email: true } }
                },
                orderBy: { dateTime: 'desc' }
            });

            return bookings;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getSessions(mentorId: bigint): Promise<any> {
        try {
            const sessions = await this.prisma.zoomSession.findMany({
                where: { userId: mentorId },
                orderBy: { startTime: 'desc' }
            });

            return sessions;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getFeedback(mentorId: bigint): Promise<any> {
        try {
            const feedback = await this.prisma.feedback.findMany({
                where: { mentorId },
                include: {
                    nurse: { select: { id: true, name: true, email: true } }
                },
                orderBy: { createdAt: 'desc' }
            });

            return feedback;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getNurses(mentorId: bigint): Promise<any> {
        try {
            const bookings = await this.prisma.booking.findMany({
                where: { mentorId },
                include: {
                    nurse: { select: { id: true, name: true, email: true } }
                },
                distinct: ['nurseId']
            });

            const nurses = bookings.map(booking => booking.nurse);
            return nurses;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getProfile(mentorId: bigint): Promise<any> {
        try {
            const mentor = await this.prisma.user.findUnique({
                where: { id: mentorId }
            });

            if (!mentor) {
                throw new Error('Mentor not found');
            }

            return {
                name: mentor.name || '',
                email: mentor.email || '',
                specialization: mentor.specialization || '',
                experience: mentor.experience || '',
                currentWorkplace: mentor.hospital || '',
                city: mentor.city || '',
                state: mentor.state || '',
                registrationNumber: mentor.registrationNumber || '',
                highestQualification: mentor.qualification || '',
                bio: mentor.bio || '',
                organization: mentor.organization || '',
                profilePicture: mentor.profilePicture || '',
                phoneNumber: mentor.phoneNumber || '',
                role: 'mentor',
                hourlyRate: mentor.hourlyRate || '',
                qualification: mentor.qualification || '',
                department: mentor.department || '',
                hospital: mentor.hospital || ''
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateProfile(mentorId: bigint, updates: any): Promise<any> {
        try {
            const data: any = {
                name: updates.name,
                email: updates.email ? updates.email.toLowerCase() : undefined,
                specialization: updates.specialization,
                experience: updates.experience ? parseInt(updates.experience.toString(), 10) : null,
                hospital: updates.currentWorkplace, // Map to hospital field
                registrationNumber: updates.registrationNumber,
                qualification: updates.highestQualification,
                city: updates.city,
                state: updates.state,
                organization: updates.organization,
                phoneNumber: updates.phoneNumber,
                hourlyRate: updates.hourlyRate ? parseFloat(updates.hourlyRate.toString()) : null,
                department: updates.department,
                profilePicture: updates.profilePicture,
                bio: updates.bio,
                isProfileComplete: true
            };

            const updatedMentor = await this.prisma.user.update({
                where: { id: mentorId },
                data
            });

            return {
                success: true,
                message: 'Profile updated successfully',
                mentor: updatedMentor
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async createAvailabilitySlot(mentorId: bigint, data: any): Promise<any> {
        try {
            console.log('Creating availability slot with data:', data);
            const {
                title,
                description,
                startDateTime,
                endDateTime,
                duration,
                maxBookings = 1,
                price,
                sessionType = 'mentoring',
                meetingType = 'online',
                specializations = []
            } = data;

            console.log('Parsed data:', { title, description, startDateTime, endDateTime, duration, maxBookings, price, sessionType, meetingType, specializations });

            const meetingLink = '';

            const start = new Date(startDateTime);
            const end = new Date(endDateTime);

            console.log('Parsed dates:', { start, end });

            if (start >= end) {
                throw new Error('Start time must be before end time');
            }

            if (start <= new Date()) {
                throw new Error('Start time must be in the future');
            }

            // Check for overlapping slots
            const overlapping = await this.prisma.mentorAvailability.findFirst({
                where: {
                    mentorId,
                    isActive: true,
                    OR: [
                        {
                            AND: [
                                { startDateTime: { lte: end } },
                                { endDateTime: { gte: start } }
                            ]
                        }
                    ]
                }
            });

            if (overlapping) {
                throw new Error('This time slot overlaps with an existing availability');
            }

            // TODO: Create Zoom meeting if meetingType is zoom

            const createData = {
                mentorId: BigInt(mentorId),
                date: new Date(startDateTime),
                title,
                description,
                startDateTime: start,
                endDateTime: end,
                duration: parseInt(duration.toString(), 10),
                maxBookings: parseInt(maxBookings.toString(), 10),
                price: price ? parseFloat(price.toString()) : null,
                sessionType,
                meetingType,
                meetingLink,
                specializations: specializations || null
            };

            console.log('Creating availability with data:', createData);

            const availability = await this.prisma.mentorAvailability.create({
                data: createData,
                include: {
                    mentor: { select: { id: true, name: true, email: true } }
                }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) {
                io.emit('new_mentor_availability', availability);
            }

            return {
                success: true,
                message: 'Availability slot created successfully',
                availability
            };
        } catch (error) {
            console.error('Error in createAvailabilitySlot:', error);
            throw new Error((error as Error).message);
        }
    }

    async getMentorAvailability(mentorId: bigint, options: { upcoming?: boolean; page: number; limit: number }): Promise<any> {
        try {
            const { upcoming, page, limit } = options;

            let where: any = { mentorId };
            if (upcoming) {
                where.startDateTime = { gte: new Date() };
                where.isActive = true;
            }

            const [availability, total] = await Promise.all([
                this.prisma.mentorAvailability.findMany({
                    where,
                    include: {
                        mentor: { select: { id: true, name: true, email: true } },
                        bookings: {
                            include: {
                                nurse: { select: { id: true, name: true, email: true } }
                            }
                        }
                    },
                    orderBy: { startDateTime: 'asc' },
                    skip: (page - 1) * limit,
                    take: limit
                }),
                this.prisma.mentorAvailability.count({ where })
            ]);

            return {
                success: true,
                availability,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalSlots: total
                }
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateAvailabilitySlot(slotId: bigint, mentorId: bigint, updates: any): Promise<any> {
        try {
            const slot = await this.prisma.mentorAvailability.findFirst({
                where: { id: slotId, mentorId }
            });

            if (!slot) {
                throw new Error('Availability slot not found');
            }

            if (slot.currentBookings > 0) {
                throw new Error('Cannot modify slot with existing bookings');
            }

            if (updates.startDateTime && updates.endDateTime) {
                const start = new Date(updates.startDateTime);
                const end = new Date(updates.endDateTime);

                if (start >= end) {
                    throw new Error('Start time must be before end time');
                }

                if (start <= new Date()) {
                    throw new Error('Start time must be in the future');
                }
            }

            const updatedSlot = await this.prisma.mentorAvailability.update({
                where: { id: slotId },
                data: updates,
                include: {
                    mentor: { select: { id: true, name: true, email: true } }
                }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) {
                io.emit('mentor_availability_update', updatedSlot);
            }

            return {
                success: true,
                message: 'Availability slot updated successfully',
                availability: updatedSlot
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deleteAvailabilitySlot(slotId: bigint, mentorId: bigint): Promise<any> {
        try {
            const slot = await this.prisma.mentorAvailability.findFirst({
                where: { id: slotId, mentorId }
            });

            if (!slot) {
                throw new Error('Availability slot not found');
            }

            if (slot.currentBookings > 0) {
                throw new Error('Cannot delete slot with existing bookings. Cancel bookings first.');
            }

            await this.prisma.mentorAvailability.delete({
                where: { id: slotId }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) {
                io.emit('availability-deleted', { id: slotId });
            }

            return {
                success: true,
                message: 'Availability slot deleted successfully'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async bookMentorSession(userId: bigint, data: { availabilityId: string; notes?: string }): Promise<any> {
        try {
            const availability = await this.prisma.mentorAvailability.findUnique({
                where: { id: BigInt(data.availabilityId) }
            });

            if (!availability) {
                throw new Error('Availability slot not found');
            }

            if (!availability.isActive || availability.currentBookings >= availability.maxBookings) {
                throw new Error('This slot is no longer available');
            }

            const existingBooking = await this.prisma.booking.findFirst({
                where: {
                    nurseId: userId,
                    mentorAvailabilityId: availability.id,
                    status: { in: ['pending', 'confirmed'] }
                }
            });

            if (existingBooking) {
                throw new Error('You already have a booking for this slot');
            }

            const booking = await this.prisma.booking.create({
                data: {
                    nurseId: userId,
                    mentorId: availability.mentorId,
                    mentorAvailabilityId: availability.id,
                    dateTime: availability.startDateTime,
                    status: 'pending',
                    notes: data.notes || '',
                    price: availability.price,
                    zoomLink: availability.meetingLink
                },
                include: {
                    mentor: { select: { id: true, name: true, email: true } },
                    nurse: { select: { id: true, name: true, email: true } }
                }
            });

            await this.prisma.mentorAvailability.update({
                where: { id: availability.id },
                data: { currentBookings: { increment: 1 } }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) {
                io.emit('booking_created', booking);
                io.emit('booking_update', booking);
            }

            return {
                success: true,
                message: 'Booking request submitted successfully',
                booking
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getMyBookings(userId: bigint): Promise<any> {
        try {
            const bookings = await this.prisma.booking.findMany({
                where: { nurseId: userId },
                include: {
                    mentor: { select: { id: true, name: true, email: true, profilePicture: true } },
                    mentorAvailability: true
                },
                orderBy: { createdAt: 'desc' }
            });

            return {
                success: true,
                bookings
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async applyForMentor(userId: bigint, data: any): Promise<any> {
        try {
            // Get mentor role id
            const mentorRole = await this.prisma.role.findFirst({
                where: { name: 'mentor' }
            });
            if (!mentorRole) {
                throw new Error('Mentor role not found');
            }

            const existingMentor = await this.prisma.user.findFirst({
                where: { id: userId, userRole: { id: mentorRole.id } }
            });

            if (existingMentor) {
                throw new Error('You are already registered as a mentor');
            }

            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    userRole: { connect: { id: mentorRole.id } },
                    qualification: data.qualification,
                    department: data.department,
                    hospital: data.hospital,
                    bio: data.bio,
                    hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate.toString()) : 0,
                    specialization: data.specializations || [],
                    experience: data.experience ? parseInt(data.experience.toString(), 10) : 0,
                    profilePicture: data.profilePicture || '',
                    availability: 'available'
                }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) {
                io.emit('mentor_created', updatedUser);
            }

            return {
                success: true,
                message: 'Mentor application submitted successfully',
                user: updatedUser
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async bookSlot(slotId: bigint, userId: bigint): Promise<any> {
        try {
            const slot = await this.prisma.mentorAvailability.findUnique({
                where: { id: slotId }
            });

            if (!slot || !slot.isActive || slot.currentBookings >= 1) {
                throw new Error('Slot is not available');
            }

            await this.prisma.mentorAvailability.update({
                where: { id: slotId },
                data: { currentBookings: { increment: 1 } }
            });

            return {
                success: true,
                message: 'Slot booked successfully',
                slot
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async acceptBooking(bookingId: bigint, mentorId: bigint): Promise<any> {
        try {
            const booking = await this.prisma.booking.findFirst({
                where: { id: bookingId, mentorId }
            });

            if (!booking) {
                throw new Error('Booking not found');
            }

            if (booking.status !== 'pending') {
                throw new Error('Booking is not in pending status');
            }

            const updatedBooking = await this.prisma.booking.update({
                where: { id: bookingId },
                data: { status: 'confirmed' },
                include: {
                    mentor: { select: { id: true, name: true, email: true } },
                    nurse: { select: { id: true, name: true, email: true } }
                }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) {
                io.emit('booking_accepted', updatedBooking);
            }

            return {
                success: true,
                message: 'Booking accepted successfully',
                booking: updatedBooking
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async rejectBooking(bookingId: bigint, mentorId: bigint): Promise<any> {
        try {
            const booking = await this.prisma.booking.findFirst({
                where: { id: bookingId, mentorId }
            });

            if (!booking) {
                throw new Error('Booking not found');
            }

            if (booking.status !== 'pending') {
                throw new Error('Booking is not in pending status');
            }

            const updatedBooking = await this.prisma.booking.update({
                where: { id: bookingId },
                data: { status: 'rejected' },
                include: {
                    mentor: { select: { id: true, name: true, email: true } },
                    nurse: { select: { id: true, name: true, email: true } }
                }
            });

            // Decrease current bookings count
            await this.prisma.mentorAvailability.update({
                where: { id: booking.mentorAvailabilityId },
                data: { currentBookings: { decrement: 1 } }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) {
                io.emit('booking_rejected', updatedBooking);
            }

            return {
                success: true,
                message: 'Booking rejected successfully',
                booking: updatedBooking
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async startSession(bookingId: bigint, mentorId: bigint, meetingLink?: string): Promise<any> {
        try {
            const booking = await this.prisma.booking.findFirst({
                where: { id: bookingId, mentorId }
            });

            if (!booking) {
                throw new Error('Booking not found');
            }

            if (booking.status !== 'confirmed') {
                throw new Error('Booking must be confirmed to start session');
            }

            // Generate meeting link if not provided
            const link = meetingLink || `https://zoom.us/j/${Math.random().toString(36).substring(2, 15)}`;

            const updatedBooking = await this.prisma.booking.update({
                where: { id: bookingId },
                data: {
                    status: 'in_progress',
                    zoomLink: link
                },
                include: {
                    mentor: { select: { id: true, name: true, email: true } },
                    nurse: { select: { id: true, name: true, email: true } }
                }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) {
                io.emit('meeting_started', {
                    bookingId,
                    meetingLink: link,
                    mentorId,
                    nurseId: booking.nurseId
                });
            }

            return {
                success: true,
                message: 'Session started successfully',
                booking: updatedBooking,
                meetingLink: link
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async rescheduleBooking(bookingId: bigint, mentorId: bigint, newDateTime: Date): Promise<any> {
        try {
            const booking = await this.prisma.booking.findFirst({
                where: { id: bookingId, mentorId }
            });

            if (!booking) {
                throw new Error('Booking not found');
            }

            if (booking.status !== 'confirmed' && booking.status !== 'pending') {
                throw new Error('Cannot reschedule booking with current status');
            }

            const updatedBooking = await this.prisma.booking.update({
                where: { id: bookingId },
                data: {
                    dateTime: newDateTime,
                    status: 'rescheduled'
                },
                include: {
                    mentor: { select: { id: true, name: true, email: true } },
                    nurse: { select: { id: true, name: true, email: true } }
                }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) {
                io.emit('booking_rescheduled', updatedBooking);
            }

            return {
                success: true,
                message: 'Booking rescheduled successfully',
                booking: updatedBooking
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async joinSession(bookingId: bigint, userId: bigint): Promise<any> {
        try {
            const booking = await this.prisma.booking.findFirst({
                where: {
                    id: bookingId,
                    OR: [
                        { nurseId: userId },
                        { mentorId: userId }
                    ]
                }
            });

            if (!booking) {
                throw new Error('Booking not found or access denied');
            }

            if (!booking.zoomLink) {
                throw new Error('Meeting link not available');
            }

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) {
                io.emit('user_joined_session', {
                    bookingId,
                    userId,
                    userType: booking.mentorId === userId ? 'mentor' : 'nurse'
                });
            }

            return {
                success: true,
                message: 'Joined session successfully',
                meetingLink: booking.zoomLink
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}