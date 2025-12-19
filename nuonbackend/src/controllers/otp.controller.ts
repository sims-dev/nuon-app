import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from '../services/otp.service';

@Controller('otp')
export class OtpController {
    constructor(private readonly otpService: OtpService) {}

    @Post('send-phone')
    async sendPhoneOTP(@Body() body: { phoneNumber: string }): Promise<any> {
        return this.otpService.sendPhoneOTP(body);
    }

    @Post('send-email')
    async sendEmailOTP(@Body() body: { email: string }): Promise<any> {
        return this.otpService.sendEmailOTP(body);
    }

    @Post('verify')
    async verifyOTP(@Body() body: { identifier: string; otp: string; type: 'phone' | 'email' }): Promise<any> {
        return this.otpService.verifyOTP(body);
    }
}