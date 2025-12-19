import { Body, Controller, Get, Param, Post, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { FeedbackService } from '../services/feedback.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) {}

    @Post(':nurseId')
    @UseGuards(JwtAuthGuard)
    async submitFeedback(
        @Param('nurseId') nurseId: string,
        @Body() body: {
            rating: number;
            comments: string;
            skills?: any;
            bookingId?: string;
        }
    ): Promise<any> {
        try {
            // TODO: Get user from JWT
            const mentorId = BigInt(1); // Placeholder
            return await this.feedbackService.submitFeedback(BigInt(nurseId), mentorId, body);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get()
    async getFeedback(
        @Query('nurseId') nurseId?: string,
        @Query('mentorId') mentorId?: string
    ): Promise<any> {
        try {
            return await this.feedbackService.getFeedback({
                nurseId: nurseId ? BigInt(nurseId) : undefined,
                mentorId: mentorId ? BigInt(mentorId) : undefined
            });
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}