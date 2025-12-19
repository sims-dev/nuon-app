import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class BookingService {
    constructor(private readonly prisma: PrismaService) {}

    async createBooking(bookingData: any, userId: bigint): Promise<any> {
        try {
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

            // TODO: Emit socket notification
            // const io = getSocket();
            // if (io) io.emit('notification', { type: 'booking:created', booking });

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

            // TODO: Emit socket notification
            // const io = getSocket();
            // if (io) io.emit('notification', { type: 'booking:updated', booking });

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
}