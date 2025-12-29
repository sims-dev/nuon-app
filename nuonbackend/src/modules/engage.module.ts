import { Module } from '@nestjs/common';
import { EngageController } from '../controllers/engage.controller';
import { EngageService } from '../services/engage.service';
import { PrismaService } from '../services/prisma.service';
import { UploadModule } from './upload.module';

@Module({
    imports: [],
    controllers: [EngageController],
    providers: [EngageService, PrismaService]
})
export class EngageModule {}