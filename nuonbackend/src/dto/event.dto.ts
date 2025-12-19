import { IsString, IsOptional, IsBoolean, IsDateString, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsDateString()
  date!: string;

  @IsString()
  time!: string;

  @IsNumber()
  duration!: number;

  @IsString()
  @IsOptional()
  venueName?: string;

  @IsString()
  @IsOptional()
  venueAddress?: string;

  @IsString()
  @IsOptional()
  venueCity?: string;

  @IsNumber()
  @IsOptional()
  venueLat?: number;

  @IsNumber()
  @IsOptional()
  venueLng?: number;

  @IsNumber()
  price!: number;

  @IsNumber()
  capacity!: number;

  @IsString()
  type!: string;

  @IsNumber()
  instructorId!: number;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  arriveEarly?: number;

  @IsBoolean()
  @IsOptional()
  idRequired?: boolean;

  @IsString()
  @IsOptional()
  dressCode?: string;
}

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  time?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  venueName?: string;

  @IsString()
  @IsOptional()
  venueAddress?: string;

  @IsString()
  @IsOptional()
  venueCity?: string;

  @IsNumber()
  @IsOptional()
  venueLat?: number;

  @IsNumber()
  @IsOptional()
  venueLng?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  arriveEarly?: number;

  @IsBoolean()
  @IsOptional()
  idRequired?: boolean;

  @IsString()
  @IsOptional()
  dressCode?: string;
}