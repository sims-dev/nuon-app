import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  nurseId!: number;

  @IsNumber()
  @IsOptional()
  mentorId?: number;

  @IsNumber()
  @IsOptional()
  itemId?: number;

  @IsNumber()
  @IsOptional()
  mentorAvailabilityId?: number;

  @IsDateString()
  dateTime!: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  sessionType?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  zoomLink?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateBookingDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  zoomLink?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}