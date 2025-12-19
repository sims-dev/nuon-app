import { Module } from '@nestjs/common';
import { NccController } from '../controllers/ncc.controller';
import { NccService } from '../services/ncc.service';
import { PrismaService } from '../services/prisma.service';

@Module({
    controllers: [NccController],
    providers: [NccService, PrismaService],
    exports: [NccService]
})
export class NccModule {}