-- Add reschedule count to bookings table
ALTER TABLE `sims_nuonhub`.`bookings` ADD COLUMN `reschedule_count` INT DEFAULT 0 AFTER `status`;