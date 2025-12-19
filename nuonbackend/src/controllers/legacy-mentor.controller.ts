import { Controller, Get, Param, Post, Body, Req, UseGuards } from '@nestjs/common';
import { MentorService } from '../services/mentor.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

// This controller maps legacy frontend routes under /mentor/* to the existing MentorService
@Controller('mentor')
export class LegacyMentorController {
    constructor(private readonly mentorService: MentorService) {}

    @Get('public/mentors')
    async getPublicMentors(): Promise<any> {
        const res = await this.mentorService.getPublicMentors();
        // Ensure response shape matches frontend expectations
        if (Array.isArray(res)) return { mentors: res };
        return res;
    }

    @Get(':id/availability')
    async getAvailability(@Param('id') id: string): Promise<any> {
        if (!id || isNaN(Number(id))) throw new Error(`Invalid mentor ID: ${id}`);
        return this.mentorService.getMentorAvailabilityPublic(BigInt(id));
    }

    @Post('book')
    @UseGuards(JwtAuthGuard)
    async book(@Body() body: any, @Req() req: any): Promise<any> {
        const userId = req.user?.id ? BigInt(req.user.id) : BigInt(1);
        // Map to existing mentor booking implementation
        return this.mentorService.bookMentorSession(userId, body);
    }

    @Get('bookings/my')
    @UseGuards(JwtAuthGuard)
    async myBookings(@Req() req: any): Promise<any> {
        const userId = req.user?.id ? BigInt(req.user.id) : BigInt(1);
        return this.mentorService.getMyBookings(userId);
    }

    @Post('apply')
    @UseGuards(JwtAuthGuard)
    async apply(@Body() body: any, @Req() req: any): Promise<any> {
        const userId = req.user?.id ? BigInt(req.user.id) : BigInt(1);
        return this.mentorService.applyForMentor(userId, body);
    }
}
