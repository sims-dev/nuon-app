import { Module } from '@nestjs/common';
import { PaymentController } from '../controllers/payment.controller';
import { PrismaService } from '../services/prisma.service';

@Module({
  controllers: [PaymentController],
  providers: [PrismaService]
})
export class PaymentModule {}