import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('hello')
    getHello(): object {
        //console.log(process.env.NVM_DIR)
        return this.appService.getHello();
    }

    // Test route (used by mobile app for connectivity probing)
    @Get('test')
    getTest(): any {
        return {
            message: 'Backend server is running!',
            timestamp: new Date().toISOString()
        };
    }
}
