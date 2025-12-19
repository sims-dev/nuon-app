import { Module } from '@nestjs/common';
import { ConferenceController } from '../controllers/conference.controller';
import { ConferenceService } from '../services/conference.service';
import { PrismaService } from '../services/prisma.service';

@Module({
    controllers: [ConferenceController],
    providers: [ConferenceService, PrismaService],
    exports: [ConferenceService]
})
export class ConferenceModule {}