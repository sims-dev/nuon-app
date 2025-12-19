import { Module } from '@nestjs/common';
import { DashboardController } from '../controllers/dashboard.controller';
import { NewsModule } from './news.module';
import { CourseModule } from './course.module';
import { EventModule } from './event.module';
import { WorkshopModule } from './workshop.module';
import { AssessmentModule } from './assessment.module';

@Module({
  imports: [NewsModule, CourseModule, EventModule, WorkshopModule, AssessmentModule],
  controllers: [DashboardController],
})
export class DashboardModule {}