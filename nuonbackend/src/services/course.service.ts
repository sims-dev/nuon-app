import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { getSocket } from '../lib/socket';
import { notifyUser, notifyAdmin } from '../lib/socket';

@Injectable()
export class CourseService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllCourses(): Promise<any> {
        try {
            const courses = await this.prisma.course.findMany({
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            const formatted = courses.map(c => ({
                _id: c.id.toString(),
                id: c.id.toString(),
                title: c.title,
                description: c.description,
                price: c.price,
                thumbnail: c.thumbnail || null,
                category: c.category || c.level || 'course',
                instructor: (c as any).instructor,
                enrolled: c.enrolledCount || c.enrollmentCount || 0,
                enrolledCount: c.enrolledCount || c.enrollmentCount || 0,
                modules: c.modules || 0,
                duration: c.duration,
                certificate: c.certificate,
                date: c.createdAt,
                lessons: (c as any).lessons || [],
                videoUrl: c.videoUrl,
                videoTitle: c.videoTitle,
                videoDuration: c.videoDuration,
                videoQuality: c.videoQuality,
                videoThumbnail: c.videoThumbnail,
                createdAt: c.createdAt,
                updatedAt: c.updatedAt,
                raw: c
            }));

            return {
                success: true,
                courses: formatted
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getCourseById(courseId: bigint, userId?: bigint): Promise<any> {
        try {
            const course = await this.prisma.course.findUnique({
                where: { id: courseId },
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    },
                    lessonsList: {
                        orderBy: { order: 'asc' }
                    }
                }
            });

            if (!course) {
                throw new Error('Course not found');
            }

            let hasPurchased = false;
            if (userId) {
                const purchase = await this.prisma.purchase.findFirst({
                    where: {
                        userId,
                        itemId: courseId,
                        itemType: 'course',
                        status: 'completed'
                    }
                });
                hasPurchased = !!purchase;
            }

            // If not purchased and course is not free, hide video URLs
            let processedCourse = course;
            if (!hasPurchased && course.price > 0) {
                processedCourse = {
                    ...course
                } as any;
            }

            const formatted = {
                _id: course.id.toString(),
                id: course.id.toString(),
                title: course.title,
                description: course.description,
                price: course.price,
                thumbnail: course.thumbnail || null,
                category: course.category || course.level || 'course',
                lessons: (course as any).lessonsList || [],
                instructor: (course as any).instructor,
                enrolledCount: course.enrolledCount || course.enrollmentCount || 0,
                enrolled: course.enrolledCount || course.enrollmentCount || 0,
                modules: course.modules || 0,
                duration: course.duration,
                certificate: course.certificate,
                date: course.createdAt,
                videoUrl: course.videoUrl,
                videoTitle: course.videoTitle,
                videoDuration: course.videoDuration,
                videoQuality: course.videoQuality,
                videoThumbnail: course.videoThumbnail,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt,
                raw: processedCourse
            };

            return {
                success: true,
                course: formatted,
                hasPurchased
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async createCourse(courseData: any, instructorId: bigint): Promise<any> {
        try {
            const course = await this.prisma.course.create({
                data: {
                    title: courseData.title,
                    description: courseData.description,
                    price: courseData.price || 0,
                    thumbnail: courseData.thumbnail || '',
                    category: courseData.category || 'course',
                    instructorId,
                    lessons: {
                        create: courseData.lessons || []
                    }
                },
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:course:created', { courseId: course.id, title: course.title });

            return {
                success: true,
                message: 'Course created successfully',
                course
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getMyCourses(userId: bigint): Promise<any> {
        try {
            const purchases = await this.prisma.purchase.findMany({
                where: {
                    userId,
                    itemType: 'course',
                    status: 'completed'
                }
            });

            // Get course IDs from purchases
            const courseIds = purchases.map(p => p.itemId).filter(id => id !== null);

            const courses = await this.prisma.course.findMany({
                where: {
                    id: { in: courseIds }
                },
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    },
                    lessonsList: {
                        orderBy: { order: 'asc' }
                    }
                }
            });

            // Calculate progress for each course
            const coursesWithProgress = await Promise.all(
                courses.map(async (c) => {
                    const lessonIds = c.lessonsList.map(l => l.id);

                    if (lessonIds.length === 0) {
                        return { ...c, progress: 0 };
                    }

                    const userProgressRecords = await this.prisma.userProgress.findMany({
                        where: {
                            userId,
                            lessonId: { in: lessonIds }
                        }
                    });

                    let totalProgress = 0;
                    let completedLessons = 0;

                    c.lessonsList.forEach(lesson => {
                        const progressRecord = userProgressRecords.find(p => p.lessonId === lesson.id);
                        if (progressRecord) {
                            totalProgress += progressRecord.progress;
                            if (progressRecord.completed) {
                                completedLessons++;
                            }
                        }
                    });

                    const progress = lessonIds.length > 0 ? Math.round(totalProgress / lessonIds.length) : 0;

                    return { ...c, progress, completedLessons, totalLessons: lessonIds.length };
                })
            );

            const formatted = coursesWithProgress.map(c => ({
                _id: c.id.toString(),
                id: c.id.toString(),
                title: c.title,
                description: c.description,
                price: c.price,
                thumbnail: c.thumbnail || null,
                instructor: (c as any).instructor,
                enrolledCount: c.enrolledCount || c.enrollmentCount || 0,
                enrolled: c.enrolledCount || c.enrollmentCount || 0,
                modules: c.modules || 0,
                duration: c.duration,
                certificate: c.certificate,
                date: c.createdAt,
                lessons: (c as any).lessonsList || [],
                progress: (c as any).progress || 0,
                completedLessons: (c as any).completedLessons || 0,
                totalLessons: (c as any).totalLessons || 0,
                videoUrl: c.videoUrl,
                videoTitle: c.videoTitle,
                videoDuration: c.videoDuration,
                videoQuality: c.videoQuality,
                videoThumbnail: c.videoThumbnail,
                createdAt: c.createdAt,
                updatedAt: c.updatedAt,
                raw: c
            }));

            return {
                success: true,
                courses: formatted
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async purchaseCourse(courseId: bigint, userId: bigint, paymentData: any): Promise<any> {
        try {
            const course = await this.prisma.course.findUnique({
                where: { id: courseId }
            });

            if (!course) {
                throw new Error('Course not found');
            }

            // Check if already purchased
            const existingPurchase = await this.prisma.purchase.findFirst({
                where: {
                    userId,
                    itemId: courseId,
                    itemType: 'course'
                }
            });

            if (existingPurchase) {
                throw new Error('Course already purchased');
            }

            // For free courses, set payment to 'free'
            let paymentMethod = paymentData.paymentMethod;
            let paymentId = paymentData.paymentId;
            if (course.price === 0) {
                paymentMethod = 'free';
                paymentId = 'free';
            }

            if (!paymentMethod || !paymentId) {
                throw new Error('Missing payment info');
            }

            const purchase = await this.prisma.purchase.create({
                data: {
                    userId,
                    itemId: courseId,
                    itemType: 'course',
                    amount: course.price,
                    paymentId,
                    status: 'completed'
                }
            });

            // Update enrollment count
            await this.prisma.course.update({
                where: { id: courseId },
                data: {
                    enrollmentCount: { increment: 1 }
                }
            });

            // Create initial progress records for all lessons
            const courseWithLessons = await this.prisma.course.findUnique({
                where: { id: courseId },
                include: { lessonsList: true }
            });

            if (courseWithLessons?.lessonsList && courseWithLessons.lessonsList.length > 0) {
                const progressRecords = courseWithLessons.lessonsList.map(lesson => ({
                    userId,
                    courseId,
                    lessonId: lesson.id,
                    progress: 0,
                    completed: false
                }));

                await this.prisma.userProgress.createMany({
                    data: progressRecords,
                    skipDuplicates: true
                });
            }

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('course_update', { courseId: courseId.toString() });

            return {
                success: true,
                message: 'Course purchased successfully',
                purchase
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateCourse(courseId: bigint, courseData: any): Promise<any> {
        try {
            const course = await this.prisma.course.findUnique({
                where: { id: courseId }
            });

            if (!course) {
                throw new Error('Course not found');
            }

            const updateData: any = {
                title: courseData.title || course.title,
                description: courseData.description || course.description,
                price: courseData.price !== undefined ? courseData.price : course.price,
                thumbnail: courseData.thumbnail || courseData.image || course.thumbnail,
                category: courseData.category || course.category,
                level: courseData.level || course.level,
                isActive: courseData.isActive !== undefined ? courseData.isActive : course.isActive,
            };

            // Add new fields if they exist in the schema
            if (courseData.image !== undefined) updateData.image = courseData.image;
            if (courseData.type !== undefined) updateData.type = courseData.type;
            if (courseData.duration !== undefined) updateData.duration = courseData.duration;
            if (courseData.modules !== undefined) updateData.modules = courseData.modules;
            if (courseData.points !== undefined) updateData.points = courseData.points;
            if (courseData.certificate !== undefined) updateData.certificate = courseData.certificate;
            if (courseData.videoUrl !== undefined) updateData.videoUrl = courseData.videoUrl;
            if (courseData.videoTitle !== undefined) updateData.videoTitle = courseData.videoTitle;
            if (courseData.videoDuration !== undefined) updateData.videoDuration = courseData.videoDuration;
            if (courseData.videoQuality !== undefined) updateData.videoQuality = courseData.videoQuality;
            if (courseData.videoUploadedAt !== undefined) updateData.videoUploadedAt = courseData.videoUploadedAt;
            if (courseData.videoThumbnail !== undefined) updateData.videoThumbnail = courseData.videoThumbnail;

            const updatedCourse = await this.prisma.course.update({
                where: { id: courseId },
                data: updateData,
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            return {
                success: true,
                message: 'Course updated successfully',
                course: updatedCourse
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deleteCourse(courseId: bigint): Promise<any> {
        try {
            const course = await this.prisma.course.findUnique({
                where: { id: courseId }
            });

            if (!course) {
                throw new Error('Course not found');
            }

            await this.prisma.course.delete({
                where: { id: courseId }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:course:deleted', { courseId: courseId });

            return {
                success: true,
                message: 'Course deleted successfully'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getCoursesWithEnrollmentStatus(userId: bigint): Promise<any> {
        try {
            const rows = await this.prisma.$queryRaw`
                SELECT c.*,
                IF(e.id IS NULL, 0, 1) AS isEnrolled
                FROM courses c
                LEFT JOIN enrollments e
                  ON c.id = e.course_id AND e.user_id = ${userId}
            ` as any[];

            return {
                success: true,
                courses: rows
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async processDemoPayment(userId: number, courseId: number): Promise<any> {
        try {
            // Check already enrolled
            const existingEnrollment = await this.prisma.enrollment.findFirst({
                where: {
                    userId: BigInt(userId),
                    courseId: BigInt(courseId)
                }
            });

            if (existingEnrollment) {
                return {
                    success: false,
                    message: 'Already enrolled'
                };
            }

            // Get course price
            const course = await this.prisma.course.findUnique({
                where: { id: BigInt(courseId) }
            });

            if (!course) {
                throw new Error('Course not found');
            }

            // Save payment
            await this.prisma.payment.create({
                data: {
                    userId: BigInt(userId),
                    amount: course.price,
                    paymentId: `demo_${Date.now()}`,
                    status: 'SUCCESS'
                }
            });

            // Enroll user
            await this.prisma.enrollment.create({
                data: {
                    userId: BigInt(userId),
                    courseId: BigInt(courseId)
                }
            });

            // User notification
            await this.prisma.notification.create({
                data: {
                    userId: BigInt(userId),
                    title: 'Enrollment Successful',
                    message: 'Course added to My Learning',
                    type: 'enrollment'
                }
            });

            // Admin notification
            await this.prisma.notification.create({
                data: {
                    userId: BigInt(1), // Assuming admin user ID is 1
                    title: 'New Enrollment',
                    message: `User ${userId} enrolled in course ${courseId}`,
                    type: 'admin'
                }
            });

            // Real-time push
            notifyUser(userId, {
                title: 'Payment Successful',
                message: 'Course added to My Learning'
            });

            notifyAdmin({
                title: 'New Enrollment',
                message: `User ${userId} enrolled`
            });

            return {
                success: true
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getMyLearning(userId: bigint): Promise<any> {
        try {
            const courses = await this.prisma.enrollment.findMany({
                where: {
                    userId
                },
                include: {
                    course: true
                }
            });

            const formattedCourses = courses.map(enrollment => ({
                id: enrollment.course.id.toString(),
                title: enrollment.course.title,
                description: enrollment.course.description,
                price: enrollment.course.price,
                thumbnail: enrollment.course.thumbnail,
                enrolledAt: enrollment.enrolledAt
            }));

            return {
                success: true,
                courses: formattedCourses
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}