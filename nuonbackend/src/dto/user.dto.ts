import { RoleDto } from './role.dto';

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
