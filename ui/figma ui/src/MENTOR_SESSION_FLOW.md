# Complete Mentor Session Flow

## 📋 Overview
This document outlines the complete flow for scheduling and attending mentorship sessions in the Neon Club app.

---

## 🔄 Complete User Journey

### **1. Discovering Mentors**

#### Path A: From Dashboard
- Dashboard → Browse mentors in "Latest News" or quick access
- Click "Mentorship" bottom nav

#### Path B: From Activities Tab
- Previously had mentor browsing (now moved to dedicated Mentorship section)

---

### **2. Mentorship Section**
**Location**: Bottom Nav → "Mentors"

**Two Main Tabs**:

#### **Tab 1: Browse Mentors**
Shows available mentors with:
- Profile photo
- Name and specialization
- Experience (e.g., "15+ years")
- Rating (⭐ 4.9)
- Number of sessions completed
- Availability status

**Actions**:
- **View Profile** → Activity Details Page
- **Book Session** → Booking Slots Page

---

### **3. Booking Flow** 🗓️

#### **Step 1: Booking Slots Page**
**Displays**:
- Mentor info card (photo, name, specialization, price)
- Date selector (horizontal scroll)
  - Shows 5 available dates
  - Wed 16, Thu 17, Fri 18, etc.
- Time slot grid (changes based on selected date)
  - Available slots (clickable)
  - Booked slots (disabled, grayed out)
  - Selected slot (purple highlight with checkmark)
- Booking summary card
  - Mentor, Date, Time, Session Fee

**Actions**:
- Select date → View time slots for that date
- Select time slot → Enable "Proceed to Payment"
- Click "Proceed to Payment" → Payment Page

#### **Step 2: Payment Page**
- Shows booking details
- Payment method selection
- Process payment
- **On Success** → Celebration Modal
- **Then** → Back to Mentorship (My Sessions tab)

---

### **4. My Sessions Tab**
**Location**: Mentorship → "My Sessions" Tab

Shows upcoming booked sessions with:
- Mentor photo
- Mentor name
- Session topic
- Date and time
- Duration
- Session type (Video Call badge)

**Actions Per Session**:

#### **A. Reschedule Button**
**Flow**: My Sessions → Click "Reschedule" → Reschedule Session Page

**Reschedule Session Page**:
1. Shows current booking details (orange warning banner)
2. Select new date (horizontal date picker)
3. Select new time slot (grid layout)
4. View new schedule summary (green confirmation card)
5. Click "Confirm Reschedule"
6. **Success**: Celebration Modal → Back to My Sessions
7. **Note**: "No charges for rescheduling"

#### **B. Join Session Button**
**Flow**: My Sessions → Click "Join Session" → Session Preparation → Video Session

---

### **5. Session Preparation Page** 🎥
**Purpose**: Pre-flight checks before joining

**Displays**:
- Session info card (topic, mentor, date, time)
- Countdown timer (if session starting soon)
- System check:
  - ✅ Microphone (working/not accessible)
  - ✅ Camera (working/not accessible)
  - ✅ Internet connection (signal strength)
- Session tips card:
  - Find quiet space
  - Good lighting
  - Camera at eye level
  - Questions ready
  - Test audio

**Actions**:
- Can only join if:
  - All permissions granted
  - Session time window open (5 min before)
- Click "Join Session Now" → Video Session Page
- Click "Back to Sessions" → Return to My Sessions

---

### **6. Video Session Page** 📹
**Full Video Call Interface**

**Features**:

#### **Header**:
- Back button (← ends session)
- Session topic
- Mentor name
- Session timer (00:00 counting up)

#### **Video Display**:
- **Main Video**: Mentor's video (full screen)
  - Mentor name badge
  - Connection status (green "Connected")
- **Self Video**: Picture-in-picture (bottom right)
  - Your video preview
  - "You" label
  - Can be turned off

#### **Control Bar** (Bottom):
1. **Microphone Toggle**
   - On: Gray button with mic icon
   - Off: Red button with mic-off icon

