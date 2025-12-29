import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
  BadRequestException,
  NotFoundException,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadService } from '../services/upload.service';
import { EngageService } from '../services/engage.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  CreateEngageActivityDto,
  UpdateEngageActivityDto,
  RegisterEngageActivityDto,
  ReviewEngageActivityDto,
  EngageActivityCategory,
} from '../dto/engage.dto';

@Controller('engage')
export class EngageController {
  constructor(
    private readonly engageService: EngageService,
    private readonly uploadService: UploadService
  ) {}

  /**
   * Get all engage activities with optional filtering
   * GET /engage/activities?category=wellness&status=active&page=1&limit=10
   */
  @Get('activities')
  async getActivities(
    @Query('category') category?: EngageActivityCategory,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const parsedPage = page ? parseInt(page, 10) : 1;
      const parsedLimit = limit ? parseInt(limit, 10) : 10;
      return await this.engageService.getActivities(
        category,
        status,
        parsedPage,
        parsedLimit,
      );
    } catch (error) {
      throw new HttpException(
        { success: false, message: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Search activities
   * GET /engage/activities/search?query=yoga&category=fitness
   */
  @Get('activities/search')
  async searchActivities(
    @Query('query') query: string,
    @Query('category') category?: EngageActivityCategory,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    try {
      if (!query || query.trim().length === 0) {
        throw new BadRequestException('Search query is required');
      }
      return await this.engageService.searchActivities(
        query,
        category,
        page || 1,
        limit || 10,
      );
    } catch (error) {
      throw new HttpException(
        { success: false, message: (error as Error).message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Get single activity by ID
   * GET /engage/activities/:id
   */
  @Get('activities/:id')
  async getActivityById(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.engageService.getActivityById(id);
    } catch (error) {
      throw new HttpException(
        { success: false, message: (error as Error).message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Create new engage activity (admin only)
   * POST /engage/activities
   */
  @Post('activities')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'videoFile', maxCount: 1 },
    { name: 'videoThumbnail', maxCount: 1 }
  ], {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      }
    }),
    limits: {
      fileSize: 500 * 1024 * 1024, // 500MB
    }
  }))
  async createActivity(
    @UploadedFiles() files: { [fieldname: string]: Express.Multer.File[] },
    @Body() body: CreateEngageActivityDto,
    @Req() request: any,
  ) {
    try {
      const creatorId = request.user?.id || request.user?.sub;
      if (!creatorId) {
        throw new BadRequestException('User ID is required');
      }

      // Normalize uploaded files
      const normalizeFiles = (rawFiles: any, reqObj: any) => {
        const map: { [k: string]: Express.Multer.File[] } = {};
        const source = rawFiles || reqObj?.files || {};

        // If req.file exists (single file), map it by its fieldname
        if (reqObj?.file) {
          const f = reqObj.file;
          if (f && f.fieldname) map[f.fieldname] = [f];
        }

        // If source is an object mapping field->file/array, normalize arrays
        if (source && typeof source === 'object') {
          Object.keys(source).forEach((key) => {
            const val = source[key];
            if (!val) return;
            if (Array.isArray(val)) map[key] = val;
            else map[key] = [val];
          });
        }

        return map;
      };

      const filesMap = normalizeFiles(files, request);

      // Convert date to ISO string
      if (body.date) {
        body.date = body.date + 'T00:00:00.000Z';
      }

      // Attach uploaded URLs to body if present
      if (filesMap.image && filesMap.image[0]) {
        const img = await this.uploadService.uploadImage(filesMap.image[0]);
        body.image = img.url;
      }
      if (filesMap.thumbnail && filesMap.thumbnail[0]) {
        const thumb = await this.uploadService.uploadImage(filesMap.thumbnail[0]);
        body.thumbnail = thumb.url;
      }
      if (filesMap.videoFile && filesMap.videoFile[0]) {
        const video = await this.uploadService.uploadVideo(filesMap.videoFile[0]);
        body.videoUrl = video.url;
      }
      if (filesMap.videoThumbnail && filesMap.videoThumbnail[0]) {
        const vthumb = await this.uploadService.uploadThumbnail(filesMap.videoThumbnail[0]);
        body.videoThumbnail = vthumb.url;
      }

      return await this.engageService.createActivity(body, Number(creatorId));
    } catch (error) {
      throw new HttpException(
        { success: false, message: (error as Error).message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Update engage activity
   * PUT /engage/activities/:id
   */
  @Put('activities/:id')
  @UseGuards(JwtAuthGuard)
  async updateActivity(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEngageActivityDto,
  ) {
    try {
      return await this.engageService.updateActivity(id, updateDto);
    } catch (error) {
      throw new HttpException(
        { success: false, message: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete engage activity
   * DELETE /engage/activities/:id
   */
  @Delete('activities/:id')
  @UseGuards(JwtAuthGuard)
  async deleteActivity(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.engageService.deleteActivity(id);
    } catch (error) {
      throw new HttpException(
        { success: false, message: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Register user for an activity
   * POST /engage/activities/:id/register
   */
  @Post('activities/:id/register')
  @UseGuards(JwtAuthGuard)
  async registerActivity(
    @Param('id', ParseIntPipe) id: number,
    @Body() registerDto: RegisterEngageActivityDto,
    @Req() req: any,
  ) {
    try {
      const userId = req.user?.id || req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      return await this.engageService.registerActivity(
        id,
        Number(userId),
        registerDto,
      );
    } catch (error) {
      throw new HttpException(
        { success: false, message: (error as Error).message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Cancel activity registration
   * DELETE /engage/activities/:id/register
   */
  @Delete('activities/:id/register')
  @UseGuards(JwtAuthGuard)
  async cancelRegistration(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    try {
      const userId = req.user?.id || req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      return await this.engageService.cancelRegistration(id, Number(userId));
    } catch (error) {
      throw new HttpException(
        { success: false, message: (error as Error).message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Get user's registrations
   * GET /engage/my-registrations?page=1&limit=10
   */
  @Get('my-registrations')
  @UseGuards(JwtAuthGuard)
  async getMyRegistrations(
    @Req() req: any,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    try {
      const userId = req.user?.id || req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      return await this.engageService.getUserRegistrations(
        Number(userId),
        page || 1,
        limit || 10,
      );
    } catch (error) {
      throw new HttpException(
        { success: false, message: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Submit review for an activity
   * POST /engage/activities/:id/review
   */
  @Post('activities/:id/review')
  @UseGuards(JwtAuthGuard)
  async submitReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() reviewDto: ReviewEngageActivityDto,
    @Req() req: any,
  ) {
    try {
      const userId = req.user?.id || req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      return await this.engageService.submitReview(
        id,
        Number(userId),
        reviewDto,
      );
    } catch (error) {
      throw new HttpException(
        { success: false, message: (error as Error).message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Get reviews for an activity
   * GET /engage/activities/:id/reviews?page=1&limit=10
   */
  @Get('activities/:id/reviews')
  async getActivityReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    try {
      return await this.engageService.getActivityReviews(
        id,
        page || 1,
        limit || 10,
      );
    } catch (error) {
      throw new HttpException(
        { success: false, message: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Mark activity as completed
   * POST /engage/registrations/:registrationId/complete
   */
  @Post('registrations/:registrationId/complete')
  @UseGuards(JwtAuthGuard)
  async markActivityCompleted(
    @Req() req: any,
    @Param('registrationId', ParseIntPipe) registrationId?: number,
    @Body() body?: { certificateUrl?: string },
  ) {
    try {
      if (!registrationId) {
        throw new BadRequestException('Registration ID is required');
      }
      return await this.engageService.markActivityCompleted(
        registrationId,
        body?.certificateUrl,
      );
    } catch (error) {
      throw new HttpException(
        { success: false, message: (error as Error).message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}