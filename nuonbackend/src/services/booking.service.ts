import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { getSocket } from '../lib/socket';

@Injectable()
export class BookingService {
    constructor(private readonly prisma: PrismaService) {}

    async createBooking(bookingData: any, userId: bigint): Promise<any> {
        try {
            // Validate that the availability slot is in the future
            const availability = await this.prisma.mentorAvailability.findUnique({
                where: { id: bookingData.mentorAvailabilityId }
            });

            if (!availability) {
                throw new Error('Availability slot not found');
            }

            const now = new Date();
            if (availability.startDateTime <= now) {
                throw new Error('Cannot book past or current time slots');
            }

            const booking = await this.prisma.booking.create({
                data: {
                    ...bookingData,
                    nurseId: userId
                },
                include: {
                    nurse: true,
                    mentor: true,
                    catalogItem: true,
                    mentorAvailability: true
                }
            });

            // Emit socket notification for booking creation
            const io = getSocket();
            if (io) {
                // Notify the mentor about new booking request
                io.to(booking.mentorId.toString()).emit('booking_update', {
                    type: 'created',
                    booking: booking,
                    message: `New booking request from ${booking.nurse.name}`
                });
            }

            return booking;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getBookings(userId: bigint): Promise<any> {
        try {
            const bookings = await this.prisma.booking.findMany({
                where: { nurseId: userId },
                include: {
                    mentor: {
                        select: { id: true, name: true, email: true }
                    }
                },
                orderBy: { dateTime: 'desc' }
            });
            return bookings;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateBookingStatus(bookingId: bigint, status: string): Promise<any> {
        try {
            const booking = await this.prisma.booking.update({
                where: { id: bookingId },
                data: { status },
                include: {
                    nurse: true,
                    mentor: true,
                    catalogItem: true,
                    mentorAvailability: true
                }
            });

            // Emit socket notification for booking status update
            const io = getSocket();
            if (io) {
                // Notify the nurse about booking status change
                io.to(booking.nurseId.toString()).emit('booking_update', {
                    type: status,
                    booking: booking,
                    message: `Your booking has been ${status}`
                });
            }

            return booking;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async createZoomSession(bookingId: bigint, zoomLink: string): Promise<any> {
        try {
            const booking = await this.prisma.booking.findUnique({
                where: { id: bookingId }
            });

            if (!booking) {
                throw new Error('Booking not found');
            }

            // Update booking with zoom link
            await this.prisma.booking.update({
                where: { id: bookingId },
                data: { zoomLink }
            });

            // Create zoom session record
            const zoomSession = await this.prisma.zoomSession.create({
                data: {
                    meetingId: '', // TODO: Generate meeting ID
                    topic: 'Mentorship Session',
                    startTime: booking.dateTime,
                    duration: booking.duration,
                    joinUrl: zoomLink,
                    password: '', // TODO: Generate password
                    userId: booking.nurseId
                } as any
            });

            return { message: 'Zoom session created successfully', zoomSession };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async rescheduleBooking(bookingId: bigint, newDateTime: Date, newAvailabilityId: bigint): Promise<any> {
        try {
            const booking = await this.prisma.booking.update({
                where: { id: bookingId },
                data: {
                    dateTime: newDateTime,
                    mentorAvailabilityId: newAvailabilityId
                },
                include: {
                    nurse: true,
                    mentor: true,
                    mentorAvailability: true
                }
            });

            // Emit socket notification for rescheduling
            const io = getSocket();
            if (io) {
                // Notify both mentor and nurse about rescheduling
                io.to(booking.mentorId.toString()).emit('booking_update', {
                    type: 'rescheduled',
                    booking: booking,
                    message: `Booking rescheduled to ${newDateTime.toISOString()}`
                });
                io.to(booking.nurseId.toString()).emit('booking_update', {
                    type: 'rescheduled',
                    booking: booking,
                    message: `Your session has been rescheduled to ${newDateTime.toISOString()}`
                });
            }

            return booking;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}