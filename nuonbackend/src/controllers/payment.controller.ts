import { Controller, Post, Body } from '@nestjs/common';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PrismaService } from '../services/prisma.service';

@Controller('payments')
export class PaymentController {
  constructor(private prisma: PrismaService) {}

  @Post('create-order')
  async createOrder(@Body() body: { amount: number, currency: string, itemType: string, itemId: string }) {
    const { amount, currency, itemType, itemId } = body;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    const options = {
      amount,
      currency,
      receipt: `receipt_${itemId}`
    };
    try {
      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  @Post('verify')
  async verifyPayment(@Body() body: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string, itemType: string, itemId: string }) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, itemType, itemId } = body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');
    if (razorpay_signature === expectedSign) {
      // Update booking status
      if (itemType === 'mentorship') {
        await this.prisma.booking.update({
          where: { id: parseInt(itemId) },
          data: { status: 'confirmed' }
        });
      }
      return { success: true };
    } else {
      return { success: false, message: 'Payment verification failed' };
    }
  }
}