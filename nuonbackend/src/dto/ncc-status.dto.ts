import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateNccStatusDto {
  @IsNumber()
  userId!: number;

  @IsString()
  currentStep!: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  completedAt?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}

export class UpdateNccStatusDto {
  @IsString()
  @IsOptional()
  currentStep?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  completedAt?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}