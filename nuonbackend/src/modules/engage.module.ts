import { Module } from '@nestjs/common';
import { EngageController } from '../controllers/engage.controller';
import { EngageService } from '../services/engage.service';
import { PrismaService } from '../services/prisma.service';

@Module({
    controllers: [EngageController],
    providers: [EngageService, PrismaService]
})
export class EngageModule {}