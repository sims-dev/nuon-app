import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreatePurchaseDto {
  @IsNumber()
  userId!: number;

  @IsNumber()
  courseId!: number;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}

export class UpdatePurchaseDto {
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}