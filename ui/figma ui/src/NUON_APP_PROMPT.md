# NUON - Complete App Specification & Prompt

## 📱 App Overview

**NUON** (Nurse United, Opportunities Nourished) is a comprehensive mobile learning platform designed specifically for nurses in the healthcare profession. The app provides professional development through courses, mentorship, certifications, and community engagement.

**Tagline:** "Nurse United, Opportunities Nourished"

---

## 🎨 Design System

### Visual Identity
- **Color Scheme:** Vibrant neon colors (purple, blue, cyan, pink gradients)
- **Design Style:** Modern glassmorphism with subtle backdrop blur and transparency
- **Typography:** Inter font family throughout
- **Component Style:** Rounded corners (rounded-xl, rounded-2xl) for all cards and buttons
- **Effects:** 
  - Neon glow effects on key elements
  - Subtle animations and transitions
  - Gradient backgrounds
  - Glass-morphic cards with `backdrop-blur-md`

### Color Palette
```
Primary: Purple (#A855F7, #9333EA)
Secondary: Blue (#3B82F6, #2563EB)
Accent: Cyan (#06B6D4, #0891B2)
Highlight: Pink (#EC4899, #DB2777)
Success: Green (#10B981, #059669)
Warning: Orange (#F59E0B, #D97706)
Background: Dark gradient (from-gray-900 via-purple-900 to-blue-900)
Cards: rgba(255, 255, 255, 0.1) with backdrop-blur
```

