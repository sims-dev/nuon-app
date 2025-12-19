import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, HttpException, HttpStatus, Req } from '@nestjs/common';
import { NewsService } from '../services/news.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Get()
    async getAllNews(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('category') category?: string,
        @Query('featured') featured?: string,
        @Query('status') status?: string
    ): Promise<any> {
        try {
            return await this.newsService.getAllNews({
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                category,
                featured: featured === 'true',
                status
            });
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('featured')
    async getFeaturedNews(@Query('limit') limit: string = '5'): Promise<any> {
        try {
            return await this.newsService.getFeaturedNews(parseInt(limit, 10));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('latest')
    async getLatestNews(
        @Query('limit') limit: string = '10',
        @Query('category') category?: string
    ): Promise<any> {
        try {
            return await this.newsService.getLatestNews(parseInt(limit, 10), category);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get(':id')
    async getNewsById(@Param('id') id: string): Promise<any> {
        try {
            return await this.newsService.getNewsById(BigInt(id));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.NOT_FOUND
            );
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createNews(@Body() body: {
        title: string;
        content: string;
        excerpt?: string;
        category?: string;
        featured?: boolean;
        images?: string[];
        videos?: string[];
        tags?: string[];
    }, @Req() req: any): Promise<any> {
        try {
            const authorId = BigInt(req.user.id);
            return await this.newsService.createNews(body, authorId);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateNews(
        @Param('id') id: string,
        @Body() body: any
    ): Promise<any> {
        try {
            return await this.newsService.updateNews(BigInt(id), body);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Put(':id/publish')
    @UseGuards(JwtAuthGuard)
    async publishNews(@Param('id') id: string): Promise<any> {
        try {
            return await this.newsService.publishNews(BigInt(id));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Put(':id/archive')
    @UseGuards(JwtAuthGuard)
    async archiveNews(@Param('id') id: string): Promise<any> {
        try {
            return await this.newsService.archiveNews(BigInt(id));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteNews(@Param('id') id: string): Promise<any> {
        try {
            return await this.newsService.deleteNews(BigInt(id));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Get('admin/stats')
    @UseGuards(JwtAuthGuard)
    async getNewsStats(): Promise<any> {
        try {
            return await this.newsService.getNewsStats();
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}