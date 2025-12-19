# Backend Migration Guide: JS → TypeScript with Prisma

## Status
- ✅ All critical JS controllers converted to TypeScript in `nuonbackend/src/`
- ✅ Prisma schema configured for MySQL
- ✅ All database migrations prepared
- ⏳ Database connection needs verification and setup

## Database Setup Instructions

### Option 1: Prisma Migration (Recommended)

1. **Verify MySQL Credentials**
   ```powershell
   # Test your MySQL connection first
   cd d:\neeeon\neon-club\nuonbackend
   node test-db.js
   ```

2. **Update DATABASE_URL in `.env`**
   - File: `nuonbackend/.env`
   - URL Format: `mysql://USER:PASSWORD@HOST:PORT/DATABASE`
   - Current: `mysql://root:Sims%40123@localhost:3306/sims_nuonhub`
   - Note: Special characters like `@` in password must be URL-encoded as `%40`

3. **Run Prisma Migration**
   ```powershell
   cd d:\neeeon\neon-club\nuonbackend
   npx prisma migrate deploy
   ```

### Option 2: Manual SQL Setup (If Prisma Fails)

1. **Using MySQL Command Line**
   ```bash
   mysql -h localhost -u root -p < d:\neeeon\neon-club\nuonbackend\setup-database.sql
   ```

2. **Using MySQL Workbench or Another SQL Client**
   - Open `nuonbackend/setup-database.sql`
   - Execute the script to create tables and roles

3. **Verify Database Creation**
   ```powershell
   mysql -h localhost -u root -p sims_nuonhub -e "SHOW TABLES;"
   ```

## Project Structure After Migration

```
d:\neeeon\neon-club\
├── nuonbackend/                    # ← MAIN BACKEND (TypeScript with Prisma)
│   ├── src/
│   │   ├── controllers/            # TS Controllers
│   │   ├── services/               # TS Services (use Prisma)
│   │   ├── dto/                    # TypeScript DTOs
│   │   ├── modules/                # NestJS modules
│   │   └── main.ts                 # Entry point
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   └── migrations/             # Database migrations
│   ├── .env                        # Database credentials
│   └── package.json                # Dependencies
│
├── NeonClubMobile/                 # React Native app
├── neonclub-web/                   # React web app
├── mentor-dashboard-web/           # React admin dashboard
│
├── controllers/                    # ❌ OLD (to be removed)
├── models/                         # ❌ OLD (to be removed)
├── routes/                         # ❌ OLD (to be removed)
└── services/                       # ❌ OLD (to be removed)
```

## TypeScript Backend Controller Mapping

| Feature | JS Controller | TS Service | TS Controller |
|---------|--------------|-----------|--------------|
| Authentication | authController.js | auth.service.ts | auth.controller.ts |
| User Profile | authController.js | auth.service.ts | auth.controller.ts |
| Booking | bookingController.js | booking.service.ts | booking.controller.ts |
| Mentor | mentorController.js | mentor.service.ts | mentor.controller.ts |
| News | newsController.js | news.service.ts | news.controller.ts |
| Admin | adminController.js | admin.service.ts | admin.controller.ts |
| Courses | courseController.js | course.service.ts | course.controller.ts |
| Assessments | assessmentController.js | assessment.service.ts | assessment.controller.ts |

## API Endpoints (All Using Prisma)

