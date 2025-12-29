# NUON Notification System - Quick Implementation Guide

## Overview
This is a practical, step-by-step guide for implementing the NUON notification system based on the comprehensive specifications in `NOTIFICATION_SYSTEM_GUIDE.md`.

---

## Phase 1: MVP Implementation (Week 1-2)

### Priority Notifications to Implement First:

1. **Welcome Notification** (Day 0)
2. **Session Reminders** (24h, 1h before)
3. **Payment Confirmations**
4. **Course Completion**
5. **Profile Incomplete Reminder** (Day 3)

---

## Step 1: Choose Notification Service Provider

### Recommended Services:

#### For SMS:
- **Twilio** (International, reliable)
- **MSG91** (India-focused, cost-effective)
- **Gupshup** (India-focused, good for healthcare)

#### For Push Notifications:
- **Firebase Cloud Messaging (FCM)** - Free, reliable, cross-platform
- **OneSignal** - Free tier available, easy integration
- **Amazon SNS** - Scalable, AWS ecosystem

### Decision Matrix:
| Provider | SMS | Push | Cost | Ease | Healthcare Compliant |
|----------|-----|------|------|------|---------------------|
| Twilio + FCM | ✓ | ✓ | $$ | ✓✓ | ✓ |
| MSG91 + OneSignal | ✓ | ✓ | $ | ✓✓✓ | ✓ |
| Gupshup + FCM | ✓ | ✓ | $ | ✓✓ | ✓✓ |

**Recommendation**: MSG91 for SMS + Firebase FCM for Push (India-focused, cost-effective)

---

## Step 2: Set Up Backend Infrastructure

### Database Schema

```sql
-- notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL, -- 'session_reminder', 'payment_success', etc.
  channel VARCHAR(20) NOT NULL, -- 'sms', 'push', 'email'
  title VARCHAR(255),
  body TEXT NOT NULL,
  data JSONB, -- Additional metadata
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- notification_preferences table
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) UNIQUE,
  sessions_push BOOLEAN DEFAULT TRUE,
  sessions_sms BOOLEAN DEFAULT TRUE,
  achievements_push BOOLEAN DEFAULT TRUE,
  courses_push BOOLEAN DEFAULT TRUE,
  tasks_push BOOLEAN DEFAULT TRUE,
  tasks_sms BOOLEAN DEFAULT FALSE,
  announcements_push BOOLEAN DEFAULT TRUE,
  email_enabled BOOLEAN DEFAULT FALSE,
  quiet_hours_start TIME DEFAULT '22:00:00',
  quiet_hours_end TIME DEFAULT '07:00:00',
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- notification_logs table (for analytics)
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY,
  notification_id UUID REFERENCES notifications(id),
  event VARCHAR(50) NOT NULL, -- 'sent', 'delivered', 'opened', 'failed'
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- notification_templates table
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY,
  type VARCHAR(50) UNIQUE NOT NULL,
  channel VARCHAR(20) NOT NULL,
  title_template VARCHAR(255),
  body_template TEXT NOT NULL,
  variables JSONB, -- List of variables used in template
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes (for performance):
```sql
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled_at ON notifications(scheduled_at);
CREATE INDEX idx_notification_logs_notification_id ON notification_logs(notification_id);
```

---

## Step 3: Backend API Endpoints

### Create these endpoints:

```typescript
// POST /api/notifications/send
// Send a notification immediately
{
  userId: string,
  type: string, // 'session_reminder_24h'
  channel: 'sms' | 'push' | 'both',
  data: Record<string, any> // Variables for template
}

// POST /api/notifications/schedule
// Schedule a notification for future
{
  userId: string,
  type: string,
  channel: 'sms' | 'push' | 'both',
  scheduledAt: string, // ISO timestamp
  data: Record<string, any>
}

// GET /api/notifications/user/:userId
// Get user's notification history
// Response: Array of notifications

// PATCH /api/notifications/preferences/:userId
// Update user notification preferences
{
  sessions_push: boolean,
  sessions_sms: boolean,
  // ... other preferences
}

// GET /api/notifications/preferences/:userId
// Get user notification preferences

// POST /api/notifications/mark-read/:notificationId
// Mark notification as read

// POST /api/notifications/mark-all-read/:userId
// Mark all notifications as read
```

---

## Step 4: Notification Service Implementation

### Core Service Structure:

```typescript
// services/notificationService.ts

