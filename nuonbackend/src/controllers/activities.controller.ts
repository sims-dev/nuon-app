import { Controller, Post, Body } from '@nestjs/common';

@Controller('activities')
export class ActivitiesController {
    @Post()
    async logActivity(@Body() body: any) {
        // You can log or process activity here
        return { success: true, message: 'Activity logged (dummy endpoint)' };
    }
}