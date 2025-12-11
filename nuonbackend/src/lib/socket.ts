import { Server } from 'socket.io';

export function initializeSocket(server: any): Server {
    const io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:3002",
                "http://localhost:5000",
                "http://192.168.0.116:3000",
                "http://192.168.0.116:3001",
                "http://192.168.0.3:3000",
                "http://192.168.0.3:5000",
            ],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join user-specific room
        socket.on('join', (userId: string) => {
            socket.join(userId);
            console.log(`User ${userId} joined room`);
        });

        // Handle new course notifications
        socket.on('new-course', (courseData) => {
            // Broadcast to all connected users
            io.emit('course-created', courseData);
        });

        // Handle booking notifications
        socket.on('booking-update', (bookingData) => {
            // Notify specific users
            if (bookingData.nurseId) {
                io.to(bookingData.nurseId).emit('booking-notification', bookingData);
            }
            if (bookingData.mentorId) {
                io.to(bookingData.mentorId).emit('booking-notification', bookingData);
            }
        });

        // Handle general notifications
        socket.on('send-notification', (notificationData) => {
            if (notificationData.userId) {
                io.to(notificationData.userId).emit('notification', notificationData);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
}