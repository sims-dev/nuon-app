import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

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

            // TODO: Emit to socket
            // const io = sock.getIo();
            // if (io) {
            //     io.emit('notification', { event: 'notification:created', title: data.title, body: data.body, type: data.type, payload: data.payload, id: notification.id });
            // }

            return notification;
        } catch (error) {
            console.error('createNotification error', error);
            throw new Error('Failed to create notification');
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
}