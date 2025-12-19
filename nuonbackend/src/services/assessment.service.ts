import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AssessmentService {
    constructor(private readonly prisma: PrismaService) {}

    async getAssessments(filters: { type?: string; courseId?: string }): Promise<any> {
        try {
            const { type, courseId } = filters;
            const where: any = { isActive: true };

            if (type) where.type = type;
            if (courseId) where.courseId = BigInt(courseId);

            const assessments = await this.prisma.assessment.findMany({
                where,
                include: {
                    course: { select: { id: true, title: true, category: true } },
                    creator: { select: { id: true, name: true } }
                },
                orderBy: { createdAt: 'desc' }
            });

            // Hide correct answers from questions
            const sanitizedAssessments = assessments.map(assessment => {
                const questions = (assessment.questions as any[]).map(q => ({
                    ...q,
                    correctAnswer: undefined // Hide correct answer
                }));
                return { ...assessment, questions };
            });

            return {
                success: true,
                assessments: sanitizedAssessments
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getUserAttempts(userId: bigint): Promise<any> {
        try {
            const attempts = await this.prisma.assessmentAttempt.findMany({
                where: { userId },
                include: {
                    assessment: { select: { id: true, title: true, type: true } }
                },
                orderBy: { createdAt: 'desc' }
            });

            return attempts;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async submitAssessment(assessmentId: bigint, userId: bigint, answers: any[]): Promise<any> {
        try {
            const assessment = await this.prisma.assessment.findUnique({
                where: { id: assessmentId }
            });

            if (!assessment) {
                throw new Error('Assessment not found');
            }

            // Check if user already attempted this assessment
            const existingAttempt = await this.prisma.assessmentAttempt.findUnique({
                where: {
                    assessmentId_userId: {
                        assessmentId,
                        userId
                    }
                }
            });

            if (existingAttempt) {
                throw new Error('Assessment already attempted');
            }

            // Calculate score
            const questions = assessment.questions as any[];
            let correctAnswers = 0;
            questions.forEach((question, index) => {
                if (answers[index] === question.correctAnswer) {
                    correctAnswers++;
                }
            });

            const score = (correctAnswers / questions.length) * 100;
            const passed = score >= 70; // 70% passing grade

            // Create assessment attempt record
            const attempt = await this.prisma.assessmentAttempt.create({
                data: {
                    assessmentId,
                    userId,
                    answers,
                    score,
                    passed
                }
            });

            return {
                attemptId: attempt.id,
                score,
                passed,
                totalQuestions: questions.length,
                correctAnswers,
                assessmentType: assessment.type
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getAssessmentResult(attemptId: bigint, userId: bigint): Promise<any> {
        try {
            const attempt = await this.prisma.assessmentAttempt.findUnique({
                where: { id: attemptId },
                include: {
                    assessment: { select: { id: true, title: true, type: true } },
                    user: { select: { id: true, name: true, email: true } }
                }
            });

            if (!attempt) {
                throw new Error('Assessment attempt not found');
            }

            // Check if user can view this result
            if (attempt.userId !== userId) {
                // TODO: Check if user is admin
                throw new Error('Access denied');
            }

            return {
                attemptId: attempt.id,
                assessment: attempt.assessment,
                user: attempt.user,
                score: attempt.score,
                passed: attempt.passed,
                submittedAt: attempt.submittedAt
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async createAssessment(data: {
        title: string;
        type: string;
        questions: any[];
        courseId?: string;
    }, creatorId: bigint): Promise<any> {
        try {
            const assessment = await this.prisma.assessment.create({
                data: {
                    title: data.title,
                    type: data.type,
                    questions: data.questions,
                    courseId: data.courseId ? BigInt(data.courseId) : null,
                    createdBy: creatorId
                },
                include: {
                    course: { select: { id: true, title: true, category: true } },
                    creator: { select: { id: true, name: true } }
                }
            });

            return {
                success: true,
                message: 'Assessment created successfully',
                assessment
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateAssessment(assessmentId: bigint, updates: {
        title?: string;
        type?: string;
        questions?: any[];
        courseId?: string;
    }): Promise<any> {
        try {
            const updateData: any = { ...updates };
            if (updates.courseId) {
                updateData.courseId = BigInt(updates.courseId);
            }

            const assessment = await this.prisma.assessment.update({
                where: { id: assessmentId },
                data: updateData,
                include: {
                    course: { select: { id: true, title: true, category: true } },
                    creator: { select: { id: true, name: true } }
                }
            });

            return {
                success: true,
                message: 'Assessment updated successfully',
                assessment
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deleteAssessment(assessmentId: bigint): Promise<any> {
        try {
            const assessment = await this.prisma.assessment.findUnique({
                where: { id: assessmentId }
            });

            if (!assessment) {
                throw new Error('Assessment not found');
            }

            // Delete all attempts for this assessment
            await this.prisma.assessmentAttempt.deleteMany({
                where: { assessmentId }
            });

            // Delete the assessment
            await this.prisma.assessment.delete({
                where: { id: assessmentId }
            });

            return {
                success: true,
                message: 'Assessment deleted successfully'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}