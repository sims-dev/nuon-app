# NUON Notification System - Comprehensive Guide

## Overview
This document provides a complete specification for the NUON notification system, covering both **Push Notifications** (in-app and mobile) and **SMS Notifications** for nurses using the healthcare professional platform.

---

## 1. Notification Types & Categories

### 1.1 Session & Mentorship Notifications
**Purpose**: Keep users informed about their mentorship sessions

| Type | Trigger | Priority | Channels |
|------|---------|----------|----------|
| Session Reminder - 24h | 24 hours before session | Medium | Push + SMS |
| Session Reminder - 1h | 1 hour before session | High | Push + SMS |
| Session Reminder - 15min | 15 minutes before session | Urgent | Push Only |
| Session Confirmed | Booking confirmed | Medium | Push + SMS |
| Session Cancelled | Session cancelled by mentor/nurse | High | Push + SMS |
| Session Rescheduled | Session time changed | High | Push + SMS |
| Session Starting | Session about to begin | Urgent | Push Only |
| Session Feedback Request | 30 minutes after session ends | Low | Push Only |
| Mentor Response | Mentor responds to booking request | High | Push + SMS |

**Content Templates:**

**SMS - Session Reminder 24h:**
```
Hi [Name], reminder: Your mentorship session with [Mentor Name] is tomorrow at [Time]. Topic: [Session Topic]. Join via NUON app. - NUON
```

**Push - Session Reminder 24h:**
```
Title: Upcoming Session Tomorrow 📅
Body: Your session with [Mentor Name] starts tomorrow at [Time]. Topic: [Session Topic]
Action: View Details
```

**SMS - Session Reminder 1h:**
```
Hi [Name], your session with [Mentor Name] starts in 1 hour ([Time]). Be ready! Link: [app_link]. - NUON
```

**Push - Session Reminder 1h:**
```
Title: Session Starting Soon! ⏰
Body: Your mentorship session with [Mentor Name] begins in 1 hour
Action: Join Now | Reschedule
```

**SMS - Session Confirmed:**
```
Great news [Name]! Your session with [Mentor Name] is confirmed for [Date] at [Time]. We'll remind you closer to the time. - NUON
```

---

### 1.2 Course & Learning Notifications
**Purpose**: Engage users with their learning journey

| Type | Trigger | Priority | Channels |
|------|---------|----------|----------|
| Course Enrolled | Successfully enrolled in course | Medium | Push Only |
| New Module Unlocked | Previous module completed | Medium | Push Only |
| Course Progress | 25%, 50%, 75% milestones | Low | Push Only |
| Course Completion | 100% course completed | High | Push + SMS |
| Assignment Due Soon | 3 days, 1 day, 6 hours before deadline | High | Push + SMS (1 day) |
| Assignment Submitted | Assignment successfully submitted | Low | Push Only |
| Certificate Available | Course completed & certificate ready | High | Push + SMS |
| New Course Recommendation | Personalized course suggestion | Low | Push Only |
| Course Update | Content updated in enrolled course | Low | Push Only |

**Content Templates:**

**SMS - Course Completion:**
```
Congratulations [Name]! You've completed [Course Name]! 🎉 Your certificate is ready to download in the NUON app. - NUON
```

**Push - Course Completion:**
```
Title: Course Completed! 🎓✨
Body: Amazing work! You've completed [Course Name]. Download your certificate now!
Action: View Certificate
```

**SMS - Assignment Due:**
```
Hi [Name], reminder: Your assignment for [Course Name] is due tomorrow at [Time]. Submit via NUON app. - NUON
```

**Push - New Module Unlocked:**
```
Title: New Content Available! 📚
Body: Great progress! Module [Number]: [Module Name] is now unlocked in [Course Name]
Action: Start Learning
```

---

### 1.3 Event & Workshop Notifications
**Purpose**: Keep users informed about upcoming events

| Type | Trigger | Priority | Channels |
|------|---------|----------|----------|
| Event Registered | Successfully registered | Medium | Push + SMS |
| Event Reminder - 7 days | 7 days before event | Low | Push Only |
| Event Reminder - 24h | 24 hours before event | Medium | Push + SMS |
| Event Reminder - 1h | 1 hour before event | High | Push Only |
| Event Cancelled | Event cancelled | Urgent | Push + SMS |
| Event Rescheduled | Event date/time changed | High | Push + SMS |
| Event Live Now | Event is starting | Urgent | Push Only |
| Event Recording Available | Recording uploaded post-event | Low | Push Only |
| New Event Available | New event matching interests | Low | Push Only |

**Content Templates:**

