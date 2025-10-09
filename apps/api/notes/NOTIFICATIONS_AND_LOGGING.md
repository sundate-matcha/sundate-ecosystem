# Notifications & Logging System

Complete push notification, in-app notification, and logging system for the reservation API.

---

## 📋 Quick Start

### 1. Install & Configure
```bash
# Already installed with pnpm install
# Add to .env:
ENABLE_PUSH_NOTIFICATIONS=true
LOG_RETENTION_DAYS=90
```

### 2. Start Server
```bash
npm run dev
```

### 3. Test
```bash
# Create reservation (auto-creates notifications & logs)
curl -X POST http://localhost:5001/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"name":"John","phone":"+1234567890","date":"2025-10-15","time":"19:00","guests":2,"tableCategory":"CATEGORY_ID"}'

# View logs
curl http://localhost:5001/api/logs/recent?limit=5

# Get unread notifications
curl http://localhost:5001/api/notifications/unread-count?userId=USER_ID
```

---

## 🎯 What It Does

### Automatic Actions on Reservation Events:
1. **Push Notification** → Sent to mobile devices (Expo)
2. **In-App Notification** → Stored in database with read/unread tracking
3. **Audit Log** → System log for admin tracking

All happen automatically when reservations are created, confirmed, cancelled, or updated.

---

## 📦 Three Systems

### 1. Push Notifications (Mobile Devices)
- **Model**: `PushToken`
- **Route**: `/api/push-tokens`
- **Purpose**: Send notifications to mobile apps via Expo

### 2. In-App Notifications (Persistent Storage)
- **Model**: `Notification`
- **Route**: `/api/notifications`
- **Purpose**: Store notifications with read/unread/archive functionality

### 3. Audit Logs (Admin Tracking)
- **Model**: `ReservationLog`
- **Route**: `/api/logs`
- **Purpose**: Track all reservation events for admin

---

## 🔌 API Endpoints

### Push Tokens
```bash
POST   /api/push-tokens              # Register device
DELETE /api/push-tokens/:token       # Unregister
GET    /api/push-tokens               # List all (admin)
POST   /api/push-tokens/test          # Send test notification
```

### In-App Notifications
```bash
GET    /api/notifications                    # Get user notifications
GET    /api/notifications/unread-count       # Get unread count
PATCH  /api/notifications/:id/read           # Mark as read
PATCH  /api/notifications/:id/unread         # Mark as unread
PATCH  /api/notifications/mark-all-read      # Mark all as read
PATCH  /api/notifications/:id/archive        # Archive
DELETE /api/notifications/:id                # Delete
```

### Logs
```bash
GET    /api/logs                       # Get all logs (filtered)
GET    /api/logs/recent                # Recent activity
GET    /api/logs/reservations/:id      # Logs for specific reservation
GET    /api/logs/stats/summary         # Statistics
```

---

## 📱 Mobile Integration

### React Native/Expo Setup

#### 1. Install Dependencies
```bash
npx expo install expo-notifications expo-device expo-constants
```

#### 2. Register Push Token
```javascript
import * as Notifications from 'expo-notifications';

async function registerPushToken() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
  
  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: 'your-expo-project-id'
  })).data;
  
  // Register with API
  await fetch('https://your-api.com/api/push-tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      deviceId: 'unique-device-id',
      platform: 'ios' // or 'android'
    })
  });
}
```

#### 3. Fetch In-App Notifications
```javascript
// Get notifications with unread count
async function fetchNotifications(userId) {
  const response = await fetch(
    `https://your-api.com/api/notifications?userId=${userId}&page=1&limit=20`
  );
  return await response.json();
  // Returns: { notifications: [...], unreadCount: 5 }
}

// Mark as read
async function markAsRead(notificationId) {
  await fetch(
    `https://your-api.com/api/notifications/${notificationId}/read`,
    { method: 'PATCH' }
  );
}

