import { Module } from '@nestjs/common';
import { AdminContentController } from '../controllers/admin-content.controller';
import { AdminContentService } from '../services/admin-content.service';
import { PrismaService } from '../services/prisma.service';

@Module({
    controllers: [AdminContentController],
    providers: [AdminContentService, PrismaService],
    exports: [AdminContentService]
})
export class AdminContentModule {}