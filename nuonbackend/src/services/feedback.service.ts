import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class FeedbackService {
    constructor(private readonly prisma: PrismaService) {}

    async submitFeedback(
        nurseId: bigint,
        mentorId: bigint,
        data: {
            rating: number;
            comments: string;
            skills?: any;
            bookingId?: string;
        }
    ): Promise<any> {
        try {
            const feedback = await this.prisma.feedback.create({
                data: {
                    mentorId,
                    nurseId,
                    bookingId: data.bookingId ? BigInt(data.bookingId) : null,
                    rating: data.rating,
                    comments: data.comments,
                    skills: data.skills || null
                },
                include: {
                    mentor: { select: { id: true, name: true, email: true } },
                    nurse: { select: { id: true, name: true, email: true } },
                    booking: true
                }
            });

            // TODO: Emit socket notification

            return {
                success: true,
                message: 'Feedback submitted successfully',
                feedback
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getFeedback(filters: { nurseId?: bigint; mentorId?: bigint }): Promise<any> {
        try {
            const { nurseId, mentorId } = filters;
            const where: any = {};

            if (nurseId) where.nurseId = nurseId;
            if (mentorId) where.mentorId = mentorId;

            const feedback = await this.prisma.feedback.findMany({
                where,
                include: {
                    mentor: { select: { id: true, name: true, email: true } },
                    nurse: { select: { id: true, name: true, email: true } },
                    booking: true
                },
                orderBy: { createdAt: 'desc' }
            });

            return {
                success: true,
                feedback
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}