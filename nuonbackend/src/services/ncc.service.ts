import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class NccService {
    constructor(private readonly prisma: PrismaService) {}

    async getNccStatus(userId: bigint): Promise<any> {
        try {
            let nccStatus = await this.prisma.nCCStatus.findUnique({
                where: { userId },
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            if (!nccStatus) {
                nccStatus = await this.prisma.nCCStatus.create({
                    data: {
                        userId,
                        status: 'not_started',
                        details: '{}'
                    },
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                });
            }

            return nccStatus;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateNccStep(userId: bigint, step: string, completed: boolean): Promise<any> {
        try {
            let nccStatus = await this.prisma.nCCStatus.findUnique({
                where: { userId }
            });

            if (!nccStatus) {
                nccStatus = await this.prisma.nCCStatus.create({
                    data: {
                        userId,
                        status: 'not_started',
                        details: '{}'
                    }
                });
            }

            // Parse current details or initialize
            let details: any = {};
            try {
                details = JSON.parse(nccStatus.details || '{}');
            } catch (e) {
                details = {};
            }

            // Update specific step
            switch (step) {
                case 'assessment':
                    details.assessmentPass = completed;
                    if (completed) details.currentStep = 'interview';
                    break;
                case 'interview':
                    details.interviewDone = completed;
                    if (completed) details.currentStep = 'leadership';
                    break;
                case 'leadership':
                    details.leadershipDone = completed;
                    if (completed) details.currentStep = 'completed';
                    break;
            }

            // Update final status
            if (details.assessmentPass && details.interviewDone && details.leadershipDone) {
                details.finalStatus = 'completed';
            } else if (details.assessmentPass || details.interviewDone || details.leadershipDone) {
                details.finalStatus = 'in_progress';
            }

            const updatedStatus = await this.prisma.nCCStatus.update({
                where: { userId },
                data: {
                    status: details.finalStatus || 'not_started',
                    details: JSON.stringify(details)
                },
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            return updatedStatus;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getNccInfo(): Promise<any> {
        return {
            success: true,
            program: {
                name: "Nursing Career Champion (NCC)",
                description: "A comprehensive leadership development program for nursing professionals",
                benefits: [
                    "Advanced leadership training",
                    "Career advancement opportunities",
                    "Networking with healthcare leaders",
                    "Certification upon completion",
                    "Mentorship opportunities"
                ],
                requirements: [
                    "Registered Nurse license",
                    "Minimum 2 years experience",
                    "Commitment to leadership development",
                    "Active participation in program activities"
                ],
                duration: "6 months",
                steps: [
                    { name: "Assessment", description: "Initial skills assessment" },
                    { name: "Interview", description: "Personal interview with panel" },
                    { name: "Leadership Training", description: "Comprehensive leadership program" },
                    { name: "Certification", description: "Final certification and recognition" }
                ]
            }
        };
    }
}