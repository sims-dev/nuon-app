import { Module } from '@nestjs/common';
import { ProgressController } from '../controllers/progress.controller';
import { ProgressService } from '../services/progress.service';
import { PrismaService } from '../services/prisma.service';

@Module({
    controllers: [ProgressController],
    providers: [ProgressService, PrismaService],
    exports: [ProgressService]
})
export class ProgressModule {}