import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ConferenceService } from '../services/conference.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('conferences')
export class ConferenceController {
    constructor(private readonly conferenceService: ConferenceService) {}

    @Get()
    async getAllConferences(): Promise<any> {
        return this.conferenceService.getAllConferences();
    }

    @Get(':conferenceId')
    async getConferenceById(@Param('conferenceId') conferenceId: string, @Req() req: any): Promise<any> {
        const userId = req.user?.id ? BigInt(req.user.id) : undefined;
        return this.conferenceService.getConferenceById(BigInt(conferenceId), userId);
    }

    @Post(':id/register')
    @UseGuards(JwtAuthGuard)
    async registerForConference(@Param('id') conferenceId: string, @Body() body: { paymentId: string; paymentMethod: string }, @Req() req: any): Promise<any> {
        const userId = BigInt(req.user.id);
        return this.conferenceService.registerForConference(BigInt(conferenceId), body, userId);
    }

    @Get('my-conferences')
    @UseGuards(JwtAuthGuard)
    async getMyConferences(@Req() req: any): Promise<any> {
        const userId = BigInt(req.user.id);
        return this.conferenceService.getMyConferences(userId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createConference(@Body() body: any, @Req() req: any): Promise<any> {
        return this.conferenceService.createConference(body, BigInt(req.user.id));
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateConference(@Param('id') id: string, @Body() body: any): Promise<any> {
        return this.conferenceService.updateConference(BigInt(id), body);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteConference(@Param('id') id: string): Promise<any> {
        return this.conferenceService.deleteConference(BigInt(id));
    }
}