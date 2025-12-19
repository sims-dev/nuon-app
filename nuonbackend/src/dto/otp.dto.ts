export class OtpDto {
    id!: bigint;
    otpCode!: number;
    userId!: bigint;
    verified!: boolean;
    createdAt!: Date;
    expiresAt!: Date;
}
