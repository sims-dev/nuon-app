import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma.service';
import { AuthModule } from './modules/auth.module';
import { GuardsModule } from './modules/guards.module';
import { BookingModule } from './modules/booking.module';
import { CourseModule } from './modules/course.module';
import { EventModule } from './modules/event.module';
import { MentorModule } from './modules/mentor.module';
import { AdminModule } from './modules/admin.module';
import { AssessmentModule } from './modules/assessment.module';
import { FeedbackModule } from './modules/feedback.module';
import { NewsModule } from './modules/news.module';
import { OtpModule } from './modules/otp.module';
import { UploadModule } from './modules/upload.module';
import { CatalogModule } from './modules/catalog.module';
import { NotificationModule } from './modules/notification.module';
import { PaymentModule } from './modules/payment.module';
import { ProgressModule } from './modules/progress.module';
import { WorkshopModule } from './modules/workshop.module';
import { NccModule } from './modules/ncc.module';
import { ConferenceModule } from './modules/conference.module';
import { AdminContentModule } from './modules/admin-content.module';
import { ActivitiesModule } from './modules/activities.module';
import { DashboardModule } from './modules/dashboard.module';
import { EngageModule } from './modules/engage.module';

@Module({
    imports: [
        AuthModule,
        GuardsModule,
        BookingModule,
        CourseModule,
        EventModule,
        MentorModule,
        AdminModule,
        AssessmentModule,
        FeedbackModule,
        NewsModule,
        OtpModule,
        UploadModule,
        CatalogModule,
        NotificationModule,
        PaymentModule,
        ProgressModule,
        WorkshopModule,
        NccModule,
        ConferenceModule,
        AdminContentModule,
        ActivitiesModule,
        DashboardModule,
        EngageModule
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService]
})
export class AppModule {}
