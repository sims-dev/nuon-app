-- CreateTable
CREATE TABLE `specializations` (
    `id` INTEGER UNSIGNED NOT
NULL AUTO_INCREMENT,
    `name` VARCHAR(60) NOT NULL,
    `active` BIT(1) NOT NULL
DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT
CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `specializations_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
`experiences` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `year_range`
VARCHAR(60) NOT NULL,
    `active` BIT(1) NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX
`experiences_year_range_key`(`year_range`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `qualifications` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(60) NOT NULL,
    `active` BIT(1) NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT
CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `qualifications_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `states` (
    `id` INTEGER UNSIGNED NOT NULL
AUTO_INCREMENT,
    `code` VARCHAR(5) NOT NULL,
    `name` VARCHAR(60) NOT NULL,
    `active` BIT(1) NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT
CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT
CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `states_code_key`(`code`),
    UNIQUE INDEX
`states_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE
utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER
UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(60) NOT NULL,
    `active`
BIT(1) NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT
CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT
CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
`users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(60) NULL,
    `email` VARCHAR(100) NULL,
    `mobile` BIGINT NULL,
    `password` VARCHAR(255) NULL,
    `active` BIT(1) NOT NULL DEFAULT true,
    `mobile_verified` BIT(1) NOT NULL DEFAULT false,
    `role_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `users_email_idx`(`email`),
    INDEX `users_mobile_idx`(`mobile`),
    UNIQUE INDEX `users_email_role_id_key`(`email`, `role_id`),
    UNIQUE INDEX `users_mobile_role_id_key`(`mobile`, `role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp` (
    `id` BIGINT
UNSIGNED NOT NULL AUTO_INCREMENT,
    `otp_code` INTEGER NOT NULL,
    `user_id` BIGINT NOT NULL,
    `verified` BIT(1) NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE
utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT
`users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON
UPDATE CASCADE;
