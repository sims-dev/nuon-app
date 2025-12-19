import { Controller, Post, Get, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post('initiate')
    @UseGuards(JwtAuthGuard)
    async initiatePayment(@Body() body: { itemId: string; amount: number; gateway: string }, @Req() req: any): Promise<any> {
        const userId = BigInt(req.user.id);
        return this.paymentService.initiatePayment(body, userId);
    }

    @Post('mentorship')
    @UseGuards(JwtAuthGuard)
    async initiateMentorshipPayment(@Body() body: {
        mentorId: string;
        amount: number;
        originalAmount: number;
        coupon?: string;
        paymentMethod: string;
        dateTime: string;
    }, @Req() req: any): Promise<any> {
        const userId = BigInt(req.user.id);
        return this.paymentService.initiateMentorshipPayment(body, userId);
    }

    @Get('history')
    @UseGuards(JwtAuthGuard)
    async getPaymentHistory(@Query('userId') userId: string, @Req() req: any): Promise<any> {
        const targetUserId = userId ? BigInt(userId) : BigInt(req.user.id);
        return this.paymentService.getPaymentHistory(targetUserId);
    }

    @Put(':id/status')
    @UseGuards(JwtAuthGuard)
    async updatePaymentStatus(@Param('id') id: string, @Body() body: { status: string }): Promise<any> {
        return this.paymentService.updatePaymentStatus(BigInt(id), body.status);
    }
}