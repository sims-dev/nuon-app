import { Module } from '@nestjs/common';
import { BookingController } from '../controllers/booking.controller';
import { PrismaService } from '../services/prisma.service';

@Module({
  controllers: [BookingController],
  providers: [PrismaService]
})
export class BookingModule {}