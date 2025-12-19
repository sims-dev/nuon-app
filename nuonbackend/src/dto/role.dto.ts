import { UserDto } from './user.dto';

export class RoleDto {
    id!: number;
    name!: string;
    active!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
    users?: UserDto[];
}