interface NotificationPayload {
  userId: string;
  type: string;
  channel: 'sms' | 'push' | 'both';
  data: Record<string, any>;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
}

class NotificationService {
  
  // Main send function
  async send(payload: NotificationPayload) {
    // 1. Check user preferences
    const preferences = await this.getUserPreferences(payload.userId);
    
    // 2. Check quiet hours
    if (this.isQuietHours(preferences) && payload.priority !== 'urgent') {
      return this.schedule(payload, this.getNextActiveTime(preferences));
    }
    
    // 3. Check frequency limits
    if (await this.hasReachedLimit(payload.userId, payload.channel)) {
      return this.queue(payload);
    }
    
    // 4. Get template
    const template = await this.getTemplate(payload.type, payload.channel);
    
    // 5. Render message
    const message = this.renderTemplate(template, payload.data);
    
    // 6. Send via channel
    if (payload.channel === 'sms' || payload.channel === 'both') {
      await this.sendSMS(payload.userId, message);
    }
    
    if (payload.channel === 'push' || payload.channel === 'both') {
      await this.sendPush(payload.userId, message);
    }
    
    // 7. Log
    await this.log(payload, 'sent');
  }
  
  // Template rendering
  renderTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\[(\w+)\]/g, (match, key) => {
      return data[key] || match;
    });
  }
  
  // SMS sending
  async sendSMS(userId: string, message: string) {
    const user = await this.getUser(userId);
    
    // Using MSG91 example
    const response = await fetch('https://api.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: {
        'authkey': process.env.MSG91_AUTH_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        mobile: user.phone,
        message: message,
        sender: 'NUON',
        DLT_TE_ID: process.env.MSG91_TEMPLATE_ID
      })
    });
    
    return response.json();
  }
  
  // Push notification sending
  async sendPush(userId: string, message: { title: string, body: string }) {
    const deviceTokens = await this.getDeviceTokens(userId);
    
    // Using FCM example
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${process.env.FCM_SERVER_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        registration_ids: deviceTokens,
        notification: {
          title: message.title,
          body: message.body,
          icon: 'ic_notification',
          sound: 'default'
        },
        data: {
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          type: message.type
        }
      })
    });
    
    return response.json();
  }
  
  // Quiet hours check
  isQuietHours(preferences: UserPreferences): boolean {
    const now = new Date();
    const userTime = this.convertToUserTimezone(now, preferences.timezone);
    
    const start = this.parseTime(preferences.quiet_hours_start);
    const end = this.parseTime(preferences.quiet_hours_end);
    const current = userTime.getHours() * 60 + userTime.getMinutes();
    
    if (start < end) {
      return current >= start && current < end;
    } else {
      // Overnight quiet hours (e.g., 22:00 to 07:00)
      return current >= start || current < end;
    }
  }
  
  // Frequency limit check
  async hasReachedLimit(userId: string, channel: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (channel === 'push') {
      const count = await db.notifications.count({
        user_id: userId,
        channel: 'push',
        sent_at: { $gte: today },
        status: 'sent'
      });
      return count >= 10; // Max 10 push per day
    }
    
    if (channel === 'sms') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const count = await db.notifications.count({
        user_id: userId,
        channel: 'sms',
        sent_at: { $gte: weekAgo },
        status: 'sent'
      });
      return count >= 5; // Max 5 SMS per week
    }
    
    return false;
  }
}

