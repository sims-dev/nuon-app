import { Controller, Get, Post, Query, Body, UseGuards, Req } from '@nestjs/common';
import { NccService } from '../services/ncc.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('ncc')
export class NccController {
    constructor(private readonly nccService: NccService) {}

    @Get('status')
    @UseGuards(JwtAuthGuard)
    async getNccStatus(@Query('userId') userId: string, @Req() req: any): Promise<any> {
        const targetUserId = userId ? BigInt(userId) : BigInt(req.user.id);
        return this.nccService.getNccStatus(targetUserId);
    }

    @Post('step')
    @UseGuards(JwtAuthGuard)
    async updateNccStep(@Body() body: { step: string; completed: boolean }, @Query('userId') userId: string, @Req() req: any): Promise<any> {
        const targetUserId = userId ? BigInt(userId) : BigInt(req.user.id);
        return this.nccService.updateNccStep(targetUserId, body.step, body.completed);
    }

    @Get('info')
    async getNccInfo(): Promise<any> {
        return this.nccService.getNccInfo();
    }
}