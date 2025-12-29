import { RoleDto } from './role.dto';
import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean, Min, IsEnum } from 'class-validator';

export class UserDto {
    id!: bigint;
    name?: string;
    email?: string;
    mobile?: bigint;
    password?: string;
    active!: boolean;
    mobileVerified!: boolean;
    roleId!: number;
    role?: RoleDto;
    createdAt!: Date;
    updatedAt!: Date;
}

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsString()
    role: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    specialization?: string;

    @IsOptional()
    @IsString()
    experience?: string;

    @IsOptional()
    @IsString()
    qualification?: string;

    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @IsString()
    hospital?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    hourlyRate?: string;

    @IsOptional()
    @IsString()
    availability?: string;
}
