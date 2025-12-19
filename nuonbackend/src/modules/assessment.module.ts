import { Module } from '@nestjs/common';
import { AssessmentController } from '../controllers/assessment.controller';
import { AssessmentService } from '../services/assessment.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  controllers: [AssessmentController],
  providers: [AssessmentService, PrismaService],
  exports: [AssessmentService],
})
export class AssessmentModule {}