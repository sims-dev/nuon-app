import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PaymentService {
    constructor(private readonly prisma: PrismaService) {}

    async initiatePayment(body: { itemId: string; amount: number; gateway: string }, userId: bigint): Promise<any> {
        try {
            const { itemId, amount, gateway } = body;

            const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const payment = await this.prisma.payment.create({
                data: {
                    userId,
                    amount,
                    status: 'pending',
                    paymentId: transactionId,
                    orderId: transactionId
                },
                include: {
                    user: { select: { id: true, name: true, email: true } }
                }
            });

            // TODO: Emit to socket
            // const io = getSocket();
            // if (io) io.emit('notification', { type: 'payment:initiated', payment });

            return payment;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async initiateMentorshipPayment(body: {
        mentorId: string;
        amount: number;
        originalAmount: number;
        coupon?: string;
        paymentMethod: string;
        dateTime: string;
    }, userId: bigint): Promise<any> {
        try {
            const { mentorId, amount, originalAmount, coupon, paymentMethod, dateTime } = body;

            const transactionId = `MENTOR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const payment = await this.prisma.payment.create({
                data: {
                    userId,
                    amount,
                    status: 'completed', // Simulate successful payment for demo
                    paymentId: transactionId,
                    orderId: transactionId
                },
                include: {
                    user: { select: { id: true, name: true, email: true } }
                }
            });

            // TODO: Emit to socket
            // const io = getSocket();
            // if (io) io.emit('notification', { type: 'mentorship_payment:completed', payment });

            return {
                success: true,
                message: 'Payment processed successfully',
                paymentId: payment.id,
                transactionId,
                payment
            };
        } catch (error) {
            console.error('Mentorship payment error:', error);
            throw new Error('Payment processing failed');
        }
    }

    async getPaymentHistory(userId: bigint): Promise<any> {
        try {
            const payments = await this.prisma.payment.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });

            return payments;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updatePaymentStatus(paymentId: bigint, status: string): Promise<any> {
        try {
            const payment = await this.prisma.payment.update({
                where: { id: paymentId },
                data: { status },
                include: {
                    user: { select: { id: true, name: true, email: true } }
                }
            });

            // TODO: Emit to socket
            // const io = getSocket();
            // if (io) io.emit('notification', { type: 'payment:updated', payment });

            return payment;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}