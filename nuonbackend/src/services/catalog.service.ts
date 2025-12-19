import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class CatalogService {
    constructor(private readonly prisma: PrismaService) {}

    async getCatalog(): Promise<any> {
        try {
            const items = await this.prisma.catalogItem.findMany({
                include: {
                    creator: {
                        select: { id: true, name: true, email: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            return { items };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getCatalogItemById(catalogItemId: bigint): Promise<any> {
        try {
            const catalogItem = await this.prisma.catalogItem.findUnique({
                where: { id: catalogItemId },
                include: {
                    creator: {
                        select: { id: true, name: true, email: true }
                    },
                    bookings: true
                }
            });

            if (!catalogItem) {
                throw new Error('Catalog item not found');
            }

            return {
                success: true,
                catalogItem
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async createCatalogItem(catalogData: { type: string; title: string; description: string; duration?: number; price?: number }, creatorId: bigint): Promise<any> {
        try {
            const item = await this.prisma.catalogItem.create({
                data: {
                    name: catalogData.title,
                    type: catalogData.type,
                    title: catalogData.title,
                    description: catalogData.description,
                    schedule: new Date(),
                    price: catalogData.price || 0,
                    createdBy: creatorId
                } as any
            });

            return { item };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateCatalogItem(catalogItemId: bigint, catalogData: any): Promise<any> {
        try {
            const item = await this.prisma.catalogItem.update({
                where: { id: catalogItemId },
                data: catalogData
            });

            return item;
        } catch (error) {
            if ((error as any).code === 'P2025') {
                throw new Error('Item not found');
            }
            throw new Error((error as Error).message);
        }
    }

    async deleteCatalogItem(catalogItemId: bigint): Promise<any> {
        try {
            await this.prisma.catalogItem.delete({
                where: { id: catalogItemId }
            });

            return { message: 'Item deleted successfully' };
        } catch (error) {
            if ((error as any).code === 'P2025') {
                throw new Error('Item not found');
            }
            throw new Error((error as Error).message);
        }
    }
}