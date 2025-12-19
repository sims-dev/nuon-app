import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    async createNotification(@Body() body: { userId: string; title: string; body: string; type: string; payload?: any }): Promise<any> {
        return this.notificationService.createNotification(body);
    }

    @Get()
    async listNotifications(@Query('userId') userId?: string): Promise<any> {
        return this.notificationService.listNotifications(userId);
    }
}