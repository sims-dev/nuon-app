import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, HttpException, HttpStatus, Req } from '@nestjs/common';
import { MentorService } from '../services/mentor.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../middleware/auth';

@Controller('mentors')
export class MentorController {
    constructor(private readonly mentorService: MentorService) {}

    // Public endpoints
    @Get()
    async getAllMentors(): Promise<any> {
        try {
            return await this.mentorService.getAllMentors();
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('public')
    async getPublicMentors(): Promise<any> {
        try {
            return await this.mentorService.getPublicMentors();
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get(':id')
    async getMentorById(@Param('id') id: string): Promise<any> {
        try {
            return await this.mentorService.getMentorById(BigInt(id));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.NOT_FOUND
            );
        }
    }

    @Get(':id/availability/public')
    async getMentorAvailabilityPublic(@Param('id') id: string): Promise<any> {
        try {
            return await this.mentorService.getMentorAvailabilityPublic(BigInt(id));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get(':id/available-slots')
    async getAvailableSlots(@Param('id') id: string): Promise<any> {
        try {
            return await this.mentorService.getAvailableSlots(BigInt(id));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Protected mentor endpoints
    @Get('mentor/stats')
    @UseGuards(JwtAuthGuard)
    async getStats(@Req() req: AuthenticatedRequest): Promise<any> {
        try {
            const userId = BigInt(req.user!.id);
            return await this.mentorService.getStats(userId);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('mentor/bookings')
    @UseGuards(JwtAuthGuard)
    async getBookings(@Req() req: AuthenticatedRequest): Promise<any> {
        try {
            const userId = BigInt(req.user!.id);
            return await this.mentorService.getBookings(userId);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('mentor/sessions')
    @UseGuards(JwtAuthGuard)
    async getSessions(@Req() req: AuthenticatedRequest): Promise<any> {
        try {
            const userId = BigInt(req.user!.id);
            return await this.mentorService.getSessions(userId);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('mentor/feedback')
    @UseGuards(JwtAuthGuard)
    async getFeedback(@Req() req: AuthenticatedRequest): Promise<any> {
        try {
            const userId = BigInt(req.user!.id);
            return await this.mentorService.getFeedback(userId);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('mentor/nurses')
    @UseGuards(JwtAuthGuard)
    async getNurses(@Req() req: AuthenticatedRequest): Promise<any> {
        try {
            const userId = BigInt(req.user!.id);
            return await this.mentorService.getNurses(userId);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Put('mentor/profile')
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Req() req: AuthenticatedRequest, @Body() body: any): Promise<any> {
        try {
            const userId = BigInt(req.user!.id);
            return await this.mentorService.updateProfile(userId, body);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('mentor/availability')
    @UseGuards(JwtAuthGuard)
    async createAvailabilitySlot(@Req() req: AuthenticatedRequest, @Body() body: any): Promise<any> {
        try {
            const userId = BigInt(req.user!.id);
            return await this.mentorService.createAvailabilitySlot(userId, body);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('mentor/availability')
    @UseGuards(JwtAuthGuard)
    async getMentorAvailability(
        @Req() req: AuthenticatedRequest,
        @Query('upcoming') upcoming?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string
    ): Promise<any> {
        try {
            const userId = BigInt(req.user!.id);
            return await this.mentorService.getMentorAvailability(userId, {
                upcoming: upcoming === 'true',
                page: parseInt(page || '1', 10),
                limit: parseInt(limit || '20', 10)
            });
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Put('mentor/availability/:id')
    @UseGuards(JwtAuthGuard)
    async updateAvailabilitySlot(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() body: any): Promise<any> {
        try {
            const userId = BigInt(req.user!.id);
            return await this.mentorService.updateAvailabilitySlot(BigInt(id), userId, body);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Delete('mentor/availability/:id')
    @UseGuards(JwtAuthGuard)
    async deleteAvailabilitySlot(@Req() req: AuthenticatedRequest, @Param('id') id: string): Promise<any> {
        try {
            const userId = BigInt(req.user!.id);
            return await this.mentorService.deleteAvailabilitySlot(BigInt(id), userId);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    // User endpoints for booking
    @Post('book')
    @UseGuards(JwtAuthGuard)
    async bookMentorSession(@Req() req: any, @Body() body: { availabilityId: string; notes?: string }): Promise<any> {
        try {
            const userId = req.user?.id ? BigInt(req.user.id) : BigInt(1);
            return await this.mentorService.bookMentorSession(userId, body);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('my-bookings')
    @UseGuards(JwtAuthGuard)
    async getMyBookings(@Req() req: any): Promise<any> {
        try {
            const userId = req.user?.id ? BigInt(req.user.id) : BigInt(1);
            return await this.mentorService.getMyBookings(userId);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('apply')
    @UseGuards(JwtAuthGuard)
    async applyForMentor(@Req() req: any, @Body() body: any): Promise<any> {
        try {
            const userId = req.user?.id ? BigInt(req.user.id) : BigInt(1);
            return await this.mentorService.applyForMentor(userId, body);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('book-slot')
    @UseGuards(JwtAuthGuard)
    async bookSlot(@Body() body: { slotId: string; userId: string }): Promise<any> {
        try {
            return await this.mentorService.bookSlot(BigInt(body.slotId), BigInt(body.userId));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    // Admin endpoints
    @Post()
    @UseGuards(JwtAuthGuard)
    async createMentor(@Body() mentorData: any): Promise<any> {
        try {
            return await this.mentorService.createMentor(mentorData);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateMentor(@Param('id') id: string, @Body() mentorData: any): Promise<any> {
        try {
            return await this.mentorService.updateMentor(BigInt(id), mentorData);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteMentor(@Param('id') id: string): Promise<any> {
        try {
            return await this.mentorService.deleteMentor(BigInt(id));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

}