2. **Video Toggle**
   - On: Gray button with video icon
   - Off: Red button with video-off icon

3. **Chat Toggle**
   - Opens chat sidebar
   - Can send messages

4. **Switch Camera**
   - Toggle front/back camera

5. **End Call** (Red Button)
   - Large red circular button
   - Phone icon rotated
   - Ends session

#### **Session Info**:
- Participant count (2 participants)
- Session duration (45 mins session)

#### **Chat Sidebar** (Optional):
- Slide-in from right
- Shows messages
- Can type and send messages
- Close button to hide

**Actions**:
- Control audio/video
- Chat with mentor
- End session → Celebration Modal (200 points) → Back to My Sessions

---

## 🎯 Complete Flow Diagram

```
DASHBOARD
    ↓
MENTORSHIP SECTION
    ├─→ Browse Mentors Tab
    │   ├─→ View Profile → Activity Details
    │   └─→ Book Session → BOOKING SLOTS
    │                       ↓
    │                   Select Date & Time
    │                       ↓
    │                   PAYMENT
    │                       ↓
    │                   ✨ Celebration Modal
    │                       ↓
    └─→ My Sessions Tab ← (Shows booked session)
        ├─→ Reschedule → RESCHEDULE SESSION
        │                   ↓
        │               Select New Date & Time
        │                   ↓
        │               ✨ Celebration Modal
        │                   ↓
        │               My Sessions Tab
        │
        └─→ Join Session → SESSION PREPARATION
                            ↓
                        System Checks
                        (Mic, Camera, Internet)
                            ↓
                        VIDEO SESSION
                        ├─ Video Controls
                        ├─ Chat
                        └─ End Call
                            ↓
                        ✨ Celebration Modal (+200 points)
                            ↓
                        My Sessions Tab
```

---

## 📱 Key Pages Summary

| Page | Purpose | Key Actions |
|------|---------|-------------|
| **Mentorship** | Browse mentors & view sessions | Browse, View Profile, Book, Reschedule, Join |
| **Booking Slots** | Select date/time for session | Pick date, Pick time, Proceed to payment |
| **Payment** | Process booking payment | Complete payment |
| **Reschedule Session** | Change session date/time | Select new slot, Confirm |
| **Session Preparation** | Pre-flight checks | Check permissions, Join when ready |
| **Video Session** | Live video call | Control A/V, Chat, End call |

---

## ✨ Celebration Moments

The app celebrates these achievements:

1. **Successful Booking**: After payment
2. **Successful Reschedule**: After confirming new time
3. **Session Complete**: After ending video call (+200 points)

---

## 🎨 Design Highlights

- **Purple/Pink/Orange**: Primary gradient theme
- **Cyan/Teal/Green**: Mentor application banner
- **Green**: Active sessions, join buttons
- **Orange**: Reschedule warnings
- **Red**: End call, disabled features
- **Glassmorphism**: Throughout for modern feel
- **Smooth Animations**: All transitions
- **Mobile-First**: Optimized for phone screens

---

## 🔐 Permissions & Requirements

- **Camera Access**: Required for video sessions
- **Microphone Access**: Required for video sessions
- **Internet Connection**: Required (checked automatically)
- **Session Window**: Can join 5 minutes before scheduled time

---

## 💡 Tips for Users

1. **Before Booking**: Check mentor profile and reviews
2. **Before Session**: Test camera/mic in preparation page
3. **During Session**: Use chat for questions if needed
4. **After Session**: Rate the mentor (future feature)
5. **Rescheduling**: Free up to 2 hours before session

---

## 🚀 Future Enhancements (Not Yet Implemented)

- Screen sharing during sessions
- Recording sessions (with consent)
- Session notes/summaries
- Mentor rating after session
- Group mentorship sessions
- Scheduled recurring sessions
- Session reminders/notifications

---

**Last Updated**: October 2024
**Version**: 1.0
