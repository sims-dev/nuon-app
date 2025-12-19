import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class WorkshopService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllWorkshops(): Promise<any> {
        try {
            const workshops = await this.prisma.workshop.findMany({
                where: { isPublished: true },
                include: {
                    creator: {
                        select: { id: true, name: true, email: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            const formatted = workshops.map(w => ({
              _id: w.id.toString(),
              id: w.id.toString(),
              title: w.title,
              slug: w.slug,
              description: w.description,
              startDate: w.startDate,
              endDate: w.endDate,
              date: w.date || (w.startDate ? w.startDate.toISOString().split('T')[0] : null),
              time: w.time,
              duration: w.duration,
              location: w.location,
              coverImage: w.coverImage || null,
              thumbnail: w.coverImage || null,
              videoUrl: w.videoUrl,
              videoTitle: w.videoTitle,
              videoDuration: w.videoDuration,
              videoQuality: w.videoQuality,
              videoThumbnail: w.videoThumbnail,
              mentors: w.mentors,
              tags: w.tags,
              isPublished: w.isPublished,
              createdBy: w.createdBy,
              creator: w.creator,
              enrolled: w.enrolled || 0,
              createdAt: w.createdAt,
              updatedAt: w.updatedAt,
              raw: w
            }));

            return {
                success: true,
                workshops: formatted
            };
        } catch (error) {
            console.error('Error fetching workshops:', error);
            return {
                success: false,
                message: 'Error fetching workshops',
                error: (error as Error).message
            };
        }
    }

    async getWorkshopById(workshopId: bigint, userId?: bigint): Promise<any> {
        try {
            const workshop = await this.prisma.workshop.findUnique({
                where: { id: workshopId },
                include: {
                    creator: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            if (!workshop) {
                return {
                    success: false,
                    message: 'Workshop not found'
                };
            }

            // Check if user has registered
            let hasRegistered = false;
            if (userId) {
                const purchase = await this.prisma.purchase.findFirst({
                    where: {
                        userId,
                        itemId: workshopId,
                        itemType: 'workshop',
                        status: 'completed'
                    }
                });
                hasRegistered = !!purchase;
            }

            return {
                success: true,
                workshop,
                hasRegistered
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error fetching workshop',
                error: (error as Error).message
            };
        }
    }

    async registerForWorkshop(workshopId: bigint, body: { paymentId?: string; paymentMethod?: string }, userId: bigint): Promise<any> {
        try {
            const workshop = await this.prisma.workshop.findUnique({ where: { id: workshopId } });
            if (!workshop) {
                return {
                    success: false,
                    message: 'Workshop not found'
                };
            }

            // Check if already registered
            const existingPurchase = await this.prisma.purchase.findFirst({
                where: {
                    userId,
                    itemId: workshopId,
                    itemType: 'workshop'
                }
            });
            if (existingPurchase) {
                return {
                    success: false,
                    message: 'Already registered for this workshop'
                };
            }

            // Workshops don't have price in new schema, use 0
            const price = 0;
            let finalPaymentMethod = body.paymentMethod;
            let finalPaymentId = body.paymentId;
            if (price === 0) {
                finalPaymentMethod = 'free';
                finalPaymentId = 'free';
            }
            if (!finalPaymentMethod || !finalPaymentId) {
                return {
                    success: false,
                    message: 'Missing payment info'
                };
            }

            const purchase = await this.prisma.purchase.create({
                data: {
                    userId,
                    itemId: workshopId,
                    itemType: 'workshop',
                    amount: price,
                    paymentId: finalPaymentId,
                    status: 'completed'
                }
            });

            return {
                success: true,
                message: 'Successfully registered for workshop',
                purchase
            };
        } catch (error) {
            console.error('Workshop registration error:', error);
            return {
                success: false,
                message: 'Error registering for workshop',
                error: (error as Error).message
            };
        }
    }

    async getMyWorkshops(userId: bigint): Promise<any> {
        try {
            const purchases = await this.prisma.purchase.findMany({
                where: {
                    userId,
                    itemType: 'workshop',
                    status: 'completed'
                }
            });

            const workshopIds = purchases.map(p => p.itemId);
            const workshops = await this.prisma.workshop.findMany({
                where: {
                    id: { in: workshopIds }
                },
                include: {
                    creator: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            const formattedWorkshops = workshops.map(workshop => ({
                _id: workshop.id.toString(),
                id: workshop.id.toString(),
                title: workshop.title,
                description: workshop.description,
                startDate: workshop.startDate,
                endDate: workshop.endDate,
                mentors: workshop.mentors,
                coverImage: workshop.coverImage || null,
                thumbnail: workshop.coverImage || null,
                videoUrl: workshop.videoUrl,
                videoTitle: workshop.videoTitle,
                videoDuration: workshop.videoDuration,
                videoQuality: workshop.videoQuality,
                videoThumbnail: workshop.videoThumbnail,
                isPublished: workshop.isPublished,
                createdAt: workshop.createdAt,
                updatedAt: workshop.updatedAt,
                raw: workshop
            }));

            return {
                success: true,
                workshops: formattedWorkshops
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error fetching registered workshops',
                error: (error as Error).message
            };
        }
    }

    async getWorkshopMaterials(workshopId: bigint, userId: bigint): Promise<any> {
        try {
            // Check if user has registered
            const purchase = await this.prisma.purchase.findFirst({
                where: {
                    userId,
                    itemId: workshopId,
                    itemType: 'workshop',
                    status: 'completed'
                }
            });

            if (!purchase) {
                return {
                    success: false,
                    message: 'Access denied. Please register for this workshop first.'
                };
            }

            const workshop = await this.prisma.workshop.findUnique({ where: { id: workshopId } });
            if (!workshop) {
                return {
                    success: false,
                    message: 'Workshop not found'
                };
            }

            // For now, return basic workshop info
            // In the original, it gets sessions with materials
            return {
                success: true,
                workshop: {
                    title: workshop.title,
                    materials: [] // Placeholder
                },
                sessions: [] // Placeholder
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error fetching workshop materials',
                error: (error as Error).message
            };
        }
    }

    async createWorkshop(body: any, userId: bigint): Promise<any> {
        try {
            const workshop = await this.prisma.workshop.create({
                data: {
                    title: body.title,
                    slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
                    description: body.description,
                    startDate: body.date ? new Date(body.date) : null,
                    endDate: body.endDate ? new Date(body.endDate) : null,
                    createdBy: userId,
                    coverImage: body.imageUrl || '',
                    tags: body.tags || [],
                    mentors: body.mentors || [],
                    metadata: body.metadata || {},
                    isPublished: true
                }
            });

            return {
                success: true,
                message: 'Workshop created successfully',
                workshop
            };
        } catch (error) {
            console.error('Error creating workshop:', error);
            return {
                success: false,
                message: 'Error creating workshop',
                error: (error as Error).message
            };
        }
    }

    async updateWorkshop(workshopId: bigint, body: any): Promise<any> {
        try {
            const workshop = await this.prisma.workshop.update({
                where: { id: workshopId },
                data: {
                    title: body.title,
                    description: body.description,
                    startDate: body.date ? new Date(body.date) : undefined,
                    endDate: body.endDate ? new Date(body.endDate) : undefined,
                    coverImage: body.imageUrl,
                    isPublished: body.isActive
                }
            });

            return {
                success: true,
                message: 'Workshop updated successfully',
                workshop
            };
        } catch (error) {
            console.error('Error updating workshop:', error);
            return {
                success: false,
                message: 'Error updating workshop',
                error: (error as Error).message
            };
        }
    }

    async deleteWorkshop(workshopId: bigint): Promise<any> {
        try {
            await this.prisma.workshop.delete({
                where: { id: workshopId }
            });

            return {
                success: true,
                message: 'Workshop deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting workshop:', error);
            return {
                success: false,
                message: 'Error deleting workshop',
                error: (error as Error).message
            };
        }
    }
}