export default new NotificationService();
```

---

## Step 5: Trigger Implementation

### Example Triggers:

#### 1. Welcome Notification (Phone Verification)
```typescript
// After successful OTP verification
async function onUserRegistered(userId: string, userData: any) {
  await notificationService.send({
    userId,
    type: 'welcome',
    channel: 'both',
    priority: 'high',
    data: {
      Name: userData.firstName,
      First_Name: userData.firstName
    }
  });
}
```

#### 2. Session Reminder (24h before)
```typescript
// Scheduled job (runs every hour)
async function checkUpcomingSessions() {
  const twentyFourHoursLater = new Date();
  twentyFourHoursLater.setHours(twentyFourHoursLater.getHours() + 24);
  
  const sessions = await db.sessions.find({
    start_time: {
      $gte: twentyFourHoursLater,
      $lt: new Date(twentyFourHoursLater.getTime() + 3600000) // +1 hour window
    },
    status: 'confirmed',
    reminder_24h_sent: false
  });
  
  for (const session of sessions) {
    await notificationService.send({
      userId: session.nurse_id,
      type: 'session_reminder_24h',
      channel: 'both',
      priority: 'medium',
      data: {
        Name: session.nurse_name,
        Mentor_Name: session.mentor_name,
        Time: formatTime(session.start_time),
        Date: formatDate(session.start_time),
        Session_Topic: session.topic
      }
    });
    
    // Mark as sent
    await db.sessions.update(
      { id: session.id },
      { reminder_24h_sent: true }
    );
  }
}
```

#### 3. Payment Confirmation
```typescript
// After successful payment
async function onPaymentSuccess(payment: Payment) {
  await notificationService.send({
    userId: payment.user_id,
    type: 'payment_success',
    channel: 'both',
    priority: 'high',
    data: {
      Name: payment.user_name,
      Amount: payment.amount,
      Item_Name: payment.item_name
    }
  });
}
```

#### 4. Profile Incomplete Reminder
```typescript
// Scheduled job (runs daily)
async function sendProfileReminders() {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  const users = await db.users.find({
    profile_incomplete: true,
    created_at: { $lte: threeDaysAgo },
    profile_reminder_sent: false
  });
  
  for (const user of users) {
    await notificationService.send({
      userId: user.id,
      type: 'profile_incomplete',
      channel: 'push',
      priority: 'medium',
      data: {
        Name: user.first_name
      }
    });
    
    await db.users.update(
      { id: user.id },
      { profile_reminder_sent: true }
    );
  }
}
```

---

## Step 6: Frontend Integration

### 1. Install Firebase (for Push)
```bash
npm install firebase
```

### 2. Initialize Firebase
```typescript
// firebase.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken };
```

### 3. Request Permission & Get Token
```typescript
// App.tsx or useEffect hook
import { messaging, getToken } from './firebase';

async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
      });
      
      // Send token to backend
      await fetch('/api/users/device-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
    }
  } catch (error) {
    console.error('Notification permission error:', error);
  }
}

// Call on app load
useEffect(() => {
  requestNotificationPermission();
}, []);
```

### 4. Listen for Foreground Messages
```typescript
import { onMessage } from 'firebase/messaging';

onMessage(messaging, (payload) => {
  console.log('Message received:', payload);
  
  // Show in-app notification
  showToast({
    title: payload.notification.title,
    message: payload.notification.body
  });
  
  // Update notification count
  updateNotificationBadge();
});
```

---

## Step 7: Testing

### Test Cases:

```typescript
// test/notifications.test.ts

describe('Notification System', () => {
  
  test('Send welcome notification on registration', async () => {
    const user = await createTestUser();
    const notifications = await getNotifications(user.id);
    
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe('welcome');
    expect(notifications[0].channel).toContain('sms');
  });
  
  test('Respect quiet hours', async () => {
    const user = await createTestUser({
      quiet_hours_start: '22:00',
      quiet_hours_end: '07:00'
    });
    
    // Mock time to 23:00 (11 PM)
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T23:00:00'));
    
    await notificationService.send({
      userId: user.id,
      type: 'course_recommendation',
      channel: 'push',
      priority: 'low'
    });
    
    const notifications = await getNotifications(user.id);
    expect(notifications[0].status).toBe('scheduled');
  });
  
  test('Respect frequency limits', async () => {
    const user = await createTestUser();
    
    // Send 10 push notifications
    for (let i = 0; i < 10; i++) {
      await notificationService.send({
        userId: user.id,
        type: 'test',
        channel: 'push'
      });
    }
    
    // 11th should be queued
    await notificationService.send({
      userId: user.id,
      type: 'test',
      channel: 'push'
    });
    
    const sentToday = await getNotificationsByStatus(user.id, 'sent');
    expect(sentToday).toHaveLength(10);
  });
  
  test('Render template correctly', () => {
    const template = 'Hi [Name], your session with [Mentor_Name] is at [Time].';
    const data = {
      Name: 'Priya',
      Mentor_Name: 'Dr. Anjali',
      Time: '2:00 PM'
    };
    
    const result = notificationService.renderTemplate(template, data);
    expect(result).toBe('Hi Priya, your session with Dr. Anjali is at 2:00 PM.');
  });
  
});
```

---

## Step 8: Monitoring & Analytics

### Key Metrics Dashboard:

```typescript
// Analytics endpoints
GET /api/analytics/notifications/delivery-rate
GET /api/analytics/notifications/open-rate
GET /api/analytics/notifications/conversion-rate
GET /api/analytics/notifications/opt-out-rate

