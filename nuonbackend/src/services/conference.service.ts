import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ConferenceService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllConferences(): Promise<any> {
        try {
            const conferences = await this.prisma.conference.findMany({
                where: { isActive: true },
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    }
                },
                orderBy: { date: 'asc' }
            });

            // Ensure thumbnail is always present
            const conferencesWithThumb = conferences.map(conf => {
                const obj = { ...conf };
                if (!obj.thumbnail && obj.imageUrl) obj.thumbnail = obj.imageUrl;
                return obj;
            });

            return {
                success: true,
                conferences: conferencesWithThumb
            };
        } catch (error) {
            console.error('Error fetching conferences:', error);
            return {
                success: false,
                message: 'Error fetching conferences',
                error: (error as Error).message
            };
        }
    }

    async getConferenceById(conferenceId: bigint, userId?: bigint): Promise<any> {
        try {
            const conference = await this.prisma.conference.findUnique({
                where: { id: conferenceId },
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            if (!conference) {
                return {
                    success: false,
                    message: 'Conference not found'
                };
            }

            // Check if user has registered
            let hasRegistered = false;
            if (userId) {
                const purchase = await this.prisma.purchase.findFirst({
                    where: {
                        userId,
                        itemId: conferenceId,
                        itemType: 'conference',
                        status: 'completed'
                    }
                });
                hasRegistered = !!purchase;
            }

            return {
                success: true,
                conference,
                hasRegistered
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error fetching conference',
                error: (error as Error).message
            };
        }
    }

    async registerForConference(conferenceId: bigint, body: { paymentId: string; paymentMethod: string }, userId: bigint): Promise<any> {
        try {
            const conference = await this.prisma.conference.findUnique({ where: { id: conferenceId } });
            if (!conference) {
                return {
                    success: false,
                    message: 'Conference not found'
                };
            }

            // Check if already registered
            const existingPurchase = await this.prisma.purchase.findFirst({
                where: {
                    userId,
                    itemId: conferenceId,
                    itemType: 'conference'
                }
            });

            if (existingPurchase) {
                return {
                    success: false,
                    message: 'Already registered for this conference'
                };
            }

            // Check capacity
            if (conference.capacity > 0 && conference.registeredCount >= conference.capacity) {
                return {
                    success: false,
                    message: 'Conference is full'
                };
            }

            // Validate payment info
            if (!body.paymentId || !body.paymentMethod) {
                return {
                    success: false,
                    message: 'Missing paymentId or paymentMethod'
                };
            }

            const purchase = await this.prisma.purchase.create({
                data: {
                    userId,
                    itemId: conferenceId,
                    itemType: 'conference',
                    amount: conference.price,
                    paymentId: body.paymentId,
                    status: 'completed'
                }
            });

            // Update registered count
            await this.prisma.conference.update({
                where: { id: conferenceId },
                data: {
                    registeredCount: { increment: 1 }
                }
            });

            return {
                success: true,
                message: 'Successfully registered for conference',
                purchase
            };
        } catch (error) {
            console.error('[conference][registerForConference] Unexpected error:', error);
            return {
                success: false,
                message: 'Error registering for conference',
                error: (error as Error).message
            };
        }
    }

    async getMyConferences(userId: bigint): Promise<any> {
        try {
            const purchases = await this.prisma.purchase.findMany({
                where: {
                    userId,
                    itemType: 'conference',
                    status: 'completed'
                }
            });

            const conferenceIds = purchases.map(p => p.itemId);
            const conferences = await this.prisma.conference.findMany({
                where: {
                    id: { in: conferenceIds }
                },
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            // Flatten and include all conference fields
            const formattedConferences = conferences.map(conference => ({
                ...conference,
                hasRegistered: true
            }));

            return {
                success: true,
                conferences
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error fetching registered conferences',
                error: (error as Error).message
            };
        }
    }

    async createConference(body: any, userId: bigint): Promise<any> {
        try {
            const conference = await this.prisma.conference.create({
                data: {
                    title: body.title,
                    description: body.description,
                    date: new Date(body.date),
                    time: body.time || '10:00',
                    duration: body.duration || 1,
                    capacity: body.maxParticipants || 50,
                    price: body.price || 0,
                    instructorId: userId,
                    videoUrl: body.videoUrl || '',
                    imageUrl: body.imageUrl || '',
                    thumbnail: body.thumbnail || body.imageUrl || '',
                    venue: body.venue || 'TBD',
                    isActive: true
                } as any
            });

            return {
                success: true,
                message: 'Conference created successfully',
                conference
            };
        } catch (error) {
            console.error('Error creating conference:', error);
            return {
                success: false,
                message: 'Error creating conference',
                error: (error as Error).message
            };
        }
    }

    async updateConference(conferenceId: bigint, body: any): Promise<any> {
        try {
            if (body.date) {
                body.date = new Date(body.date);
            }

            // Set thumbnail from imageUrl if not provided
            if (!body.thumbnail && body.imageUrl) {
                body.thumbnail = body.imageUrl;
            }

            const conference = await this.prisma.conference.update({
                where: { id: conferenceId },
                data: {
                    title: body.title,
                    description: body.description,
                    date: body.date,
                    time: body.time,
                    duration: body.duration,
                    capacity: body.maxParticipants,
                    price: body.price,
                    videoUrl: body.videoUrl,
                    imageUrl: body.imageUrl,
                    thumbnail: body.thumbnail,
                    venue: body.venue,
                    isActive: body.isActive
                } as any
            });

            return {
                success: true,
                message: 'Conference updated successfully',
                conference
            };
        } catch (error) {
            console.error('Error updating conference:', error);
            return {
                success: false,
                message: 'Error updating conference',
                error: (error as Error).message
            };
        }
    }

    async deleteConference(conferenceId: bigint): Promise<any> {
        try {
            await this.prisma.conference.delete({
                where: { id: conferenceId }
            });

            return {
                success: true,
                message: 'Conference deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting conference:', error);
            return {
                success: false,
                message: 'Error deleting conference',
                error: (error as Error).message
            };
        }
    }
}