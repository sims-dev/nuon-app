# NUON App - Operational Dependencies & Requirements

## Document Overview

This document outlines all operational dependencies, content requirements, third-party services, and infrastructure needed to run NUON in production.

**App Type:** Mobile-first nurse education & mentorship platform  
**Target Audience:** Nursing professionals in India  
**Business Model:** Paid courses + Mentorship sessions + Certifications

---

## 1. CONTENT MANAGEMENT SYSTEM (CMS)

### 1.1 Course Content Management

#### Requirements:

- **Course Creation & Publishing**
  - Rich text editor for course descriptions
  - Module/chapter organization system
  - Drag-and-drop course structure builder
  - Draft/Published status workflow
  - Version control for course updates
  - Bulk upload capabilities

- **Video Content Management**
  - Video upload (MP4, WebM formats)
  - Video transcoding for multiple resolutions (360p, 480p, 720p, 1080p)
  - Thumbnail generation
  - Video player with playback tracking
  - Subtitle/caption management (English, Hindi)
  - Video analytics (watch time, completion rate)

- **Learning Materials**
  - PDF document upload & management
  - PowerPoint presentations
  - Downloadable resources
  - Interactive quizzes & assessments
  - Case studies & clinical scenarios
  - Reference materials & guidelines

#### Recommended Solutions:

- **Option 1 (All-in-One):** Teachable, Thinkific, or Kajabi
- **Option 2 (Custom):** Strapi CMS + Vimeo/Wistia for videos
- **Option 3 (Budget):** WordPress + LearnDash plugin

#### Data Structure:

```json
{
  "courseId": "course_001",
  "title": "Advanced Critical Care Nursing",
  "description": "...",
  "instructor": "Dr. Sunita Verma",
  "modules": [
    {
      "moduleId": "mod_001",
      "title": "Introduction to Critical Care",
      "lessons": [
        {
          "lessonId": "lesson_001",
          "title": "ICU Fundamentals",
          "type": "video",
          "duration": 1800,
          "videoUrl": "https://...",
          "resources": ["pdf_001", "quiz_001"]
        }
      ]
    }
  ],
  "price": 4999,
  "duration": "8 weeks",
  "level": "Advanced",
  "category": "Critical Care"
}
```

---

### 1.2 Fitness & Wellness Content

#### Requirements:

- **Workout Programs**
  - Exercise video library
  - Workout plans for nurses (desk exercises, stress relief)
  - Duration tracking
  - Difficulty levels
  - Body part/focus area tagging

- **Nutrition & Diet**
  - Meal plan templates
  - Healthy recipes for shift workers
  - Nutrition guides
  - Hydration tracking content

- **Mental Health & Wellness**
  - Meditation audio/video
  - Stress management techniques
  - Sleep hygiene guides
  - Burnout prevention content

#### Recommended Solutions:

- **Option 1:** Partner with fitness content provider (e.g., HealthifyMe content licensing)
- **Option 2:** Create original content with fitness instructor
- **Option 3:** Curate free YouTube content with proper attribution

#### Data Structure:

```json
{
  "workoutId": "workout_001",
  "title": "5-Minute Desk Stretches for Nurses",
  "category": "Fitness",
  "duration": 300,
  "difficulty": "Beginner",
  "videoUrl": "https://...",
  "thumbnail": "https://...",
  "targetAreas": ["Back", "Neck", "Shoulders"],
  "instructor": "Fitness Coach Name"
}
```

---

### 1.3 News & Announcements

#### Requirements:

- **Content Publishing**
  - News article editor
  - Image upload for featured images
  - Category tagging (Healthcare Updates, NUON News, etc.)
  - Publishing schedule
  - Push notification trigger

- **Content Sources**
  - Healthcare news aggregation (WHO, MCI, nursing councils)
  - Platform announcements
  - Industry updates
  - Event announcements

#### Recommended Solutions:

- **Option 1:** Custom admin panel with text editor
- **Option 2:** Ghost CMS for blog/news
- **Option 3:** Sanity.io headless CMS

---

## 2. USER MANAGEMENT SYSTEM

### 2.1 Authentication & Authorization

#### Requirements:

- **Phone Number + OTP Authentication**
  - SMS OTP service (6-digit code)
  - OTP expiry (5-10 minutes)
  - Rate limiting (max 3 attempts)
  - Resend OTP functionality
  - Phone number verification

#### Recommended Services:

