import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateZoomSessionDto {
  @IsNumber()
  bookingId!: number;

  @IsString()
  zoomMeetingId!: string;

  @IsString()
  zoomMeetingPassword!: string;

  @IsString()
  joinUrl!: string;

  @IsString()
  startUrl!: string;

  @IsDateString()
  startTime!: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  recordingUrl?: string;

  @IsBoolean()
  @IsOptional()
  isRecorded?: boolean;
}

export class UpdateZoomSessionDto {
  @IsString()
  @IsOptional()
  zoomMeetingId?: string;

  @IsString()
  @IsOptional()
  zoomMeetingPassword?: string;

  @IsString()
  @IsOptional()
  joinUrl?: string;

  @IsString()
  @IsOptional()
  startUrl?: string;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  recordingUrl?: string;

  @IsBoolean()
  @IsOptional()
  isRecorded?: boolean;
}