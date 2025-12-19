-- Create admin role if not exists
INSERT IGNORE INTO `sims_nuonhub`.`roles` (`id`, `name`, `active`, `created_at`, `updated_at`)
VALUES (1, 'admin', 1, NOW(), NOW());

-- Create admin user with email admin@nuonclub.com
-- Password hash for 'admin@123' using bcrypt with 10 rounds
INSERT INTO `sims_nuonhub`.`users` (
    `id`,
    `name`,
    `email`,
    `phone_number`,
    `password`,
    `active`,
    `role_id`,
    `is_profile_complete`,
    `bio`,
    `created_at`,
    `updated_at`
) VALUES (
    1,
    'System Administrator',
    'admin@nuonclub.com',
    NULL,
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    1,
    1,
    1,
    'System administrator account',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    `name` = VALUES(`name`),
    `password` = VALUES(`password`),
    `active` = VALUES(`active`),
    `role_id` = VALUES(`role_id`),
    `is_profile_complete` = VALUES(`is_profile_complete`),
    `bio` = VALUES(`bio`),
    `updated_at` = NOW();