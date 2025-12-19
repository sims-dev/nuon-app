import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ProgressService } from '../services/progress.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    @Get('course/:courseId')
    @UseGuards(JwtAuthGuard)
    async getUserProgress(@Param('courseId') courseId: string, @Req() req: any): Promise<any> {
        const userId = BigInt(req.user.id);
        return this.progressService.getUserProgress(BigInt(courseId), userId);
    }

    @Post('course/:courseId/lesson/:lessonId')
    @UseGuards(JwtAuthGuard)
    async updateLessonProgress(
        @Param('courseId') courseId: string,
        @Param('lessonId') lessonId: string,
        @Body() body: { completed: boolean; timeSpent?: number },
        @Req() req: any
    ): Promise<any> {
        const userId = BigInt(req.user.id);
        return this.progressService.updateLessonProgress(BigInt(courseId), BigInt(lessonId), body, userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllUserProgress(@Req() req: any): Promise<any> {
        const userId = BigInt(req.user.id);
        return this.progressService.getAllUserProgress(userId);
    }

    @Post('course/:courseId/certificate')
    @UseGuards(JwtAuthGuard)
    async downloadCertificate(@Param('courseId') courseId: string, @Req() req: any): Promise<any> {
        const userId = BigInt(req.user.id);
        return this.progressService.downloadCertificate(BigInt(courseId), userId);
    }
}