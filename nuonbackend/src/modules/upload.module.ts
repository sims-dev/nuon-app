import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from '../controllers/upload.controller';
import { UploadService } from '../services/upload.service';
import { PrismaService } from '../services/prisma.service';

@Global()
@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, PrismaService],
  exports: [UploadService],
})
export class UploadModule {}