**SMS - Event Registration:**
```
Hi [Name], you're registered for [Event Name] on [Date] at [Time]. Location: [Venue/Online]. Looking forward to seeing you! - NUON
```

**Push - Event Registration:**
```
Title: Registration Confirmed! ✓
Body: You're all set for [Event Name] on [Date] at [Time]
Action: Add to Calendar | View Details
```

**SMS - Event Reminder 24h:**
```
Tomorrow: [Event Name] at [Time]. [Venue/Link]. Don't miss out [Name]! Open NUON app for details. - NUON
```

**Push - Event Live:**
```
Title: [Event Name] is Live Now! 🔴
Body: Join now and don't miss out on this amazing session
Action: Join Event
```

---

### 1.4 Achievement & Milestone Notifications
**Purpose**: Celebrate user accomplishments and motivate continued engagement

| Type | Trigger | Priority | Channels |
|------|---------|----------|----------|
| Badge Earned | User meets badge criteria | Medium | Push Only |
| Streak Milestone | 7, 30, 60, 100 day streaks | Medium | Push Only |
| Certification Earned | Complete certification program | High | Push + SMS |
| Level Up | User progresses to next level | Medium | Push Only |
| First Achievement | User's first badge/milestone | High | Push Only |
| Leaderboard Position | Top 10 in category | Low | Push Only |

**Content Templates:**

**SMS - Certification Earned:**
```
Congratulations [Name]! You're now certified in [Certification Name]! 🏆 Share your achievement and download certificate via NUON. - NUON
```

**Push - Badge Earned:**
```
Title: New Badge Unlocked! 🎖️
Body: Congratulations! You earned the "[Badge Name]" badge for [Achievement]
Action: View Badge | Share
```

**Push - Streak Milestone:**
```
Title: [Number] Day Streak! 🔥
Body: Amazing dedication! You've logged in for [Number] consecutive days. Keep it up!
Action: View Progress
```

---

### 1.5 Payment & Transaction Notifications
**Purpose**: Confirm financial transactions and purchases

| Type | Trigger | Priority | Channels |
|------|---------|----------|----------|
| Payment Successful | Payment processed | High | Push + SMS |
| Payment Failed | Payment declined/failed | Urgent | Push + SMS |
| Refund Processed | Refund completed | Medium | Push + SMS |
| Discount Applied | Referral/coupon code used | Low | Push Only |
| Invoice Available | Invoice generated | Low | Push Only |
| Subscription Renewal | 7 days before renewal | Medium | Push + SMS |

**Content Templates:**

**SMS - Payment Successful:**
```
Hi [Name], payment of ₹[Amount] received for [Item Name]. Receipt sent to your email. Thank you! - NUON
```

**Push - Payment Successful:**
```
Title: Payment Successful ✓
Body: ₹[Amount] paid for [Item Name]. You now have full access!
Action: View Receipt
```

**SMS - Payment Failed:**
```
[Name], your payment of ₹[Amount] for [Item] failed. Please update payment method in NUON app and try again. - NUON
```

**Push - Discount Applied:**
```
Title: Discount Applied! 🎉
Body: You saved ₹[Amount] using [Code Name]. Total: ₹[Final Amount]
Action: Complete Purchase
```

---

### 1.6 Community & Social Notifications
**Purpose**: Foster engagement and community interaction

| Type | Trigger | Priority | Channels |
|------|---------|----------|----------|
| New Connection | Someone connects with you | Low | Push Only |
| Mentor Approval | Approved as mentor | High | Push + SMS |
| Review Received | Someone reviews your session | Medium | Push Only |
| Reply to Comment | Response to your comment | Low | Push Only |
| New Follower | Someone follows you | Low | Push Only |

**Content Templates:**

**SMS - Mentor Approval:**
```
Congratulations [Name]! You're approved as a NUON mentor! Start accepting sessions and inspire fellow nurses. Login to get started. - NUON
```

**Push - New Connection:**
```
Title: New Connection! 👥
Body: [User Name] connected with you on NUON
Action: View Profile
```

---

### 1.7 System & Administrative Notifications
**Purpose**: Important system updates and administrative messages

| Type | Trigger | Priority | Channels |
|------|---------|----------|----------|
| Profile Incomplete | User skipped profile completion | Medium | Push Only (after 3 days) |
| Policy Update | Terms/Privacy policy changed | Medium | Push + Email |
| Maintenance Alert | Scheduled maintenance | High | Push + SMS |
| Security Alert | Suspicious activity detected | Urgent | Push + SMS |
| App Update Available | New version released | Low | Push Only |
| Welcome Message | New user onboarding | High | Push + SMS |

