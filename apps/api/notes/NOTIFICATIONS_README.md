# Push Notifications & Logging System

This document describes the push notification and logging system implemented for the Sundate reservation API.

## Overview

The system automatically logs all reservation-related actions and sends push notifications to registered mobile devices (via Expo) when:
- A new reservation is created
- A reservation is confirmed
- A reservation is cancelled
- A reservation is updated

## Architecture

### Components

1. **Models**
   - `PushToken`: Stores Expo push tokens for mobile devices
   - `ReservationLog`: Logs all reservation events with metadata

2. **Services**
   - `notificationService`: Handles push notification delivery via Expo
   - `logService`: Manages reservation event logging

3. **Routes**
   - `/api/push-tokens`: Manage device push tokens
   - `/api/logs`: Query and analyze reservation logs

4. **Utilities**
   - `notificationHelpers`: Format and generate notification messages
   - `logHelpers`: Filter and analyze log data

## Setup

### 1. Install Dependencies

```bash
cd apps/api
npm install
# or
pnpm install
```

New dependencies added:
- `expo-server-sdk`: ^3.7.0 - For Expo push notifications
- `winston`: ^3.11.0 - For advanced logging

### 2. Environment Variables

Add the following to your `.env` file:

```env
# Notification Settings
ENABLE_PUSH_NOTIFICATIONS=true
NOTIFICATION_BATCH_SIZE=100

# Logging Settings
LOG_RETENTION_DAYS=90
LOG_LEVEL=info
```

### 3. Start the Server

```bash
npm run dev
```

## API Endpoints

### Push Token Management

#### Register a Push Token
```http
POST /api/push-tokens
Content-Type: application/json

{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "deviceId": "unique-device-id",
  "platform": "ios",
  "userId": "optional-user-id",
  "deviceInfo": "Optional device information"
}
```

**Response:**
```json
{
  "message": "Push token registered successfully",
  "token": {
    "_id": "...",
    "token": "ExponentPushToken[...]",
    "deviceId": "...",
    "platform": "ios",
    "isActive": true
  }
}
```

#### Unregister a Push Token
```http
DELETE /api/push-tokens/:token
```

#### Get All Push Tokens (Admin)
```http
GET /api/push-tokens?page=1&limit=50&isActive=true&platform=ios
```

#### Get Token Statistics (Admin)
```http
GET /api/push-tokens/stats/summary
```

**Response:**
```json
{
  "total": 100,
  "active": 85,
  "inactive": 15,
  "platforms": {
    "ios": 50,
    "android": 30,
    "web": 5
  }
}
```

#### Send Test Notification (Admin)
```http
POST /api/push-tokens/test
Content-Type: application/json

{
  "title": "Test Notification",
  "body": "This is a test",
  "userId": "optional-user-id"
}
```

#### Cleanup Old Tokens (Admin)
```http
POST /api/push-tokens/cleanup
```

### Logs Management

#### Get All Logs (Admin)
```http
GET /api/logs?page=1&limit=50&action=created&startDate=2024-01-01&endDate=2024-12-31
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)
- `action`: Filter by action (created, confirmed, cancelled, updated, deleted)
- `reservationId`: Filter by reservation ID
- `notificationStatus`: Filter by notification status (sent, failed, pending)
- `startDate`: Start date filter
- `endDate`: End date filter
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: Sort order (asc/desc, default: desc)

#### Get Logs for Specific Reservation
```http
GET /api/logs/reservations/:reservationId?limit=50
```

#### Get Recent Logs
```http
GET /api/logs/recent?limit=100&action=created
```

#### Get Log Statistics (Admin)
```http
GET /api/logs/stats/summary
```

**Response:**
```json
{
  "total": 500,
  "byAction": {
    "created": 200,
    "confirmed": 150,
    "cancelled": 50,
    "updated": 80,
    "deleted": 20
  },
  "notifications": {
    "total": 500,
    "sent": 450,
    "failed": 20,
    "pending": 30,
    "successRate": "90.00"
  },
  "recentActivity": 45
}
```

#### Get Logs by Date Range
```http
GET /api/logs/date-range?startDate=2024-01-01&endDate=2024-01-31
```

#### Get Specific Log Entry
```http
GET /api/logs/:logId
```

#### Delete Log Entry (Admin)
```http
DELETE /api/logs/:logId
```

#### Cleanup Old Logs (Admin)
```http
POST /api/logs/cleanup
Content-Type: application/json

{
  "daysOld": 90
}
```

## Mobile App Integration (React Native/Expo)

### 1. Install Expo Notifications

```bash
expo install expo-notifications expo-device expo-constants
```

### 2. Register for Push Notifications

```javascript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

async function registerForPushNotificationsAsync() {
  let token;
  
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    })).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

// Register token with your API
async function registerToken() {
  const token = await registerForPushNotificationsAsync();
  const deviceId = Constants.deviceId || 'unknown';
  const platform = Device.osName?.toLowerCase() || 'unknown';
  
  const response = await fetch('https://your-api.com/api/push-tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      deviceId,
      platform,
      deviceInfo: `${Device.brand} ${Device.modelName}`
    }),
  });
  
  const data = await response.json();
  console.log('Token registered:', data);
}
```

### 3. Handle Incoming Notifications

```javascript
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

