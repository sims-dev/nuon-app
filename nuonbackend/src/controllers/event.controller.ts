import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Req } from '@nestjs/common';
import { EventService } from '../services/event.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Get()
    async getAllEvents(): Promise<any> {
        return this.eventService.getAllEvents();
    }

    // Special/static routes must be declared before parameterized routes
    @Get('my/registered')
    @UseGuards(JwtAuthGuard)
    async getMyEvents(@Req() req: any): Promise<any> {
        const userId = req.user?.id ? BigInt(req.user.id) : BigInt(1);
        return this.eventService.getMyEvents(userId);
    }

    // Legacy/frontend-compatible alias used by mobile app
    @Get('my/events')
    @UseGuards(JwtAuthGuard)
    async getMyEventsAlias(@Req() req: any): Promise<any> {
        const userId = req.user?.id ? BigInt(req.user.id) : BigInt(1);
        return this.eventService.getMyEvents(userId);
    }

    @Get(':id')
    async getEventById(@Param('id') id: string): Promise<any> {
        if (!id || isNaN(Number(id))) {
            throw new Error(`Invalid event ID: ${id}`);
        }
        return this.eventService.getEventById(BigInt(id));
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createEvent(@Body() eventData: any, @Req() req: any): Promise<any> {
        const userId = req.user?.id ? BigInt(req.user.id) : BigInt(1);
        return this.eventService.createEvent(eventData, userId);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateEvent(@Param('id') id: string, @Body() eventData: any): Promise<any> {
        if (!id || isNaN(Number(id))) {
            throw new Error(`Invalid event ID: ${id}`);
        }
        return this.eventService.updateEvent(BigInt(id), eventData);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteEvent(@Param('id') id: string): Promise<any> {
        if (!id || isNaN(Number(id))) {
            throw new Error(`Invalid event ID: ${id}`);
        }
        return this.eventService.deleteEvent(BigInt(id));
    }

    @Post(':id/register')
    @UseGuards(JwtAuthGuard)
    async registerForEvent(
        @Param('id') id: string,
        @Body() body: { paymentId: string; paymentMethod: string },
        @Req() req: any
    ): Promise<any> {
        if (!id || isNaN(Number(id))) {
            throw new Error(`Invalid event ID: ${id}`);
        }
        const userId = req.user?.id ? BigInt(req.user.id) : BigInt(1);
        return this.eventService.registerForEvent(BigInt(id), userId, body);
    }
    
}