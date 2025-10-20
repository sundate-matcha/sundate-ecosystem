# Server-Sent Events (SSE) Implementation

Complete real-time event streaming system for the Sundate Matcha API with admin user targeting.

---

## 🎯 Overview

The SSE implementation provides real-time updates to connected clients, with intelligent targeting:
- **Specific User**: Send events to a particular user
- **All Admin Users**: Send events to all users with `role: 'admin'` when no specific user is provided
- **Event Filtering**: Filter events by type, user, and reservation
- **Connection Management**: Track and monitor active connections

---

## 🔌 API Endpoints

### SSE Connection
```
GET /api/events
```

**Query Parameters:**
- `userId` (optional): Specific user ID to filter events
- `types` (optional): Comma-separated event types to subscribe to
- `reservationId` (optional): Specific reservation ID to monitor

**Example:**
```javascript
// Connect as specific user
const eventSource = new EventSource('/api/events?userId=USER_ID&types=reservation_created,reservation_updated')

// Connect as admin user (receives all events)
const eventSource = new EventSource('/api/events?types=reservation_created,notification_created')
```

### Admin Endpoints

#### View Active Connections
```
GET /api/events/connections
```

**Response:**
```json
{
  "totalConnections": 3,
  "connections": [
    {
      "id": "connection-123",
      "userId": "user-456",
      "eventTypes": ["reservation_created"],
      "connectedAt": "2025-01-15T10:00:00Z",
      "duration": 30000
    }
  ]
}
```

#### Broadcast Custom Event
```
POST /api/events/broadcast
```

**Request Body:**
```json
{
  "type": "reservation_created",
  "data": {
    "reservation": { /* reservation data */ },
    "message": "New reservation created"
  },
  "targetUserId": "optional-user-id"  // Omit to send to all admin users
}
```

**Response:**
```json
{
  "message": "Event broadcasted successfully",
  "stats": {
    "sent": 2,
    "filtered": 1,
    "totalConnections": 3,
    "targetUserIds": ["admin-user-1", "admin-user-2"]
  }
}
```

---

## 📡 Event Types

### Reservation Events
- `reservation_created` - New reservation created
- `reservation_updated` - Reservation modified
- `reservation_confirmed` - Reservation confirmed
- `reservation_cancelled` - Reservation cancelled
- `reservation_deleted` - Reservation deleted

### Notification Events
- `notification_created` - New notification created
- `notification_read` - Notification marked as read

### System Events
- `system_status` - System status updates
- `connection_established` - SSE connection established
- `ping` - Keep-alive ping

---

## 🎯 User Targeting Logic

### When `userId` is provided:
- Events are sent only to connections with that specific `userId`
- Other connections are filtered out

### When `userId` is `null` or omitted:
- System queries the database for all users with `role: 'admin'` and `isActive: true`
- Events are sent to all admin user connections
- Non-admin connections are filtered out

### Example Usage:

```javascript
// Send to specific user
await sseService.broadcastReservationCreated(reservation, 'user-123')

// Send to all admin users
await sseService.broadcastReservationCreated(reservation) // userId = null
```

---

## 🔧 Integration Points

### Reservation Operations
All reservation CRUD operations automatically broadcast SSE events:

```javascript
// In reservation routes
sseService
  .broadcastReservationCreated(reservation)
  .catch(error => console.error('Error broadcasting SSE event:', error))
```

### Notification Operations
Notification creation and read operations broadcast events:

```javascript
// In notification routes
sseService
  .broadcastNotificationCreated(notification, notification.userId)
  .catch(error => console.error('Error broadcasting SSE event:', error))
```

---

## 🧪 Testing

### 1. Create Admin User
```bash
node scripts/create-admin-user.js
```

### 2. Test with Node.js Script
```bash
node scripts/test-sse.js
```

### 3. Test with Browser
Open `scripts/sse-test.html` in a browser and:
- Connect with empty userId (admin mode)
- Connect with specific userId
- Test different event types

---

## 📱 Mobile App Integration

### Connect to SSE Stream
```javascript
// In your Expo app
const eventSource = new EventSource('http://your-api.com/api/events?userId=USER_ID')

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  
  switch(data.type) {
    case 'reservation_created':
      // Update UI with new reservation
      updateReservationsList(data.data.reservation)
      break
      
    case 'reservation_updated':
      // Update existing reservation
      updateReservation(data.data.reservation)
      break
      
    case 'notification_created':
      // Show new notification
      showNotification(data.data.notification)
      break
  }
}

eventSource.onopen = () => {
  console.log('Connected to real-time updates')
}

eventSource.onerror = (error) => {
  console.log('SSE connection error:', error)
}
```

### Handle Connection States
```javascript
// Reconnect on error
eventSource.onerror = (error) => {
  console.log('Connection lost, reconnecting...')
  setTimeout(() => {
    // Reconnect logic
    connectToSSE()
  }, 5000)
}
```

---

## 🔒 Security Considerations

1. **User Authentication**: Implement proper authentication for SSE connections
2. **Rate Limiting**: Consider rate limiting for SSE connections
3. **Admin Access**: Only admin users receive events when no specific userId is provided
4. **Data Validation**: All broadcast events are validated before sending

---

## 📊 Monitoring

### Connection Statistics
```javascript
// Get SSE service stats
const stats = sseService.getStats()
console.log('Active connections:', stats.activeConnections)

// Get user-specific connections
const userConnections = sseService.getUserConnections('user-123')
console.log('User connections:', userConnections.length)
```

### Logging
All SSE events are logged with:
- Event type and target users
- Success/failure counts
- Connection management events

---

## 🚀 Performance Notes

1. **Non-blocking**: All SSE broadcasts are asynchronous and don't block API responses
2. **Connection Cleanup**: Dead connections are automatically removed
3. **Event Filtering**: Only relevant events are sent to each connection
4. **Database Queries**: Admin user lookup is cached for performance

---

## 🔄 Event Flow

```
Reservation Created
        ↓
   Log to Database
        ↓
   Send Push Notification
        ↓
   Broadcast SSE Event
        ↓
   [If userId provided] → Send to specific user
   [If userId null] → Send to all admin users
        ↓
   Update UI in real-time
```

This implementation provides a complete real-time communication system that works seamlessly with your existing push notification system!
