import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Req } from '@nestjs/common';
import { CourseService } from '../services/course.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('courses')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Get()
    async getAllCourses(): Promise<any> {
        return this.courseService.getAllCourses();
    }

    // IMPORTANT: Special routes must come BEFORE :id parameter routes
    @Get('my')
    @UseGuards(JwtAuthGuard)
    async getMyCourses(@Req() req: any): Promise<any> {
        const userId = req.user?.id ? BigInt(req.user.id) : BigInt(1);
        return this.courseService.getMyCourses(userId);
    }

    // Legacy/frontend alias: /courses/my/courses
    @Get('my/courses')
    @UseGuards(JwtAuthGuard)
    async getMyCoursesAlias(@Req() req: any): Promise<any> {
        const userId = req.user?.id ? BigInt(req.user.id) : BigInt(1);
        return this.courseService.getMyCourses(userId);
    }

    @Get(':id')
    async getCourseById(@Param('id') id: string): Promise<any> {
        // Validate that id is numeric to prevent BigInt conversion errors
        if (!id || isNaN(Number(id))) {
            throw new Error(`Invalid course ID: ${id}`);
        }
        // TODO: Get user from JWT if available
        const userId = undefined; // Placeholder
        return this.courseService.getCourseById(BigInt(id), userId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createCourse(@Body() courseData: any, @Req() req: any): Promise<any> {
        const userId = req.user?.id ? BigInt(req.user.id) : BigInt(1);
        return this.courseService.createCourse(courseData, userId);
    }

    @Post(':id/purchase')
    @UseGuards(JwtAuthGuard)
    async purchaseCourse(
        @Param('id') id: string,
        @Body() body: { paymentMethod: string; paymentId: string },
        @Req() req: any
    ): Promise<any> {
        if (!id || isNaN(Number(id))) {
            throw new Error(`Invalid course ID: ${id}`);
        }
        const userId = req.user?.id ? BigInt(req.user.id) : BigInt(1);
        return this.courseService.purchaseCourse(BigInt(id), userId, body);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateCourse(@Param('id') id: string, @Body() courseData: any): Promise<any> {
        if (!id || isNaN(Number(id))) {
            throw new Error(`Invalid course ID: ${id}`);
        }
        return this.courseService.updateCourse(BigInt(id), courseData);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteCourse(@Param('id') id: string): Promise<any> {
        if (!id || isNaN(Number(id))) {
            throw new Error(`Invalid course ID: ${id}`);
        }
        return this.courseService.deleteCourse(BigInt(id));
    }
}