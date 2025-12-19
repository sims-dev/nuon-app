import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { getSocket } from '../lib/socket';
import { CreateEngageActivityDto, UpdateEngageActivityDto } from '../dto/engage.dto';

@Injectable()
export class AdminContentService {
    constructor(private readonly prisma: PrismaService) {}

    // Workshops
    async listWorkshops(query: { page?: string; limit?: string; q?: string; published?: string }): Promise<any> {
        try {
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '20', 10);
            const filter: any = {};

            if (query.q) filter.title = { contains: query.q };
            if (query.published !== undefined) filter.isPublished = query.published === 'true';

            const workshops = await this.prisma.workshop.findMany({
                where: filter,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            });

            const total = await this.prisma.workshop.count({ where: filter });

            return {
                workshops,
                total,
                page,
                limit
            };
        } catch (error) {
            console.error('listWorkshops', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async createWorkshop(body: any, userId: bigint): Promise<any> {
        try {
            if (!body.title) {
                return { message: 'title required' };
            }

            // Handle the frontend data structure
            const workshopData: any = {
                title: body.title,
                slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                description: body.description,
                coverImage: body.coverImage,
                image: body.coverImage, // Use coverImage as image too
                thumbnail: body.thumbnail,
                isPublished: body.isPublished !== undefined ? body.isPublished : true,
                startDate: body.startDate ? new Date(body.startDate) : new Date(),
                endDate: body.endDate ? new Date(body.endDate) : new Date(),
                date: body.date,
                time: body.time,
                duration: body.duration,
                location: body.location || body.venue,
                tags: body.tags,
                metadata: body.metadata,
                mentors: body.mentors,
                createdBy: userId,
                instructorId: body.instructorId,
                instructor: body.instructor,
                price: body.price || (body.metadata && body.metadata.price) || 0,
                points: body.points || 0,
                enrolled: body.enrolled || 0,
                seats: body.seats || body.maxParticipants || (body.metadata && body.metadata.maxParticipants) || 50,
                materials: body.materials,
                type: body.type,
                category: body.category,
                level: body.level,
                isActive: body.isActive !== undefined ? body.isActive : true,
                videoUrl: body.videoUrl || (body.metadata && body.metadata.videoUrl),
                videoTitle: body.videoTitle,
                videoDuration: body.videoDuration,
                videoQuality: body.videoQuality,
                videoUploadedAt: body.videoUploadedAt,
                videoThumbnail: body.videoThumbnail
            };

            // Remove undefined values
            Object.keys(workshopData).forEach(key => {
                if (workshopData[key] === undefined) {
                    delete workshopData[key];
                }
            });

            const workshop = await this.prisma.workshop.create({
                data: workshopData
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:workshop:created', { workshopId: workshop.id, title: workshop.title, slug: workshop.slug });

            return { workshop };
        } catch (error) {
            console.error('createWorkshop', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async getWorkshop(workshopId: bigint): Promise<any> {
        try {
            const workshop = await this.prisma.workshop.findUnique({
                where: { id: workshopId },
                include: {
                    creator: { select: { name: true, email: true } }
                }
            });

            if (!workshop) {
                return { message: 'Not found' };
            }

            return { workshop };
        } catch (error) {
            console.error('getWorkshop', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async updateWorkshop(workshopId: bigint, body: any): Promise<any> {
        try {
            const workshop = await this.prisma.workshop.update({
                where: { id: workshopId },
                data: body
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:workshop:updated', { workshopId: workshop.id });

            return { workshop };
        } catch (error) {
            console.error('updateWorkshop', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async deleteWorkshop(workshopId: bigint): Promise<any> {
        try {
            await this.prisma.workshop.delete({
                where: { id: workshopId }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:workshop:deleted', { workshopId: workshopId });

            return { message: 'deleted' };
        } catch (error) {
            console.error('deleteWorkshop', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    // Sessions
    async listSessions(query: { page?: string; limit?: string; workshopId?: string }): Promise<any> {
        try {
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '20', 10);
            const filter: any = {};

            if (query.workshopId) filter.workshopId = BigInt(query.workshopId);

            const sessions = await this.prisma.workshopSession.findMany({
                where: filter,
                include: {
                    workshop: { select: { id: true, title: true, slug: true } }
                },
                orderBy: { startsAt: 'asc' },
                skip: (page - 1) * limit,
                take: limit
            });

            const total = await this.prisma.workshopSession.count({ where: filter });

            return {
                sessions,
                total,
                page,
                limit
            };
        } catch (error) {
            console.error('listSessions', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async createSession(body: any): Promise<any> {
        try {
            if (!body.workshopId || !body.title) {
                return { message: 'workshopId and title required' };
            }

            const session = await this.prisma.workshopSession.create({
                data: {
                    workshopId: BigInt(body.workshopId),
                    title: body.title,
                    description: body.description || '',
                    sessionType: body.sessionType || 'lecture',
                    startsAt: body.startsAt ? new Date(body.startsAt) : null,
                    endsAt: body.endsAt ? new Date(body.endsAt) : null,
                    mentors: body.mentors || [],
                    capacity: body.capacity || 0,
                } as any,
                include: {
                    workshop: { select: { id: true, title: true, slug: true } }
                }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:session:created', { sessionId: session.id, workshopId: session.workshopId, title: session.title });

            return { session };
        } catch (error) {
            console.error('createSession', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async getSession(sessionId: bigint): Promise<any> {
        try {
            const session = await this.prisma.workshopSession.findUnique({
                where: { id: sessionId },
                include: {
                    workshop: { select: { id: true, title: true, slug: true, mentors: true } }
                }
            });

            if (!session) {
                return { message: 'Not found' };
            }

            return { session };
        } catch (error) {
            console.error('getSession', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async updateSession(sessionId: bigint, body: any): Promise<any> {
        try {
            const updateData: any = { ...body };
            if (body.startsAt) updateData.startsAt = new Date(body.startsAt);
            if (body.endsAt) updateData.endsAt = new Date(body.endsAt);

            const session = await this.prisma.workshopSession.update({
                where: { id: sessionId },
                data: updateData,
                include: {
                    workshop: { select: { id: true, title: true, slug: true } }
                }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:session:updated', { sessionId: session.id });

            return { session };
        } catch (error) {
            console.error('updateSession', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async deleteSession(sessionId: bigint): Promise<any> {
        try {
            await this.prisma.workshopSession.delete({
                where: { id: sessionId }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:session:deleted', { sessionId: sessionId });

            return { message: 'deleted' };
        } catch (error) {
            console.error('deleteSession', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    // Engage Activities
    async listEngageActivities(query: { page?: string; limit?: string; q?: string; category?: string; status?: string }): Promise<any> {
        try {
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '20', 10);
            const filter: any = {};

            if (query.q) filter.title = { contains: query.q };
            if (query.category) filter.category = query.category;
            if (query.status) filter.status = query.status;

            const activities = await this.prisma.engageActivity.findMany({
                where: filter,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    instructor: { select: { name: true } }
                }
            });

            const total = await this.prisma.engageActivity.count({ where: filter });

            return {
                activities,
                total,
                page,
                limit
            };
        } catch (error) {
            console.error('listEngageActivities', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async createEngageActivity(body: CreateEngageActivityDto, userId: bigint): Promise<any> {
        try {
            if (!body.title || !body.category) {
                return { message: 'title and category required' };
            }

            const activityData: any = {
                title: body.title,
                description: body.description,
                category: body.category,
                type: body.type,
                date: body.date ? new Date(body.date) : null,
                time: body.time,
                duration: body.duration,
                location: body.location,
                price: body.price || 0,
                points: body.points || 100,
                image: body.image,
                thumbnail: body.thumbnail,
                videoUrl: body.videoUrl,
                videoThumbnail: body.videoThumbnail,
                videoTitle: body.videoTitle,
                videoDuration: body.videoDuration,
                videoQuality: body.videoQuality,
                instructorId: body.instructorId,
                instructorName: body.instructorName,
                capacity: body.capacity || 100,
                status: body.status || 'active',
                tags: body.tags,
                isActive: body.isActive !== undefined ? body.isActive : true,
                creatorId: userId,
            };

            // Remove undefined values
            Object.keys(activityData).forEach(key => {
                if (activityData[key] === undefined) {
                    delete activityData[key];
                }
            });

            const activity = await this.prisma.engageActivity.create({
                data: activityData,
                include: {
                    instructor: { select: { name: true } }
                }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:engage:created', { activityId: activity.id, title: activity.title, category: activity.category });

            return { activity };
        } catch (error) {
            console.error('createEngageActivity', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async getEngageActivity(activityId: bigint): Promise<any> {
        try {
            const activity = await this.prisma.engageActivity.findUnique({
                where: { id: activityId },
                include: {
                    instructor: { select: { name: true } }
                }
            });

            if (!activity) {
                return { message: 'Not found' };
            }

            return { activity };
        } catch (error) {
            console.error('getEngageActivity', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async updateEngageActivity(activityId: bigint, body: UpdateEngageActivityDto): Promise<any> {
        try {
            const updateData: any = { ...body };
            if (body.date) updateData.date = new Date(body.date);

            const activity = await this.prisma.engageActivity.update({
                where: { id: activityId },
                data: updateData,
                include: {
                    instructor: { select: { name: true } }
                }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:engage:updated', { activityId: activity.id });

            return { activity };
        } catch (error) {
            console.error('updateEngageActivity', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async deleteEngageActivity(activityId: bigint): Promise<any> {
        try {
            await this.prisma.engageActivity.delete({
                where: { id: activityId }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:engage:deleted', { activityId: activityId });

            return { message: 'deleted' };
        } catch (error) {
            console.error('deleteEngageActivity', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    // Courses
    async listCourses(query: { page?: string; limit?: string; q?: string; category?: string; level?: string }): Promise<any> {
        try {
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '20', 10);
            const filter: any = {};

            if (query.q) filter.title = { contains: query.q };
            if (query.category) filter.category = query.category;
            if (query.level) filter.level = query.level;

            const courses = await this.prisma.course.findMany({
                where: filter,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    instructor: { select: { name: true } }
                }
            });

            const total = await this.prisma.course.count({ where: filter });

            return {
                courses,
                total,
                page,
                limit
            };
        } catch (error) {
            console.error('listCourses', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async createCourse(body: any, userId: bigint): Promise<any> {
        try {
            if (!body.title) {
                return { message: 'title required' };
            }

            const courseData: any = {
                title: body.title,
                description: body.description,
                category: body.category,
                level: body.level,
                duration: body.duration,
                modules: body.modules,
                price: body.price || 0,
                points: body.points || 100,
                image: body.image,
                thumbnail: body.thumbnail,
                videoUrl: body.videoUrl,
                videoThumbnail: body.videoThumbnail,
                videoTitle: body.videoTitle,
                videoDuration: body.videoDuration,
                videoQuality: body.videoQuality,
                instructorId: body.instructorId,
                instructorName: body.instructorName,
                certificate: body.certificate || false,
                isActive: body.isActive !== undefined ? body.isActive : true,
                enrolledCount: body.enrolled || 0,
                date: body.date ? new Date(body.date) : null,
                creatorId: userId,
            };

            // Remove undefined values
            Object.keys(courseData).forEach(key => {
                if (courseData[key] === undefined) {
                    delete courseData[key];
                }
            });

            const course = await this.prisma.course.create({
                data: courseData,
                include: {
                    instructor: { select: { name: true } }
                }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:course:created', { courseId: course.id, title: course.title });

            return { course };
        } catch (error) {
            console.error('createCourse', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async getCourse(courseId: bigint): Promise<any> {
        try {
            const course = await this.prisma.course.findUnique({
                where: { id: courseId },
                include: {
                    instructor: { select: { name: true } }
                }
            });

            if (!course) {
                return { message: 'Not found' };
            }

            return { course };
        } catch (error) {
            console.error('getCourse', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async updateCourse(courseId: bigint, body: any): Promise<any> {
        try {
            const course = await this.prisma.course.update({
                where: { id: courseId },
                data: body,
                include: {
                    instructor: { select: { name: true } }
                }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:course:updated', { courseId: course.id });

            return { course };
        } catch (error) {
            console.error('updateCourse', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async deleteCourse(courseId: bigint): Promise<any> {
        try {
            await this.prisma.course.delete({
                where: { id: courseId }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:course:deleted', { courseId: courseId });

            return { message: 'deleted' };
        } catch (error) {
            console.error('deleteCourse', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    // Events
    async listEvents(query: { page?: string; limit?: string; q?: string; category?: string }): Promise<any> {
        try {
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '20', 10);
            const filter: any = {};

            if (query.q) filter.title = { contains: query.q };
            if (query.category) filter.category = query.category;

            const events = await this.prisma.event.findMany({
                where: filter,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            });

            const total = await this.prisma.event.count({ where: filter });

            return {
                events,
                total,
                page,
                limit
            };
        } catch (error) {
            console.error('listEvents', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async createEvent(body: any, userId: bigint): Promise<any> {
        try {
            if (!body.title) {
                return { message: 'title required' };
            }

            const eventData: any = {
                title: body.title,
                description: body.description,
                category: body.category,
                date: body.date ? new Date(body.date) : null,
                time: body.time,
                location: body.location,
                price: body.price || 0,
                points: body.points || 100,
                image: body.image,
                thumbnail: body.thumbnail,
                videoUrl: body.videoUrl,
                videoThumbnail: body.videoThumbnail,
                videoTitle: body.videoTitle,
                videoDuration: body.videoDuration,
                videoQuality: body.videoQuality,
                speakers: body.speakers || [],
                capacity: body.capacity || 100,
                isActive: body.isActive !== undefined ? body.isActive : true,
                registeredCount: body.enrolled || 0,
                creatorId: userId,
            };

            // Remove undefined values
            Object.keys(eventData).forEach(key => {
                if (eventData[key] === undefined) {
                    delete eventData[key];
                }
            });

            const event = await this.prisma.event.create({
                data: eventData
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:event:created', { eventId: event.id, title: event.title });

            return { event };
        } catch (error) {
            console.error('createEvent', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async getEvent(eventId: bigint): Promise<any> {
        try {
            const event = await this.prisma.event.findUnique({
                where: { id: eventId },
                include: {
                    instructor: { select: { name: true, email: true } }
                }
            });

            if (!event) {
                return { message: 'Not found' };
            }

            return { event };
        } catch (error) {
            console.error('getEvent', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async updateEvent(eventId: bigint, body: any): Promise<any> {
        try {
            const event = await this.prisma.event.update({
                where: { id: eventId },
                data: body
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:event:updated', { eventId: event.id });

            return { event };
        } catch (error) {
            console.error('updateEvent', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async deleteEvent(eventId: bigint): Promise<any> {
        try {
            await this.prisma.event.delete({
                where: { id: eventId }
            });

            // Emit socket event for real-time updates
            const io = getSocket();
            if (io) io.emit('content:event:deleted', { eventId: eventId });

            return { message: 'deleted' };
        } catch (error) {
            console.error('deleteEvent', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }
}