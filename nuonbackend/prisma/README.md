# Database Schema Architecture

This project uses separate database schemas for different user types to ensure proper data isolation, security, and scalability.

## Schema Overview

### 1. **Web Schema** (`schema-web.prisma`)
- **Database URL:** `DATABASE_URL_WEB`
- **User Model:** `WebUser`
- **Purpose:** General web platform users
- **Features:**
  - Course purchases and progress tracking
  - Basic booking system
  - Notifications and payments
  - User feedback system

### 2. **Admin Schema** (`schema-admin.prisma`)
- **Database URL:** `DATABASE_URL_ADMIN`
- **User Model:** `AdminUser`
- **Purpose:** System administrators
- **Features:**
  - Admin authentication and authorization
  - System settings management
  - Admin activity logging
  - Session management
  - Role and permission management

### 3. **Mentor Schema** (`schema-mentor.prisma`)
- **Database URL:** `DATABASE_URL_MENTOR`
- **User Model:** `MentorUser`
- **Purpose:** Mentor service providers
- **Features:**
  - Mentor profiles and availability
  - Booking management
  - Earnings tracking
  - Feedback and ratings
  - Zoom session integration
  - Mentor application process

### 4. **App Schema** (`schema-app.prisma`)
- **Database URL:** `DATABASE_URL_APP`
- **User Model:** `AppUser`
- **Purpose:** Mobile application users
- **Features:**
  - Mobile-optimized user profiles
  - Push notification support
  - Device session management
  - App-specific features (favorites, NCC status)
  - Mobile booking system

## Environment Variables Setup

Add these to your `.env` file:

```env
# Main database (for backward compatibility)
DATABASE_URL="mysql://user:password@localhost:3306/sims_nuonhub"

# Separate databases for each schema
DATABASE_URL_WEB="mysql://user:password@localhost:3306/nuonhub_web"
DATABASE_URL_ADMIN="mysql://user:password@localhost:3306/nuonhub_admin"
DATABASE_URL_MENTOR="mysql://user:password@localhost:3306/nuonhub_mentor"
DATABASE_URL_APP="mysql://user:password@localhost:3306/nuonhub_app"

# Admin credentials
ADMIN_EMAIL="admin@nuonhub.com"
ADMIN_PASSWORD="admin@123"
```

## Database Setup Commands

### Create Separate Databases
```sql
CREATE DATABASE nuonhub_web;
CREATE DATABASE nuonhub_admin;
CREATE DATABASE nuonhub_mentor;
CREATE DATABASE nuonhub_app;
```

### Generate Prisma Clients
```bash
# Generate for web schema
npx prisma generate --schema=prisma/schema-web.prisma

# Generate for admin schema
npx prisma generate --schema=prisma/schema-admin.prisma

# Generate for mentor schema
npx prisma generate --schema=prisma/schema-mentor.prisma

# Generate for app schema
npx prisma generate --schema=prisma/schema-app.prisma
```

### Push Schemas to Databases
```bash
# Push web schema
npx prisma db push --schema=prisma/schema-web.prisma

# Push admin schema
npx prisma db push --schema=prisma/schema-admin.prisma

# Push mentor schema
npx prisma db push --schema=prisma/schema-mentor.prisma

# Push app schema
npx prisma db push --schema=prisma/schema-app.prisma
```

## Usage in Code

### Web Users Service
```typescript
import { PrismaClient as WebPrismaClient } from '@prisma/web-client';

const webPrisma = new WebPrismaClient({
  datasourceUrl: process.env.DATABASE_URL_WEB,
});

// Usage
const user = await webPrisma.webUser.findUnique({
  where: { email: 'user@example.com' }
});
```

### Admin Users Service
```typescript
import { PrismaClient as AdminPrismaClient } from '@prisma/admin-client';

const adminPrisma = new AdminPrismaClient({
  datasourceUrl: process.env.DATABASE_URL_ADMIN,
});

// Usage
const admin = await adminPrisma.adminUser.findUnique({
  where: { email: 'admin@nuonhub.com' }
});
```

### Mentor Users Service
```typescript
import { PrismaClient as MentorPrismaClient } from '@prisma/mentor-client';

const mentorPrisma = new MentorPrismaClient({
  datasourceUrl: process.env.DATABASE_URL_MENTOR,
});

// Usage
const mentor = await mentorPrisma.mentorUser.findUnique({
  where: { email: 'mentor@example.com' }
});
```

### App Users Service
```typescript
import { PrismaClient as AppPrismaClient } from '@prisma/app-client';

const appPrisma = new AppPrismaClient({
  datasourceUrl: process.env.DATABASE_URL_APP,
});

// Usage
const appUser = await appPrisma.appUser.findUnique({
  where: { phoneNumber: '+1234567890' }
});
```

## Migration Strategy

When deploying updates:

1. **Backup all databases** before migration
2. **Test migrations** on staging environment first
3. **Update schemas** in order (admin → mentor → web → app)
4. **Run migrations** for each schema separately
5. **Verify data integrity** after migration

## Security Considerations

- **Admin schema** has enhanced security with login attempt tracking
- **App schema** requires phone verification by default
- **Mentor schema** includes approval workflow
- **Web schema** has basic user management

## API Endpoints Structure

```
/api/auth/login (universal login - routes to appropriate schema)
/api/admin/* (admin schema operations)
/api/mentor/* (mentor schema operations)
/api/web/* (web schema operations)
/api/app/* (app schema operations)
```

## Login Flow

1. **Universal Login Endpoint:** `/api/auth/login`
2. **Determine User Type:** Based on email domain or user selection
3. **Route to Appropriate Schema:** Connect to correct database
4. **Validate Credentials:** Check against specific user table
5. **Return Appropriate Token:** With user role and permissions

## Admin Creation

For each schema, create appropriate admin users:

```bash
# Web admin
node scripts/create-web-admin.js

# System admin
node scripts/create-admin-admin.js

# Mentor admin
node scripts/create-mentor-admin.js

# App admin
node scripts/create-app-admin.js