import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createBooking(@Body() bookingData: any): Promise<any> {
        // TODO: Get user from JWT
        const userId = BigInt(1); // Placeholder
        return this.bookingService.createBooking(bookingData, userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getBookings(): Promise<any> {
        // TODO: Get user from JWT
        const userId = BigInt(1); // Placeholder
        return this.bookingService.getBookings(userId);
    }

    @Put(':id/status')
    @UseGuards(JwtAuthGuard)
    async updateBookingStatus(
        @Param('id') id: string,
        @Body() body: { status: string }
    ): Promise<any> {
        return this.bookingService.updateBookingStatus(BigInt(id), body.status);
    }

    @Post(':id/zoom')
    @UseGuards(JwtAuthGuard)
    async createZoomSession(
        @Param('id') id: string,
        @Body() body: { zoomLink: string }
    ): Promise<any> {
        return this.bookingService.createZoomSession(BigInt(id), body.zoomLink);
    }
}