// Mark all as read
async function markAllAsRead(userId) {
  await fetch(
    `https://your-api.com/api/notifications/mark-all-read`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    }
  );
}
```

#### 4. Display Unread Badge
```javascript
function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    async function loadCount() {
      const response = await fetch(
        `https://your-api.com/api/notifications/unread-count?userId=${userId}`
      );
      const data = await response.json();
      setUnreadCount(data.unreadCount);
    }
    loadCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadCount, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return unreadCount > 0 ? <Badge value={unreadCount} /> : null;
}
```

---

## 📊 Database Models

### Notification (In-App)
```javascript
{
  userId: ObjectId,              // User who receives notification
  type: String,                  // reservation_created, reservation_confirmed, etc.
  title: String,                 // "🎉 Reservation Created!"
  body: String,                  // "New reservation for John..."
  reservationId: ObjectId,       // Related reservation
  priority: String,              // low, normal, high, urgent
  isRead: Boolean,               // Read status
  readAt: Date,                  // When marked as read
  isArchived: Boolean,           // Archive status
  icon: String,                  // Emoji icon
  createdAt: Date
}
```

### PushToken (Device Registration)
```javascript
{
  userId: ObjectId,              // Optional user reference
  token: String,                 // Expo push token
  deviceId: String,              // Unique device ID
  platform: String,              // ios, android, web
  isActive: Boolean,             // Active status
  lastUsed: Date,                // Last used timestamp
  failureCount: Number           // Failed delivery count
}
```

### ReservationLog (Audit Trail)
```javascript
{
  reservationId: ObjectId,       // Related reservation
  action: String,                // created, confirmed, cancelled, etc.
  previousStatus: String,        // Previous status
  newStatus: String,             // New status
  changes: Object,               // Changed fields
  details: String,               // Human-readable description
  notificationSent: Boolean,     // Whether notification was sent
  metadata: {
    ipAddress: String,
    userAgent: String,
    userId: ObjectId,
    source: String               // web, mobile, api, admin
  },
  createdAt: Date
}
```

---

## 🔧 Common Tasks

### Test Push Notification
```bash
curl -X POST http://localhost:5001/api/push-tokens/test \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","body":"Hello World!"}'
```

### View Recent Logs
```bash
curl http://localhost:5001/api/logs/recent?limit=10
```

### Get Statistics
```bash
# Notification stats
curl http://localhost:5001/api/notifications/stats/summary?userId=USER_ID

# Log stats
curl http://localhost:5001/api/logs/stats/summary
```

### Cleanup Old Data
```bash
# Clean old tokens (30+ days inactive)
curl -X POST http://localhost:5001/api/push-tokens/cleanup

# Clean old logs (90+ days)
curl -X POST http://localhost:5001/api/logs/cleanup \
  -H "Content-Type: application/json" \
  -d '{"daysOld":90}'

# Clean old notifications
curl -X POST http://localhost:5001/api/notifications/cleanup \
  -H "Content-Type: application/json" \
  -d '{"daysOld":30}'
```

---

## 🎨 Notification Examples

### Reservation Created
```
Title: 🎉 Reservation Created!
Body: New reservation for John Doe - 2 guests on October 15, 2025 at 19:00
Type: reservation_created
Priority: high
```

### Reservation Confirmed
```
Title: ✅ Reservation Confirmed!
Body: Reservation for John Doe on October 15, 2025 at 19:00 has been confirmed
Type: reservation_confirmed
Priority: high
```

### Reservation Cancelled
```
Title: ❌ Reservation Cancelled
Body: Reservation for John Doe on October 15, 2025 at 19:00 has been cancelled
Type: reservation_cancelled
Priority: high
```

---

## 🔒 Security Notes

⚠️ **Before Production:**

1. Add authentication middleware to protect endpoints
2. Validate userId from JWT token instead of query params
3. Set up proper CORS for your domain
4. Use HTTPS in production
5. Implement rate limiting for token registration

Example:
```javascript
import { authenticate } from '../middleware/auth.js'

router.get('/notifications', authenticate, async (req, res) => {
  const userId = req.user._id // From auth token, not query
  // ... fetch notifications
})
```

---

## 🐛 Troubleshooting

### Notifications not working?
1. Check token is registered: `GET /api/push-tokens`
2. Verify logs show notification attempts: `GET /api/logs?notificationStatus=failed`
3. Send test notification: `POST /api/push-tokens/test`
4. Check token format starts with `ExponentPushToken[`

### In-app notifications not appearing?
1. Verify notification was created: `GET /api/notifications?userId=USER_ID`
2. Check userId is correct
3. Verify includeRead parameter if filtering

### High failure rate?
1. Run cleanup: `POST /api/push-tokens/cleanup`
2. Check error logs: `GET /api/logs?notificationStatus=failed`

---

## 📁 Files Created

```
src/
├── models/
│   ├── Notification.js          # In-app notifications
│   ├── PushToken.js             # Device tokens
│   └── ReservationLog.js        # Audit logs
├── routes/
│   ├── notifications.js         # Notification endpoints
│   ├── pushTokens.js            # Token management
│   └── logs.js                  # Log queries
├── services/
│   ├── notificationService.js   # Notification logic
│   └── logService.js            # Logging logic
└── utils/
    ├── notificationHelpers.js   # Formatting helpers
    └── logHelpers.js            # Log helpers
```

---

## ✨ Summary

**What happens when a reservation is created:**
1. Reservation saved to database ✅
2. Audit log created → `/api/logs` 📝
3. In-app notification saved → `/api/notifications` 💾
4. Push notification sent to devices → Expo 📱

**Everything is automatic!** Just create/update reservations normally.
