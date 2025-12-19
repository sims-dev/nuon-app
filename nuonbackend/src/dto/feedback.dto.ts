import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class CreateFeedbackDto {
  @IsNumber()
  mentorId!: number;

  @IsNumber()
  nurseId!: number;

  @IsNumber()
  @IsOptional()
  bookingId?: number;

  @IsNumber()
  rating!: number;

  @IsString()
  comments!: string;

  @IsObject()
  @IsOptional()
  skills?: any;

  @IsNumber()
  @IsOptional()
  communication?: number;

  @IsNumber()
  @IsOptional()
  technical?: number;

  @IsNumber()
  @IsOptional()
  professionalism?: number;
}

export class UpdateFeedbackDto {
  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  comments?: string;

  @IsObject()
  @IsOptional()
  skills?: any;

  @IsNumber()
  @IsOptional()
  communication?: number;

  @IsNumber()
  @IsOptional()
  technical?: number;

  @IsNumber()
  @IsOptional()
  professionalism?: number;
}