import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors, UseGuards, Delete, Param } from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../services/upload.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('file')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: any): Promise<any> {
        return this.uploadService.uploadFile(file);
    }

    @Post('files')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files', 5))
    async uploadMultipleFiles(@UploadedFiles() files: any[]): Promise<any> {
        return this.uploadService.uploadMultipleFiles(files);
    }

    @Post('image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@UploadedFile() file: any): Promise<any> {
        return this.uploadService.uploadImage(file);
    }

    @Post('video')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('video'))
    async uploadVideo(@UploadedFile() file: any): Promise<any> {
        return this.uploadService.uploadVideo(file);
    }

    @Delete('file/:filename')
    @UseGuards(JwtAuthGuard)
    async deleteFile(@Param('filename') filename: string): Promise<any> {
        return this.uploadService.deleteFile(filename);
    }
}