- **Option 1:** Firebase Authentication (₹0.06 per verification in India)
- **Option 2:** Twilio SMS (₹0.50-1.00 per SMS)
- **Option 3:** MSG91 (Indian service, ₹0.15-0.40 per SMS)
- **Option 4:** AWS SNS (₹0.50 per SMS)

#### Monthly Cost Estimate:

- 10,000 users × 2 logins/month = 20,000 OTPs
- Cost: ₹3,000-8,000/month

---

### 2.2 User Profile Management

#### Requirements:

- **Profile Data Storage**
  - Personal info (name, email, phone)
  - Professional details (nursing council registration, specialization)
  - Profile photo upload & storage
  - Educational background
  - Work experience
  - Certifications earned

- **Profile Photo Management**
  - Image upload (max 5MB)
  - Image compression
  - Thumbnail generation
  - CDN delivery

#### Recommended Solutions:

- **Storage:** AWS S3, Google Cloud Storage, or Cloudinary
- **CDN:** Cloudflare or AWS CloudFront
- **Database:** PostgreSQL or MongoDB

#### Cost Estimate:

- Storage: ₹2-5/GB/month
- Bandwidth: ₹7-15/GB transferred
- For 10,000 users: ~₹2,000-5,000/month

---

### 2.3 User Progress Tracking

#### Requirements:

- **Learning Progress**
  - Course enrollment tracking
  - Video watch time tracking
  - Lesson completion status
  - Quiz/assessment scores
  - Certificate issuance
  - Learning streak tracking

- **Fitness Progress**
  - Workout completion
  - Activity minutes logged
  - Goals & milestones

#### Data Structure:

```json
{
  "userId": "user_12345",
  "enrolledCourses": [
    {
      "courseId": "course_001",
      "enrollmentDate": "2024-01-15",
      "progress": 65,
      "lastAccessed": "2024-11-28",
      "completedLessons": ["lesson_001", "lesson_002"],
      "quizScores": [85, 90, 78]
    }
  ],
  "certificates": ["cert_001", "cert_002"],
  "totalLearningTime": 36000
}
```

---

## 3. MENTOR MANAGEMENT SYSTEM

### 3.1 Mentor Onboarding

#### Requirements:

- **Application Process**
  - Online application form
  - Document upload (certifications, ID proof)
  - Background verification
  - Approval workflow
  - Mentor profile creation

- **Required Documents**
  - Nursing council registration certificate
  - Educational certificates
  - Experience letters
  - ID proof (Aadhaar/PAN)
  - Recent photograph

#### Recommended Solutions:

- **Document Verification:** Manual review + DigiLocker integration
- **Background Check:** Third-party service (e.g., SpringVerify, AuthBridge)
- **Cost:** ₹200-500 per mentor verification

---

### 3.2 Mentor Profile Management

#### Requirements:

- **Profile Information**
  - Professional details (specialization, experience)
  - Qualifications & certifications
  - Areas of expertise
  - Languages spoken
  - Availability calendar
  - Session pricing
  - Bio & introduction video

- **Rating & Review System**
  - Student ratings (1-5 stars)
  - Written reviews
  - Response time tracking
  - Session completion rate
  - Average rating calculation

#### Data Structure:

```json
{
  "mentorId": "mentor_001",
  "name": "Dr. Sunita Verma",
  "specialization": "Critical Care",
  "experience": "15 years",
  "qualifications": ["MSc Nursing", "ICU Certification"],
  "rating": 4.9,
  "totalSessions": 340,
  "pricing": 1999,
  "availability": {
    "monday": ["10:00-12:00", "15:00-17:00"],
    "tuesday": ["10:00-12:00"]
  },
  "languages": ["English", "Hindi", "Marathi"]
}
```

---

### 3.3 Session Scheduling & Management

#### Requirements:

- **Booking System**
  - Calendar integration
  - Time slot management
  - Booking confirmation
  - Automated reminders (SMS/Email)
  - Reschedule/cancellation handling
  - Waitlist management

- **Video Conferencing**
  - One-on-one video calls
  - Screen sharing capability
  - Chat functionality
  - Session recording (optional)
  - Call quality monitoring

#### Recommended Services:

- **Scheduling:** Calendly API, Cal.com, or custom solution
- **Video Calls:**
  - **Option 1:** Zoom API (₹1,600-2,000/month for Pro)
  - **Option 2:** Google Meet API (free with Google Workspace)
  - **Option 3:** Twilio Video (₹1.20/participant/minute)
  - **Option 4:** 100ms (₹0.80/participant/minute, Indian startup)
  - **Option 5:** Agora (₹0.60/participant/minute)