// Configure how notifications are presented
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      // Handle notification while app is in foreground
    });

    // Listen for user interactions with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      
      const data = response.notification.request.content.data;
      
      // Navigate based on notification type
      if (data.screen === 'ReservationDetails') {
        navigation.navigate('ReservationDetails', {
          reservationId: data.reservationId
        });
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    // Your app components
  );
}
```

## Notification Format

### Notification Types

Each notification includes a `data` object with:
- `type`: Notification type (e.g., "reservation_created")
- `reservationId`: ID of the reservation
- `action`: Action performed (created, confirmed, cancelled, updated)
- `screen`: Suggested screen to navigate to
- `timestamp`: ISO timestamp

### Example Notification

```javascript
{
  title: "🎉 Reservation Created!",
  body: "New reservation for John Doe on January 15, 2024 at 19:00",
  data: {
    type: "reservation_created",
    reservationId: "65a1b2c3d4e5f6g7h8i9j0k1",
    action: "created",
    screen: "ReservationDetails",
    timestamp: "2024-01-10T10:30:00.000Z"
  },
  sound: "default",
  priority: "high"
}
```

## Logging Details

### Log Structure

Each log entry contains:
- `reservationId`: Reference to the reservation
- `action`: Action performed (created, confirmed, cancelled, updated, deleted)
- `previousStatus`: Previous reservation status
- `newStatus`: New reservation status
- `changes`: Object containing changed fields (for updates)
- `details`: Human-readable description
- `notificationSent`: Whether notification was sent
- `notificationStatus`: Status of notification (sent, failed, pending, not_applicable)
- `metadata`: Additional context
  - `ipAddress`: Request IP address
  - `userAgent`: User agent string
  - `userId`: User who performed the action
  - `source`: Source of the action (web, mobile, api, admin, system)
- `createdAt`: Timestamp of the log entry

### Example Log Entry

```json
{
  "_id": "...",
  "reservationId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "action": "confirmed",
  "previousStatus": "pending",
  "newStatus": "confirmed",
  "details": "Reservation confirmed for John Doe on January 15, 2024 at 19:00",
  "notificationSent": true,
  "notificationStatus": "sent",
  "metadata": {
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "userId": "admin123",
    "source": "admin"
  },
  "createdAt": "2024-01-10T10:30:00.000Z"
}
```

## Error Handling

### Push Token Failures

The system automatically handles failed push notifications:
- **DeviceNotRegistered**: Token is immediately deactivated
- **MessageTooBig**: Logged as error
- **MessageRateExceeded**: Logged and retried later
- **Other errors**: Token failure count is incremented
  - After 3 failures, token is automatically deactivated

### Automatic Cleanup

- **Old Tokens**: Tokens not used in 30+ days are automatically deactivated
- **Old Logs**: Logs older than 90 days (configurable) can be cleaned up via API

## Best Practices

### For Mobile Apps

1. **Register token on app launch** and when user logs in
2. **Unregister token** when user logs out
3. **Handle notification permissions** gracefully
4. **Test on physical devices** (push notifications don't work in simulators)
5. **Update token** when it changes (rare, but possible)

### For Server/Admin

1. **Monitor notification success rate** via `/api/logs/stats/summary`
2. **Clean up old tokens regularly** via `/api/push-tokens/cleanup`
3. **Archive old logs** periodically via `/api/logs/cleanup`
4. **Test notifications** before major releases via `/api/push-tokens/test`

## Troubleshooting

### Notifications Not Received

1. Check token is registered and active: `GET /api/push-tokens?token=...`
2. Verify notification was sent: `GET /api/logs/reservations/:id`
3. Check notification status in logs
4. Ensure device has proper permissions
5. Test with a simple test notification: `POST /api/push-tokens/test`

### High Failure Rate

1. Check logs for error patterns: `GET /api/logs?notificationStatus=failed`
2. Run token cleanup: `POST /api/push-tokens/cleanup`
3. Verify Expo configuration is correct
4. Check device token format (ExponentPushToken[...])

## Security Considerations

1. **Authentication**: Add authentication middleware to admin endpoints
2. **Rate Limiting**: Already configured for all API routes
3. **Token Validation**: All Expo tokens are validated before storage
4. **Data Privacy**: Logs contain metadata - ensure compliance with privacy laws
5. **Access Control**: Implement proper authorization for log viewing

## Future Enhancements

Potential improvements:
- [ ] Email notifications alongside push notifications
- [ ] SMS notifications for critical updates
- [ ] User notification preferences
- [ ] Scheduled notifications (reminders)
- [ ] Rich notifications with images
- [ ] In-app notification center
- [ ] Notification templates with customization
- [ ] A/B testing for notification content
- [ ] Advanced analytics and reporting

## Support

For issues or questions:
1. Check the logs: `GET /api/logs`
2. Test notifications: `POST /api/push-tokens/test`
3. Review notification statistics: `GET /api/logs/stats/summary`

## License

MIT
