import { Module } from '@nestjs/common';
import { WorkshopController } from '../controllers/workshop.controller';
import { WorkshopService } from '../services/workshop.service';
import { PrismaService } from '../services/prisma.service';

@Module({
    controllers: [WorkshopController],
    providers: [WorkshopService, PrismaService],
    exports: [WorkshopService]
})
export class WorkshopModule {}