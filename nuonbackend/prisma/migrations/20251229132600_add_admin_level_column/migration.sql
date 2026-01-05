/*
  Warnings:

  - You are about to drop the column `image_url` on the `catalog_items` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `conferences` table. All the data in the column will be lost.
  - You are about to drop the column `video_url` on the `conferences` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `max_participants` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `venue_address` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `venue_city` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `venue_lat` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `venue_lng` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `venue_name` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `video_url` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `meeting_type` on the `mentor_availability` table. All the data in the column will be lost.
  - You are about to drop the column `session_type` on the `mentor_availability` table. All the data in the column will be lost.
  - You are about to drop the column `is_completed` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `payment_id` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `admin_level` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `session_type` on the `workshop_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `cover_image` on the `workshops` table. All the data in the column will be lost.
  - You are about to drop the column `join_url` on the `zoom_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `meeting_id` on the `zoom_sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lesson_id]` on the table `assessments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `joinUrl` to the `zoom_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meetingId` to the `zoom_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assessments` ADD COLUMN `lesson_id` BIGINT UNSIGNED NULL;

-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `reschedule_count` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `catalog_items` DROP COLUMN `image_url`,
    ADD COLUMN `imageUrl` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `conferences` DROP COLUMN `image_url`,
    DROP COLUMN `video_url`,
    ADD COLUMN `imageUrl` VARCHAR(500) NULL,
    ADD COLUMN `videoUrl` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `courses` ADD COLUMN `certificate` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `date` DATETIME(3) NULL,
    ADD COLUMN `duration` VARCHAR(50) NULL,
    ADD COLUMN `image` VARCHAR(500) NULL,
    ADD COLUMN `modules` INTEGER NULL DEFAULT 0,
    ADD COLUMN `points` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `type` VARCHAR(50) NULL,
    ADD COLUMN `video_duration` INTEGER NULL,
    ADD COLUMN `video_quality` VARCHAR(100) NULL,
    ADD COLUMN `video_thumbnail` VARCHAR(500) NULL,
    ADD COLUMN `video_title` VARCHAR(255) NULL,
    ADD COLUMN `video_uploaded_at` DATETIME(3) NULL,
    ADD COLUMN `video_url` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `events` DROP COLUMN `image_url`,
    DROP COLUMN `max_participants`,
    DROP COLUMN `venue_address`,
    DROP COLUMN `venue_city`,
    DROP COLUMN `venue_lat`,
    DROP COLUMN `venue_lng`,
    DROP COLUMN `venue_name`,
    ADD COLUMN `category` VARCHAR(50) NOT NULL DEFAULT 'event',
    ADD COLUMN `end_date` DATETIME(3) NULL,
    ADD COLUMN `image` VARCHAR(500) NULL,
    ADD COLUMN `imageUrl` VARCHAR(500) NULL,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `level` VARCHAR(20) NULL,
    ADD COLUMN `location` VARCHAR(255) NULL,
    ADD COLUMN `maxParticipants` INTEGER NOT NULL DEFAULT 100,
    ADD COLUMN `points` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `seats` INTEGER NULL DEFAULT 100,
    ADD COLUMN `speakers` VARCHAR(255) NULL,
    ADD COLUMN `start_date` DATETIME(3) NULL,
    ADD COLUMN `tags` JSON NULL,
    ADD COLUMN `thumbnail` VARCHAR(500) NULL,
    ADD COLUMN `type` VARCHAR(50) NULL,
    ADD COLUMN `venueAddress` VARCHAR(500) NULL,
    ADD COLUMN `venueCity` VARCHAR(100) NULL,
    ADD COLUMN `venueLat` DOUBLE NULL,
    ADD COLUMN `venueLng` DOUBLE NULL,
    ADD COLUMN `venueName` VARCHAR(255) NULL,
    ADD COLUMN `video_duration` INTEGER NULL,
    ADD COLUMN `video_quality` VARCHAR(100) NULL,
    ADD COLUMN `video_thumbnail` VARCHAR(500) NULL,
    ADD COLUMN `video_title` VARCHAR(255) NULL,
    ADD COLUMN `video_uploaded_at` DATETIME(3) NULL,
    ADD COLUMN `video_url` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `lessons` DROP COLUMN `video_url`,
    ADD COLUMN `videoUrl` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `mentor_availability` DROP COLUMN `meeting_type`,
    DROP COLUMN `session_type`,
    ADD COLUMN `meetingType` VARCHAR(50) NULL,
    ADD COLUMN `sessionType` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `payments` ADD COLUMN `course_id` BIGINT UNSIGNED NULL;

-- AlterTable
ALTER TABLE `purchases` DROP COLUMN `is_completed`,
    DROP COLUMN `payment_id`,
    DROP COLUMN `payment_method`,
    DROP COLUMN `transaction_id`,
    ADD COLUMN `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `paymentId` VARCHAR(255) NULL,
    ADD COLUMN `paymentMethod` VARCHAR(50) NULL,
    ADD COLUMN `transactionId` VARCHAR(255) NULL,
    MODIFY `item_type` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `admin_level`,
    DROP COLUMN `profile_picture`,
    ADD COLUMN `adminLevel` VARCHAR(20) NULL DEFAULT 'standard',
    ADD COLUMN `expertise_areas` JSON NULL,
    ADD COLUMN `profilePicture` VARCHAR(255) NULL,
    ADD COLUMN `session_focus` TEXT NULL;

-- AlterTable
ALTER TABLE `workshop_sessions` DROP COLUMN `session_type`,
    ADD COLUMN `sessionType` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `workshops` DROP COLUMN `cover_image`,
    ADD COLUMN `category` VARCHAR(50) NULL,
    ADD COLUMN `coverImage` VARCHAR(500) NULL,
    ADD COLUMN `date` VARCHAR(50) NULL,
    ADD COLUMN `duration` VARCHAR(50) NULL,
    ADD COLUMN `enrolled` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `image` VARCHAR(500) NULL,
    ADD COLUMN `instructor` VARCHAR(100) NULL,
    ADD COLUMN `instructor_id` BIGINT UNSIGNED NULL,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `level` VARCHAR(20) NULL,
    ADD COLUMN `location` VARCHAR(255) NULL,
    ADD COLUMN `materials` VARCHAR(100) NULL,
    ADD COLUMN `points` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `price` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `seats` INTEGER NULL DEFAULT 50,
    ADD COLUMN `thumbnail` VARCHAR(500) NULL,
    ADD COLUMN `time` VARCHAR(50) NULL,
    ADD COLUMN `type` VARCHAR(50) NULL,
    ADD COLUMN `video_duration` INTEGER NULL,
    ADD COLUMN `video_quality` VARCHAR(100) NULL,
    ADD COLUMN `video_thumbnail` VARCHAR(500) NULL,
    ADD COLUMN `video_title` VARCHAR(255) NULL,
    ADD COLUMN `video_uploaded_at` DATETIME(3) NULL,
    ADD COLUMN `video_url` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `zoom_sessions` DROP COLUMN `join_url`,
    DROP COLUMN `meeting_id`,
    ADD COLUMN `joinUrl` VARCHAR(500) NOT NULL,
    ADD COLUMN `meetingId` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `engage_activities` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(50) NOT NULL,
    `type` VARCHAR(50) NULL,
    `date` DATETIME(3) NULL,
    `time` VARCHAR(50) NULL,
    `duration` VARCHAR(50) NULL,
    `location` VARCHAR(255) NULL,
    `price` DOUBLE NOT NULL DEFAULT 0,
    `points` INTEGER NOT NULL DEFAULT 100,
    `image` VARCHAR(500) NULL,
    `thumbnail` VARCHAR(500) NULL,
    `video_url` VARCHAR(500) NULL,
    `video_title` VARCHAR(255) NULL,
    `video_duration` INTEGER NULL,
    `video_quality` VARCHAR(100) NULL,
    `video_uploaded_at` DATETIME(3) NULL,
    `video_thumbnail` VARCHAR(500) NULL,
    `instructor_id` BIGINT UNSIGNED NULL,
    `instructor_name` VARCHAR(100) NULL,
    `capacity` INTEGER NOT NULL DEFAULT 100,
    `registered_count` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `enrolled` INTEGER NOT NULL DEFAULT 0,
    `rating` DOUBLE NULL DEFAULT 0,
    `review_count` INTEGER NOT NULL DEFAULT 0,
    `creator_id` BIGINT UNSIGNED NULL,
    `tags` VARCHAR(255) NULL,
    `max_seats` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `engage_activities_category_idx`(`category`),
    INDEX `engage_activities_status_idx`(`status`),
    INDEX `engage_activities_creator_id_idx`(`creator_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `engage_activity_registrations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `activity_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `registration_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(20) NOT NULL DEFAULT 'registered',
    `payment_id` BIGINT UNSIGNED NULL,
    `amount_paid` DOUBLE NULL,
    `completed_at` DATETIME(3) NULL,
    `certificate_url` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `engage_activity_registrations_user_id_idx`(`user_id`),
    INDEX `engage_activity_registrations_activity_id_idx`(`activity_id`),
    UNIQUE INDEX `engage_activity_registrations_activity_id_user_id_key`(`activity_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `engage_activity_reviews` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `activity_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `rating` INTEGER NOT NULL,
    `review` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `engage_activity_reviews_activity_id_idx`(`activity_id`),
    UNIQUE INDEX `engage_activity_reviews_activity_id_user_id_key`(`activity_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `engage_user_progress` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `activity_id` BIGINT UNSIGNED NOT NULL,
    `progress` DOUBLE NOT NULL DEFAULT 0,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `engage_user_progress_user_id_activity_id_key`(`user_id`, `activity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enrollments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `course_id` BIGINT UNSIGNED NOT NULL,
    `enrolled_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `enrollments_user_id_course_id_key`(`user_id`, `course_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_notifications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `assessments_lesson_id_key` ON `assessments`(`lesson_id`);

-- AddForeignKey
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engage_activities` ADD CONSTRAINT `engage_activities_instructor_id_fkey` FOREIGN KEY (`instructor_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engage_activities` ADD CONSTRAINT `engage_activities_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engage_activity_registrations` ADD CONSTRAINT `engage_activity_registrations_activity_id_fkey` FOREIGN KEY (`activity_id`) REFERENCES `engage_activities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engage_activity_registrations` ADD CONSTRAINT `engage_activity_registrations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engage_activity_reviews` ADD CONSTRAINT `engage_activity_reviews_activity_id_fkey` FOREIGN KEY (`activity_id`) REFERENCES `engage_activities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engage_activity_reviews` ADD CONSTRAINT `engage_activity_reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engage_user_progress` ADD CONSTRAINT `engage_user_progress_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engage_user_progress` ADD CONSTRAINT `engage_user_progress_activity_id_fkey` FOREIGN KEY (`activity_id`) REFERENCES `engage_activities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `bookings` RENAME INDEX `bookings_availability_slot_id_fkey` TO `bookings_availability_slot_id_idx`;

-- RenameIndex
ALTER TABLE `bookings` RENAME INDEX `bookings_mentor_id_fkey` TO `bookings_mentor_id_idx`;

-- RenameIndex
ALTER TABLE `feedback` RENAME INDEX `feedback_booking_id_fkey` TO `feedback_booking_id_idx`;

-- RenameIndex
ALTER TABLE `feedback` RENAME INDEX `feedback_mentor_id_fkey` TO `feedback_mentor_id_idx`;

-- RenameIndex
ALTER TABLE `mentor_availability` RENAME INDEX `mentor_availability_mentor_id_fkey` TO `mentor_availability_mentor_id_idx`;

-- RenameIndex
ALTER TABLE `zoom_sessions` RENAME INDEX `zoom_sessions_booking_id_fkey` TO `zoom_sessions_booking_id_idx`;

-- RenameIndex
ALTER TABLE `zoom_sessions` RENAME INDEX `zoom_sessions_mentor_id_fkey` TO `zoom_sessions_mentor_id_idx`;