### Logo Design
**NUON Logo v3.0** features:
- Florence Nightingale's oil lamp hanging gracefully ABOVE the letter "U" in NUON
- Striped lantern design with golden gradient (#F4D03F → #E8B923 → #D4A017)
- Horizontal rings creating traditional lantern appearance
- Gentle glow animation with warm light
- Hook and string connecting lamp to the "U"
- Clean, bold NUON wordmark in modern sans-serif
- Tagline: "Nurse United, Opportunities Nourished"

**Three Logo Variants:**
1. `<NuonLogo>` - Full logo with tagline
2. `<NuonLogoHorizontal>` - Compact for headers
3. `<NuonIcon>` - Lamp + U for app icons and favicons

---

## 🔐 Authentication Flow

### 1. Splash Screen (`SplashScreen.tsx`)
- **Duration:** 3 seconds
- **Content:**
  - Animated NUON logo with glowing lamp
  - Tagline appears with fade-in animation
  - Gradient background with subtle animation
  - Professional, welcoming first impression
- **Transition:** Auto-navigates to Phone/OTP Auth

### 2. Phone Number + OTP Authentication (`PhoneOTPAuth.tsx`)
- **Step 1: Phone Number Entry**
  - Indian phone number format (+91)
  - 10-digit validation
  - Clean input with neon accent border on focus
  - "Get OTP" button with gradient background
  
- **Step 2: OTP Verification**
  - 6-digit OTP input
  - Auto-focus on each digit
  - Resend OTP option (with 30s cooldown timer)
  - "Verify OTP" button
  - Mock OTP: "123456" for testing

- **Post-Auth Logic:**
  - Check if user profile exists in localStorage
  - If new user → Navigate to Nurse Details Form
  - If returning user → Navigate to Dashboard

---

## 👤 Onboarding Flow

### 3. Nurse Details Form (`NurseDetailsForm.tsx`)
Collects professional information in a multi-step form:

**Step 1: Personal Information**
- Full Name (required)
- Email Address (required, validation)
- Date of Birth (date picker)
- Gender (Male/Female/Other/Prefer not to say)
- Profile Photo Upload (optional)

**Step 2: Professional Information** *(SKIPPABLE - Added in recent update)*
- Nursing Registration Number
- Registration Council (dropdown: INC, State Councils)
- Years of Experience (slider: 0-40 years)
- Current Designation (Staff Nurse, Senior Nurse, Nursing Officer, etc.)
- Specialization (General, ICU, Pediatric, etc.)
- "Skip for Now" button available

**Step 3: Location & Institution**
- Current City (required)
- State (dropdown of Indian states)
- Current Institution/Hospital
- Institution Type (Government/Private/Trust)

**Step 4: Interests & Goals**
- Areas of Interest (multi-select checkboxes):
  - Critical Care, Pediatrics, Mental Health, Community Health
  - Geriatric Care, Emergency Care, Oncology, Cardiology
  - Maternal & Child Health, Research & Academia
- Learning Goals (textarea)
- How did you hear about NUON? (dropdown)

**Features:**
- Progress indicator (Step X of 4)
- Form validation with error messages
- Data saved to localStorage as `nurseProfile`
- Professional photo preview with crop/edit option
- Smooth transitions between steps
- Success animation on completion

**Data Structure Saved:**
```json
{
  "phone": "+91XXXXXXXXXX",
  "name": "Nurse Name",
  "email": "nurse@example.com",
  "dob": "YYYY-MM-DD",
  "gender": "Female",
  "profilePhoto": "base64 or URL",
  "registrationNumber": "ABC123456",
  "council": "INC",
  "experience": 5,
  "designation": "Staff Nurse",
  "specialization": "ICU",
  "city": "Mumbai",
  "state": "Maharashtra",
  "institution": "Hospital Name",
  "institutionType": "Government",
  "interests": ["Critical Care", "Emergency Care"],
  "goals": "User's learning goals",
  "source": "Social Media",
  "profileComplete": true,
  "registeredAt": "timestamp"
}
```

---

## 🏠 Main Dashboard (`NewDashboard.tsx`)

### Header Section
- **Profile Photo** (circular, 48px) next to greeting
- **Personalized Greeting:** "Good Morning, [Name]!" (time-based)
- **Notification Bell** icon with red badge for unread count
- **NUON Logo** (horizontal variant, white)

### Quick Stats Cards (Glass-morphic design)
- **Total Learning Hours:** Accumulated hours with trending up icon
- **Certifications Earned:** Count with trophy icon
- **Courses in Progress:** Active courses with book icon
- **Mentorship Sessions:** Upcoming sessions with users icon

### Active Courses Section
- **Course Cards** with:
  - Course thumbnail/icon
  - Course title
  - Progress bar with percentage
  - "Continue Learning" button
  - Category badge
- **View All Courses** link

### Upcoming Sessions
- **Session Cards** displaying:
  - Mentor name and photo
  - Session title
  - Date and time with calendar icon
  - "Join Session" button (if within 15 mins of start)
  - "View Details" button
- **Book New Session** CTA button

### Quick Actions Grid
- **Explore Courses:** Navigate to My Learning
- **Find a Mentor:** Navigate to Mentorship Sessions
- **Get Certified:** Navigate to Nightingale Champion
- **Join Activities:** Navigate to Activities section
- **News & Updates:** Navigate to News & Announcements
- **My Profile:** Navigate to Profile section

### Featured Content
- **Nightingale Champion Assessment** banner (Coming Soon in Phase 2)
- **Latest Announcements** preview (3 most recent)
- **Recommended Courses** based on interests

---

## 📚 Core Features & Sections

## 🎯 Bottom Navigation (`BottomNav.tsx`)

**Modern 4-Tab Design (Fixed Bottom Bar):**

1. **Home** 
   - Icon: House
   - Route: Dashboard
   - Active: Gradient purple indicator

2. **Learning**
   - Icon: Book Open
   - Route: My Learning
   - Courses, events, workshops

3. **Engage**
   - Icon: Heart (filled)
   - Route: Wellness, Fitness, Events
   - Growth-focused programs

4. **Mentors**
   - Icon: Users
   - Route: Mentorship Sessions
   - Find and book mentors

**Profile Access:**
- Located in **top-right header** on all main pages
- Tappable profile picture with ring animation
- Consistent across Dashboard, Learning, Engage, Mentors
- Profile completion prompt shown on Dashboard header

**Header Design Pattern:**
- **Dashboard:** Blue-purple gradient, profile pic + notifications
- **Learning:** Purple-pink gradient, clean header with stats
- **Engage:** Purple-pink-orange gradient, search bar
- **Mentors:** Cyan-teal-blue gradient, search + filter

---

### 1. My Learning (`MyLearning.tsx`)
**Categories:**
- All Courses
- In Progress (with progress %)
- Completed (with certificates)
- Saved/Bookmarked

**Course Types:**
- **Video Courses:** Multi-module video content
- **Workshops:** Interactive sessions with assignments
- **Events:** Webinars, conferences, live sessions

**Course Card Details:**
- Thumbnail image
- Title and instructor
- Duration and lesson count
- Rating (stars) and review count
- Price or "Free" badge
- Progress indicator (if enrolled)
- Category tags

**Course Viewer (`CourseViewer.tsx`):**
- Video player with controls
- Module list sidebar
- Progress tracking per module
- Notes section
- Resources download
- Quiz/Assessment integration
- Certificate generation on completion
- "Mark as Complete" for each module

**Workshop Viewer (`WorkshopViewer.tsx`):**
- Live session countdown
- Interactive whiteboard
- Chat functionality
- Screen sharing view
- Assignment submission
- Participant list
- Recording playback (for past workshops)

**Event Viewer (`EventViewer.tsx`):**
- Event details (date, time, venue/link)
- Registration button
- Add to calendar option
- Speaker profiles
- Agenda/Schedule
- Live streaming link (when active)
- Replay recording (post-event)

### 2. Mentorship Sessions (`MentorshipSessions.tsx`)

**Mentor Discovery:**
- Search and filter mentors by:
  - Specialization
  - Experience level
  - Language
  - Rating
  - Availability
- Mentor cards with:
  - Profile photo
  - Name and designation
  - Specialization badges
  - Years of experience
  - Rating and reviews count
  - Hourly rate
  - "View Profile" and "Book Session" buttons

**Mentor Profile:**
- Detailed bio
- Qualifications and certifications
- Areas of expertise
- Session types offered (1-on-1, Group)
- Availability calendar
- Reviews and testimonials
- Session packages and pricing

**Booking Flow (`BookingSlots.tsx`):**
1. Select session type (1-on-1 / Group / Package)
2. Choose date from calendar
3. Select time slot from available options
4. Add session notes/topics to discuss
5. Confirm and proceed to payment
6. Booking confirmation with calendar invite

**My Sessions Dashboard:**
- **Upcoming Sessions:**
  - Session details card
  - Join button (15 mins before start)
  - Reschedule option (`RescheduleSession.tsx`)
  - Cancel option (with refund policy)
  - Preparation guide (`SessionPreparation.tsx`)
  
- **Past Sessions:**
  - Session summary
  - Duration and date
  - Mentor notes/feedback
  - Recording link (if available)
  - "Provide Feedback" button (`SessionFeedback.tsx`)
  - "Book Again" option

**Video Session (`VideoSession.tsx`):**
- Full-screen video interface
- Mentor video (large)
- Your video (small, draggable PiP)
- Controls:
  - Mute/Unmute microphone
  - Enable/Disable camera
  - Screen share
  - End call
- Chat sidebar
- Note-taking panel
- Timer showing session duration
- Record session option
- Virtual background settings

**Session Feedback (`SessionFeedback.tsx`):**
- Star rating (1-5)
- Structured questions:
  - Was the mentor prepared?
  - Did you achieve session goals?
  - Would you recommend this mentor?
- Text feedback area
- Anonymous option
- Submit feedback (unlocks certificate/credits)

**Session Preparation (`SessionPreparation.tsx`):**
- Session details reminder
- Mentor bio quick view
- Suggested preparation:
  - Topics to prepare
  - Questions to ask
  - Materials to review
- Technical check:
  - Camera test
  - Microphone test
  - Internet speed check
- Reschedule option
- Join session button

### 3. Engage (`Engage.tsx`)

**Focus:** Wellness, Fitness, and Events for nurse professional and personal growth

**Three Main Categories:**

#### 🧘 **Wellness Programs**
Focus on mental health, stress management, and self-care for healthcare workers.

**Program Types:**
- Stress Management Workshops
- Mindfulness & Meditation Sessions
- Burnout Prevention Programs
- Self-Care Activities
- Mental Health Support Groups
- Compassion Fatigue Management

**Wellness Card Details:**
- Program title and image
- Category badge (Mental Health, Mindfulness, Self-Care)
- Date, time, and location
- Available seats
- Price (many are FREE)
- Points earned
- Heart icon indicator

#### 💪 **Fitness Activities**
Physical wellness programs designed specifically for nurses and healthcare professionals.

**Activity Types:**
- Fitness Challenges (30-day programs)
- Desk Stretches for Long Shifts
- Strength Training for Nurses
- Nutrition Programs
- Yoga & Breathwork
- Health Tracking Programs

**Fitness Card Details:**
- Program title and image
- Category badge (Fitness Challenge, Nutrition, etc.)
- Instructor name
- Duration (days/weeks)
- Enrolled count
- Price
- Points earned
- Dumbbell icon indicator

#### 📅 **Events**
Professional growth events including conferences, webinars, workshops, and volunteering.

**Event Types:**
- Healthcare Conferences
- Professional Webinars
- Leadership Workshops
- Community Health Camps (Volunteering)
- Career Growth Sessions
- Networking Events

**Event Card Details:**
- Event title and image
- Category badge (Conference, Volunteering, Leadership, etc.)
- Date, time, and location
- Available seats
- Price (Free or paid)
- Points earned
- Activity icon indicator

**Engage Details (`EngageDetails.tsx`):**
- Full program/event description tailored to type
- Key information (date, time, location, duration)
- Detailed "What You'll Get" section
- Benefits explanation specific to wellness/fitness/events
- Registration/enrollment button
- Points and pricing display
- Profile completion check before enrollment

**Key Features:**
- **Free Programs:** Many wellness and volunteering events are FREE
- **Points System:** Earn points for participation and completion
- **Category Filtering:** Easy tabs to switch between Wellness, Fitness, and Events
- **Growth Focus:** All programs designed to support professional and personal development
- **Healthcare-Specific:** Programs tailored to the unique needs of nurses and healthcare workers

### 4. Nightingale Champion Assessment (`NightingaleChampion.tsx`)

**Status:** Coming Soon in Phase 2 (as per recent updates)

**Planned Features:**
- **Assessment Overview:**
  - About the certification
  - Benefits and recognition
  - Assessment structure
  - Passing criteria
  - Certificate validity

- **Assessment Modules:**
  - Clinical Knowledge
  - Patient Care Excellence
  - Leadership & Management
  - Communication Skills
  - Ethical Practice
  - Evidence-Based Practice

- **Assessment Flow:**
  1. Eligibility check (experience, education)
  2. Registration and payment
  3. Study materials access
  4. Practice tests
  5. Schedule final assessment
  6. Proctored online exam
  7. Results and feedback
  8. Certificate generation
  9. Badge for profile

- **Certification Page:**
  - Certificate preview
  - Download/Share options
  - Verification QR code
  - Add to LinkedIn
  - Renewal information

### 5. News & Announcements (`NewsAnnouncements.tsx`)

**Categories:**
- All News
- Platform Updates
- Healthcare Industry News
- Success Stories
- Events & Webinars
- Policy & Regulations
- Research & Innovation

**Filtering & Search:**
- Category filter dropdown
- Date range filter
- Search by keywords
- Sort by (Latest, Most Viewed, Trending)

**News Card:**
- Featured image
- Headline
- Category badge
- Published date
- Author/Source
- Read time estimate
- Bookmark icon
- Share button
- View count

**Article View:**
- Full article content with rich text
- Hero image
- Author bio
- Related articles
- Comment section
- Share on social media
- Bookmark option
- Print/Download PDF

**Push Notifications:**
- Opt-in for news categories
- Breaking news alerts
- Daily digest option

### 6. Certifications (`Certifications.tsx`)

**My Certificates Dashboard:**
- Earned certificates grid
- In-progress certifications
- Recommended certifications
- Certificate categories:
  - Course Completion
  - Workshop Attendance
  - Mentorship Program
  - Nightingale Champion
  - Activity Participation
  - Skill Assessments

**Certificate Card:**
- Certificate preview image
- Certification name
- Issuing authority (NUON)
- Issue date
- Validity period
- Verification ID
- Download button
- Share button
- Verify online link

**Certificate Details:**
- Full certificate view
- Download as PDF
- Share on LinkedIn/Facebook
- Email certificate
- Print certificate
- QR code for verification
- Skills/competencies covered
- Renewal requirements (if applicable)

**Certificate Verification:**
- Public verification page
- Enter certificate ID
- Displays:
  - Recipient name
  - Certificate type
  - Issue date
  - Validity status
  - Issuing authority

### 7. Direct Mentor Registration (`DirectRegistration.tsx`)

**For Experienced Nurses to Become Mentors:**

**Eligibility Criteria:**
- Minimum 5 years experience
- Valid nursing registration
- Specialization/expertise area
- Good standing with nursing council

**Registration Form:**
1. **Professional Verification:**
   - Nursing license upload
   - Experience certificates
   - Qualification documents
   - Specialization proof

2. **Mentor Profile Setup:**
   - Professional photo
   - Detailed bio (200+ words)
   - Areas of expertise (multi-select)
   - Languages spoken
   - LinkedIn profile (optional)

3. **Availability & Pricing:**
   - Available days and time slots
   - Session duration preferences
   - Hourly rate setting
   - Package offers
   - Cancellation policy

4. **Bank Details:**
   - Account holder name
   - Account number
   - IFSC code
   - PAN card upload
   - GST details (if applicable)

5. **Agreement & Terms:**
   - Mentor code of conduct
   - Privacy policy
   - Payment terms
   - Quality standards
   - Background verification consent

**Review Process:**
- Application submitted
- Document verification (2-3 days)
- Video interview scheduling
- Approval/Rejection notification
- Mentor onboarding session
- Profile goes live

**Mentor Dashboard (Post-Approval):**
- Booking requests
- Session schedule
- Earnings summary
- Student feedback
- Profile analytics
- Availability management
- Payout history

### 8. Referral Program (`Referral.tsx`)

**Referral Dashboard:**
- Your unique referral code
- Referral link with copy button
- QR code for easy sharing
- Social share buttons (WhatsApp, Facebook, Twitter, Email)

**Referral Stats:**
- Total referrals sent
- Successful sign-ups
- Active users from referrals
- Total rewards earned
- Pending rewards
- Rewards history

**Reward Structure:**
- ₹100 for each successful referral sign-up
- Additional ₹200 when referee completes first course
- Bonus rewards for milestones (5, 10, 25, 50 referrals)
- Rewards credited to NUON wallet

**Referral Tracking:**
- List of referred users (name hidden for privacy)
- Sign-up date
- Status (Signed Up / Active / Course Completed)
- Reward earned per referral
- Reward status (Pending / Credited)

**How It Works Section:**
1. Share your unique code/link
2. Friend signs up using your code
3. You get ₹100 instantly
4. Friend completes profile → You get ₹50 bonus
5. Friend completes first course → You get ₹200 more
6. Both of you benefit!

**Terms & Conditions:**
- Referral program rules
- Fraud prevention
- Reward expiry policy
- Withdrawal limits

---

## 💳 Payment & Orders

### Payment Processing (`Payment.tsx`)

**Payment Flow:**
1. **Cart/Order Summary:**
   - Item details (course/mentorship/certification)
   - Base price
   - Tax breakdown (GST 18%)
   - Total amount

2. **Coupon Code Section:**
   - Apply coupon input
   - Validate coupon
   - Show discount applied
   - Remove coupon option
   - Available coupons list

3. **Referral Code Section:**
   - Apply referral code
   - Referral discount (₹50-200)
   - Cannot combine with coupon
   - Referrer gets credit

4. **Payment Methods:**
   - NUON Wallet (if balance available)
   - UPI (GPay, PhonePe, Paytm)
   - Credit/Debit Card
   - Net Banking
   - EMI options (for ₹3000+)

5. **Order Review:**
   - Final amount breakdown
   - Payment method selected
   - Billing address
   - Terms acceptance checkbox
   - "Proceed to Pay" button

6. **Payment Processing:**
   - Secure payment gateway (mock)
   - Processing animation
   - Success/Failure handling
   - Transaction ID generation

7. **Payment Confirmation:**
   - Success animation with celebration confetti
   - Order ID and transaction details
   - Receipt download
   - Email confirmation sent
   - Access granted to purchased item

**Mock Payment:**
- Any card number works
- CVV: Any 3 digits
- Expiry: Any future date
- OTP: 123456

### Celebration Modal (`CelebrationModal.tsx`)
Triggered on successful actions:
- Payment completion
- Course completion
- Certificate earned
- Milestone achieved
- Assessment passed

**Features:**
- Confetti animation
- Success message
- Animated icon (trophy, star, certificate)
- Neon glow effects
- Sound effect (optional)
- Next steps CTA
- Share achievement button

### Order History (`OrderHistory.tsx`)

**Order List:**
- All orders in reverse chronological order
- Filter by:
  - Order type (Course, Mentorship, Certification)
  - Date range
  - Payment status
  - Amount range

**Order Card:**
- Order ID
- Item name and thumbnail
- Order date and time
- Amount paid
- Payment method
- Status badge (Completed/Pending/Refunded)
- "View Receipt" button
- "Download Invoice" button

**Order Details:**
- Complete transaction details
- Itemized billing
- Taxes and discounts
- Payment timeline
- Refund status (if applicable)
- Support contact for issues

**Invoice Generation:**
- Professional invoice PDF
- Company details (NUON)
- Customer details
- Itemized charges
- GST breakdown
- Payment method
- Transaction ID
- Download and email options

---

## 👤 Profile & Settings

### Profile View (`Profile.tsx`)

**Profile Header:**
- Large profile photo (with edit icon)
- Name and designation
- Registration number
- Experience badge
- Member since date
- Edit profile button

**Stats Section:**
- Courses completed
- Certifications earned
- Mentorship hours
- Learning streak (days)
- Total points/badges

**Profile Information:**
- Personal details
- Professional details
- Location
- Contact information
- Interests and specializations

**Certifications Preview:**
- Latest 3 certificates
- "View All Certifications" link

**Activity Timeline:**
- Recent courses
- Recent sessions
- Recent achievements
- Recent activities

**Quick Actions:**
- Edit Profile
- My Orders
- Referral Program
- Settings
- Help & Support
- Logout

### Profile Edit (`ProfileEdit.tsx`)

**Editable Sections:**
1. **Profile Photo:**
   - Upload new photo
   - Crop and adjust
   - Remove photo option
   - Photo guidelines

2. **Personal Information:**
   - Name (required)
   - Email (required, verified)
   - Phone (readonly after verification)
   - Date of Birth
   - Gender

3. **Professional Details:**
   - Registration number
   - Council
   - Experience
   - Current designation
   - Specialization
   - Institution
   - City and state

4. **Interests & Preferences:**
   - Areas of interest (multi-select)
   - Learning goals
   - Preferred learning format
   - Notification preferences

5. **Privacy Settings:**
   - Profile visibility
   - Show contact info
   - Allow messages from mentors
   - Show activity to others

6. **Account Settings:**
   - Change password
   - Email notifications toggle
   - Push notifications toggle
   - SMS alerts toggle
   - Language preference
   - Timezone

**Save Changes:**
- Validate form
- Update localStorage
- Show success toast
- Return to profile view

### Profile Completion Prompt (`ProfileCompletionPrompt.tsx`)

**Triggered When:**
- User tries to access locked features
- Profile completion < 100%
- Professional info skipped during onboarding

**Prompt Content:**
- Current completion percentage
- Missing fields list
- Benefits of completing profile:
  - Better course recommendations
  - Mentor matching
  - Certificate generation
  - Community features
- "Complete Now" CTA button
- "Remind Me Later" option
- "Don't Show Again" option

**Completion Checklist:**
- ✓ Phone verified
- ✓ Basic info added
- ⚠ Professional details (skipped)
- ✓ Location added
- ✓ Interests selected
- ⚠ Profile photo (optional)
- ⚠ Bio/Goals (optional)

---

## 🔔 Notifications System (`Notifications.tsx`)

**Notification Categories:**
- Course Updates (new modules, assignments)
- Mentorship (bookings, reminders, cancellations)
- Activities (new activities, deadlines, results)
- Announcements (platform news, updates)
- Social (comments, likes, mentions)
- Achievements (certificates, badges, milestones)
- Payment (successful, failed, refunds)
- System (maintenance, updates, security)

**Notification Card:**
- Icon based on category (color-coded)
- Title and message
- Timestamp (relative: "2 hours ago")
- Read/Unread indicator
- Action button (View, Join, Download, etc.)
- Dismiss option

**Notification Actions:**
- Mark as read
- Mark all as read
- Delete notification
- Notification settings
- Navigate to relevant section

**Notification Badge:**
- Red badge on bell icon
- Shows unread count
- Updates in real-time
- Maximum display: 99+

**Notification Preferences:**
- Enable/disable per category
- Email notifications
- Push notifications
- SMS notifications
- Notification sound
- Do Not Disturb schedule

**Data Structure:**
```json
{
  "id": "notif_123",
  "category": "mentorship",
  "title": "Session Reminder",
  "message": "Your session with Dr. Sharma starts in 15 minutes",
  "timestamp": 1699363200000,
  "read": false,
  "actionType": "join_session",
  "actionData": { "sessionId": "sess_456" },
  "icon": "calendar",
  "priority": "high"
}
```

---

## ℹ️ Help & Support (`Help.tsx`)

**Help Center:**
- Search help articles
- Browse by category:
  - Getting Started
  - Courses & Learning
  - Mentorship Sessions
  - Payments & Refunds
  - Certifications
  - Account & Profile
  - Technical Issues
  - Policies & Guidelines

**FAQ Section:**
- Expandable accordion
- Most common questions
- Clear answers with screenshots
- Related articles links

**Contact Support:**
- Live chat (mock)
- Email support form
- Phone support number
- WhatsApp support
- Support hours

**Submit Ticket:**
- Issue category dropdown
- Subject line
- Detailed description
- Attach screenshots
- Priority level
- Submit button
- Track ticket status

**Useful Links:**
- Terms of Service
- Privacy Policy
- Refund Policy
- Community Guidelines
- Safety & Security
- Accessibility

**Video Tutorials:**
- How to register
- Booking a mentor session
- Taking a course
- Earning certificates
- Using the platform

**Feedback:**
- Rate your experience
- Suggest new features
- Report bugs
- Testimonials

---

## 🎯 Bottom Navigation (`BottomNav.tsx`)

**5 Main Tabs (Fixed Bottom Bar):**

1. **Home** 
   - Icon: House
   - Route: Dashboard
   - Active: Gradient purple

2. **Learning**
   - Icon: Book Open
   - Route: My Learning
   - Badge: Courses in progress count

3. **Mentors**
   - Icon: Users
   - Route: Mentorship Sessions
   - Badge: Upcoming sessions count

4. **Activities**
   - Icon: Sparkles
   - Route: Activities
   - Badge: Active activities count

5. **Profile**
   - Icon: User
   - Route: Profile
   - Badge: Profile completion indicator

**Interaction:**
- Smooth transitions between tabs
- Active tab highlighted with neon glow
- Icon animations on tap
- Badge notifications
- Haptic feedback (mobile)

**State Persistence:**
- Current tab saved in localStorage
- Remembers position on reload
- Deep linking support

---

## 💾 Data Persistence & Management

### LocalStorage Structure

**1. Authentication:**
```json
{
  "isAuthenticated": true,
  "phoneNumber": "+91XXXXXXXXXX",
  "authToken": "mock_token_123",
  "loginTimestamp": 1699363200000
}
```

**2. User Profile (`nurseProfile`):**
```json
{
  "phone": "+91XXXXXXXXXX",
  "name": "Priya Sharma",
  "email": "priya.sharma@example.com",
  "dob": "1995-05-15",
  "gender": "Female",
  "profilePhoto": "base64_string_or_url",
  "registrationNumber": "MH/2020/12345",
  "council": "Maharashtra Nursing Council",
  "experience": 5,
  "designation": "Staff Nurse",
  "specialization": "Critical Care",
  "city": "Mumbai",
  "state": "Maharashtra",
  "institution": "Lilavati Hospital",
  "institutionType": "Private",
  "interests": ["Critical Care", "Emergency Care", "ICU"],
  "goals": "I want to advance my critical care skills...",
  "source": "Social Media",
  "profileComplete": true,
  "registeredAt": 1699363200000,
  "lastUpdated": 1699449600000
}
```

**3. Course Progress:**
```json
{
  "enrolledCourses": [
    {
      "courseId": "course_001",
      "title": "Advanced ICU Care",
      "enrolledDate": 1699363200000,
      "progress": 45,
      "completedModules": [1, 2, 3],
      "totalModules": 8,
      "lastAccessed": 1699449600000
    }
  ]
}
```

**4. Mentorship Data:**
```json
{
  "bookedSessions": [
    {
      "sessionId": "sess_001",
      "mentorId": "mentor_123",
      "mentorName": "Dr. Anjali Mehta",
      "date": "2024-11-15",
      "time": "14:00",
      "duration": 60,
      "status": "upcoming",
      "meetingLink": "https://meet.nuon.app/sess_001"
    }
  ],
  "completedSessions": [],
  "sessionFeedback": []
}
```

**5. Notifications:**
```json
{
  "notifications": [
    {
      "id": "notif_001",
      "category": "course",
      "title": "New Module Available",
      "message": "Module 4 is now available in Advanced ICU Care",
      "timestamp": 1699449600000,
      "read": false,
      "actionType": "view_course",
      "actionData": { "courseId": "course_001" }
    }
  ],
  "unreadCount": 5
}
```

**6. Wallet & Payments:**
```json
{
  "wallet": {
    "balance": 500,
    "currency": "INR",
    "transactions": []
  },
  "orders": [
    {
      "orderId": "ORD_001",
      "type": "course",
      "itemId": "course_001",
      "itemName": "Advanced ICU Care",
      "amount": 2999,
      "discount": 300,
      "total": 2699,
      "paymentMethod": "UPI",
      "status": "completed",
      "date": 1699363200000,
      "transactionId": "TXN_123456"
    }
  ]
}
```

**7. App Settings:**
```json
{
  "currentScreen": "dashboard",
  "theme": "dark",
  "language": "en",
  "notifications": {
    "email": true,
    "push": true,
    "sms": false
  },
  "preferences": {
    "autoPlayVideos": true,
    "downloadQuality": "high",
    "showCelebrations": true
  }
}
```

**8. Referral Data:**
```json
{
  "referralCode": "PRIYA2024",
  "referrals": [
    {
      "name": "User***",
      "signupDate": 1699363200000,
      "status": "active",
      "reward": 100,
      "rewardStatus": "credited"
    }
  ],
  "totalEarnings": 500
}
```

---

## 🎭 Mock Data & Examples

### Sample Courses
```javascript
const courses = [
  {
    id: 'course_001',
    title: 'Advanced Critical Care Nursing',
    instructor: 'Dr. Anjali Mehta',
    duration: '12 hours',
    modules: 8,
    rating: 4.8,
    reviews: 234,
    price: 2999,
    thumbnail: 'unsplash:icu medical equipment',
    category: 'Critical Care',
    level: 'Advanced',
    enrolled: 1245
  },
  // ... more courses
];
```

### Sample Mentors
```javascript
const mentors = [
  {
    id: 'mentor_001',
    name: 'Dr. Anjali Mehta',
    designation: 'Senior Nursing Officer',
    specialization: ['Critical Care', 'ICU', 'Emergency'],
    experience: 15,
    rating: 4.9,
    reviews: 187,
    hourlyRate: 500,
    languages: ['English', 'Hindi', 'Marathi'],
    avatar: 'unsplash:professional nurse',
    bio: 'Experienced ICU specialist with 15+ years...',
    availability: ['Mon', 'Wed', 'Fri']
  },
  // ... more mentors
];
```

### Sample Activities
```javascript
const activities = [
  {
    id: 'activity_001',
    title: 'Case Study Challenge: Emergency Response',
    category: 'Case Study',
    participants: 156,
    startDate: '2024-11-10',
    endDate: '2024-11-20',
    difficulty: 'Intermediate',
    points: 500,
    description: 'Analyze and discuss emergency scenarios...'
  },
  // ... more activities
];
```

---

## 🎬 Animations & Interactions

### Page Transitions
- Fade in on load
- Slide up for modals
- Slide from right for new screens
- Smooth 300ms transitions

### Button Interactions
- Scale on press (0.95)
- Neon glow on hover
- Gradient shift animation
- Ripple effect

### Loading States
- Skeleton loaders for cards
- Spinner for actions
- Progress bars for uploads
- Shimmer effect on placeholders

### Success Animations
- Confetti explosion (celebration modal)
- Check mark animation
- Badge/trophy float-in
- Neon pulse effect

### Micro-interactions
- Card hover lift
- Icon bounce on click
- Badge pulse (notifications)
- Progress bar fill animation
- Toast notifications slide in

---

## 📱 Mobile Optimization

### Responsive Design
- Mobile-first approach
- Max-width: 480px for mobile
- Touch-friendly buttons (min 44px)
- Swipe gestures support
- Bottom sheet modals

### Performance
- Lazy loading images
- Virtual scrolling for long lists
- Debounced search inputs
- Optimized re-renders
- Code splitting per route

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators
- Semantic HTML

### PWA Features (Future)
- Installable app
- Offline support
- Push notifications
- Background sync
- Cache management

---

## 🔒 Security & Privacy

### Data Security
- LocalStorage encryption (future)
- Secure payment gateway
- No PII in URLs
- Session timeout
- Logout on inactivity

### Privacy
- Privacy policy compliance
- Data deletion on request
- Opt-in for marketing
- Anonymous feedback
- Secure document uploads

### Content Security
- XSS prevention
- CSRF protection
- Input validation
- Sanitized user inputs
- Safe external links

---

## 🚀 Technical Stack

### Frontend Framework
- **React 18** with TypeScript
- **Tailwind CSS v4.0** for styling
- **Shadcn/UI** components
- **Lucide React** icons
- **Motion/React** for animations

### State Management
- React useState, useEffect hooks
- LocalStorage for persistence
- Context API (if needed)

### Routing
- Component-based routing
- State-managed navigation
- Deep linking support

### Form Handling
- React Hook Form v7.55.0
- Zod validation
- Custom validators

### UI Libraries
- Recharts (charts/graphs)
- React Slick (carousels)
- Sonner (toast notifications)
- React DnD (drag & drop)

### Date & Time
- date-fns for formatting
- Calendar component (shadcn)

### File Handling
- Base64 encoding for images
- File upload with preview
- Image compression

---

## 📋 Recent Updates & Changes

### Branding Update
- Changed from "Neon Club" to "NUON"
- New logo v3.0 with hanging lamp design
- Updated tagline to "Nurse United, Opportunities Nourished"
- Consistent branding across all screens

### UX Improvements
- Made professional information step skippable in onboarding
- Added profile photo next to greeting on dashboard
- Profile completion prompt for users who skipped steps
- Improved notification system with categories

### Feature Updates
- Nightingale Champion Assessment set to "Coming Soon - Phase 2"
- Enhanced mentor registration flow
- Added session feedback system
- Improved course viewer with progress tracking
- Added referral program with rewards

### Design Refinements
- Glassmorphism effects on all cards
- Neon glow on active elements
- Smooth animations throughout
- Better mobile responsiveness
- Celebration animations for achievements

---

## 🎯 User Personas

### Primary Users

**1. Priya - Staff Nurse (2-3 years experience)**
- Goals: Upskill in critical care, get certified
- Uses: Courses, mentorship, certifications
- Pain points: Limited time, budget constraints
- Motivation: Career advancement

**2. Dr. Anjali - Senior Nurse (10+ years experience)**
- Goals: Share knowledge, earn extra income
- Uses: Mentor registration, sessions, content creation
- Pain points: Finding mentees, scheduling
- Motivation: Give back to community

**3. Rahul - Nursing Student**
- Goals: Learn practical skills, network
- Uses: Free courses, activities, community
- Pain points: Lack of real-world experience
- Motivation: Prepare for first job

**4. Kavita - Nursing Manager (15+ years)**
- Goals: Leadership training, team development
- Uses: Advanced courses, webinars, certifications
- Pain points: Staying updated with trends
- Motivation: Professional excellence

---

## 📈 Key Features Summary

### ✅ Implemented
1. ✓ Splash screen with animated logo
2. ✓ Phone + OTP authentication
3. ✓ Multi-step nurse details form (with skip option)
4. ✓ Profile completion tracking
5. ✓ Dashboard with stats and quick actions
6. ✓ Course catalog and viewer
7. ✓ Mentor discovery and booking
8. ✓ Video mentorship sessions
9. ✓ Session feedback system
10. ✓ **Engage: Wellness, Fitness & Events** programs
11. ✓ Nightingale Champion (coming soon banner)
12. ✓ News & announcements with filtering
13. ✓ Certifications management
14. ✓ Direct mentor registration
15. ✓ Referral program with rewards
16. ✓ Payment processing with coupons
17. ✓ Order history and invoices
18. ✓ Celebration animations
19. ✓ Notification system
20. ✓ Profile management
21. ✓ Help & support center
22. ✓ Bottom navigation (5 tabs)
23. ✓ LocalStorage persistence
24. ✓ Responsive mobile design
25. ✓ Glassmorphism UI
26. ✓ Neon color scheme

### 🔮 Future Enhancements (Phase 2)
- Nightingale Champion Assessment (full implementation)
- Live streaming for events
- Community forums and discussions
- Peer-to-peer learning groups
- Gamification with badges and leaderboards
- AI-powered course recommendations
- Offline mode (PWA)
- Multi-language support
- Real-time chat with mentors
- Integration with nursing councils
- Certificate blockchain verification
- Advanced analytics dashboard
- Team/Organization accounts
- Content creator tools
- Mobile app (iOS/Android native)

---

## 🎨 Component Architecture

### Core Components (in `/components`)
- `SplashScreen.tsx` - App entry with logo animation
- `PhoneOTPAuth.tsx` - Authentication flow
- `NurseDetailsForm.tsx` - Onboarding form
- `NewDashboard.tsx` - Main dashboard
- `MyLearning.tsx` - Courses catalog
- `CourseViewer.tsx` - Video course player
- `WorkshopViewer.tsx` - Workshop interface
- `EventViewer.tsx` - Event details and streaming
- `MentorshipSessions.tsx` - Mentor discovery
- `BookingSlots.tsx` - Session booking
- `VideoSession.tsx` - Live mentorship session
- `SessionFeedback.tsx` - Post-session feedback
- `SessionPreparation.tsx` - Pre-session prep
- `RescheduleSession.tsx` - Session rescheduling
- `Engage.tsx` - Wellness, Fitness & Events catalog
- `EngageDetails.tsx` - Program/Event participation
- `NightingaleChampion.tsx` - Certification program
- `Certifications.tsx` - Certificate management
- `DirectRegistration.tsx` - Mentor registration
- `NewsAnnouncements.tsx` - News feed
- `Notifications.tsx` - Notification center
- `Payment.tsx` - Payment processing
- `OrderHistory.tsx` - Order tracking
- `CelebrationModal.tsx` - Success animations
- `Referral.tsx` - Referral program
- `Profile.tsx` - User profile view
- `ProfileEdit.tsx` - Profile editing
- `ProfileCompletionPrompt.tsx` - Completion nudge
- `Help.tsx` - Support center
- `BottomNav.tsx` - Navigation bar (5 tabs)
- `NuonLogo.tsx` - Logo components
- `LogoShowcase.tsx` - Logo documentation
- `ValueProposition.tsx` - Platform benefits

### UI Components (in `/components/ui`)
- 40+ Shadcn/UI components
- Pre-styled and accessible
- Consistent design system
- Dark mode support

---

## 📝 Usage Instructions

### For Developers

**1. Setup:**
```bash
npm install
npm run dev
```

**2. Test Flow:**
- App loads → Splash screen (3s)
- Phone: +91 followed by 10 digits
- OTP: 123456
- Complete nurse details form
- Explore dashboard and features

**3. Test Credentials:**
- Phone: Any valid format
- OTP: 123456
- Payment: Any card details
- All features work with mock data

**4. LocalStorage:**
- Check browser DevTools → Application → LocalStorage
- Keys: nurseProfile, enrolledCourses, notifications, wallet, etc.
- Clear localStorage to reset app state

### For Designers

**1. Design System:**
- Colors defined in `/styles/globals.css`
- Neon palette: purple, blue, cyan, pink
- Glassmorphism: `bg-white/10 backdrop-blur-md`
- Rounded corners: `rounded-xl`, `rounded-2xl`

**2. Typography:**
- Font: Inter (imported from Google Fonts)
- Sizes defined in globals.css
- No inline text-* classes unless specific need

**3. Spacing:**
- Consistent padding: p-4, p-6, p-8
- Gap between elements: gap-4, gap-6
- Margins for sections: mt-6, mb-8

**4. Components:**
- Reuse existing Shadcn components
- Maintain consistent styling
- Follow accessibility guidelines

---

## 🎓 Learning Objectives

NUON aims to help nurses:
1. **Upskill** through quality courses and workshops
2. **Connect** with experienced mentors for guidance
3. **Certify** their expertise with recognized credentials
4. **Engage** in community activities and challenges
5. **Advance** their careers with continuous learning
6. **Network** with peers and industry leaders
7. **Stay Updated** with latest healthcare trends
8. **Earn** through mentorship and content creation (for experienced nurses)

---

## 🌟 Brand Values

**N**urturing Excellence
**U**nited in Purpose  
**O**pportunities for All  
**N**ursing with Pride

---

## 📞 Support & Community

- **Email:** support@nuon.app
- **Phone:** +91-XXXX-XXXXXX
- **WhatsApp:** +91-XXXX-XXXXXX
- **Website:** www.nuon.app
- **Social Media:** @nuonapp (Twitter, Facebook, Instagram, LinkedIn)

---

## 📄 License & Attribution

- Shadcn/UI components (MIT License)
- Lucide Icons (ISC License)
- Tailwind CSS (MIT License)
- React & React packages (MIT License)
- Unsplash images (Unsplash License)

---

## 🎯 Success Metrics (Future)

- User registrations
- Course completion rates
- Mentorship session bookings
- Certification achievements
- User satisfaction (NPS score)
- Engagement rates
- Referral conversions
- Revenue (course sales, mentorships)
- Content quality ratings
- Community participation

---

## 🏆 Conclusion

NUON is a comprehensive, mobile-first learning platform designed specifically for nurses to unite, learn, grow, and advance their careers. With a vibrant neon-themed glassmorphic design, intuitive user flows, and rich features covering courses, mentorship, certifications, activities, and community engagement, NUON provides a complete ecosystem for nursing professional development.

The platform honors the legacy of Florence Nightingale through its iconic lamp logo while embracing modern design and technology to empower the nursing community.

**Nurse United, Opportunities Nourished** 🏮✨

---

*Last Updated: November 7, 2024*
*Version: 3.0*
*Status: Production Ready*
