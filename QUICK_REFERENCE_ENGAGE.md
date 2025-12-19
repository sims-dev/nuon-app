# Engage Feature - Quick Reference Guide

## 📱 Mobile Implementation

### Files Created/Updated
```
NeonClubMobile/
├── src/screens/
│   ├── EngageScreen.js          (UPDATED) - Main engagement tab
│   └── EngageDetailsScreen.js   (NEW)     - Activity details & registration
```

### Quick Mobile Integration
```javascript
// In your navigation stack, add:
<Stack.Screen 
  name="EngageDetails" 
  component={EngageDetailsScreen}
/>

// EngageScreen already navigates to it:
navigation.navigate('EngageDetails', { item })
```

### Key Mobile Features
- ✅ Wellness, Fitness, Events tabs
- ✅ Activity search with real-time filtering
- ✅ Detailed activity information view
- ✅ User registration (free & paid)
- ✅ Favorite/like functionality
- ✅ Benefits and features display
- ✅ Real-time socket.io updates

---

## ⚙️ Backend Implementation

### Files Created/Updated
```
nuonbackend/
├── prisma/
│   ├── schema.prisma                           (UPDATED)
│   └── migrations/
│       └── engage_activities_migration.sql     (NEW)
└── src/
    ├── dto/
    │   └── engage.dto.ts                       (NEW)
    ├── services/
    │   └── engage.service.ts                   (REPLACED)
    └── controllers/
        └── engage.controller.ts                (REPLACED)
```

### Database Models
```
EngageActivity
├── id, title, description, category, type
├── date, time, duration, location
├── price, points, capacity
├── instructor, creator relationships
├── registrations (one-to-many)
└── reviews (one-to-many)

EngageActivityRegistration
├── id, activity_id, user_id
├── status, payment info
├── certificate tracking
└── completion details

EngageActivityReview
├── id, activity_id, user_id
├── rating (1-5)
└── review text
```

### API Endpoints Summary
```
PUBLIC:
GET  /engage/activities                         # List all activities
GET  /engage/activities/search?query=yoga       # Search
GET  /engage/activities/:id                     # Single activity
GET  /engage/activities/:id/reviews             # Reviews for activity

PROTECTED (JWT Required):
POST   /engage/activities                       # Create
PUT    /engage/activities/:id                   # Update
DELETE /engage/activities/:id                   # Delete

POST   /engage/activities/:id/register          # Register user
DELETE /engage/activities/:id/register          # Cancel registration
GET    /engage/my-registrations                 # User registrations

POST   /engage/activities/:id/review            # Submit review
POST   /engage/registrations/:id/complete       # Mark completed
```

---

## 🔧 Setup Checklist

### Step 1: Database Migration
```bash
cd nuonbackend

# Option A: Using Prisma
npx prisma generate
npx prisma migrate dev --name add_engage_activities

# Option B: Direct SQL
mysql -u root -p < prisma/migrations/engage_activities_migration.sql
```

### Step 2: Verify Backend Setup
```bash
# Start backend server
npm run start

# Test endpoint
curl http://localhost:5000/engage/activities
```

### Step 3: Verify Mobile Setup
```bash
# Ensure config is set correctly
cat NeonClubMobile/config/ipConfig.js
# Should have correct IP_ADDRESS pointing to backend
```

### Step 4: Test Registration Flow
1. Open app on EngageScreen
2. Click any activity card
3. View EngageDetailsScreen
4. Click "Register Free" or "Register Now"
5. Should see success message

---

## 📊 Data Sample

### Create Activity Request
```json
POST /engage/activities
{
  "title": "Yoga for Healthcare Workers",
  "description": "Relaxing yoga session",
  "category": "fitness",
  "date": "2025-12-20",
  "time": "6:00 PM - 7:00 PM",
  "location": "Online",
  "price": 0,
  "points": 100,
  "capacity": 50
}
```

### Register Response
```json
{
  "message": "Successfully registered for the activity",
  "registration": {
    "id": 1,
    "activityId": 1,
    "userId": 123,
    "status": "registered",
    "registrationDate": "2025-12-09T10:00:00Z"
  }
}
```

