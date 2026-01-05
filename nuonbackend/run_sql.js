const mysql = require('mysql2/promise');

async function runSQL() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sims@123',
    database: 'sims_nuonhub',
    multipleStatements: true
  });

  try {
    // Check if type column exists in courses
    const [coursesColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`courses` LIKE 'type'");
    if (coursesColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`courses` ADD COLUMN `type` VARCHAR(50) NULL AFTER `duration`;');
      console.log('Added type column to courses table');
    } else {
      console.log('Type column already exists in courses table');
    }

    // Check if seats column exists in events
    const [eventsColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`events` LIKE 'seats'");
    if (eventsColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`events` ADD COLUMN `seats` INT NULL DEFAULT 100 AFTER `registered_count`;');
      console.log('Added seats column to events table');
    } else {
      console.log('Seats column already exists in events table');
    }

    // Check if tags column exists in events
    const [eventsTagsColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`events` LIKE 'tags'");
    if (eventsTagsColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`events` ADD COLUMN `tags` JSON NULL AFTER `level`;');
      console.log('Added tags column to events table');
    } else {
      console.log('Tags column already exists in events table');
    }

    // Check if image column exists in workshops
    const [workshopsImageColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`workshops` LIKE 'image'");
    if (workshopsImageColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`workshops` ADD COLUMN `image` VARCHAR(500) NULL AFTER `slug`;');
      console.log('Added image column to workshops table');
    } else {
      console.log('Image column already exists in workshops table');
    }

    // Check if thumbnail column exists in workshops
    const [workshopsThumbnailColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`workshops` LIKE 'thumbnail'");
    if (workshopsThumbnailColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`workshops` ADD COLUMN `thumbnail` VARCHAR(500) NULL AFTER `image`;');
      console.log('Added thumbnail column to workshops table');
    } else {
      console.log('Thumbnail column already exists in workshops table');
    }

    // Check if is_active column exists in events
    const [eventsIsActiveColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`events` LIKE 'is_active'");
    if (eventsIsActiveColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`events` ADD COLUMN `is_active` BIT(1) NOT NULL DEFAULT b\'1\';');
      console.log('Added is_active column to events table');
    } else {
      console.log('is_active column already exists in events table');
    }

    // Check if video_title column exists in engage_activities
    const [engageVideoTitleColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`engage_activities` LIKE 'video_title'");
    if (engageVideoTitleColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`engage_activities` ADD COLUMN `video_title` VARCHAR(255) NULL AFTER `video_url`;');
      console.log('Added video_title column to engage_activities table');
    } else {
      console.log('video_title column already exists in engage_activities table');
    }

    // Check if video_duration column exists in engage_activities
    const [engageVideoDurationColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`engage_activities` LIKE 'video_duration'");
    if (engageVideoDurationColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`engage_activities` ADD COLUMN `video_duration` INT NULL AFTER `video_title`;');
      console.log('Added video_duration column to engage_activities table');
    } else {
      console.log('video_duration column already exists in engage_activities table');
    }

    // Check if date column exists in workshops
    const [workshopsDateColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`workshops` LIKE 'date'");
    if (workshopsDateColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`workshops` ADD COLUMN `date` VARCHAR(50) NULL AFTER `end_date`;');
      console.log('Added date column to workshops table');
    } else {
      console.log('date column already exists in workshops table');
    }

    // Check if speakers column exists in events
    const [eventsSpeakersColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`events` LIKE 'speakers'");
    if (eventsSpeakersColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`events` ADD COLUMN `speakers` VARCHAR(255) NULL AFTER `is_active`;');
      console.log('Added speakers column to events table');
    } else {
      console.log('speakers column already exists in events table');
    }

    // Check if time column exists in workshops
    const [workshopsTimeColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`workshops` LIKE 'time'");
    if (workshopsTimeColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`workshops` ADD COLUMN `time` VARCHAR(50) NULL AFTER `date`;');
      console.log('Added time column to workshops table');
    } else {
      console.log('time column already exists in workshops table');
    }

    // Check if video_url column exists in events
    const [eventsVideoUrlColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`events` LIKE 'video_url'");
    if (eventsVideoUrlColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`events` ADD COLUMN `video_url` VARCHAR(500) NULL AFTER `speakers`;');
      console.log('Added video_url column to events table');
    } else {
      console.log('video_url column already exists in events table');
    }

    // Check if video_title column exists in events
    const [eventsVideoTitleColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`events` LIKE 'video_title'");
    if (eventsVideoTitleColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`events` ADD COLUMN `video_title` VARCHAR(255) NULL AFTER `video_url`;');
      console.log('Added video_title column to events table');
    } else {
      console.log('video_title column already exists in events table');
    }

    // Check if video_duration column exists in events
    const [eventsVideoDurationColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`events` LIKE 'video_duration'");
    if (eventsVideoDurationColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`events` ADD COLUMN `video_duration` INT NULL AFTER `video_title`;');
      console.log('Added video_duration column to events table');
    } else {
      console.log('video_duration column already exists in events table');
    }

    // Check if video_quality column exists in events
    const [eventsVideoQualityColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`events` LIKE 'video_quality'");
    if (eventsVideoQualityColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`events` ADD COLUMN `video_quality` VARCHAR(100) NULL AFTER `video_duration`;');
      console.log('Added video_quality column to events table');
    } else {
      console.log('video_quality column already exists in events table');
    }

    // Check if video_uploaded_at column exists in events
    const [eventsVideoUploadedAtColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`events` LIKE 'video_uploaded_at'");
    if (eventsVideoUploadedAtColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`events` ADD COLUMN `video_uploaded_at` DATETIME NULL AFTER `video_quality`;');
      console.log('Added video_uploaded_at column to events table');
    } else {
      console.log('video_uploaded_at column already exists in events table');
    }

    // Check if video_thumbnail column exists in events
    const [eventsVideoThumbnailColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`events` LIKE 'video_thumbnail'");
    if (eventsVideoThumbnailColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`events` ADD COLUMN `video_thumbnail` VARCHAR(500) NULL AFTER `video_uploaded_at`;');
      console.log('Added video_thumbnail column to events table');
    } else {
      console.log('video_thumbnail column already exists in events table');
    }

    // Check if video_url column exists in workshops
    const [workshopsVideoUrlColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`workshops` LIKE 'video_url'");
    if (workshopsVideoUrlColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`workshops` ADD COLUMN `video_url` VARCHAR(500) NULL AFTER `time`;');
      console.log('Added video_url column to workshops table');
    } else {
      console.log('video_url column already exists in workshops table');
    }

    // Check if video_title column exists in workshops
    const [workshopsVideoTitleColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`workshops` LIKE 'video_title'");
    if (workshopsVideoTitleColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`workshops` ADD COLUMN `video_title` VARCHAR(255) NULL AFTER `video_url`;');
      console.log('Added video_title column to workshops table');
    } else {
      console.log('video_title column already exists in workshops table');
    }

    // Check if video_duration column exists in workshops
    const [workshopsVideoDurationColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`workshops` LIKE 'video_duration'");
    if (workshopsVideoDurationColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`workshops` ADD COLUMN `video_duration` INT NULL AFTER `video_title`;');
      console.log('Added video_duration column to workshops table');
    } else {
      console.log('video_duration column already exists in workshops table');
    }

    // Check if video_quality column exists in workshops
    const [workshopsVideoQualityColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`workshops` LIKE 'video_quality'");
    if (workshopsVideoQualityColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`workshops` ADD COLUMN `video_quality` VARCHAR(100) NULL AFTER `video_duration`;');
      console.log('Added video_quality column to workshops table');
    } else {
      console.log('video_quality column already exists in workshops table');
    }

    // Check if video_uploaded_at column exists in workshops
    const [workshopsVideoUploadedAtColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`workshops` LIKE 'video_uploaded_at'");
    if (workshopsVideoUploadedAtColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`workshops` ADD COLUMN `video_uploaded_at` DATETIME NULL AFTER `video_quality`;');
      console.log('Added video_uploaded_at column to workshops table');
    } else {
      console.log('video_uploaded_at column already exists in workshops table');
    }

    // Check if video_thumbnail column exists in workshops
    const [workshopsVideoThumbnailColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`workshops` LIKE 'video_thumbnail'");
    if (workshopsVideoThumbnailColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`workshops` ADD COLUMN `video_thumbnail` VARCHAR(500) NULL AFTER `video_uploaded_at`;');
      console.log('Added video_thumbnail column to workshops table');
    } else {
      console.log('video_thumbnail column already exists in workshops table');
    }

    // Check if video_quality column exists in engage_activities
    const [engageVideoQualityColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`engage_activities` LIKE 'video_quality'");
    if (engageVideoQualityColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`engage_activities` ADD COLUMN `video_quality` VARCHAR(100) NULL AFTER `video_duration`;');
      console.log('Added video_quality column to engage_activities table');
    } else {
      console.log('video_quality column already exists in engage_activities table');
    }

    // Check if video_uploaded_at column exists in engage_activities
    const [engageVideoUploadedAtColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`engage_activities` LIKE 'video_uploaded_at'");
    if (engageVideoUploadedAtColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`engage_activities` ADD COLUMN `video_uploaded_at` DATETIME NULL AFTER `video_quality`;');
      console.log('Added video_uploaded_at column to engage_activities table');
    } else {
      console.log('video_uploaded_at column already exists in engage_activities table');
    }

    // Check if video_thumbnail column exists in engage_activities
    const [engageVideoThumbnailColumns] = await connection.execute("SHOW COLUMNS FROM `sims_nuonhub`.`engage_activities` LIKE 'video_thumbnail'");
    if (engageVideoThumbnailColumns.length === 0) {
      await connection.execute('ALTER TABLE `sims_nuonhub`.`engage_activities` ADD COLUMN `video_thumbnail` VARCHAR(500) NULL AFTER `video_uploaded_at`;');
      console.log('Added video_thumbnail column to engage_activities table');
    } else {
      console.log('video_thumbnail column already exists in engage_activities table');
    }

    // Check if nurse role exists
    const [nurseRole] = await connection.execute("SELECT id FROM `sims_nuonhub`.`roles` WHERE name = 'nurse'");
    if (nurseRole.length === 0) {
      await connection.execute("INSERT INTO `sims_nuonhub`.`roles` (name, active, created_at, updated_at) VALUES ('nurse', 1, NOW(), NOW())");
      console.log('Added nurse role to roles table');
    } else {
      console.log('Nurse role already exists in roles table');
    }

    // Update media URLs from 192.168.0.4 to 192.168.29.81
    console.log('Updating media URLs from 192.168.0.4 to 192.168.29.81...');

    // Users table
    await connection.execute("UPDATE `sims_nuonhub`.`users` SET `profilePicture` = REPLACE(`profilePicture`, '192.168.0.4', '192.168.29.81') WHERE `profilePicture` LIKE '%192.168.0.4%'");
    console.log('Updated users profilePicture URLs');

    // News table
    await connection.execute("UPDATE `sims_nuonhub`.`news` SET `images` = REPLACE(`images`, '192.168.0.4', '192.168.29.81') WHERE `images` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`news` SET `videos` = REPLACE(`videos`, '192.168.0.4', '192.168.29.81') WHERE `videos` LIKE '%192.168.0.4%'");
    console.log('Updated news images and videos URLs');

    // Courses table
    await connection.execute("UPDATE `sims_nuonhub`.`courses` SET `thumbnail` = REPLACE(`thumbnail`, '192.168.0.4', '192.168.29.81') WHERE `thumbnail` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`courses` SET `image` = REPLACE(`image`, '192.168.0.4', '192.168.29.81') WHERE `image` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`courses` SET `video_url` = REPLACE(`video_url`, '192.168.0.4', '192.168.29.81') WHERE `video_url` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`courses` SET `video_thumbnail` = REPLACE(`video_thumbnail`, '192.168.0.4', '192.168.29.81') WHERE `video_thumbnail` LIKE '%192.168.0.4%'");
    console.log('Updated courses media URLs');

    // Events table
    await connection.execute("UPDATE `sims_nuonhub`.`events` SET `image` = REPLACE(`image`, '192.168.0.4', '192.168.29.81') WHERE `image` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`events` SET `imageUrl` = REPLACE(`imageUrl`, '192.168.0.4', '192.168.29.81') WHERE `imageUrl` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`events` SET `thumbnail` = REPLACE(`thumbnail`, '192.168.0.4', '192.168.29.81') WHERE `thumbnail` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`events` SET `video_url` = REPLACE(`video_url`, '192.168.0.4', '192.168.29.81') WHERE `video_url` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`events` SET `video_thumbnail` = REPLACE(`video_thumbnail`, '192.168.0.4', '192.168.29.81') WHERE `video_thumbnail` LIKE '%192.168.0.4%'");
    console.log('Updated events media URLs');

    // Workshops table
    await connection.execute("UPDATE `sims_nuonhub`.`workshops` SET `coverImage` = REPLACE(`coverImage`, '192.168.0.4', '192.168.29.81') WHERE `coverImage` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`workshops` SET `image` = REPLACE(`image`, '192.168.0.4', '192.168.29.81') WHERE `image` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`workshops` SET `thumbnail` = REPLACE(`thumbnail`, '192.168.0.4', '192.168.29.81') WHERE `thumbnail` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`workshops` SET `video_url` = REPLACE(`video_url`, '192.168.0.4', '192.168.29.81') WHERE `video_url` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`workshops` SET `video_thumbnail` = REPLACE(`video_thumbnail`, '192.168.0.4', '192.168.29.81') WHERE `video_thumbnail` LIKE '%192.168.0.4%'");
    console.log('Updated workshops media URLs');

    // Conferences table
    await connection.execute("UPDATE `sims_nuonhub`.`conferences` SET `imageUrl` = REPLACE(`imageUrl`, '192.168.0.4', '192.168.29.81') WHERE `imageUrl` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`conferences` SET `thumbnail` = REPLACE(`thumbnail`, '192.168.0.4', '192.168.29.81') WHERE `thumbnail` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`conferences` SET `videoUrl` = REPLACE(`videoUrl`, '192.168.0.4', '192.168.29.81') WHERE `videoUrl` LIKE '%192.168.0.4%'");
    console.log('Updated conferences media URLs');

    // Engage activities table
    await connection.execute("UPDATE `sims_nuonhub`.`engage_activities` SET `image` = REPLACE(`image`, '192.168.0.4', '192.168.29.81') WHERE `image` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`engage_activities` SET `thumbnail` = REPLACE(`thumbnail`, '192.168.0.4', '192.168.29.81') WHERE `thumbnail` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`engage_activities` SET `video_url` = REPLACE(`video_url`, '192.168.0.4', '192.168.29.81') WHERE `video_url` LIKE '%192.168.0.4%'");
    await connection.execute("UPDATE `sims_nuonhub`.`engage_activities` SET `video_thumbnail` = REPLACE(`video_thumbnail`, '192.168.0.4', '192.168.29.81') WHERE `video_thumbnail` LIKE '%192.168.0.4%'");
    console.log('Updated engage_activities media URLs');

    // Catalog items table
    await connection.execute("UPDATE `sims_nuonhub`.`catalog_items` SET `imageUrl` = REPLACE(`imageUrl`, '192.168.0.4', '192.168.29.81') WHERE `imageUrl` LIKE '%192.168.0.4%'");
    console.log('Updated catalog_items image URLs');

    console.log('All media URLs updated successfully');
    console.log('All SQL executed successfully');
  } catch (error) {
    console.error('Error executing SQL:', error);
  } finally {
    await connection.end();
  }
}

runSQL();