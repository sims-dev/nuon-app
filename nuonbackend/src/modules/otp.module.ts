import { Module } from '@nestjs/common';
import { OtpController } from '../controllers/otp.controller';
import { OtpService } from '../services/otp.service';
import { PrismaService } from '../services/prisma.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [OtpController],
  providers: [OtpService, PrismaService],
})
export class OtpModule {}