import { IsString, IsOptional, IsBoolean, IsNumber, IsObject } from 'class-validator';

export class CreateAssessmentDto {
  @IsString()
  title!: string;

  @IsString()
  type!: string; // 'course' or 'ncc'

  @IsObject()
  questions!: any; // JSON object

  @IsNumber()
  @IsOptional()
  courseId?: number;

  @IsNumber()
  createdBy!: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateAssessmentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsObject()
  @IsOptional()
  questions?: any;

  @IsNumber()
  @IsOptional()
  courseId?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class SubmitAssessmentDto {
  @IsObject()
  answers!: any; // JSON object with answers
}