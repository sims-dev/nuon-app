import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, IsArray } from 'class-validator';

export class CreateAssessmentAttemptDto {
  @IsNumber()
  userId!: number;

  @IsNumber()
  assessmentId!: number;

  @IsArray()
  @IsOptional()
  answers?: any[];

  @IsNumber()
  @IsOptional()
  score?: number;

  @IsNumber()
  @IsOptional()
  totalQuestions?: number;

  @IsNumber()
  @IsOptional()
  correctAnswers?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  startedAt?: string;

  @IsDateString()
  @IsOptional()
  completedAt?: string;

  @IsNumber()
  @IsOptional()
  timeSpent?: number;

  @IsBoolean()
  @IsOptional()
  isPassed?: boolean;
}

export class UpdateAssessmentAttemptDto {
  @IsArray()
  @IsOptional()
  answers?: any[];

  @IsNumber()
  @IsOptional()
  score?: number;

  @IsNumber()
  @IsOptional()
  totalQuestions?: number;

  @IsNumber()
  @IsOptional()
  correctAnswers?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  startedAt?: string;

  @IsDateString()
  @IsOptional()
  completedAt?: string;

  @IsNumber()
  @IsOptional()
  timeSpent?: number;

  @IsBoolean()
  @IsOptional()
  isPassed?: boolean;
}