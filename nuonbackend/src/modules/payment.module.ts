import { Module } from '@nestjs/common';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentService } from '../services/payment.service';
import { PrismaService } from '../services/prisma.service';

@Module({
    controllers: [PaymentController],
    providers: [PaymentService, PrismaService],
    exports: [PaymentService]
})
export class PaymentModule {}