#### Cost Estimate (for 500 sessions/month @ 30 min each):

- Zoom: ₹2,000/month (fixed)
- Twilio: ~₹18,000/month
- 100ms: ~₹12,000/month
- **Recommended:** Zoom or Google Meet for cost efficiency

---

### 3.4 Mentor Compensation

#### Requirements:

- **Payment Processing**
  - Session fee tracking
  - Platform commission calculation (e.g., 20-30%)
  - Payout schedule (weekly/monthly)
  - Payment method (Bank transfer, UPI)
  - Invoice generation
  - Tax documentation (TDS if applicable)

#### Recommended Solutions:

- **Payout Service:** Razorpay Route, Cashfree Payouts, or Stripe Connect
- **Cost:** ₹3-5 per payout + 0.25% of amount

---

## 4. PAYMENT PROCESSING

### 4.1 Payment Gateway Integration

#### Requirements:

- **Payment Methods**
  - Credit/Debit Cards (Visa, Mastercard, RuPay)
  - UPI (PhonePe, Google Pay, Paytm, BHIM)
  - Net Banking (all major banks)
  - Wallets (Paytm, PhonePe, Mobikwik)
  - EMI options (for courses above ₹5,000)

- **Features Needed**
  - Payment link generation
  - Webhook for payment status
  - Refund processing
  - Failed payment retry
  - Payment receipt generation

#### Recommended Services:

**Option 1: Razorpay (Most Popular in India)**

- Transaction Fee: 2% + ₹0 (cards), 1% (UPI)
- Setup Fee: ₹0
- Settlement: T+3 days
- Features: Complete suite, good docs
- **Recommended:** ✅ Best for Indian market

**Option 2: Cashfree**

- Transaction Fee: 1.95% + ₹0
- Similar features to Razorpay
- Slightly cheaper

**Option 3: PayU**

- Transaction Fee: 2% + ₹0
- Established player
- Good for high volumes

**Option 4: Stripe**

- Transaction Fee: 2.9% + ₹2
- International support
- Higher fees for India

#### Cost Estimate (for ₹10,00,000 monthly revenue):

- Razorpay: ~₹20,000/month in fees
- Cashfree: ~₹19,500/month in fees

---

### 4.2 Subscription Management

#### Requirements:

- **Subscription Plans** (if implemented)
  - Monthly/Annual subscriptions
  - Auto-renewal
  - Subscription pause/cancel
  - Pro-rated refunds
  - Dunning management (failed payments)

#### Recommended Solutions:

- **Option 1:** Razorpay Subscriptions
- **Option 2:** Chargebee (specialized billing)
- **Option 3:** Stripe Billing

---

### 4.3 Coupon & Referral System

#### Requirements:

- **Coupon Management**
  - Coupon code generation
  - Discount types (%, fixed amount)
  - Usage limits (one-time, multiple)
  - Validity period
  - User eligibility
  - Tracking & analytics

- **Referral System**
  - Unique referral codes per user
  - Referral tracking
  - Reward calculation
  - Payout/credit to referrer
  - Multi-level referral (optional)

#### Implementation:

- Custom backend logic
- Database tables for coupons/referrals
- Admin panel for management

---

## 5. NOTIFICATION SYSTEM

### 5.1 Push Notifications

#### Requirements:

