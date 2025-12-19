-- Manual Database Setup Script for sims_nuonhub
-- This file can be used to manually set up the database if Prisma migration fails
-- Run this in MySQL command line or SQL client:
-- mysql -u root -p < setup-database.sql

-- Create database
CREATE DATABASE IF NOT EXISTS sims_nuonhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sims_nuonhub;

-- Create roles table
CREATE TABLE IF NOT EXISTS `roles` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(60) NOT NULL,
    `active` BIT(1) NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create users table
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(60) NULL,
    `email` VARCHAR(100) NULL,
    `phone_number` VARCHAR(20) NULL,
    `password` VARCHAR(255) NULL,
    `active` BIT(1) NOT NULL DEFAULT true,
    `mobile_verified` BIT(1) NOT NULL DEFAULT false,
    `role_id` INTEGER UNSIGNED NOT NULL,
    `is_mentor` BOOLEAN DEFAULT false,
    `is_approved` BOOLEAN DEFAULT false,
    `is_profile_complete` BOOLEAN DEFAULT false,
    `hourly_rate` FLOAT NULL,
    `specialization` VARCHAR(100) NULL,
    `experience` INT DEFAULT 0,
    `qualification` VARCHAR(255) NULL,
    `registration_number` VARCHAR(100) NULL,
    `department` VARCHAR(255) NULL,
    `hospital` VARCHAR(255) NULL,
    `bio` TEXT NULL,
    `availability` VARCHAR(50) NULL,
    `total_sessions` INT DEFAULT 0,
    `rating` FLOAT DEFAULT 0,
    `review_count` INT DEFAULT 0,
    `admin_level` VARCHAR(20) DEFAULT 'standard',
    `last_login` DATETIME NULL,
    `login_attempts` INT DEFAULT 0,
    `city` VARCHAR(50) NULL,
    `location` VARCHAR(100) NULL,
    `profile_picture` VARCHAR(255) NULL,
    `device_token` VARCHAR(255) NULL,
    `device_type` VARCHAR(20) NULL,
    `app_version` VARCHAR(20) NULL,
    `organization` VARCHAR(100) NULL,
    `state` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_phone_number_key`(`phone_number`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_phone_number_idx`(`phone_number`),
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create otp table
CREATE TABLE IF NOT EXISTS `otp` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `otp_code` INTEGER NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `verified` BIT(1) NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at` DATETIME(3) NOT NULL,
    UNIQUE INDEX `otp_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create mentor_availability table
CREATE TABLE IF NOT EXISTS `mentor_availability` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `mentor_id` BIGINT UNSIGNED NOT NULL,
    `day_of_week` VARCHAR(20) NOT NULL,
    `start_time` VARCHAR(20) NOT NULL,
    `end_time` VARCHAR(20) NOT NULL,
    `is_available` BOOLEAN DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    FOREIGN KEY (`mentor_id`) REFERENCES `users`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create bookings table
CREATE TABLE IF NOT EXISTS `bookings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nurse_id` BIGINT UNSIGNED NOT NULL,
    `mentor_id` BIGINT UNSIGNED NOT NULL,
    `availability_slot_id` BIGINT UNSIGNED NOT NULL,
    `date_time` DATETIME NOT NULL,
    `duration` INT NULL,
    `session_type` VARCHAR(50) NULL,
    `price` FLOAT NULL,
    `notes` TEXT NULL,
    `zoom_link` VARCHAR(255) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `catalog_item_id` BIGINT UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    FOREIGN KEY (`nurse_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`mentor_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`availability_slot_id`) REFERENCES `mentor_availability`(`id`),
    INDEX `bookings_mentor_id_idx`(`mentor_id`),
    INDEX `bookings_availability_slot_id_idx`(`availability_slot_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create news table
CREATE TABLE IF NOT EXISTS `news` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `excerpt` TEXT NULL,
    `category` VARCHAR(50) NOT NULL,
    `featured` BOOLEAN DEFAULT false,
    `images` JSON NULL,
    `videos` JSON NULL,
    `tags` JSON NULL,
    `type` VARCHAR(20) DEFAULT 'article',
    `status` VARCHAR(20) DEFAULT 'draft',
    `published_at` DATETIME NULL,
    `author_id` BIGINT UNSIGNED NULL,
    `view_count` INT DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    FOREIGN KEY (`author_id`) REFERENCES `users`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create courses table
CREATE TABLE IF NOT EXISTS `courses` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `price` FLOAT DEFAULT 0,
    `thumbnail` VARCHAR(500) NULL,
    `lessons` JSON NULL,
    `level` VARCHAR(20) NULL,
    `category` VARCHAR(50) NULL,
    `instructor_id` BIGINT UNSIGNED NULL,
    `enrolled_count` INT DEFAULT 0,
    `enrollment_count` INT DEFAULT 0,
    `is_active` BOOLEAN DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    FOREIGN KEY (`instructor_id`) REFERENCES `users`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert default roles if they don't exist
INSERT IGNORE INTO `roles` (`name`, `active`) VALUES
('admin', true),
('mentor', true),
('nurse', true),
('student', true);

-- Display setup completion message
SELECT 'Database setup completed successfully!' as Status;
