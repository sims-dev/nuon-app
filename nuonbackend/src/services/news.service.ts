import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class NewsService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllNews(filters: {
        page: number;
        limit: number;
        category?: string;
        featured?: boolean;
        status?: string;
    }): Promise<any> {
        try {
            const { page, limit, category, featured, status } = filters;
            const where: any = {};

            if (status) where.status = status;
            else where.status = 'published'; // Default to published for public routes

            if (category) where.category = category;
            if (featured !== undefined) where.featured = featured;

            const [news, total] = await Promise.all([
                this.prisma.news.findMany({
                    where,
                    include: { author: { select: { id: true, name: true, email: true } } },
                    orderBy: [
                        { publishedAt: 'desc' },
                        { createdAt: 'desc' }
                    ],
                    skip: (page - 1) * limit,
                    take: limit
                }),
                this.prisma.news.count({ where })
            ]);

            return {
                success: true,
                news: news || [],
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalNews: total
                }
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getFeaturedNews(limit: number): Promise<any> {
        try {
            const news = await this.prisma.news.findMany({
                where: {
                    status: 'published',
                    featured: true
                },
                include: { author: { select: { id: true, name: true, email: true } } },
                orderBy: { publishedAt: 'desc' },
                take: limit
            });

            return {
                success: true,
                news
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getLatestNews(limit: number, category?: string): Promise<any> {
        try {
            const where: any = { status: 'published' };
            if (category) where.category = category;

            const news = await this.prisma.news.findMany({
                where,
                include: { author: { select: { id: true, name: true, email: true } } },
                orderBy: { publishedAt: 'desc' },
                take: limit
            });

            return {
                success: true,
                news
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getNewsById(newsId: bigint): Promise<any> {
        try {
            const news = await this.prisma.news.findUnique({
                where: { id: newsId },
                include: { author: { select: { id: true, name: true, email: true } } }
            });

            if (!news) {
                throw new Error('News not found');
            }

            // Increment view count
            await this.prisma.news.update({
                where: { id: newsId },
                data: { viewCount: { increment: 1 } }
            });

            return {
                success: true,
                news: { ...news, viewCount: news.viewCount + 1 }
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async createNews(data: {
        title: string;
        content: string;
        excerpt?: string;
        category?: string;
        featured?: boolean;
        images?: string[];
        videos?: string[];
        tags?: string[];
    }, authorId: bigint): Promise<any> {
        try {
            const news = await this.prisma.news.create({
                data: {
                    title: data.title,
                    content: data.content,
                    excerpt: data.excerpt,
                    category: data.category,
                    status: 'published', // Auto-publish news when created
                    featured: data.featured || false,
                    images: data.images || [],
                    videos: data.videos || [],
                    tags: data.tags || [],
                    authorId
                },
                include: { author: { select: { id: true, name: true, email: true } } }
            });

            // TODO: Emit real-time update

            return {
                success: true,
                message: 'News created successfully',
                news
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateNews(newsId: bigint, updates: any): Promise<any> {
        try {
            const news = await this.prisma.news.findUnique({
                where: { id: newsId }
            });

            if (!news) {
                throw new Error('News not found');
            }

            const updatedNews = await this.prisma.news.update({
                where: { id: newsId },
                data: updates,
                include: { author: { select: { id: true, name: true, email: true } } }
            });

            // TODO: Emit real-time update

            return {
                success: true,
                message: 'News updated successfully',
                news: updatedNews
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async publishNews(newsId: bigint): Promise<any> {
        try {
            const news = await this.prisma.news.update({
                where: { id: newsId },
                data: {
                    status: 'published',
                    publishedAt: new Date()
                },
                include: { author: { select: { id: true, name: true, email: true } } }
            });

            // TODO: Emit real-time update

            return {
                success: true,
                message: 'News published successfully',
                news
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async archiveNews(newsId: bigint): Promise<any> {
        try {
            const news = await this.prisma.news.update({
                where: { id: newsId },
                data: { status: 'archived' },
                include: { author: { select: { id: true, name: true, email: true } } }
            });

            // TODO: Emit real-time update

            return {
                success: true,
                message: 'News archived successfully',
                news
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deleteNews(newsId: bigint): Promise<any> {
        try {
            const news = await this.prisma.news.findUnique({
                where: { id: newsId }
            });

            if (!news) {
                throw new Error('News not found');
            }

            await this.prisma.news.delete({
                where: { id: newsId }
            });

            // TODO: Emit real-time update

            return {
                success: true,
                message: 'News deleted successfully'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getNewsStats(): Promise<any> {
        try {
            const [totalNews, publishedNews, draftNews, featuredNews] = await Promise.all([
                this.prisma.news.count(),
                this.prisma.news.count({ where: { status: 'published' } }),
                this.prisma.news.count({ where: { status: 'draft' } }),
                this.prisma.news.count({ where: { featured: true, status: 'published' } })
            ]);

            // Get total views and likes using raw query since Prisma doesn't support aggregation easily
            const [totalViewsResult, totalLikesResult] = await Promise.all([
                this.prisma.$queryRaw`SELECT SUM(viewCount) as totalViews FROM news WHERE status = 'published'`,
                this.prisma.$queryRaw`SELECT SUM(likeCount) as totalLikes FROM news WHERE status = 'published'`
            ]);

            const totalViews = (totalViewsResult as any)[0]?.totalViews || 0;
            const totalLikes = (totalLikesResult as any)[0]?.totalLikes || 0;

            return {
                success: true,
                stats: {
                    totalNews,
                    publishedNews,
                    draftNews,
                    featuredNews,
                    totalViews,
                    totalLikes
                }
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}