### Auth
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login-otp` - OTP-based login
- `GET /api/profile/:id` - Get user profile
- `PUT /api/profile` - Update profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `PATCH /api/bookings/:id` - Update booking status
- `POST /api/bookings/:id/zoom` - Create Zoom session

### Mentor
- `GET /api/mentor/bookings` - Get mentor's bookings
- `POST /api/mentor/availability` - Add availability slot
- `GET /api/mentor/availability` - List availability
- `PATCH /api/mentor/bookings/:id` - Accept/decline booking

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `POST /api/admin/news` - Create news article
- `GET /api/admin/users` - List users
- `GET /api/admin/bookings` - List all bookings

### News (Stores in DB)
- `GET /api/news` - Get published news
- `POST /api/news` - Admin create news (persists to DB)
- `PUT /api/news/:id` - Edit news
- `DELETE /api/news/:id` - Delete news

## Data Flow Example: Admin Creates News

1. **Admin Dashboard** (`mentor-dashboard-web`)
   ```typescript
   POST /api/admin/news
   {
     "title": "New Mentorship Program",
     "content": "...",
     "category": "announcement"
   }
   ```

2. **Backend** (`nuonbackend/src/services/news.service.ts`)
   ```typescript
   async createNews(data: NewsDto) {
     return this.prisma.news.create({
       data: {
         title: data.title,
         content: data.content,
         category: data.category,
         status: 'published',
         authorId: adminUserId
       }
     });
   }
   ```

3. **Database** (`sims_nuonhub.news`)
   - Record stored with `created_at` timestamp

4. **Mobile/Web App** (`NeonClubMobile`, `neonclub-web`)
   ```typescript
   GET /api/news
   // Returns: [{ id, title, content, createdAt, ... }]
   ```

## Starting the Backend

### Development Mode
```powershell
cd d:\neeeon\neon-club\nuonbackend
npm run start:dev
```

Expected Output:
```
[Nest] <timestamp> - 06/12/2025, <time> LOG [NestFactory] Starting Nest application...
✅ Database connected successfully
📊 Connected to MySQL database: sims_nuonhub
👤 Admin user found: admin@nuonhub.com
[Nest] <timestamp> - 06/12/2025, <time> LOG [InstanceLoader] AuthModule dependencies initialized
...
[Nest] <timestamp> - 06/12/2025, <time> LOG Server listening on port 3000
```

### Production Mode
```powershell
cd d:\neeeon\neon-club\nuonbackend
npm run build
npm run start:prod
```

## Environment Variables Required

Create `.env` in `nuonbackend/` directory:

```env
# Database
DATABASE_URL="mysql://root:Sims%40123@localhost:3306/sims_nuonhub"

# Server
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=your-secret-key-change-in-production
ACCESS_SECRET=access-secret-key
REFRESH_SECRET=refresh-secret-key

# Admin
ADMIN_EMAIL=admin@nuonhub.com

# Frontend API Base
API_BASE_URL=http://192.168.0.116:5000
```

## Testing the Backend

### 1. Health Check
```powershell
curl http://localhost:3000/api/health
```

### 2. Create News (As Admin)
```powershell
curl -X POST http://localhost:3000/api/admin/news `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer <ADMIN_TOKEN>" `
  -d '{
    "title": "Test News",
    "content": "This persists in MySQL",
    "category": "announcement"
  }'
```

### 3. Get News (Public)
```powershell
curl http://localhost:3000/api/news
```

## Removing Old JS Backend

Once `nuonbackend` is running successfully and all tests pass:

```powershell
cd d:\neeeon\neon-club

# Remove old JS backend folders
Remove-Item -Recurse -Force controllers/
Remove-Item -Recurse -Force models/
Remove-Item -Recurse -Force routes/
Remove-Item -Recurse -Force services/ -Exclude services/zoomService.js

# Keep only if needed for reference
# Move old files to backup folder if preferred:
# mkdir old-js-backend
# robocopy controllers old-js-backend/controllers /E
# robocopy models old-js-backend/models /E
# robocopy routes old-js-backend/routes /E
```

## Troubleshooting

### Database Connection Error
```
Error: P1000: Authentication failed against database server
```

**Solution:**
- Verify MySQL is running
- Check username/password in `.env`
- Ensure database exists: `mysql -u root -p sims_nuonhub`
- Check special character encoding in PASSWORD (@ → %40)

### Prisma Migration Failed
```
Error: Migration failed to apply cleanly
```

**Solution:**
- Option 1: Use manual SQL setup (see Option 2 above)
- Option 2: Reset database: `npx prisma migrate reset`
- Option 3: Check `prisma/migrations/` for pending migrations

### Port Already in Use (3000)
```powershell
# Find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Next Steps

1. ✅ Set up database with credentials provided
2. ⏳ Apply Prisma migrations
3. ⏳ Start `nuonbackend` server
4. ⏳ Test admin → DB → app flow
5. ⏳ Remove old JS backend folders
6. ⏳ Update frontend `.env` files to point to new backend at `http://192.168.0.116:5000`

## Support

If you encounter issues:
1. Check `.env` DATABASE_URL format
2. Verify MySQL is running and accessible
3. Review server logs: `npm run start:dev`
4. Check Prisma schema: `npx prisma studio`

---

**Last Updated:** December 6, 2025  
**TypeScript Backend Version:** v1.0.0 (NestJS + Prisma)
