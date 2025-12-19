import { IsString, IsOptional, IsBoolean, IsDateString, IsNumber, IsArray } from 'class-validator';

export class CreateMentorAvailabilityDto {
  @IsNumber()
  mentorId!: number;

  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  startDateTime!: string;

  @IsDateString()
  endDateTime!: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsNumber()
  @IsOptional()
  maxBookings?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  sessionType?: string;

  @IsString()
  @IsOptional()
  meetingType?: string;

  @IsString()
  @IsOptional()
  meetingLink?: string;

  @IsArray()
  @IsOptional()
  specializations?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateMentorAvailabilityDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDateTime?: string;

  @IsDateString()
  @IsOptional()
  endDateTime?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsNumber()
  @IsOptional()
  maxBookings?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  sessionType?: string;

  @IsString()
  @IsOptional()
  meetingType?: string;

  @IsString()
  @IsOptional()
  meetingLink?: string;

  @IsArray()
  @IsOptional()
  specializations?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}