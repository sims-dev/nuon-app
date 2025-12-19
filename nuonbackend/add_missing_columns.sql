-- Add missing columns to courses and events tables

-- Add type column to courses table
ALTER TABLE `sims_nuonhub`.`courses` ADD COLUMN `type` VARCHAR(50) NULL AFTER `duration`;

-- Add seats column to events table
ALTER TABLE `sims_nuonhub`.`events` ADD COLUMN `seats` INT NULL DEFAULT 100 AFTER `registered_count`;
