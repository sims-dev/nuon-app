import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateUserProgressDto {
  @IsNumber()
  userId!: number;

  @IsNumber()
  courseId!: number;

  @IsNumber()
  @IsOptional()
  lessonId?: number;

  @IsNumber()
  @IsOptional()
  progressPercentage?: number;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @IsDateString()
  @IsOptional()
  completedAt?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateUserProgressDto {
  @IsNumber()
  @IsOptional()
  lessonId?: number;

  @IsNumber()
  @IsOptional()
  progressPercentage?: number;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @IsDateString()
  @IsOptional()
  completedAt?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}