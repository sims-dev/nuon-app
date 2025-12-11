-- Migration: Add Engage Activity Models
-- Created for implementing Wellness, Fitness, and Community Events feature

-- Create engage_activities table
CREATE TABLE IF NOT EXISTS `engage_activities` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` LONGTEXT,
  `category` VARCHAR(50) NOT NULL,  -- wellness, fitness, event
  `type` VARCHAR(50),  -- Workshop, Challenge, Session, etc.
  
  -- Date and Time
  `date` DATETIME,
  `time` VARCHAR(50),  -- "3:00 PM - 5:00 PM"
  `duration` VARCHAR(50),  -- "2 weeks", "30 days", "6 weeks"
  
  -- Location
  `location` VARCHAR(255),  -- Online, Mumbai Center, etc.
  
  -- Pricing and Points
  `price` FLOAT NOT NULL DEFAULT 0,
  `points` INT NOT NULL DEFAULT 100,
  
  -- Media
  `image` VARCHAR(500),
  `thumbnail` VARCHAR(500),
  
  -- Instructor/Creator
  `instructor_id` BIGINT UNSIGNED,
  `instructor_name` VARCHAR(100),
  
  -- Capacity and Registration
  `capacity` INT NOT NULL DEFAULT 100,
  `registered_count` INT NOT NULL DEFAULT 0,
  
  -- Status and Meta
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',  -- active, upcoming, completed, archived
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  
  -- Enrollment and Ratings
  `enrolled` INT NOT NULL DEFAULT 0,
  `rating` FLOAT DEFAULT 0,
  `review_count` INT NOT NULL DEFAULT 0,
  
  -- Additional Details
  `creator_id` BIGINT UNSIGNED,
  `tags` VARCHAR(255),  -- JSON array stored as string
  `max_seats` INT,
  
  -- Timestamps
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`),
  INDEX `idx_creator_id` (`creator_id`),
  
  -- Foreign Keys
  CONSTRAINT `fk_engage_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_engage_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create engage_activity_registrations table
CREATE TABLE IF NOT EXISTS `engage_activity_registrations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `activity_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  
  -- Registration details
  `registration_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(20) NOT NULL DEFAULT 'registered',  -- registered, completed, cancelled
  `payment_id` BIGINT UNSIGNED,
  `amount_paid` FLOAT,
  
  -- Completion tracking
  `completed_at` DATETIME,
  `certificate_url` VARCHAR(500),
  
  -- Timestamps
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Constraints
  UNIQUE KEY `uk_activity_user` (`activity_id`, `user_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_activity_id` (`activity_id`),
  
  -- Foreign Keys
  CONSTRAINT `fk_registration_activity` FOREIGN KEY (`activity_id`) REFERENCES `engage_activities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_registration_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create engage_activity_reviews table
CREATE TABLE IF NOT EXISTS `engage_activity_reviews` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `activity_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  
  `rating` INT NOT NULL,  -- 1-5 stars
  `review` LONGTEXT,
  
  -- Timestamps
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Constraints
  UNIQUE KEY `uk_activity_reviewer` (`activity_id`, `user_id`),
  INDEX `idx_activity_id` (`activity_id`),
  
  -- Foreign Keys
  CONSTRAINT `fk_review_activity` FOREIGN KEY (`activity_id`) REFERENCES `engage_activities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add relationships to users table (if not already exist via Prisma)
-- This is for reference; Prisma handles the actual schema

-- Insert sample data for testing
INSERT INTO `engage_activities` (
  `title`, `description`, `category`, `type`, `date`, `time`, 
  `location`, `price`, `points`, `capacity`, `status`, `enrolled`, `rating`, `review_count`
) VALUES
(
  'Stress Management for Healthcare Workers',
  'Comprehensive stress management techniques designed for nurses and healthcare professionals',
  'wellness',
  'Mental Wellness',
  '2025-12-15',
  '6:00 PM - 7:30 PM',
  'Online',
  0,
  100,
  50,
  'active',
  0,
  0,
  0
),
(
  'Mindfulness & Meditation for Nurses',
  'Mindfulness and meditation practices tailored for busy healthcare schedules',
  'wellness',
  'Wellness Workshop',
  '2025-12-18',
  '7:00 AM - 8:00 AM',
  'Online',
  299,
  150,
  30,
  'active',
  0,
  0,
  0
),
(
  'Yoga for Healthcare Workers',
  'Relaxing yoga session designed to relieve tension and improve flexibility',
  'fitness',
  'Fitness Session',
  '2025-12-17',
  '8:00 AM - 9:30 AM',
  'Mumbai Community Center',
  199,
  120,
  25,
  'active',
  0,
  0,
  0
),
(
  'Healthcare Wellness Summit 2024',
  'Comprehensive conference for healthcare professionals focusing on wellness and career growth',
  'event',
  'Conference',
  '2025-12-05',
  '9:00 AM onwards',
  'Delhi Convention Center',
  2500,
  500,
  100,
  'upcoming',
  0,
  0,
  0
);

-- Verify tables created
SHOW TABLES LIKE 'engage_%';
