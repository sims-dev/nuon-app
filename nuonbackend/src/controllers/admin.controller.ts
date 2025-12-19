import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req, HttpException, HttpStatus, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { NewsService } from '../services/news.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadService } from '../services/upload.service';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly newsService: NewsService,
        private readonly uploadService: UploadService
    ) {}

    @Get('stats')
    @UseGuards(JwtAuthGuard)
    async getStats(): Promise<any> {
        try {
            return await this.adminService.getStats();
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('users')
    @UseGuards(JwtAuthGuard)
    async getUsers(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '50',
        @Query('q') q?: string,
        @Query('role') role?: string
    ): Promise<any> {
        try {
            return await this.adminService.getUsers({
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                q,
                role
            });
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('users/all')
    @UseGuards(JwtAuthGuard)
    async getAllUsers(): Promise<any> {
        try {
            return await this.adminService.getAllUsers();
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('users')
    @UseGuards(JwtAuthGuard)
    async createUser(@Body() body: any): Promise<any> {
        try {
            return await this.adminService.createUser(body);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Put('users/:id')
    @UseGuards(JwtAuthGuard)
    async updateUser(@Param('id') id: string, @Body() body: any): Promise<any> {
        try {
            return await this.adminService.updateUser(BigInt(id), body);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Delete('users/:id')
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Param('id') id: string): Promise<any> {
        try {
            return await this.adminService.deleteUser(BigInt(id));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Get('bookings')
    @UseGuards(JwtAuthGuard)
    async getBookings(): Promise<any> {
        try {
            return await this.adminService.getBookings();
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('payments')
    @UseGuards(JwtAuthGuard)
    async getPayments(): Promise<any> {
        try {
            return await this.adminService.getPayments();
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('feedback')
    @UseGuards(JwtAuthGuard)
    async getFeedback(): Promise<any> {
        try {
            return await this.adminService.getFeedback();
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('analytics')
    @UseGuards(JwtAuthGuard)
    async getAnalytics(): Promise<any> {
        try {
            return await this.adminService.getAnalytics();
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('messages/:mentorId')
    @UseGuards(JwtAuthGuard)
    async getMessages(@Param('mentorId') mentorId: string): Promise<any> {
        try {
            return await this.adminService.getMessages(BigInt(mentorId));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('messages/:mentorId')
    @UseGuards(JwtAuthGuard)
    async sendMessage(@Param('mentorId') mentorId: string, @Body() body: { message: string }): Promise<any> {
        try {
            // TODO: Get admin user ID from guard context
            const adminId = BigInt(1); // Placeholder
            return await this.adminService.sendMessage(BigInt(mentorId), adminId, body.message);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('mentors')
    @UseGuards(JwtAuthGuard)
    async createMentor(@Body() body: { name: string; email: string; hourlyRate?: number }): Promise<any> {
        try {
            return await this.adminService.createMentor(body);
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Put('mentors/:id')
    @UseGuards(JwtAuthGuard)
    async updateMentor(@Param('id') id: string, @Body() body: any): Promise<any> {
        try {
            return await this.adminService.updateMentor(BigInt(id), body);
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Delete('mentors/:id')
    @UseGuards(JwtAuthGuard)
    async deleteMentor(@Param('id') id: string): Promise<any> {
        try {
            return await this.adminService.deleteMentor(BigInt(id));
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Post('mentors/add')
    @UseGuards(JwtAuthGuard)
    async addMentor(@Body() body: {
        name: string;
        email: string;
        specialization?: string;
        experience?: number;
        hourlyRate?: number;
    }): Promise<any> {
        try {
            return await this.adminService.addMentor(body);
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    async getAllContent(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '50'
    ): Promise<any> {
        try {
            return await this.newsService.getAllNews({
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            });
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Legacy methods for compatibility
    @Get('dashboard')
    @UseGuards(JwtAuthGuard)
    async getDashboardStats(): Promise<any> {
        return this.getStats();
    }

    @Put('users/:id/role')
    @UseGuards(JwtAuthGuard)
    async updateUserRole(@Param('id') id: string, @Body() body: { role: string }): Promise<any> {
        return this.updateUser(id, { role: body.role });
    }

    @Put('users/:id/deactivate')
    @UseGuards(JwtAuthGuard)
    async deactivateUser(@Param('id') id: string): Promise<any> {
        return this.updateUser(id, { active: false });
    }

    // Engage Activities Management
    @Get('engage/activities')
    @UseGuards(JwtAuthGuard)
    async getEngageActivities(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '50',
        @Query('category') category?: string
    ): Promise<any> {
        try {
            return await this.adminService.getEngageActivities({
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                category
            });
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('engage/activities')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'videoFile', maxCount: 1 },
        { name: 'videoThumbnail', maxCount: 1 }
    ], {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueName = `${Date.now()}-${file.originalname}`;
                cb(null, uniqueName);
            }
        }),
        limits: {
            fileSize: 500 * 1024 * 1024, // 500MB
        }
    }))
    async createEngageActivity(
        @UploadedFiles() files: { [fieldname: string]: Express.Multer.File[] },
        @Body() body: any,
        @Req() request: any
    ): Promise<any> {
        try {
            // Debug: log incoming files structure for easier troubleshooting
            console.log('[AdminController] createEngageActivity - received files:', Object.keys(files || {}).reduce((acc, k) => (acc[k] = (files[k] && files[k][0]) ? {
                originalname: files[k][0].originalname,
                filename: (files[k][0] as any).filename || null,
                path: (files[k][0] as any).path || null,
                size: files[k][0].size || null,
                bufferPresent: !!(files[k][0] as any).buffer
            } : null, acc), {}));

            // Also log content-type header for multipart verification
            console.log('[AdminController] Content-Type:', request.headers && request.headers['content-type']);
            // Normalize uploaded files (support @UploadedFiles(), req.files, and req.file)
            const normalizeFiles = (rawFiles: any, reqObj: any) => {
                const map: { [k: string]: Express.Multer.File[] } = {};
                const source = rawFiles || reqObj?.files || {};

                // If req.file exists (single file), map it by its fieldname
                if (reqObj?.file) {
                    const f = reqObj.file;
                    if (f && f.fieldname) map[f.fieldname] = [f];
                }

                // If source is an object mapping field->file/array, normalize arrays
                if (source && typeof source === 'object') {
                    Object.keys(source).forEach((key) => {
                        const val = source[key];
                        if (!val) return;
                        if (Array.isArray(val)) map[key] = val;
                        else map[key] = [val];
                    });
                }

                return map;
            };

            const filesMap = normalizeFiles(files, request);

            // Convert date to ISO string
            if (body.date) {
                body.date = body.date + 'T00:00:00.000Z';
            }

            // Attach uploaded URLs to body if present
            if (filesMap.image && filesMap.image[0]) {
                const img = await this.uploadService.uploadImage(filesMap.image[0]);
                body.image = img.url;
            }
            if (filesMap.thumbnail && filesMap.thumbnail[0]) {
                const thumb = await this.uploadService.uploadImage(filesMap.thumbnail[0]);
                body.thumbnail = thumb.url;
            }
            if (filesMap.videoFile && filesMap.videoFile[0]) {
                const video = await this.uploadService.uploadVideo(filesMap.videoFile[0]);
                body.videoUrl = video.url;
            }
            if (filesMap.videoThumbnail && filesMap.videoThumbnail[0]) {
                const vthumb = await this.uploadService.uploadImage(filesMap.videoThumbnail[0]);
                body.videoThumbnail = vthumb.url;
            }


            return await this.adminService.createEngageActivity(body, BigInt(request.user.id));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Put('engage/activities/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'videoFile', maxCount: 1 },
        { name: 'videoThumbnail', maxCount: 1 }
    ], {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueName = `${Date.now()}-${file.originalname}`;
                cb(null, uniqueName);
            }
        }),
        limits: {
            fileSize: 500 * 1024 * 1024, // 500MB
        }
    }))
    async updateEngageActivity(
        @Param('id') id: string,
        @UploadedFiles() files: { [fieldname: string]: Express.Multer.File[] },
        @Body() body: any
    ): Promise<any> {
        try {
            // Convert date to ISO string
            if (body.date) {
                body.date = body.date + 'T00:00:00.000Z';
            }

            // Normalize files similarly to create handler (support different multer shapes)
            const normalizeFiles = (rawFiles: any, reqObj: any) => {
                const map: { [k: string]: Express.Multer.File[] } = {};
                const source = rawFiles || reqObj?.files || {};
                // If reqObj.file exists, include it
                if (reqObj?.file) {
                    const f = reqObj.file;
                    if (f && f.fieldname) map[f.fieldname] = [f];
                }
                if (source && typeof source === 'object') {
                    Object.keys(source).forEach((key) => {
                        const val = source[key];
                        if (!val) return;
                        if (Array.isArray(val)) map[key] = val;
                        else map[key] = [val];
                    });
                }
                return map;
            };

            // Try to access request via (global as any).lastExpressRequest if available (best-effort)
            const lastReq = (global as any).lastExpressRequest || {};
            const filesMap = normalizeFiles(files, lastReq);

            if (filesMap.image && filesMap.image[0]) {
                const img = await this.uploadService.uploadImage(filesMap.image[0]);
                body.image = img.url;
            }
            if (filesMap.thumbnail && filesMap.thumbnail[0]) {
                const thumb = await this.uploadService.uploadImage(filesMap.thumbnail[0]);
                body.thumbnail = thumb.url;
            }
            if (filesMap.videoFile && filesMap.videoFile[0]) {
                const video = await this.uploadService.uploadVideo(filesMap.videoFile[0]);
                body.videoUrl = video.url;
            }
            if (filesMap.videoThumbnail && filesMap.videoThumbnail[0]) {
                const vthumb = await this.uploadService.uploadImage(filesMap.videoThumbnail[0]);
                body.videoThumbnail = vthumb.url;
            }


            return await this.adminService.updateEngageActivity(BigInt(id), body);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Delete('engage/activities/:id')
    @UseGuards(JwtAuthGuard)
    async deleteEngageActivity(@Param('id') id: string): Promise<any> {
        try {
            return await this.adminService.deleteEngageActivity(BigInt(id));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }
}