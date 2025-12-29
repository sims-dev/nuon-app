import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { getSocket } from '../lib/socket';
import {
  CreateEngageActivityDto,
  UpdateEngageActivityDto,
  EngageActivityResponseDto,
  RegisterEngageActivityDto,
  ReviewEngageActivityDto,
  EngageActivityCategory,
} from '../dto/engage.dto';

@Injectable()
export class EngageService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all engage activities with optional filtering
   */
  async getActivities(
    category?: EngageActivityCategory,
    status?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: EngageActivityResponseDto[]; total: number }> {
    const skip = (page - 1) * limit;

    const whereCondition: any = {
      isActive: true,
    };

    if (category) {
      whereCondition.category = category;
    }

    if (status) {
      whereCondition.status = status;
    }

    const [activities, total] = await Promise.all([
      this.prisma.engageActivity.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
            },
          },
        },
      }),
      this.prisma.engageActivity.count({ where: whereCondition }),
    ]);

    return {
      data: activities.map((activity) => this.formatActivityResponse(activity)),
      total,
    };
  }

  /**
   * Get a single activity by ID
   */
  async getActivityById(id: number): Promise<EngageActivityResponseDto> {
    const activity = await this.prisma.engageActivity.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        registrations: {
          select: {
            userId: true,
          },
        },
        reviews: true,
      },
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    return this.formatActivityResponse(activity);
  }

  /**
   * Create a new engage activity
   */
  async createActivity(
    createDto: CreateEngageActivityDto,
    creatorId: number,
  ): Promise<EngageActivityResponseDto> {
    const activity = await this.prisma.engageActivity.create({
      data: {
        title: createDto.title,
        description: createDto.description,
        category: createDto.category,
        type: createDto.type,
        date: createDto.date ? new Date(`${createDto.date}T00:00:00.000Z`) : null,
        time: createDto.time,
        duration: createDto.duration,
        location: createDto.location,
        price: createDto.price || 0,
        points: createDto.points || 100,
        image: createDto.image,
        thumbnail: createDto.thumbnail,
        instructorId: createDto.instructorId,
        instructorName: createDto.instructorName,
        capacity: createDto.capacity || 100,
        status: createDto.status || 'active',
        tags: createDto.tags,
        creatorId,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    return this.formatActivityResponse(activity);
  }

  /**
   * Update an engage activity
   */
  async updateActivity(
    id: number,
    updateDto: UpdateEngageActivityDto,
  ): Promise<EngageActivityResponseDto> {
    // Verify activity exists
    await this.getActivityById(id);

    const activity = await this.prisma.engageActivity.update({
      where: { id },
      data: {
        ...(updateDto.title !== undefined && { title: updateDto.title }),
        ...(updateDto.description !== undefined && {
          description: updateDto.description,
        }),
        ...(updateDto.category !== undefined && { category: updateDto.category }),
        ...(updateDto.type !== undefined && { type: updateDto.type }),
        ...(updateDto.date !== undefined && {
          date: updateDto.date ? new Date(`${updateDto.date}T00:00:00.000Z`) : null,
        }),
        ...(updateDto.time !== undefined && { time: updateDto.time }),
        ...(updateDto.duration !== undefined && {
          duration: updateDto.duration,
        }),
        ...(updateDto.location !== undefined && {
          location: updateDto.location,
        }),
        ...(updateDto.price !== undefined && { price: updateDto.price }),
        ...(updateDto.points !== undefined && { points: updateDto.points }),
        ...(updateDto.image !== undefined && { image: updateDto.image }),
        ...(updateDto.thumbnail !== undefined && {
          thumbnail: updateDto.thumbnail,
        }),
        ...(updateDto.instructorId !== undefined && {
          instructorId: updateDto.instructorId,
        }),
        ...(updateDto.instructorName !== undefined && {
          instructorName: updateDto.instructorName,
        }),
        ...(updateDto.capacity !== undefined && {
          capacity: updateDto.capacity,
        }),
        ...(updateDto.status !== undefined && { status: updateDto.status }),
        ...(updateDto.tags !== undefined && { tags: updateDto.tags }),
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    // Emit socket event for real-time updates
    const io = getSocket();
    if (io) io.emit('content:engage:created', { activityId: activity.id, title: activity.title, category: activity.category });

    // Emit socket event for real-time updates
    const socketIo = getSocket();
    if (socketIo) socketIo.emit('content:engage:updated', { activityId: activity.id });

    return this.formatActivityResponse(activity);
   }

  /**
   * Delete an engage activity
   */
  async deleteActivity(id: number): Promise<{ message: string }> {
    // Verify activity exists
    await this.getActivityById(id);

    await this.prisma.engageActivity.delete({
       where: { id },
     });

     // Emit socket event for real-time updates
     const socketIoDelete = getSocket();
     if (socketIoDelete) socketIoDelete.emit('content:engage:deleted', { activityId: id });

     return { message: 'Activity deleted successfully' };
  }

  /**
   * Register user for an activity
   */
  async registerActivity(
    activityId: number,
    userId: number,
    registerDto?: RegisterEngageActivityDto,
  ): Promise<{ message: string; registration: any }> {
    const activity = await this.prisma.engageActivity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${activityId} not found`);
    }

    // Check capacity
    if (
      activity.registeredCount >= activity.capacity &&
      activity.capacity > 0
    ) {
      throw new BadRequestException(
        'Activity is at full capacity. No more registrations allowed.',
      );
    }

    // Check if already registered
    const existingRegistration =
      await this.prisma.engageActivityRegistration.findUnique({
        where: {
          activityId_userId: {
            activityId,
            userId,
          },
        },
      });

    if (existingRegistration) {
      throw new BadRequestException('User is already registered for this activity');
    }

    // Create registration
    const registration = await this.prisma.engageActivityRegistration.create({
      data: {
        activityId,
        userId,
        status: 'registered',
        paymentId: registerDto?.paymentId,
        amountPaid: registerDto?.amountPaid,
      },
    });

    // Update registered count
    await this.prisma.engageActivity.update({
      where: { id: activityId },
      data: {
        registeredCount: {
          increment: 1,
        },
      },
    });

    return {
      message: 'Successfully registered for the activity',
      registration,
    };
  }

  /**
   * Cancel activity registration
   */
  async cancelRegistration(
    activityId: number,
    userId: number,
  ): Promise<{ message: string }> {
    const registration =
      await this.prisma.engageActivityRegistration.findUnique({
        where: {
          activityId_userId: {
            activityId,
            userId,
          },
        },
      });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    if (registration.status === 'cancelled') {
      throw new BadRequestException('Registration is already cancelled');
    }

    // Update registration status
    await this.prisma.engageActivityRegistration.update({
      where: { id: registration.id },
      data: { status: 'cancelled' },
    });

    // Decrement registered count
    await this.prisma.engageActivity.update({
      where: { id: activityId },
      data: {
        registeredCount: {
          decrement: 1,
        },
      },
    });

    return { message: 'Registration cancelled successfully' };
  }

  /**
   * Get user's registrations
   */
  async getUserRegistrations(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: any[]; total: number }> {
    const skip = (page - 1) * limit;

    const [registrations, total] = await Promise.all([
      this.prisma.engageActivityRegistration.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { registrationDate: 'desc' },
        include: {
          activity: {
            select: {
              id: true,
              title: true,
              category: true,
              type: true,
              date: true,
              time: true,
              location: true,
              image: true,
              thumbnail: true,
              price: true,
              points: true,
              isActive: true,
              instructorName: true,
            },
          },
        },
      }),
      this.prisma.engageActivityRegistration.count({ where: { userId } }),
    ]);

    return { data: registrations, total };
  }

  /**
   * Submit review for an activity
   */
  async submitReview(
    activityId: number,
    userId: number,
    reviewDto: ReviewEngageActivityDto,
  ): Promise<{ message: string; review: any }> {
    if (reviewDto.rating < 1 || reviewDto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Check if user has registered for the activity
    const registration =
      await this.prisma.engageActivityRegistration.findUnique({
        where: {
          activityId_userId: {
            activityId,
            userId,
          },
        },
      });

    if (!registration) {
      throw new BadRequestException(
        'You must be registered for the activity to submit a review',
      );
    }

    // Check if user has already reviewed
    const existingReview = await this.prisma.engageActivityReview.findUnique({
      where: {
        activityId_userId: {
          activityId,
          userId,
        },
      },
    });

    let review;

    if (existingReview) {
      // Update existing review
      review = await this.prisma.engageActivityReview.update({
        where: { id: existingReview.id },
        data: {
          rating: reviewDto.rating,
          review: reviewDto.review,
        },
      });
    } else {
      // Create new review
      review = await this.prisma.engageActivityReview.create({
        data: {
          activityId,
          userId,
          rating: reviewDto.rating,
          review: reviewDto.review,
        },
      });

      // Update activity review count
      await this.prisma.engageActivity.update({
        where: { id: activityId },
        data: {
          reviewCount: {
            increment: 1,
          },
        },
      });
    }

    // Recalculate activity rating
    const reviews = await this.prisma.engageActivityReview.findMany({
      where: { activityId },
      select: { rating: true },
    });

    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await this.prisma.engageActivity.update({
      where: { id: activityId },
      data: { rating: averageRating },
    });

    return { message: 'Review submitted successfully', review };
  }

  /**
   * Get activity reviews
   */
  async getActivityReviews(
    activityId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: any[]; total: number }> {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.engageActivityReview.findMany({
        where: { activityId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
            },
          },
        },
      }),
      this.prisma.engageActivityReview.count({ where: { activityId } }),
    ]);

    return { data: reviews, total };
  }

  /**
   * Mark activity as completed
   */
  async markActivityCompleted(
    registrationId: number,
    certificateUrl?: string,
  ): Promise<{ message: string }> {
    const registration =
      await this.prisma.engageActivityRegistration.findUnique({
        where: { id: registrationId },
      });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    await this.prisma.engageActivityRegistration.update({
      where: { id: registrationId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        certificateUrl,
      },
    });

    return { message: 'Activity marked as completed' };
  }

  /**
   * Search activities
   */
  async searchActivities(
    query: string,
    category?: EngageActivityCategory,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: EngageActivityResponseDto[]; total: number }> {
    const skip = (page - 1) * limit;

    const whereCondition: any = {
      isActive: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { instructorName: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (category) {
      whereCondition.category = category;
    }

    const [activities, total] = await Promise.all([
      this.prisma.engageActivity.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
            },
          },
        },
      }),
      this.prisma.engageActivity.count({ where: whereCondition }),
    ]);

    return {
      data: activities.map((activity) => this.formatActivityResponse(activity)),
      total,
    };
  }

  /**
   * Format activity response
   */
  private formatActivityResponse(activity: any): EngageActivityResponseDto {
    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      category: activity.category,
      type: activity.type,
      date: activity.date,
      time: activity.time,
      duration: activity.duration,
      location: activity.location,
      price: activity.price,
      points: activity.points,
      image: activity.image,
      thumbnail: activity.thumbnail,
      videoUrl: activity.videoUrl,
      videoTitle: activity.videoTitle,
      videoDuration: activity.videoDuration,
      videoQuality: activity.videoQuality,
      videoThumbnail: activity.videoThumbnail,
      instructorId: activity.instructorId,
      instructorName: activity.instructorName || activity.instructor?.name,
      capacity: activity.capacity,
      registeredCount: activity.registeredCount,
      status: activity.status,
      enrolled: activity.enrolled,
      rating: activity.rating,
      reviewCount: activity.reviewCount,
      tags: activity.tags,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    };
  }
}