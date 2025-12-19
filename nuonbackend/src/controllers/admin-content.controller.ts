import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AdminContentService } from '../services/admin-content.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('admin/content')
export class AdminContentController {
    constructor(private readonly adminContentService: AdminContentService) {}

    // Workshops
    @Get('workshops')
    @UseGuards(JwtAuthGuard)
    async listWorkshops(@Query() query: { page?: string; limit?: string; q?: string; published?: string }): Promise<any> {
        return this.adminContentService.listWorkshops(query);
    }

    @Post('workshops')
    @UseGuards(JwtAuthGuard)
    async createWorkshop(@Body() body: any, @Req() req: any): Promise<any> {
        return this.adminContentService.createWorkshop(body, BigInt(req.user.id));
    }

    @Get('workshops/:id')
    @UseGuards(JwtAuthGuard)
    async getWorkshop(@Param('id') id: string): Promise<any> {
        return this.adminContentService.getWorkshop(BigInt(id));
    }

    @Put('workshops/:id')
    @UseGuards(JwtAuthGuard)
    async updateWorkshop(@Param('id') id: string, @Body() body: any): Promise<any> {
        return this.adminContentService.updateWorkshop(BigInt(id), body);
    }

    @Delete('workshops/:id')
    @UseGuards(JwtAuthGuard)
    async deleteWorkshop(@Param('id') id: string): Promise<any> {
        return this.adminContentService.deleteWorkshop(BigInt(id));
    }

    // Sessions
    @Get('sessions')
    @UseGuards(JwtAuthGuard)
    async listSessions(@Query() query: { page?: string; limit?: string; workshopId?: string }): Promise<any> {
        return this.adminContentService.listSessions(query);
    }

    @Post('sessions')
    @UseGuards(JwtAuthGuard)
    async createSession(@Body() body: any): Promise<any> {
        return this.adminContentService.createSession(body);
    }

    @Get('sessions/:id')
    @UseGuards(JwtAuthGuard)
    async getSession(@Param('id') id: string): Promise<any> {
        return this.adminContentService.getSession(BigInt(id));
    }

    @Put('sessions/:id')
    @UseGuards(JwtAuthGuard)
    async updateSession(@Param('id') id: string, @Body() body: any): Promise<any> {
        return this.adminContentService.updateSession(BigInt(id), body);
    }

    @Delete('sessions/:id')
    @UseGuards(JwtAuthGuard)
    async deleteSession(@Param('id') id: string): Promise<any> {
        return this.adminContentService.deleteSession(BigInt(id));
    }
}