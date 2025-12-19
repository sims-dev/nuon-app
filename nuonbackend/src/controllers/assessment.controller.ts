import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, HttpException, HttpStatus, Req } from '@nestjs/common';
import { AssessmentService } from '../services/assessment.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('assessments')
export class AssessmentController {
    constructor(private readonly assessmentService: AssessmentService) {}

    @Get()
    async getAssessments(
        @Query('type') type?: string,
        @Query('courseId') courseId?: string
    ): Promise<any> {
        try {
            return await this.assessmentService.getAssessments({ type, courseId });
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('attempts')
    @UseGuards(JwtAuthGuard)
    async getUserAttempts(@Query('userId') userId?: string): Promise<any> {
        try {
            // TODO: Get user from JWT
            const currentUserId = BigInt(1); // Placeholder
            const targetUserId = userId ? BigInt(userId) : currentUserId;
            return await this.assessmentService.getUserAttempts(targetUserId);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post(':id/submit')
    @UseGuards(JwtAuthGuard)
    async submitAssessment(
        @Param('id') id: string,
        @Body() body: { answers: any[] }
    ): Promise<any> {
        try {
            // TODO: Get user from JWT
            const userId = BigInt(1); // Placeholder
            return await this.assessmentService.submitAssessment(BigInt(id), userId, body.answers);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('results/:id')
    @UseGuards(JwtAuthGuard)
    async getAssessmentResult(@Param('id') id: string): Promise<any> {
        try {
            // TODO: Get user from JWT
            const userId = BigInt(1); // Placeholder
            return await this.assessmentService.getAssessmentResult(BigInt(id), userId);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createAssessment(@Body() body: {
        title: string;
        type: string;
        questions: any[];
        courseId?: string;
    }, @Req() req: any): Promise<any> {
        try {
            const userId = BigInt(req.user.id);
            return await this.assessmentService.createAssessment(body, userId);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateAssessment(
        @Param('id') id: string,
        @Body() body: {
            title?: string;
            type?: string;
            questions?: any[];
            courseId?: string;
        }
    ): Promise<any> {
        try {
            return await this.assessmentService.updateAssessment(BigInt(id), body);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteAssessment(@Param('id') id: string): Promise<any> {
        try {
            return await this.assessmentService.deleteAssessment(BigInt(id));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }
}