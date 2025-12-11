# Engage Feature Implementation Guide

## Overview
This document describes the complete implementation of the Engage feature for the NeonClub application, including wellness programs, fitness activities, and community events.

## Frontend Implementation (Mobile)

### Files Created/Updated

#### 1. **EngageScreen.js** (Updated)
- **Path**: `NeonClubMobile/src/screens/EngageScreen.js`
- **Purpose**: Main engage screen with tabbed interface (Wellness, Fitness, Events)
- **Features**:
  - Search functionality with real-time filtering
  - Category-based tabbed interface
  - Activity cards with images, pricing, and points display
  - Connection to backend API via `/engage/activities` endpoint
  - Socket.io integration for real-time updates
  - Responsive design with gradient header

#### 2. **EngageDetailsScreen.js** (New)
- **Path**: `NeonClubMobile/src/screens/EngageDetailsScreen.js`
- **Purpose**: Detailed view of a single activity with registration
- **Features**:
  - Complete activity information display
  - Key details card (date, time, location, duration, capacity)
  - Description and benefits section
  - Category-specific information
  - User registration functionality
  - Favorite/heart functionality
  - Free and paid registration options
  - Bottom action bar with pricing and registration button

### Navigation Setup
Add to your navigation stack (e.g., in AppNavigator.js):

```javascript
<Stack.Screen 
  name="EngageDetails" 
  component={EngageDetailsScreen}
  options={{ headerShown: false }}
/>
```

## Backend Implementation (TypeScript/NestJS)

### Database Schema (Prisma)

#### 1. **EngageActivity Model**
- Stores all activity information
- Fields: title, description, category, type, date, time, location, price, points, capacity, etc.
- Relationships:
  - `instructor`: User (optional) - who leads the activity
  - `creator`: User - who created the activity
  - `registrations`: EngageActivityRegistration[] - user registrations
  - `reviews`: EngageActivityReview[] - user reviews

#### 2. **EngageActivityRegistration Model**
- Tracks user registrations for activities
- Fields: activityId, userId, status, paymentId, completedAt, certificateUrl
- Unique constraint: (activityId, userId) - prevents duplicate registrations
- Relationships: activity, user

#### 3. **EngageActivityReview Model**
- Stores user reviews and ratings
- Fields: activityId, userId, rating (1-5), review text
- Unique constraint: (activityId, userId) - one review per user per activity
- Relationships: activity, user

### API Endpoints

#### Public Endpoints (No Auth Required)
```
GET  /engage/activities                          # Get all activities with filtering
GET  /engage/activities/search?query=yoga        # Search activities
GET  /engage/activities/:id                      # Get single activity details
GET  /engage/activities/:id/reviews              # Get activity reviews
```

#### Protected Endpoints (JWT Required)
```
POST   /engage/activities                        # Create new activity (admin)
PUT    /engage/activities/:id                    # Update activity (admin)
DELETE /engage/activities/:id                    # Delete activity (admin)

POST   /engage/activities/:id/register           # Register for activity
DELETE /engage/activities/:id/register           # Cancel registration
GET    /engage/my-registrations                  # Get user's registrations

POST   /engage/activities/:id/review             # Submit review
POST   /engage/registrations/:id/complete        # Mark as completed
```

### DTOs (Data Transfer Objects)

#### CreateEngageActivityDto
```typescript
{
  title: string;
  description?: string;
  category: 'wellness' | 'fitness' | 'event';
  type?: string;
  date?: string;  // ISO date format
  time?: string;  // "3:00 PM - 5:00 PM"
  duration?: string; // "2 weeks", "30 days"
  location?: string;
  price?: number; // default: 0
  points?: number; // default: 100
  image?: string;  // image URL
  thumbnail?: string; // thumbnail URL
  instructorId?: number;
  instructorName?: string;
  capacity?: number; // default: 100
  status?: 'active' | 'upcoming' | 'completed' | 'archived'; // default: 'active'
  tags?: string;  // JSON array as string
}
```

#### UpdateEngageActivityDto
- Same as CreateEngageActivityDto but all fields optional

#### RegisterEngageActivityDto
```typescript
{
  paymentId?: number;
  amountPaid?: number;
}
```

#### ReviewEngageActivityDto
```typescript
{
  rating: number;  // 1-5
  review?: string;
}
```

### Services

#### EngageService
Main service with these methods:

- `getActivities(category?, status?, page, limit)` - Get paginated activities
- `getActivityById(id)` - Get single activity with related data
- `createActivity(createDto, creatorId)` - Create new activity
- `updateActivity(id, updateDto)` - Update activity details
- `deleteActivity(id)` - Soft delete activity
- `registerActivity(activityId, userId, registerDto)` - Register user
- `cancelRegistration(activityId, userId)` - Cancel registration
- `getUserRegistrations(userId, page, limit)` - Get user's registrations
- `submitReview(activityId, userId, reviewDto)` - Submit review
- `getActivityReviews(activityId, page, limit)` - Get activity reviews
- `markActivityCompleted(registrationId, certificateUrl)` - Mark complete
- `searchActivities(query, category, page, limit)` - Search activities

