import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCatalogItemDto {
  @IsString()
  type!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  @IsOptional()
  schedule?: string;

  @IsString()
  @IsOptional()
  contentUrl?: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  createdBy!: number;
}

export class UpdateCatalogItemDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  schedule?: string;

  @IsString()
  @IsOptional()
  contentUrl?: string;

  @IsNumber()
  @IsOptional()
  price?: number;
}