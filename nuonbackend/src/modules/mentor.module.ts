import { Module } from '@nestjs/common';
import { MentorController } from '../controllers/mentor.controller';
import { LegacyMentorController } from '../controllers/legacy-mentor.controller';
import { MentorService } from '../services/mentor.service';
import { PrismaService } from '../services/prisma.service';
import { UploadModule } from './upload.module';
import { NotificationModule } from './notification.module';

@Module({
  imports: [UploadModule, NotificationModule],
  controllers: [MentorController, LegacyMentorController],
  providers: [MentorService, PrismaService],
})
export class MentorModule {}