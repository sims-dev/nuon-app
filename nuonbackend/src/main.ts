import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { initializeSocket } from './lib/socket';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IP_ADDRESS } from './config/ipConfig';

// Load environment variables FIRST, before anything else
dotenv.config();

const PORT = process.env.PORT || 5000;

async function bootstrap(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (BigInt.prototype as any).toJSON = function () {
        return this.toString();
    };

    const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: false });
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.use(cookieParser());

    // Configure CORS to allow frontend origins
    const allowedOrigins = [
        `http://localhost:3000`,
        `http://localhost:3001`,
        `http://localhost:3002`,
        `http://localhost:5000`,
        `http://192.168.0.116:3000`,
        `http://192.168.0.116:3001`,
        `http://192.168.0.3:3000`,
        `http://192.168.0.3:5000`,
        `http://192.168.0.4:3000`,
        `http://192.168.0.4:5000`,
        `http://192.168.0.209:3000`,
        `http://192.168.0.209:3001`,
        `http://192.168.0.209:5000`,
    ];

    app.enableCors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
        allowedHeaders: 'Content-Type, Authorization'
    });

    // Set global API prefix
    app.setGlobalPrefix('api');

    // Serve static files from uploads directory with performance optimizations
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads',
        // Enable caching for better performance
        setHeaders: (res, path) => {
            // Cache static assets for 1 hour
            res.set('Cache-Control', 'public, max-age=3600');
            // Set content-type for video files
            if (path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.ogg')) {
                res.set('Accept-Ranges', 'bytes');
                res.set('Content-Type', 'video/mp4');
            } else if (!path.includes('.') && path.includes('uploads')) {
                // Files without extension in uploads are likely videos
                res.set('Accept-Ranges', 'bytes');
                res.set('Content-Type', 'video/mp4');
            }
        }
    });

    // Initialize Socket.io
    const server = app.getHttpServer();
    initializeSocket(server);

    await app.listen(PORT, '0.0.0.0');
    console.log(`Server (with sockets) running on port ${PORT} and listening on 0.0.0.0`);
    console.log(`Server accessible at: http://localhost:${PORT} and http://${IP_ADDRESS}:${PORT}`);

    // Ensure an admin user exists on startup
    const appService = app.get(AppService);
    setTimeout(() => {
        appService.ensureAdminUser();
    }, 2000); // Delay to allow database connection to establish
}
void bootstrap();