### Controllers

#### EngageController
Routes all API requests to EngageService with proper validation and error handling.

## Setup Instructions

### 1. Database Migration
```bash
# In nuonbackend folder
cd nuonbackend

# Generate Prisma client with new models
npx prisma generate

# Create migration
npx prisma migrate dev --name add_engage_models

# Or apply migration directly
npx prisma db push
```

### 2. Install Dependencies (if needed)
```bash
# In mobile app
npm install

# In backend
npm install
```

### 3. Environment Configuration
Ensure these endpoints are properly configured:

**Mobile** (`NeonClubMobile/config/ipConfig.js`):
```javascript
export const IP_ADDRESS = 'your_backend_ip'; // e.g., '192.168.1.100'
```

**Backend** (`.env`):
```
DATABASE_URL="mysql://user:password@localhost:3306/database_name"
JWT_SECRET="your_secret"
PORT=5000
```

## API Usage Examples

### Get All Wellness Activities
```bash
curl http://localhost:5000/engage/activities?category=wellness&limit=10
```

### Register for Activity
```bash
curl -X POST http://localhost:5000/engage/activities/1/register \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"paymentId": 123, "amountPaid": 299}'
```

### Search Activities
```bash
curl http://localhost:5000/engage/activities/search?query=yoga&category=fitness
```

### Submit Review
```bash
curl -X POST http://localhost:5000/engage/activities/1/review \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"rating": 5, "review": "Great session!"}'
```

## Frontend Integration Checklist

- [x] EngageScreen.js updated with new navigation
- [x] EngageDetailsScreen.js created
- [x] Navigation stack configured
- [x] API calls properly integrated
- [x] Socket.io integration for real-time updates

## Backend Integration Checklist

- [x] Prisma schema updated with new models
- [x] DTOs created with validation
- [x] EngageService implemented with full CRUD + features
- [x] EngageController with all endpoints
- [x] Error handling and validation in place
- [ ] Database migration applied (needs manual run)
- [ ] Auth guards configured for protected routes
- [ ] Testing of all endpoints

## Data Flow

### Registration Flow
1. User clicks activity card on EngageScreen
2. Navigates to EngageDetailsScreen with activity data
3. User clicks "Register Free" or "Register Now"
4. Mobile app calls `POST /engage/activities/:id/register`
5. Backend validates capacity and uniqueness
6. Creates EngageActivityRegistration record
7. Increments registeredCount on activity
8. Returns success message

### Review Flow
1. User navigates to activity details
2. User clicks submit review button
3. Mobile app calls `POST /engage/activities/:id/review`
4. Backend validates user has registered
5. Creates or updates review
6. Recalculates activity rating
7. Returns updated review data

## Category Definitions

### Wellness (Mental Health)
- Stress management
- Mindfulness & meditation
- Work-life balance
- Mental health support
- Burnout prevention

### Fitness (Physical Health)
- Yoga & stretching
- Strength training
- Nutrition & wellness
- Fitness challenges
- Fitness programs

### Event (Community)
- Conferences
- Workshops
- Networking events
- Volunteering
- Professional development

## Points System

Each activity awards points based on:
- Category (wellness: 100-200, fitness: 80-150, event: 100-300)
- Duration (longer activities = more points)
- Difficulty/intensity
- User engagement (reviews, completion)

## Testing

### Test Data Creation
```typescript
// Create a test activity
POST /engage/activities
{
  "title": "Yoga for Nurses",
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

## Troubleshooting

### Issue: "Property 'engageActivity' does not exist on type 'PrismaService'"
**Solution**: Run `npx prisma generate` to regenerate Prisma client after schema changes.

### Issue: Activities not loading on mobile
**Solution**: 
1. Verify IP_ADDRESS is correct in `config/ipConfig.js`
2. Check backend is running on port 5000
3. Verify `/engage/activities` endpoint returns data

### Issue: Registration fails with "User is already registered"
**Solution**: This is expected - users cannot register twice for the same activity. The unique constraint prevents duplicates.

## Future Enhancements

- [ ] Waitlist for full activities
- [ ] Bulk registration for events
- [ ] Certificate download/sharing
- [ ] Activity reminders via notifications
- [ ] Engagement badges/achievements
- [ ] Instructor revenue tracking
- [ ] Analytics dashboard for admins
- [ ] Social sharing of activities

## Support
For issues or questions about the Engage feature implementation, refer to the API documentation or backend logs for detailed error messages.
