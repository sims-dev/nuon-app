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
} from '@nestjs/common';
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
  constructor(private readonly engageService: EngageService) {}

  /**
   * Get all engage activities with optional filtering
   * GET /engage/activities?category=wellness&status=active&page=1&limit=10
   */
  @Get('activities')
  async getActivities(
    @Query('category') category?: EngageActivityCategory,
    @Query('status') status?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    try {
      return await this.engageService.getActivities(
        category,
        status,
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
  async createActivity(
    @Body() createDto: CreateEngageActivityDto,
    @Req() req: any,
  ) {
    try {
      const creatorId = req.user?.id || req.user?.sub;
      if (!creatorId) {
        throw new BadRequestException('User ID is required');
      }
      return await this.engageService.createActivity(createDto, Number(creatorId));
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