### Activity List Response
```json
{
  "data": [
    {
      "id": 1,
      "title": "Yoga for Healthcare Workers",
      "category": "fitness",
      "price": 0,
      "points": 100,
      "registeredCount": 15,
      "capacity": 50,
      "rating": 4.5,
      "reviewCount": 8,
      "date": "2025-12-20",
      "time": "6:00 PM - 7:00 PM",
      "location": "Online"
    }
  ],
  "total": 1
}
```

---

## 🎯 Key Features Breakdown

### For End Users
| Feature | Status | Details |
|---------|--------|---------|
| Browse Activities | ✅ | Wellness, Fitness, Events tabs |
| Search | ✅ | Real-time text search |
| View Details | ✅ | Full activity information |
| Register | ✅ | Free and paid options |
| Review | ✅ | Rate and comment |
| Favorite | ✅ | Like/favorite activities |
| Track Progress | ✅ | View registrations |

### For Admins
| Feature | Status | Details |
|---------|--------|---------|
| Create | ✅ | POST /engage/activities |
| Update | ✅ | PUT /engage/activities/:id |
| Delete | ✅ | DELETE /engage/activities/:id |
| View Stats | ✅ | Registrations, reviews, ratings |

---

## 🚨 Troubleshooting Quick Fixes

| Error | Cause | Solution |
|-------|-------|----------|
| "Property 'engageActivity' does not exist" | Prisma not regenerated | `npx prisma generate` |
| "Activities not loading" | Wrong IP/port | Check config/ipConfig.js |
| "User already registered" | Duplicate registration | Expected behavior - one registration per user |
| "Activity not found" | Invalid activity ID | Verify ID exists |
| "User not authenticated" | Missing JWT token | Include Authorization header |

---

## 🔐 Security Reminders

✅ All write operations require JWT authentication
✅ Unique constraints prevent duplicate registrations
✅ Capacity validation prevents overbooking
✅ User permissions checked for admin operations
✅ Input validation via class-validator

---

## 📈 Performance Tips

- Use pagination for large lists: `?page=1&limit=10`
- Filter by category: `?category=wellness`
- Search instead of loading all: `/engage/activities/search?query=yoga`
- Cache response data on mobile for offline access

---

## 🔗 Related Files Reference

```
Documentation:
- ENGAGE_FEATURE_DOCUMENTATION.md     (Comprehensive guide)
- IMPLEMENTATION_COMPLETE_ENGAGE.md   (This summary)
- QUICK_REFERENCE.md                  (This file)

Code:
- Frontend: NeonClubMobile/src/screens/Engage*.js
- Backend: nuonbackend/src/{controllers,services,dto}/engage.*
- Database: nuonbackend/prisma/schema.prisma
```

---

## ✅ Deployment Checklist

- [ ] Database migration completed
- [ ] Prisma client regenerated
- [ ] Backend tests passing
- [ ] Frontend navigation configured
- [ ] IP_ADDRESS configured correctly
- [ ] JWT authentication verified
- [ ] Sample data created (optional)
- [ ] All endpoints tested
- [ ] Error handling verified
- [ ] Documentation reviewed

---

## 📞 Quick Commands Reference

```bash
# Database
npx prisma generate              # Regenerate Prisma client
npx prisma migrate dev           # Create migration
npx prisma studio              # Open Prisma Studio GUI

# Testing
curl http://localhost:5000/engage/activities          # Get activities
curl -X POST http://localhost:5000/engage/activities   # Create activity
curl http://localhost:5000/engage/activities/1         # Get activity details

# Mobile
npm start                        # Run mobile app
npm run android                  # Run on Android
npm run ios                      # Run on iOS
```

---

## 🎓 Learning Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Native Documentation](https://reactnative.dev/)
- [JWT Authentication Guide](https://jwt.io/)

---

**Last Updated**: December 9, 2025
**Status**: Implementation Complete ✅
**Version**: 1.0
