import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  userId!: number;

  @IsNumber()
  amount!: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  paymentId?: string;

  @IsString()
  @IsOptional()
  orderId?: string;
}

export class UpdatePaymentDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  paymentId?: string;

  @IsString()
  @IsOptional()
  orderId?: string;
}