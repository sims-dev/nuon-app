import { Module } from '@nestjs/common';
import { AdminController } from '../controllers/admin.controller';
import { AdminService } from '../services/admin.service';
import { NewsService } from '../services/news.service';
import { PrismaService } from '../services/prisma.service';
import { UploadModule } from './upload.module';
import { EngageModule } from './engage.module';

@Module({
  imports: [UploadModule, EngageModule],
  controllers: [AdminController],
  providers: [AdminService, NewsService, PrismaService],
})
export class AdminModule {}