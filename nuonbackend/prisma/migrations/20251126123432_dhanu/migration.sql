-- AlterTable
ALTER TABLE `experiences` MODIFY `active` BIT(1) NOT NULL DEFAULT
true;

-- AlterTable
ALTER TABLE `otp` MODIFY `verified` BIT(1) NOT NULL DEFAULT
false;

-- AlterTable
ALTER TABLE `qualifications` MODIFY `active` BIT(1) NOT
NULL DEFAULT true;

-- AlterTable
ALTER TABLE `roles` MODIFY `active` BIT(1) NOT
NULL DEFAULT true;

-- AlterTable
ALTER TABLE `specializations` MODIFY `active`
BIT(1) NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `states` MODIFY
`active` BIT(1) NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `users` MODIFY
`active` BIT(1) NOT NULL DEFAULT true,
    MODIFY `mobile_verified` BIT(1) NOT NULL
DEFAULT false;
