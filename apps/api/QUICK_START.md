# 🚀 Quick Start Guide - Push Notifications & Logging

## What Was Implemented?

A complete push notification and logging system for the reservation API that:
- ✅ Automatically logs every reservation action (create, update, confirm, cancel, delete)
- ✅ Sends push notifications to mobile devices via Expo
- ✅ Tracks notification delivery status
- ✅ Provides admin endpoints for monitoring and management

## 📦 Installation

Dependencies have already been added to `package.json`:
- `expo-server-sdk` - For Expo push notifications
- `winston` - For advanced logging

To install (if needed):
```bash
pnpm install
```

## ⚙️ Configuration

### 1. Environment Variables

Copy the example file and configure:
```bash
cp env.example .env
```

Add these settings to your `.env`:
```env
# Notification Settings
ENABLE_PUSH_NOTIFICATIONS=true
NOTIFICATION_BATCH_SIZE=100

# Logging Settings
LOG_RETENTION_DAYS=90
LOG_LEVEL=info
```

### 2. Start the Server

```bash
npm run dev
# or
pnpm dev
```

The server will automatically:
- Load the new models (PushToken, ReservationLog)
- Register the new routes (/api/push-tokens, /api/logs)
- Start logging all reservation actions

## 🧪 Quick Test

### Test 1: Create a Reservation (will auto-log)
```bash
curl -X POST http://localhost:5001/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "date": "2025-10-15",
    "time": "19:00",
    "guests": 2,
    "tableCategory": "YOUR_TABLE_CATEGORY_ID"
  }'
```

### Test 2: View Recent Logs
```bash
curl http://localhost:5001/api/logs/recent?limit=5
```

### Test 3: View Log Statistics
```bash
curl http://localhost:5001/api/logs/stats/summary
```

## 📱 Mobile App Setup (React Native/Expo)

### Install Dependencies
```bash
npx expo install expo-notifications expo-device expo-constants
```

### Register for Push Notifications
```javascript
import * as Notifications from 'expo-notifications';

// Get push token
async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  
  if (status !== 'granted') {
    alert('Push notification permissions required!');
    return;
  }
  
  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: 'your-expo-project-id'
  })).data;
  
  // Register with your API
  await fetch('http://localhost:5001/api/push-tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: token,
      deviceId: 'unique-device-id',
      platform: 'ios' // or 'android'
    })
  });
  
  return token;
}
```

### Test Push Notification
```bash
# First, register a token from your mobile app
# Then send a test notification:
curl -X POST http://localhost:5001/api/push-tokens/test \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "body": "Hello from API!"}'
```

## 📊 Available Endpoints

### Push Tokens
- `POST /api/push-tokens` - Register device token
- `DELETE /api/push-tokens/:token` - Unregister token
- `GET /api/push-tokens` - List all tokens (admin)
- `GET /api/push-tokens/stats/summary` - Token statistics
- `POST /api/push-tokens/test` - Send test notification

### Logs
- `GET /api/logs` - Get all logs (with filters)
- `GET /api/logs/recent` - Recent logs
- `GET /api/logs/reservations/:id` - Logs for specific reservation
- `GET /api/logs/stats/summary` - Log statistics

## 🎯 How It Works

### When a Reservation is Created:
1. Reservation is saved to database ✅
2. Log entry is created automatically 📝
3. Push notification is sent to all registered devices 📱
4. Response is returned immediately (notification is async) ⚡

### When a Reservation is Confirmed:
1. Status is updated to "confirmed" ✅
2. Log entry records the status change 📝
3. Push notification sent: "✅ Reservation Confirmed!" 📱

### When a Reservation is Cancelled:
1. Status is updated to "cancelled" ❌
2. Log entry records the cancellation 📝
3. Push notification sent: "❌ Reservation Cancelled" 📱

## 🔍 Monitoring Dashboard

### Check System Health
```bash
# Notification success rate
curl http://localhost:5001/api/logs/stats/summary

# Active devices
curl http://localhost:5001/api/push-tokens/stats/summary

# Recent activity
curl http://localhost:5001/api/logs/recent?limit=20
```

## 🛠️ Maintenance

### Clean Up Old Tokens (run monthly)
```bash
curl -X POST http://localhost:5001/api/push-tokens/cleanup
```

### Clean Up Old Logs (run quarterly)
```bash
curl -X POST http://localhost:5001/api/logs/cleanup \
  -H "Content-Type: application/json" \
  -d '{"daysOld": 90}'
```

## 🎨 Notification Examples

### New Reservation
```
Title: 🎉 Reservation Created!
Body: New reservation for John Doe - 2 guests on October 15, 2025 at 19:00
```

### Confirmed Reservation
```
Title: ✅ Reservation Confirmed!
Body: Reservation for John Doe on October 15, 2025 at 19:00 has been confirmed
```

### Cancelled Reservation
```
Title: ❌ Reservation Cancelled
Body: Reservation for John Doe on October 15, 2025 at 19:00 has been cancelled
```

## 🔒 Security Recommendations

**Before Production:**
1. Add authentication middleware to admin endpoints
2. Implement rate limiting for push token registration
3. Add API key authentication for mobile apps
4. Set up CORS properly for your domain
5. Use HTTPS in production

Example auth middleware:
```javascript
import { authenticate, isAdmin } from './middleware/auth.js'

// Protect admin endpoints
router.get('/logs', authenticate, isAdmin, async (req, res) => {
  // ... handler
})
```

## 📚 Documentation

- **Full Documentation**: `NOTIFICATIONS_README.md`
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`
- **API Reference**: See route files in `src/routes/`

## ❓ Troubleshooting

### Notifications Not Working?
1. ✅ Check token is registered: `GET /api/push-tokens`
2. ✅ Verify logs show notification attempts: `GET /api/logs?notificationStatus=failed`
3. ✅ Send test notification: `POST /api/push-tokens/test`
4. ✅ Check Expo token format starts with `ExponentPushToken[`

### Server Not Starting?
1. ✅ Check MongoDB is running
2. ✅ Verify all dependencies installed: `pnpm install`
3. ✅ Check environment variables in `.env`

### Need Help?
1. Check logs: `GET /api/logs/recent`
2. View statistics: `GET /api/logs/stats/summary`
3. Review error logs in terminal

## ✨ What's Next?

1. **Test with real mobile app** - Build an Expo app and test notifications
2. **Add authentication** - Secure admin endpoints
3. **Set up monitoring** - Check success rates regularly
4. **Schedule cleanups** - Automate token and log cleanup
5. **Customize notifications** - Modify templates in `notificationHelpers.js`

## 🎉 You're All Set!

The system is fully functional and ready to use. Every reservation action will now:
- Be automatically logged ✅
- Trigger push notifications 📱
- Track delivery status 📊
- Provide audit trail 📝

Start creating reservations and watch the magic happen! 🚀
