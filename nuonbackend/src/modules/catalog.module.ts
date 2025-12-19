import { Module } from '@nestjs/common';
import { CatalogController } from '../controllers/catalog.controller';
import { CatalogService } from '../services/catalog.service';
import { PrismaService } from '../services/prisma.service';

@Module({
    controllers: [CatalogController],
    providers: [CatalogService, PrismaService],
    exports: [CatalogService]
})
export class CatalogModule {}