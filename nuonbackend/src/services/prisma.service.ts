import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Ensure environment variables are loaded before PrismaClient initialization
dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);
    private isConnected = false;

    constructor() {
        super({
            log: [
                { emit: 'stdout', level: 'warn' },
                { emit: 'stdout', level: 'error' }
            ]
        });
    }

    async onModuleInit(): Promise<void> {
        try {
            await this.$connect();
            this.isConnected = true;
            this.logger.log('✅ Database connected successfully');

            // Log database connection details
            const dbUrl = process.env.DATABASE_URL || '';
            const dbName = dbUrl.split('/').pop()?.split('?')[0] || 'unknown';
            this.logger.log(`📊 Connected to MySQL database: ${dbName}`);

            // Check admin user exists
            try {
                const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nuonhub.com').toLowerCase();
                const adminUser = await this.user.findFirst({
                    where: { email: adminEmail },
                    select: { email: true, name: true }
                });

                if (adminUser) {
                    this.logger.log(`👤 Admin user found: ${adminUser.email} (${adminUser.name})`);
                } else {
                    this.logger.warn(`⚠️ Admin user not found: ${adminEmail}`);
                }
            } catch (adminCheckError) {
                this.logger.warn('⚠️ Could not check admin user status');
            }

        } catch (error) {
            this.isConnected = false;
            this.logger.error('❌ Database connection failed - running without database');
            this.logger.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async onModuleDestroy(): Promise<void> {
        if (this.isConnected) {
            await this.$disconnect();
        }
    }

    getConnectionStatus(): boolean {
        return this.isConnected;
    }
}