// Response format
{
  date_range: { start: '2024-01-01', end: '2024-01-31' },
  metrics: {
    total_sent: 10000,
    total_delivered: 9800,
    total_opened: 5000,
    total_clicked: 2000,
    delivery_rate: 98,
    open_rate: 51,
    click_rate: 20
  },
  by_type: {
    session_reminder: { sent: 3000, opened: 2000, open_rate: 66 },
    // ...
  }
}
```

### Logging:
```typescript
// Every notification event should log
await db.notification_logs.create({
  notification_id: notif.id,
  event: 'sent', // 'sent', 'delivered', 'opened', 'failed'
  metadata: {
    provider: 'msg91',
    response_code: 200,
    delivery_time_ms: 1200
  }
});
```

---

## Step 9: Scheduled Jobs Setup

### Use a job scheduler (e.g., node-cron):

```typescript
// jobs/notificationJobs.ts
import cron from 'node-cron';

// Run every hour to check session reminders
cron.schedule('0 * * * *', async () => {
  await checkSessionReminders24h();
  await checkSessionReminders1h();
});

// Run every 15 minutes for urgent reminders
cron.schedule('*/15 * * * *', async () => {
  await checkSessionReminders15min();
});

// Run daily at 9 AM for profile reminders
cron.schedule('0 9 * * *', async () => {
  await sendProfileReminders();
});

// Run daily at midnight for daily summaries
cron.schedule('0 0 * * *', async () => {
  await sendDailySummaries();
});
```

---

## Step 10: Deployment Checklist

- [ ] Environment variables configured (API keys, credentials)
- [ ] Database tables created
- [ ] Notification templates seeded
- [ ] Firebase project set up
- [ ] SMS provider account created
- [ ] DLT registration completed (India)
- [ ] Scheduled jobs configured
- [ ] Monitoring dashboard set up
- [ ] Error alerting configured
- [ ] Test notifications sent successfully
- [ ] User preferences UI completed
- [ ] Opt-out functionality tested
- [ ] Analytics tracking verified

---

## Cost Estimation (Monthly)

### For 10,000 Active Users:

**SMS (MSG91 India)**:
- Transactional: ₹0.15/SMS
- Promotional: ₹0.10/SMS
- Estimated: 5 SMS/user/month = 50,000 SMS
- Cost: ₹7,500/month (~$90)

**Push Notifications (Firebase)**:
- Free for unlimited notifications

**Total Estimated Cost**: ~₹7,500/month (~$90/month)

### For 100,000 Active Users:
- SMS: ₹75,000/month (~$900)
- Push: Free
- Total: ~₹75,000/month

---

## Support & Troubleshooting

### Common Issues:

**1. Notifications not received**
- Check FCM token is valid
- Verify app has notification permissions
- Check quiet hours settings
- Verify user preferences

**2. SMS delivery failures**
- Verify phone number format (+91XXXXXXXXXX)
- Check DND registry status
- Verify sender ID (NUON) is registered
- Check account balance

**3. High opt-out rate**
- Review notification frequency
- Check message relevance
- Improve timing
- A/B test content

---

## Quick Reference

### Priority Levels:
- **Urgent**: Immediate (security, session starting now)
- **High**: 5 min (session 1h away, payment confirmation)
- **Medium**: 30 min (session 24h away, achievements)
- **Low**: Batched (recommendations, tips)

### Character Limits:
- SMS: 160 characters (single), 153/segment (multi)
- Push Title: 65 characters
- Push Body: 240 characters

### Template Variables:
Common: `[Name]`, `[First_Name]`, `[Date]`, `[Time]`
Session: `[Mentor_Name]`, `[Session_Topic]`
Course: `[Course_Name]`, `[Module_Name]`
Payment: `[Amount]`, `[Item_Name]`

---

**Ready to implement? Start with Phase 1 MVP notifications and expand from there!**

**Last Updated**: November 3, 2025
**Version**: 1.0
