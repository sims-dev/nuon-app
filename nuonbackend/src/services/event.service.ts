import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class EventService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllEvents(): Promise<any> {
        try {
            const events = await this.prisma.event.findMany({
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            // Format events for frontend compatibility
            const formatted = events.map(ev => ({
                _id: ev.id.toString(),
                id: ev.id.toString(),
                title: ev.title,
                description: ev.description,
                price: ev.price,
                thumbnail: ev.imageUrl || ev.imageUrl || null,
                imageUrl: ev.imageUrl || null,
                date: ev.date,
                time: ev.time,
                duration: ev.duration,
                capacity: ev.capacity,
                registeredCount: ev.registeredCount,
                seats: ev.capacity && ev.registeredCount != null ? ev.capacity - ev.registeredCount : null,
                venueName: ev.venueName,
                venueAddress: ev.venueAddress,
                venueCity: ev.venueCity,
                location: ev.venueName || ev.venueCity || ev.venueAddress || null,
                category: (ev as any).category || (ev as any).type || 'event',
                instructor: ev.instructor,
                createdAt: ev.createdAt,
                updatedAt: ev.updatedAt,
                raw: ev
            }));

            return {
                success: true,
                events: formatted
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getEventById(eventId: bigint): Promise<any> {
        try {
            const event = await this.prisma.event.findUnique({
                where: { id: eventId },
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            if (!event) {
                throw new Error('Event not found');
            }

            const formatted = {
                _id: event.id.toString(),
                id: event.id.toString(),
                title: event.title,
                description: event.description,
                price: event.price,
                thumbnail: event.imageUrl || null,
                imageUrl: event.imageUrl || null,
                date: event.date,
                time: event.time,
                duration: event.duration,
                capacity: event.capacity,
                registeredCount: event.registeredCount,
                seats: event.capacity && event.registeredCount != null ? event.capacity - event.registeredCount : null,
                venueName: event.venueName,
                venueAddress: event.venueAddress,
                venueCity: event.venueCity,
                location: event.venueName || event.venueCity || event.venueAddress || null,
                category: (event as any).category || (event as any).type || 'event',
                instructor: event.instructor,
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
                raw: event
            };

            return {
                success: true,
                event: formatted
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async createEvent(eventData: any, instructorId: bigint): Promise<any> {
        try {
            const event = await this.prisma.event.create({
                data: {
                    title: eventData.title,
                    description: eventData.description,
                    date: new Date(eventData.date),
                    time: eventData.time,
                    duration: eventData.duration || 60,
                    venueName: eventData.venueName,
                    venueAddress: eventData.venueAddress,
                    venueCity: eventData.venueCity,
                    venueLat: eventData.venueLat,
                    venueLng: eventData.venueLng,
                    price: eventData.price || 0,
                    capacity: eventData.capacity || 0,
                    instructorId
                } as any,
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            return {
                success: true,
                message: 'Event created successfully',
                event
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateEvent(eventId: bigint, eventData: any): Promise<any> {
        try {
            const event = await this.prisma.event.findUnique({
                where: { id: eventId }
            });

            if (!event) {
                throw new Error('Event not found');
            }

            const updatedEvent = await this.prisma.event.update({
                where: { id: eventId },
                data: {
                    title: eventData.title,
                    description: eventData.description,
                    date: eventData.date ? new Date(eventData.date) : undefined,
                    time: eventData.time,
                    duration: eventData.duration,
                    venueName: eventData.venueName,
                    venueAddress: eventData.venueAddress,
                    venueCity: eventData.venueCity,
                    venueLat: eventData.venueLat,
                    venueLng: eventData.venueLng,
                    price: eventData.price,
                    capacity: eventData.capacity
                } as any,
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            return {
                success: true,
                message: 'Event updated successfully',
                event: updatedEvent
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deleteEvent(eventId: bigint): Promise<any> {
        try {
            const event = await this.prisma.event.findUnique({
                where: { id: eventId }
            });

            if (!event) {
                throw new Error('Event not found');
            }

            await this.prisma.event.delete({
                where: { id: eventId }
            });

            return {
                success: true,
                message: 'Event deleted successfully'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async registerForEvent(eventId: bigint, userId: bigint, paymentData: any): Promise<any> {
        try {
            const event = await this.prisma.event.findUnique({
                where: { id: eventId }
            });

            if (!event) {
                throw new Error('Event not found');
            }

            // Check if already registered
            const existingPurchase = await this.prisma.purchase.findFirst({
                where: {
                    userId,
                    itemId: eventId,
                    itemType: 'event'
                }
            });

            if (existingPurchase) {
                throw new Error('Already registered for this event');
            }

            // Check capacity
            if (event.capacity > 0 && event.registeredCount >= event.capacity) {
                throw new Error('Event is full');
            }

            // For free events, set payment to 'free'
            let paymentMethod = paymentData.paymentMethod;
            let paymentId = paymentData.paymentId;
            if (event.price === 0) {
                paymentMethod = 'free';
                paymentId = 'free';
            }

            if (!paymentMethod || !paymentId) {
                throw new Error('Missing payment info');
            }

            const purchase = await this.prisma.purchase.create({
                data: {
                    userId,
                    itemId: eventId,
                    itemType: 'event',
                    amount: event.price,
                    paymentId,
                    status: 'completed'
                }
            });

            // Update registered count
            await this.prisma.event.update({
                where: { id: eventId },
                data: {
                    registeredCount: { increment: 1 }
                }
            });

            return {
                success: true,
                message: 'Successfully registered for event',
                purchase
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getMyEvents(userId: bigint): Promise<any> {
        try {
            const purchases = await this.prisma.purchase.findMany({
                where: {
                    userId,
                    itemType: 'event',
                    status: 'completed'
                },
                include: {
                    user: true
                }
            });

            // Get event IDs from purchases
            const eventIds = purchases.map(p => p.itemId);

            const events = await this.prisma.event.findMany({
                where: {
                    id: { in: eventIds }
                },
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            return {
                success: true,
                events
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}