import { Module } from '@nestjs/common';
import { MentorController } from '../controllers/mentor.controller';
import { LegacyMentorController } from '../controllers/legacy-mentor.controller';
import { MentorService } from '../services/mentor.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  controllers: [MentorController, LegacyMentorController],
  providers: [MentorService, PrismaService],
})
export class MentorModule {}