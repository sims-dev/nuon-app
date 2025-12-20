import { Server } from 'socket.io';

let io: Server;

export function initializeSocket(server: any): Server {
    io = new Server(server, {
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
                "http://192.168.0.209:3000",
                "http://192.168.0.209:5000",
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

        // Handle session room joining
        socket.on('join_session', (data: { sessionId: string; userId: string; userType: string }) => {
            socket.join(`session_${data.sessionId}`);
            console.log(`${data.userType} ${data.userId} joined session room ${data.sessionId}`);
        });

        // Handle user joining notification
        socket.on('user_joining', (data: { sessionId: string; userId: string; userName: string; mentorId: string }) => {
            // Notify mentor that user is joining
            io.to(data.mentorId).emit('user_joining_notification', {
                sessionId: data.sessionId,
                userId: data.userId,
                userName: data.userName,
                message: `${data.userName} is joining your session`
            });

            // Notify all participants in session room
            io.to(`session_${data.sessionId}`).emit('user_joined', {
                userId: data.userId,
                userName: data.userName,
                sessionId: data.sessionId
            });
        });

        // Handle meeting ready (mentor creates Zoom meeting)
        socket.on('meeting_ready', (data: { sessionId: string; meetingLink: string; mentorId: string }) => {
            // Notify all participants in session room
            io.to(`session_${data.sessionId}`).emit('meeting_ready', {
                sessionId: data.sessionId,
                meetingLink: data.meetingLink,
                mentorId: data.mentorId
            });
        });

        // Handle mentor joined meeting
        socket.on('mentor_joined', (data: { sessionId: string; mentorId: string }) => {
            io.to(`session_${data.sessionId}`).emit('mentor_joined', {
                sessionId: data.sessionId,
                mentorId: data.mentorId
            });
        });

        // Handle meeting started
        socket.on('meeting_started', (data: { sessionId: string }) => {
            io.to(`session_${data.sessionId}`).emit('meeting_started', {
                sessionId: data.sessionId
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
}

export function getSocket(): Server | undefined {
    return io;
}