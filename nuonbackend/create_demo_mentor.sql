-- Create demo mentor user
-- Password hash for 'mentor@123' using bcrypt with 10 rounds
INSERT INTO `sims_nuonhub`.`users` (
    `id`,
    `name`,
    `email`,
    `phone_number`,
    `password`,
    `active`,
    `role_id`,
    `is_mentor`,
    `is_approved`,
    `is_profile_complete`,
    `hourly_rate`,
    `specialization`,
    `experience`,
    `qualification`,
    `department`,
    `hospital`,
    `bio`,
    `organization`,
    `city`,
    `state`,
    `profile_picture`,
    `created_at`,
    `updated_at`
) VALUES (
    2,
    'Demo Mentor',
    'mentor@nuonhub.com',
    '+91-9876543210',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    1,
    2, -- mentor role id
    1, -- is_mentor
    1, -- is_approved
    1, -- is_profile_complete
    50.00, -- hourly_rate
    'Nursing Education',
    5, -- experience
    'MSc Nursing',
    'Medical-Surgical',
    'City Hospital',
    'Experienced nursing educator with 5+ years of teaching experience',
    'Nuon Healthcare',
    'Mumbai',
    'Maharashtra',
    'https://example.com/mentor-profile.jpg',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    `name` = VALUES(`name`),
    `password` = VALUES(`password`),
    `active` = VALUES(`active`),
    `role_id` = VALUES(`role_id`),
    `is_mentor` = VALUES(`is_mentor`),
    `is_approved` = VALUES(`is_approved`),
    `is_profile_complete` = VALUES(`is_profile_complete`),
    `hourly_rate` = VALUES(`hourly_rate`),
    `specialization` = VALUES(`specialization`),
    `experience` = VALUES(`experience`),
    `qualification` = VALUES(`qualification`),
    `department` = VALUES(`department`),
    `hospital` = VALUES(`hospital`),
    `bio` = VALUES(`bio`),
    `organization` = VALUES(`organization`),
    `city` = VALUES(`city`),
    `state` = VALUES(`state`),
    `profile_picture` = VALUES(`profile_picture`),
    `updated_at` = NOW();