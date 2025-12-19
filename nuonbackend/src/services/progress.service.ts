import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProgressService {
    constructor(private readonly prisma: PrismaService) {}

    async getUserProgress(courseId: bigint, userId: bigint): Promise<any> {
        try {
            // Check if user has purchased the course
            const purchase = await this.prisma.purchase.findFirst({
                where: {
                    userId,
                    itemId: courseId,
                    status: 'completed'
                }
            });

            if (!purchase) {
                return {
                    success: false,
                    message: 'Access denied. Please purchase the course first.'
                };
            }

            // Get all progress for this course
            const progressRecords = await this.prisma.userProgress.findMany({
                where: { userId, courseId },
                include: { lesson: true }
            });

            // Calculate overall progress
            const totalLessons = progressRecords.length;
            const completedLessons = progressRecords.filter(p => p.completed).length;
            const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            return {
                success: true,
                progress: {
                    courseId,
                    userId,
                    progress,
                    lessons: progressRecords,
                    completedAt: progress === 100 ? new Date() : null
                }
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error fetching progress',
                error: (error as Error).message
            };
        }
    }

    async updateLessonProgress(courseId: bigint, lessonId: bigint, body: { completed: boolean; timeSpent?: number }, userId: bigint): Promise<any> {
        try {
            const { completed, timeSpent } = body;

            // Update or create progress record
            const progress = await this.prisma.userProgress.upsert({
                where: {
                    userId_courseId_lessonId: {
                        userId,
                        courseId,
                        lessonId
                    }
                },
                update: {
                    completed,
                    progress: completed ? 100 : 0
                },
                create: {
                    userId,
                    courseId,
                    lessonId,
                    completed,
                    progress: completed ? 100 : 0
                }
            });

            // Calculate overall course progress
            const allProgress = await this.prisma.userProgress.findMany({
                where: { userId, courseId }
            });

            const totalLessons = allProgress.length;
            const completedLessons = allProgress.filter(p => p.completed).length;
            const overallProgress = Math.round((completedLessons / totalLessons) * 100);

            return {
                success: true,
                progress: {
                    ...progress,
                    overallProgress
                }
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error updating progress',
                error: (error as Error).message
            };
        }
    }

    async getAllUserProgress(userId: bigint): Promise<any> {
        try {
            const progress = await this.prisma.userProgress.findMany({
                where: { userId },
                include: {
                    course: {
                        select: { id: true, title: true, thumbnail: true }
                    }
                },
                orderBy: { updatedAt: 'desc' }
            });

            return {
                success: true,
                progress
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error fetching progress',
                error: (error as Error).message
            };
        }
    }

    async downloadCertificate(courseId: bigint, userId: bigint): Promise<any> {
        try {
            // Check if course is completed
            const progressRecords = await this.prisma.userProgress.findMany({
                where: { userId, courseId }
            });

            const totalLessons = progressRecords.length;
            const completedLessons = progressRecords.filter(p => p.completed).length;
            const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            if (progress < 100) {
                return {
                    success: false,
                    message: 'Course not completed yet'
                };
            }

            // In a real app, you'd generate a PDF certificate here
            return {
                success: true,
                message: 'Certificate downloaded successfully',
                certificateUrl: `/certificates/${courseId}/${userId}.pdf`
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error downloading certificate',
                error: (error as Error).message
            };
        }
    }
}