- **Use Cases**
  - Course enrollment confirmation
  - New course launches
  - Mentor session reminders (1 hour before)
  - Payment confirmations
  - Certificate availability
  - News & announcements
  - Engagement reminders (haven't learned in 7 days)

#### Recommended Services:

- **Option 1:** Firebase Cloud Messaging (FCM) - Free for unlimited notifications
- **Option 2:** OneSignal - Free up to 10,000 users, then $9/month
- **Option 3:** Amazon SNS - Pay per notification

**Recommended:** Firebase FCM (free, reliable)

---

### 5.2 SMS Notifications

#### Requirements:

- **Use Cases**
  - OTP for login
  - Booking confirmations
  - Payment receipts
  - Session reminders
  - Critical announcements

#### Recommended Services:

- **MSG91:** ₹0.15-0.40/SMS (DLT registered)
- **Twilio:** ₹0.50-1.00/SMS
- **Kaleyra:** ₹0.20-0.50/SMS
- **TextLocal:** ₹0.20-0.35/SMS

**Cost Estimate:**

- 10,000 users × 5 SMS/month = 50,000 SMS
- Cost: ₹7,500-20,000/month

---

### 5.3 Email Notifications

#### Requirements:

- **Use Cases**
  - Welcome email
  - Course purchase confirmation
  - Payment receipts
  - Weekly learning summary
  - Newsletter
  - Password reset (if email login added)

#### Recommended Services:

- **SendGrid:** Free up to 100 emails/day, then $19.95/month
- **Mailgun:** Free up to 5,000 emails/month
- **Amazon SES:** ₹0.08 per 1,000 emails
- **Postmark:** Transactional emails specialist

**Cost Estimate:**

- 10,000 users × 10 emails/month = 100,000 emails
- Cost: ₹800-2,000/month

---

## 6. DATA STORAGE & HOSTING

### 6.1 Database

#### Requirements:

- **Data Types**
  - User profiles & authentication
  - Course content metadata
  - Progress tracking
  - Mentor information
  - Booking & scheduling data
  - Payment transactions
  - Analytics data

- **Database Characteristics**
  - Scalable (start: 1,000 users → grow to 100,000+)
  - Fast read/write
  - Backup & recovery
  - ACID compliance for transactions
  - Real-time queries

#### Recommended Solutions:

**Option 1: PostgreSQL (Relational)**

- ✅ Best for structured data (users, courses, bookings)
- ✅ ACID compliant
- ✅ Good for complex queries
- Hosting: AWS RDS, Google Cloud SQL, DigitalOcean
- Cost: ₹1,500-10,000/month depending on size

**Option 2: MongoDB (NoSQL)**

- ✅ Flexible schema
- ✅ Fast for read-heavy workloads
- ✅ Good for rapid iteration
- Hosting: MongoDB Atlas
- Cost: Free tier → ₹2,000-15,000/month

**Option 3: Supabase (PostgreSQL + Real-time)**

- ✅ PostgreSQL with real-time features
- ✅ Built-in auth & storage
- ✅ Good for rapid development
- Cost: Free tier → $25/month

**Recommended:** PostgreSQL on AWS RDS or Supabase

---

### 6.2 File Storage (Images, Videos, Documents)

#### Requirements:

- **Storage Needs**
  - Profile photos: ~1MB each
  - Course videos: 100MB-2GB each
  - PDF materials: 1-50MB each
  - Thumbnails: ~100KB each
- **Estimated Storage (for 100 courses, 10,000 users)**
  - Videos: ~200GB
  - PDFs: ~10GB
  - Profile photos: ~10GB
  - Thumbnails: ~1GB
  - **Total: ~220GB**

#### Recommended Solutions:

**Option 1: AWS S3**

- Cost: ₹1.60/GB/month storage + ₹7/GB transfer
- Storage: ~₹350/month
- Bandwidth (100GB/month): ~₹700/month
- **Total: ~₹1,050/month**

**Option 2: Google Cloud Storage**

- Similar pricing to S3
- Good integration with Firebase

**Option 3: Cloudinary**

- Optimized for images/videos
- Auto-compression & CDN
- Free tier: 25GB storage, 25GB bandwidth
- Paid: $89/month for 125GB

**Option 4: Backblaze B2**

- Cheapest option
- ₹0.40/GB/month storage
- First 10GB bandwidth free
- Storage: ~₹90/month
- Bandwidth: ~₹400/month
- **Total: ~₹490/month**

**Recommended:** Backblaze B2 for video storage + Cloudinary for images

---

### 6.3 CDN (Content Delivery Network)

#### Requirements:

- Fast content delivery across India
- Reduce server load
- Improve video streaming
- Cache static assets

#### Recommended Solutions:

- **Cloudflare:** Free tier available, good for India
- **AWS CloudFront:** ₹6-8/GB transfer
- **BunnyCDN:** Cheap, ₹0.80/GB
- **KeyCDN:** ₹0.80/GB, India presence

**Recommended:** Cloudflare (free tier) or BunnyCDN (paid)

---

### 6.4 Application Hosting

#### Requirements:

- **Backend API Server**
  - Node.js/Python/Go backend
  - REST or GraphQL API
  - Auto-scaling capability
  - Load balancing
  - 99.9% uptime

#### Recommended Solutions:

**Option 1: AWS EC2/ECS**

- Full control
- Scalable
- Cost: ₹3,000-20,000/month

**Option 2: DigitalOcean Droplets/App Platform**

- Simple setup
- Fixed pricing
- Cost: ₹800-8,000/month

**Option 3: Heroku**

- Easy deployment
- Auto-scaling
- Cost: $7-50/month

**Option 4: Vercel/Netlify**

- Great for frontend + serverless backend
- Free tier available
- Cost: $0-20/month

**Option 5: Railway**

- Modern platform
- Good DX
- Cost: $5-50/month

**Recommended:** DigitalOcean App Platform or Railway for simplicity

---

## 7. CERTIFICATE GENERATION

### 7.1 Requirements

- **Certificate Design**
  - Professional template design
  - NUON branding
  - Digital signatures
  - QR code for verification
  - Unique certificate ID
  - Issue date

- **Generation Process**
  - Auto-generate on course completion
  - PDF format
  - Downloadable & shareable
  - Email delivery

#### Recommended Solutions:

**Option 1: Custom HTML to PDF**

- Libraries: Puppeteer, jsPDF, PDFKit
- Full control over design
- Cost: Free (server resources only)

**Option 2: Third-party Service**

- Accredible: $49/month for 100 certificates
- Certifier: $29/month for 100 certificates
- Canva API: Design in Canva, generate via API

**Option 3: Blockchain Certificates**

- Verifiable credentials
- Immutable record
- Services: Blockcerts, Learning Machine
- Cost: $100-500/month

**Recommended:** Custom HTML to PDF (cost-effective)

---

### 7.2 Verification System

#### Requirements:

- Public certificate verification page
- QR code scanning
- Certificate ID lookup
- Fraud prevention

#### Implementation:

- Public API endpoint: `/verify-certificate/{certificateId}`
- Returns: Learner name, course name, issue date, validity status

---

## 8. ANALYTICS & REPORTING

### 8.1 User Analytics

#### Requirements:

- **Metrics to Track**
  - Daily/Monthly Active Users (DAU/MAU)
  - User retention (7-day, 30-day)
  - Session duration
  - Feature usage
  - Funnel analysis (signup → purchase → completion)
  - Churn rate

#### Recommended Services:

- **Google Analytics 4:** Free, comprehensive
- **Mixpanel:** Free up to 100,000 events/month
- **Amplitude:** Free up to 10M events/month
- **PostHog:** Open-source, self-hosted option

**Recommended:** Google Analytics 4 + Mixpanel

---

### 8.2 Business Analytics

#### Requirements:

- **Revenue Metrics**
  - Total revenue
  - Revenue by course
  - Revenue by mentor
  - Average order value
  - Customer lifetime value (LTV)
  - Refund rate

- **Course Analytics**
  - Enrollment rate
  - Completion rate
  - Average rating
  - Time to complete
  - Drop-off points

- **Mentor Analytics**
  - Bookings per mentor
  - Revenue per mentor
  - Ratings & reviews
  - No-show rate

#### Recommended Solutions:

- **Custom dashboard:** Build with React + Chart.js
- **BI Tools:**
  - Metabase (open-source, free)
  - Google Data Studio (free)
  - Tableau (paid, enterprise)

**Recommended:** Metabase or Google Data Studio

---

### 8.3 Video Analytics

#### Requirements:

- Watch time per video
- Completion rate
- Drop-off points
- Average view duration
- Replay rate

#### Solutions:

- Built into video hosting platforms (Vimeo, Wistia)
- Custom tracking with video.js events

---

## 9. CUSTOMER SUPPORT

### 9.1 Help Desk / Ticketing System

#### Requirements:

- **Support Channels**
  - In-app chat
  - Email support
  - Phone support (optional)
  - FAQ/Knowledge base

- **Ticketing Features**
  - Ticket creation & assignment
  - Priority levels
  - Status tracking
  - Response templates
  - SLA monitoring

#### Recommended Solutions:

- **Freshdesk:** ₹1,200/agent/month (₹12,000/year)
- **Zoho Desk:** ₹800/agent/month
- **Intercom:** $74/month (expensive)
- **Crisp:** €25/month (~₹2,200)
- **Tawk.to:** Free live chat

**Recommended:** Freshdesk or Zoho Desk

---

### 9.2 Live Chat

#### Requirements:

- Real-time chat widget
- Mobile support
- Typing indicators
- File sharing
- Chat history

#### Recommended Solutions:

- **Tawk.to:** Free
- **Crisp:** Free up to 2 agents
- **Intercom:** $74/month
- **Drift:** $40/month

**Recommended:** Tawk.to (free) or Crisp

---

### 9.3 Knowledge Base

#### Requirements:

- FAQ articles
- Search functionality
- Categories (Account, Courses, Payments, Technical)
- Video tutorials
- Troubleshooting guides

#### Recommended Solutions:

- **Notion:** Free public pages
- **GitBook:** $0-8/user/month
- **Freshdesk built-in KB**
- **Custom built:** Markdown files + search

**Recommended:** Notion or custom built

---

## 10. ADMIN PANEL

### 10.1 Requirements

#### User Management

- View all users
- User profile editing
- Account suspension/deletion
- Role assignment (student, mentor, admin)
- User activity logs

#### Content Management

- Course CRUD operations
- Module/lesson management
- Video upload & organization
- Quiz/assessment creation
- News/announcement publishing

#### Mentor Management

- Mentor application review
- Profile approval/rejection
- Session management
- Payout tracking
- Performance monitoring

#### Payment Management

- Transaction history
- Refund processing
- Revenue reports
- Tax reporting
- Coupon/referral management

#### Analytics Dashboard

- Key metrics overview
- Revenue charts
- User growth graphs
- Course performance
- Mentor performance

#### Settings

- Platform configuration
- Payment gateway settings
- Notification templates
- Email templates
- App version management

---

### 10.2 Recommended Solutions

**Option 1: Custom Built (React Admin, Refine, React Admin)**

- Full control
- Custom workflows
- Cost: Development time

**Option 2: No-code Tools**

- Retool: $10/user/month
- Budibase: Free self-hosted
- Appsmith: Free self-hosted

**Recommended:** Custom built with React Admin or Refine

---

## 11. COMPLIANCE & LEGAL

### 11.1 Data Privacy (India)

#### Requirements:

- **Personal Data Protection Bill (PDPB) compliance**
- Privacy policy
- Terms of service
- Cookie policy
- Data retention policy
- User consent management
- Right to deletion
- Data export capability

#### Actions Required:

1. Draft privacy policy (lawyer consultation: ₹10,000-50,000)
2. Implement consent forms
3. Data encryption in transit & at rest
4. Regular security audits

---

### 11.2 Payment Compliance

#### Requirements:

- **PCI DSS compliance** (if storing card data - avoid this)
- GST registration & collection
- TDS on mentor payouts (if applicable)
- Invoice generation
- Financial record keeping

#### Actions Required:

1. Use PCI-compliant payment gateway (Razorpay handles this)
2. Register for GST
3. Implement GST calculation (18% on services)
4. Generate GST invoices
5. File quarterly GST returns

---

### 11.3 Medical/Healthcare Content

#### Requirements:

- **Medical disclaimer** on all courses
- Content reviewed by qualified professionals
- Certification disclaimers
- Copyright compliance for all materials

#### Actions Required:

1. Add disclaimer: "For educational purposes only, not medical advice"
2. Content review by nursing experts
3. Copyright clearance for all third-party content

---

## 12. THIRD-PARTY INTEGRATIONS

### 12.1 Social Media Integration

- **Facebook Pixel** - Ads tracking
- **Google Ads** - Conversion tracking
- **LinkedIn** - Share certificates
- **WhatsApp Business API** - Customer support (₹5-10/conversation)

---

### 12.2 Marketing Tools

- **Email Marketing:** Mailchimp, SendinBlue (₹1,000-5,000/month)
- **SMS Marketing:** MSG91, Gupshup
- **Referral Program:** ReferralCandy, GrowSurf
- **Affiliate Program:** Tapfiliate, Rewardful

---

### 12.3 SEO & Content

- **Google Search Console** - Free
- **Google My Business** - Free
- **Blog/Content:** WordPress or custom
- **Social Media Management:** Buffer, Hootsuite

---

## 13. QUALITY ASSURANCE

### 13.1 Testing Requirements

- **Unit Testing:** Jest, React Testing Library
- **Integration Testing:** Cypress, Playwright
- **Load Testing:** k6, JMeter
- **Security Testing:** OWASP ZAP, Burp Suite
- **User Acceptance Testing (UAT):** Beta user group

---

### 13.2 Monitoring & Error Tracking

#### Requirements:

- Application monitoring
- Error tracking & reporting
- Performance monitoring
- Uptime monitoring
- Log management

#### Recommended Services:

- **Sentry:** Error tracking (Free tier → $26/month)
- **LogRocket:** Session replay ($99/month)
- **New Relic:** APM (Free tier → $99/month)
- **UptimeRobot:** Uptime monitoring (Free)
- **Better Stack:** Logging ($10/month)

**Recommended:** Sentry (errors) + UptimeRobot (uptime)

---

## 14. COST SUMMARY

### 14.1 Initial Setup Costs (One-time)

| Item                            | Cost (INR)              |
| ------------------------------- | ----------------------- |
| Legal (Privacy policy, T&C)     | ₹20,000-50,000          |
| Logo & Branding                 | ₹10,000-50,000          |
| App Development (if outsourced) | ₹5,00,000-20,00,000     |
| Initial Content Creation        | ₹50,000-2,00,000        |
| **Total**                       | **₹5,80,000-24,00,000** |

---

### 14.2 Monthly Operational Costs (Estimated for 10,000 users)

| Category                      | Service                  | Monthly Cost (INR) |
| ----------------------------- | ------------------------ | ------------------ |
| **Infrastructure**            |
| Database Hosting              | AWS RDS / Supabase       | ₹3,000-8,000       |
| Application Hosting           | DigitalOcean / Railway   | ₹2,000-8,000       |
| File Storage                  | Backblaze + Cloudinary   | ₹1,000-3,000       |
| CDN                           | Cloudflare / BunnyCDN    | ₹500-2,000         |
| **Communication**             |
| SMS (OTP + Notifications)     | MSG91                    | ₹8,000-15,000      |
| Email                         | SendGrid / Amazon SES    | ₹1,000-2,000       |
| Push Notifications            | Firebase FCM             | Free               |
| **Payments**                  |
| Payment Gateway Fees          | Razorpay (2% of revenue) | ₹20,000\*          |
| Mentor Payouts                | Razorpay Route           | ₹2,000-5,000       |
| **Video**                     |
| Video Hosting                 | Vimeo Pro                | ₹6,000-12,000      |
| Video Calls (Mentorship)      | Zoom Pro                 | ₹2,000             |
| **Support & Tools**           |
| Customer Support              | Freshdesk                | ₹2,000-5,000       |
| Analytics                     | Mixpanel                 | Free-₹3,000        |
| Error Tracking                | Sentry                   | Free-₹2,000        |
| Monitoring                    | UptimeRobot              | Free               |
| **Content & Marketing**       |
| Content Creation              | Freelancers              | ₹20,000-50,000     |
| Social Media Marketing        | Ads                      | ₹10,000-50,000     |
| **Human Resources**           |
| Content Team (1-2 people)     | Salaries                 | ₹40,000-80,000     |
| Customer Support (1-2 people) | Salaries                 | ₹30,000-60,000     |
| **TOTAL (Low estimate)**      |                          | **₹1,47,500**      |
| **TOTAL (High estimate)**     |                          | **₹3,05,000**      |

\*Assuming ₹10,00,000 monthly revenue

---

### 14.3 Scalability Costs (Per 10,000 additional users)

- Database: +₹2,000-5,000/month
- Storage: +₹500-1,000/month
- Bandwidth: +₹1,000-2,000/month
- SMS: +₹8,000-15,000/month
- **Total:** ~₹11,500-23,000/month per 10K users

---

## 15. HUMAN RESOURCES NEEDED

### 15.1 Technical Team

- **Backend Developer** (1-2)
- **Frontend/Mobile Developer** (1-2)
- **DevOps Engineer** (0.5-1, can be part-time initially)
- **QA/Tester** (1)

### 15.2 Content Team

- **Course Creator / Instructional Designer** (1-2)
- **Video Editor** (1)
- **Graphic Designer** (0.5-1)
- **Medical/Nursing Content Reviewer** (Consultant)

### 15.3 Operations Team

- **Customer Support** (1-2)
- **Mentor Coordinator** (1)
- **Content Manager** (1)

### 15.4 Business Team

- **Product Manager** (1)
- **Marketing Manager** (1)
- **Sales/Partnerships** (1)

**Total Team Size (Phase 1):** 10-15 people

---

## 16. LAUNCH PHASES

### Phase 1 - MVP (Months 1-3)

- ✅ User authentication
- ✅ Basic course browsing & playback
- ✅ Payment integration
- ✅ Profile management
- ✅ Certificate generation
- 🎯 Target: 100-500 users

### Phase 2 - Growth (Months 4-6)

- ✅ Mentorship booking system
- ✅ Live video sessions
- ✅ Advanced analytics
- ✅ Referral program
- ✅ Mobile app (iOS/Android)
- 🎯 Target: 1,000-5,000 users

### Phase 3 - Scale (Months 7-12)

- ✅ Community features (forums, groups)
- ✅ Live classes/webinars
- ✅ Subscription plans
- ✅ Gamification
- ✅ Partnerships with nursing institutions
- 🎯 Target: 10,000-50,000 users

### Phase 4 - Expansion (Year 2+)

- ✅ International expansion
- ✅ Corporate training programs
- ✅ White-label solution for hospitals
- ✅ AI-powered learning recommendations
- 🎯 Target: 100,000+ users

---

## 17. CONTENT PIPELINE

### 17.1 Course Production Workflow

```
Week 1-2: Course Planning & Scripting
  ├─ Topic research
  ├─ Learning objectives
  ├─ Outline creation
  └─ Script writing

Week 3-4: Content Creation
  ├─ Video recording
  ├─ Presentation design
  └─ Resource preparation

Week 5: Post-Production
  ├─ Video editing
  ├─ Thumbnail design
  └─ Quality review

Week 6: Platform Upload
  ├─ Video upload & transcoding
  ├─ Quiz creation
  ├─ Platform testing
  └─ Launch

Total: 6 weeks per course
```

### 17.2 Content Calendar

**Year 1 Target:** 20-30 courses

- **Month 1-2:** 5 foundational courses (Critical Care, Med-Surg, etc.)
- **Month 3-6:** 10 specialized courses
- **Month 7-12:** 10-15 advanced courses + certifications

---

## 18. RISK MITIGATION

### 18.1 Technical Risks

| Risk                   | Impact    | Mitigation                                      |
| ---------------------- | --------- | ----------------------------------------------- |
| Server downtime        | High      | Use multiple availability zones, auto-scaling   |
| Data breach            | Very High | Encryption, regular audits, penetration testing |
| Payment failures       | High      | Multiple payment gateways, retry mechanism      |
| Video streaming issues | Medium    | CDN, multiple quality options, download option  |

---

### 18.2 Business Risks

| Risk                | Impact | Mitigation                              |
| ------------------- | ------ | --------------------------------------- |
| Low user adoption   | High   | Marketing, free trial, referral program |
| Poor course quality | High   | Rigorous content review, user feedback  |
| Mentor shortage     | Medium | Competitive rates, recognition program  |
| Regulatory changes  | Medium | Legal monitoring, compliance team       |

---

## 19. SUCCESS METRICS (KPIs)

### 19.1 User Metrics

- **DAU/MAU Ratio:** Target >20%
- **Retention:** 30-day >40%, 90-day >20%
- **NPS Score:** >50

### 19.2 Business Metrics

- **Monthly Recurring Revenue (MRR):** Growth target 15-20%/month
- **Customer Acquisition Cost (CAC):** <₹500
- **Lifetime Value (LTV):** >₹5,000
- **LTV/CAC Ratio:** >10:1

### 19.3 Engagement Metrics

- **Avg. Session Duration:** >15 minutes
- **Course Completion Rate:** >60%
- **Mentor Booking Rate:** >30% of users

---

## 20. RECOMMENDED TECH STACK SUMMARY

### Frontend

- **Framework:** React (web), React Native (mobile)
- **Styling:** Tailwind CSS
- **State Management:** React Context / Zustand
- **UI Components:** shadcn/ui

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js / Fastify
- **Language:** TypeScript
- **Authentication:** Firebase Auth or custom JWT

### Database

- **Primary:** PostgreSQL (AWS RDS or Supabase)
- **Cache:** Redis (optional, for sessions)

### Storage

- **Files:** AWS S3 / Backblaze B2
- **Images:** Cloudinary
- **Videos:** Vimeo Pro or AWS S3 + CloudFront

### Infrastructure

- **Hosting:** DigitalOcean / AWS / Railway
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry + UptimeRobot

### Third-Party Services

- **Payments:** Razorpay
- **SMS:** MSG91
- **Email:** SendGrid
- **Video Calls:** Zoom API
- **Push Notifications:** Firebase FCM
- **Analytics:** Google Analytics 4 + Mixpanel

---

## CONCLUSION

This document outlines all operational dependencies for the NUON app. Priority should be given to:

1. ✅ **Infrastructure setup** (hosting, database, storage)
2. ✅ **Payment processing** (critical for revenue)
3. ✅ **Content creation pipeline** (core value proposition)
4. ✅ **Mentor onboarding system** (differentiation factor)
5. ✅ **Customer support** (user satisfaction)

**Estimated Time to Launch MVP:** 3-4 months with a dedicated team
**Estimated Initial Budget:** ₹10-25 lakhs (including development + 3 months operations)

---

**Document Version:** 1.0  
**Last Updated:** November 28, 2024  
**Status:** Ready for Implementation Planning