**Content Templates:**

**SMS - Welcome Message:**
```
Welcome to NUON, [Name]! 🎉 Join 10,000+ nurses growing their careers. Complete your profile to unlock personalized courses. - NUON
```

**Push - Profile Incomplete:**
```
Title: Complete Your Profile 👤
Body: Unlock personalized content! Add your professional details to get started
Action: Complete Profile
```

**SMS - Security Alert:**
```
NUON Security Alert: New login detected from [Location] on [Date]. If this wasn't you, secure your account immediately via the app. - NUON
```

---

### 1.8 News & Announcements
**Purpose**: Keep users informed about platform updates and healthcare news

| Type | Trigger | Priority | Channels |
|------|---------|----------|----------|
| New Feature Launch | New feature released | Medium | Push Only |
| Healthcare Update | Important industry news | Medium | Push Only |
| Collaboration Update | New hospital partner | Low | Push Only |
| Platform Announcement | Major updates | High | Push + SMS (important only) |

**Content Templates:**

**Push - New Feature:**
```
Title: New Feature Available! ✨
Body: Check out [Feature Name] - [Brief Description]
Action: Explore Now
```

---

## 2. Notification Timing Rules

### 2.1 Quiet Hours
- **Default**: No notifications between 10:00 PM - 7:00 AM (user's local time)
- **Exception**: Urgent notifications (session starting, security alerts)
- **User Configurable**: Users can customize quiet hours

### 2.2 Frequency Limits
- **Maximum per day**: 10 push notifications
- **Maximum per week**: 5 SMS (excluding transactional)
- **Batch Grouping**: Multiple updates grouped into digest (e.g., "3 new achievements")

### 2.3 Priority Queue
1. **Urgent**: Immediate delivery (security, session starting)
2. **High**: Within 5 minutes
3. **Medium**: Within 30 minutes
4. **Low**: Batched/scheduled for optimal time

---

## 3. User Flow Scenarios

### Scenario 1: New User Onboarding
```
Day 0: Phone verification → Welcome SMS + Push
Day 0: Profile completion → Encouragement push (if skipped)
Day 1: First course recommendation → Push
Day 3: Profile incomplete reminder → Push
Day 7: Weekly summary → Push
```

### Scenario 2: Mentorship Session Booking
```
Step 1: Booking request → Push confirmation
Step 2: Mentor accepts → Push + SMS
Step 3: 24h before → Push + SMS reminder
Step 4: 1h before → Push + SMS reminder
Step 5: 15min before → Push reminder
Step 6: Session joins → Welcome push
Step 7: Session ends → Feedback request push (30 min later)
```

### Scenario 3: Course Enrollment & Completion
```
Step 1: Enrollment → Push confirmation
Step 2: First module start → Push encouragement
Step 3: 25% progress → Push milestone
Step 4: 50% progress → Push milestone
Step 5: 75% progress → Push milestone
Step 6: Assignment due (1 day) → Push + SMS
Step 7: Course completion → Push + SMS + Certificate
```

### Scenario 4: Event Registration
```
Step 1: Registration → Push + SMS confirmation
Step 2: 7 days before → Push reminder
Step 3: 24h before → Push + SMS reminder
Step 4: 1h before → Push reminder
Step 5: Event live → Push alert
Step 6: Recording available → Push notification (next day)
```

### Scenario 5: Payment Flow
```
Step 1: Initiate payment → Processing message
Step 2: Success → Push + SMS confirmation + Receipt
Step 3: Failure → Push + SMS with retry options
Step 4: Access granted → Push confirmation
```

---

## 4. SMS vs Push Notification Guidelines

### Use SMS When:
- ✅ Time-sensitive (session reminders, event confirmations)
- ✅ Transactional (payments, registrations)
- ✅ High importance (security alerts, cancellations)
- ✅ Critical deadlines (assignment due, event starting soon)
- ✅ User may not have app open (external reminders)

### Use Push Only When:
- ✅ Engagement/motivation (achievements, progress)
- ✅ Content discovery (new courses, recommendations)
- ✅ Social interactions (connections, comments)
- ✅ Minor updates (badge earned, leaderboard)
- ✅ In-app activities (module unlocked)

### SMS Character Limits
- **Standard**: 160 characters
- **Segmented**: 153 characters per segment (for longer messages)
- **Include**: Brand name (NUON), actionable info, link if needed

---

## 5. Personalization Variables

All notifications should use these dynamic variables:

| Variable | Example |
|----------|---------|
| `[Name]` | Priya |
| `[First_Name]` | Priya |
| `[Mentor_Name]` | Dr. Anjali Reddy |
| `[Course_Name]` | Advanced Patient Care |
| `[Event_Name]` | Healthcare Summit 2024 |
| `[Date]` | October 15, 2024 |
| `[Time]` | 2:00 PM |
| `[Amount]` | ₹499 |
| `[Badge_Name]` | Week Warrior |
| `[Achievement]` | 7-day login streak |
| `[Location]` | Mumbai |
| `[Item_Name]` | Wound Care Workshop |

---

## 6. Opt-Out & Preferences

### User Notification Preferences (App Settings)
Users can toggle:
- ✅ Session Reminders (Push + SMS)
- ✅ Achievement Alerts (Push)
- ✅ Course Updates (Push)
- ✅ Task Reminders (Push + SMS)
- ✅ Announcements (Push)
- ✅ Email Notifications
- ✅ SMS Notifications (except transactional)

### Mandatory Notifications (Cannot be disabled):
- Security alerts
- Payment confirmations
- Account verification
- Terms of service updates

---

## 7. Error Handling & Fallbacks

### SMS Delivery Failures:
1. Retry once after 5 minutes
2. If failed again, send push notification
3. Log failure for review

### Push Notification Failures:
1. Queue for retry when device comes online
2. Expire after 7 days
3. Don't send if information is outdated (e.g., session already happened)

### Rate Limiting:
- If user receives 5+ notifications in 1 hour, batch remaining into digest
- Show "X new notifications" instead of individual alerts

---

## 8. Analytics & Tracking

Track the following metrics:
- **Delivery Rate**: % of notifications delivered successfully
- **Open Rate**: % of notifications opened
- **Conversion Rate**: % of notifications resulting in action
- **Opt-out Rate**: % of users disabling categories
- **Response Time**: Time from notification to action

---

## 9. Compliance & Privacy

### Data Protection:
- ✅ No personal health information (PHI) in SMS
- ✅ Generic subject lines for push notifications
- ✅ Secure links only (HTTPS)
- ✅ Opt-out link in every SMS

### SMS Format (Compliance):
```
[Message content]. Reply STOP to opt out. - NUON
```

### DND (Do Not Disturb) Compliance:
- Respect telecom DND registry
- Transactional SMS allowed on DND numbers
- Promotional SMS only to opted-in users

---

## 10. Testing Checklist

Before launching notifications:
- [ ] Test all notification types in staging
- [ ] Verify personalization variables populate correctly
- [ ] Check timing rules (quiet hours, frequency limits)
- [ ] Test opt-out functionality
- [ ] Verify SMS character counts
- [ ] Test push notification on iOS and Android
- [ ] Validate deeplinks work correctly
- [ ] Check notification grouping/batching
- [ ] Test failure/retry scenarios
- [ ] Verify analytics tracking

---

## 11. Implementation Priority

### Phase 1 (MVP):
1. Welcome notifications (SMS + Push)
2. Session reminders (24h, 1h)
3. Payment confirmations
4. Course completion
5. Profile incomplete reminder

### Phase 2:
1. Achievement notifications
2. Event reminders
3. Assignment deadlines
4. Security alerts
5. Community notifications

### Phase 3:
1. Advanced personalization
2. Digest notifications
3. Predictive notifications (AI-driven timing)
4. Multi-language support

---

## 12. Sample Notification Calendar (Weekly User Journey)

**Monday:**
- Morning: Weekly summary push
- Afternoon: Course recommendation push

**Tuesday:**
- Evening: Session reminder (24h) - SMS + Push

**Wednesday:**
- Afternoon: Session reminder (1h) - SMS + Push
- Evening: Session feedback request - Push

**Thursday:**
- Morning: Assignment due reminder - SMS + Push

**Friday:**
- Evening: Weekend event reminder - Push

**Saturday:**
- Afternoon: Progress milestone - Push

**Sunday:**
- Evening: Course completion - SMS + Push + Certificate

---

## 13. Support & Troubleshooting

### User Support:
- Help link in all notifications
- "Not receiving notifications?" troubleshooting guide
- Contact support: support@nuon.app

### Common Issues:
1. **Notifications not received**: Check app permissions, device settings
2. **Too many notifications**: Adjust frequency in settings
3. **Wrong time zone**: Update location in profile
4. **Language issues**: Set preferred language in app

---

## Conclusion

This notification system is designed to keep NUON users engaged, informed, and motivated throughout their healthcare professional journey while respecting their time and preferences. Regular review and optimization based on user feedback and analytics will ensure the system remains effective and user-friendly.

**Last Updated**: November 3, 2025
**Version**: 1.0
**Owner**: NUON Product Team
