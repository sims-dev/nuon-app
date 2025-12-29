import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { getSocket } from '../lib/socket';
import { firebaseAdmin } from '../config/firebase-admin';

@Injectable()
export class NotificationService {
    constructor(private readonly prisma: PrismaService) {}

    async createNotification(data: { userId: string; title: string; body: string; type: string; payload?: any }): Promise<any> {
        try {
            const notification = await this.prisma.notification.create({
                data: {
                    userId: BigInt(data.userId),
                    title: data.title,
                    message: data.body,
                    type: data.type
                }
            });

            // Send FCM push notification
            await this.sendPushNotification(data.userId, data.title, data.body, data.payload);

            // Emit real-time notification
            const io = getSocket();
            if (io) {
                io.to(data.userId).emit('notification', {
                    event: 'notification:created',
                    title: data.title,
                    body: data.body,
                    type: data.type,
                    payload: data.payload,
                    id: notification.id,
                    createdAt: notification.createdAt
                });
            }

            return notification;
        } catch (error) {
            console.error('createNotification error', error);
            throw new Error('Failed to create notification');
        }
    }

    private async sendPushNotification(userId: string, title: string, body: string, payload?: any): Promise<void> {
        try {
            // Get user's FCM token
            const user = await this.prisma.user.findUnique({
                where: { id: BigInt(userId) },
                select: { deviceToken: true }
            });

            if (!user?.deviceToken) {
                console.log('No FCM token found for user:', userId);
                return;
            }

            // Send FCM message
            const message = {
                token: user.deviceToken,
                notification: {
                    title,
                    body
                },
                data: payload ? {
                    ...payload,
                    userId
                } : { userId }
            };

            const response = await firebaseAdmin.messaging().send(message);
            console.log('FCM notification sent:', response);
        } catch (error) {
            console.error('FCM push notification error:', error);
            // Don't throw error, just log it
        }
    }

    async listNotifications(userId?: string): Promise<any> {
        try {
            const query: any = {};
            if (userId) {
                query.userId = BigInt(userId);
            }

            const items = await this.prisma.notification.findMany({
                where: query,
                orderBy: { createdAt: 'desc' },
                take: 200
            });

            return items;
        } catch (error) {
            console.error('listNotifications error', error);
            throw new Error('Failed to list notifications');
        }
    }

    async markAsRead(notificationId: string): Promise<any> {
        try {
            const notification = await this.prisma.notification.update({
                where: { id: BigInt(notificationId) },
                data: { isRead: true }
            });
            return notification;
        } catch (error) {
            console.error('markAsRead error', error);
            throw new Error('Failed to mark notification as read');
        }
    }
}