import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, IsArray } from 'class-validator';

export class CreateConferenceDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  virtualLink?: string;

  @IsNumber()
  @IsOptional()
  maxAttendees?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsOptional()
  speakers?: string[];

  @IsString()
  @IsOptional()
  agenda?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateConferenceDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  virtualLink?: string;

  @IsNumber()
  @IsOptional()
  maxAttendees?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsOptional()
  speakers?: string[];

  @IsString()
  @IsOptional()
  agenda?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}