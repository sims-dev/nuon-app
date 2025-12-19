import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';

export enum EngageActivityCategory {
  WELLNESS = 'wellness',
  FITNESS = 'fitness',
  EVENT = 'event',
}

export enum EngageActivityStatus {
  ACTIVE = 'active',
  UPCOMING = 'upcoming',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export class CreateEngageActivityDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(EngageActivityCategory)
  category: EngageActivityCategory;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  points?: number = 100;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsNumber()
  instructorId?: number;

  @IsOptional()
  @IsString()
  instructorName?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number = 100;

  @IsOptional()
  @IsEnum(EngageActivityStatus)
  status?: EngageActivityStatus = EngageActivityStatus.ACTIVE;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  videoThumbnail?: string;

  @IsOptional()
  @IsString()
  videoTitle?: string;

  @IsOptional()
  @IsString()
  videoQuality?: string;

  @IsOptional()
  @IsNumber()
  videoDuration?: number;

  @IsOptional()
  isActive?: boolean;
}

export class UpdateEngageActivityDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(EngageActivityCategory)
  category?: EngageActivityCategory;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  points?: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsNumber()
  instructorId?: number;

  @IsOptional()
  @IsString()
  instructorName?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsEnum(EngageActivityStatus)
  status?: EngageActivityStatus;

  @IsOptional()
  @IsString()
  tags?: string;
}

export class EngageActivityResponseDto {
  id: number;
  title: string;
  description?: string;
  category: EngageActivityCategory;
  type?: string;
  date?: Date;
  time?: string;
  duration?: string;
  location?: string;
  price: number;
  points: number;
  image?: string;
  thumbnail?: string;
  videoUrl?: string;
  videoTitle?: string;
  videoDuration?: number;
  videoQuality?: string;
  videoThumbnail?: string;
  instructorId?: number;
  instructorName?: string;
  capacity: number;
  registeredCount: number;
  status: EngageActivityStatus;
  enrolled: number;
  rating?: number;
  reviewCount: number;
  tags?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class RegisterEngageActivityDto {
  @IsOptional()
  @IsNumber()
  paymentId?: number;

  @IsOptional()
  @IsNumber()
  amountPaid?: number;
}

export class EngageActivityRegistrationResponseDto {
  id: number;
  activityId: number;
  userId: number;
  registrationDate: Date;
  status: string;
  paymentId?: number;
  amountPaid?: number;
  completedAt?: Date;
  certificateUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ReviewEngageActivityDto {
  @IsNumber()
  @Min(1)
  rating: number; // 1-5

  @IsOptional()
  @IsString()
  review?: string;
}
