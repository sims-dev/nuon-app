/*
 Warnings:

 - A unique constraint covering the columns `[user_id]` on the
 table `otp` will be added. If there are existing duplicate values, this will
 fail.

*/
-- AlterTable
ALTER TABLE `experiences` MODIFY `active` BIT(1) NOT NULL
DEFAULT true;

-- AlterTable
ALTER TABLE `otp` MODIFY `verified` BIT(1) NOT NULL
DEFAULT false;

-- AlterTable
ALTER TABLE `qualifications` MODIFY `active`
BIT(1) NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `roles` MODIFY `active`
BIT(1) NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `specializations` MODIFY
`active` BIT(1) NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `states` MODIFY
`active` BIT(1) NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `users` MODIFY
`active` BIT(1) NOT NULL DEFAULT true,
    MODIFY `mobile_verified` BIT(1) NOT
NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `otp_user_id_key` ON
`otp`(`user_id`);
