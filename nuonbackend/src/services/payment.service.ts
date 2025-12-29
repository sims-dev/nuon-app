import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { getSocket } from '../lib/socket';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
    constructor(private readonly prisma: PrismaService) {}

    async createOrder(body: {
        amount: number;
        currency?: string;
        itemType: string;
        itemId: string;
        couponCode?: string;
    }, userId: bigint): Promise<any> {
        try {
            const { amount, currency = 'INR', itemType, itemId, couponCode } = body;

            // Create Razorpay order
            const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // For demo purposes, simulate order creation
            const order = {
                id: orderId,
                amount: amount,
                currency: currency,
                status: 'created'
            };

            // Store order in database
            await this.prisma.payment.create({
                data: {
                    userId,
                    amount: amount / 100, // Store in rupees
                    status: 'pending',
                    paymentId: orderId,
                    orderId: orderId
                }
            });

            return order;
        } catch (error) {
            console.error('Create order error:', error);
            throw new Error('Failed to create payment order');
        }
    }

    async freePurchase(body: {
        itemType: string;
        itemId: string;
        couponCode?: string;
    }, userId: bigint): Promise<any> {
        try {
            const { itemType, itemId, couponCode } = body;

            // Handle different item types
            if (itemType === 'engage-activity') {
                // Register for engage activity
                await this.prisma.engageActivityRegistration.create({
                    data: {
                        activityId: BigInt(itemId),
                        userId: userId,
                        status: 'registered',
                        amountPaid: 0
                    }
                });

                // Update registered count
                await this.prisma.engageActivity.update({
                    where: { id: BigInt(itemId) },
                    data: { registeredCount: { increment: 1 } }
                });
            } else if (itemType === 'course') {
              // Handle course purchase
              await this.prisma.purchase.create({
                data: {
                  userId: userId,
                  courseId: BigInt(itemId),
                  itemType: 'course',
                  amount: 0,
                  status: 'completed'
                }
              });
            } else if (itemType === 'event') {
              // Handle event registration
              await this.prisma.purchase.create({
                data: {
                  userId: userId,
                  itemId: BigInt(itemId),
                  itemType: 'event',
                  amount: 0,
                  status: 'completed'
                }
              });

              // Update registered count
              await this.prisma.event.update({
                where: { id: BigInt(itemId) },
                data: { registeredCount: { increment: 1 } }
              });
            } else if (itemType === 'workshop') {
              // Handle workshop registration
              await this.prisma.purchase.create({
                data: {
                  userId: userId,
                  itemId: BigInt(itemId),
                  itemType: 'workshop',
                  amount: 0,
                  status: 'completed'
                }
              });
            }

            // Emit real-time notification for payment success
            const io = getSocket();
            if (io) {
                io.emit('notification', {
                    type: 'payment:completed',
                    userId: userId.toString(),
                    itemType,
                    itemId,
                    amount: 0,
                    message: `Successfully enrolled in ${itemType}`
                });

                // Emit content update for real-time UI updates
                if (itemType === 'engage-activity') {
                    io.emit('content:engage:updated', { activityId: itemId });
                } else if (itemType === 'course') {
                    io.emit('course_update', { courseId: itemId });
                }
            }

            return {
                success: true,
                message: 'Free purchase completed successfully'
            };
        } catch (error) {
            console.error('Free purchase error:', error);
            throw new Error('Failed to process free purchase');
        }
    }

    async verifyPayment(body: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        itemType: string;
        itemId: string;
        couponCode?: string;
    }, userId: bigint): Promise<any> {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, itemType, itemId } = body;

            // For demo, simulate verification
            // In production, verify signature with Razorpay secret

            // Update payment status
            await this.prisma.payment.updateMany({
                where: {
                    orderId: razorpay_order_id,
                    userId: userId
                },
                data: {
                    status: 'completed',
                    paymentId: razorpay_payment_id
                }
            });

            // Handle different item types
            if (itemType === 'engage-activity') {
                // Register for engage activity
                await this.prisma.engageActivityRegistration.create({
                    data: {
                        activityId: BigInt(itemId),
                        userId: userId,
                        status: 'registered',
                        amountPaid: 0 // Will be updated with actual amount
                    }
                });

                // Update registered count
                await this.prisma.engageActivity.update({
                    where: { id: BigInt(itemId) },
                    data: { registeredCount: { increment: 1 } }
                });
            } else if (itemType === 'course') {
              // Handle course purchase
              await this.prisma.purchase.create({
                data: {
                  userId: userId,
                  courseId: BigInt(itemId),
                  itemType: 'course',
                  amount: 0, // Will be updated with actual amount
                  status: 'completed'
                }
              });
            } else if (itemType === 'event') {
              // Handle event registration
              await this.prisma.purchase.create({
                data: {
                  userId: userId,
                  itemId: BigInt(itemId),
                  itemType: 'event',
                  amount: 0, // Will be updated with actual amount
                  status: 'completed'
                }
              });

              // Update registered count
              await this.prisma.event.update({
                where: { id: BigInt(itemId) },
                data: { registeredCount: { increment: 1 } }
              });
            } else if (itemType === 'workshop') {
              // Handle workshop registration
              await this.prisma.purchase.create({
                data: {
                  userId: userId,
                  itemId: BigInt(itemId),
                  itemType: 'workshop',
                  amount: 0, // Will be updated with actual amount
                  status: 'completed'
                }
              });
            }

            // Emit real-time notification for payment success
            const io = getSocket();
            if (io) {
                io.emit('notification', {
                    type: 'payment:completed',
                    userId: userId.toString(),
                    itemType,
                    itemId,
                    amount: 0, // Will be updated with actual amount from payment record
                    message: `Successfully purchased ${itemType}`
                });

                // Emit content update for real-time UI updates
                if (itemType === 'engage-activity') {
                    io.emit('content:engage:updated', { activityId: itemId });
                } else if (itemType === 'course') {
                    io.emit('course_update', { courseId: itemId });
                }
            }

            return {
                success: true,
                message: 'Payment verified successfully'
            };
        } catch (error) {
            console.error('Payment verification error:', error);
            throw new Error('Payment verification failed');
        }
    }

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