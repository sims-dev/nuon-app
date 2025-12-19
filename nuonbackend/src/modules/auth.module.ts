import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { PrismaService } from '../services/prisma.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, PrismaService],
    exports: [AuthService]
})
export class AuthModule {}
