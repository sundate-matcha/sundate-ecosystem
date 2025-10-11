import { EndpointCard } from '@/components/EndpointCard'

export const metadata = {
  title: 'Notifications API - Sundate Matcha API Documentation',
  description: 'Manage user notifications, read status, and notification history'
}

// Get Notifications
const getNotificationsParams = [
  { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' },
  { name: 'limit', type: 'number', required: false, description: 'Items per page (default: 20)' },
  { name: 'includeRead', type: 'boolean', required: false, description: 'Include read notifications (default: true)' },
  { name: 'includeArchived', type: 'boolean', required: false, description: 'Include archived notifications (default: false)' },
  { name: 'type', type: 'string', required: false, description: 'Filter by notification type' },
  { name: 'userId', type: 'string', required: false, description: 'User ID (for testing, use authenticated user in production)' }
]

const getNotificationsResponse = `{
  "notifications": [
    {
      "id": "...",
      "userId": "...",
      "type": "reservation_confirmed",
      "title": "Reservation Confirmed",
      "body": "Your reservation for 2 people at 7:00 PM has been confirmed.",
      "isRead": false,
      "isArchived": false,
      "priority": "normal",
      "reservationId": "...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 3,
  "currentPage": 1,
  "total": 45
}`

// Get Unread Count
const unreadCountResponse = `{
  "userId": "...",
  "unreadCount": 5
}`

// Get Specific Notification
const getNotificationResponse = `{
  "id": "...",
  "userId": "...",
  "type": "reservation_confirmed",
  "title": "Reservation Confirmed",
  "body": "Your reservation for 2 people at 7:00 PM has been confirmed.",
  "isRead": false,
  "isArchived": false,
  "priority": "normal",
  "reservationId": {
    "id": "...",
    "date": "2024-01-15",
    "time": "19:00",
    "partySize": 2
  },
  "createdAt": "2024-01-01T00:00:00.000Z"
}`

// Mark as Read/Unread
const markAsReadResponse = `{
  "message": "Notification marked as read",
  "notification": {
    "id": "...",
    "isRead": true,
    "readAt": "2024-01-01T12:00:00.000Z"
  }
}`

const markAsUnreadResponse = `{
  "message": "Notification marked as unread",
  "notification": {
    "id": "...",
    "isRead": false,
    "readAt": null
  }
}`

// Mark All as Read
const markAllAsReadParams = [
  { name: 'userId', type: 'string', required: false, description: 'User ID (use authenticated user in production)' }
]

const markAllAsReadResponse = `{
  "message": "All notifications marked as read",
  "modifiedCount": 12
}`

// Archive/Unarchive
const archiveResponse = `{
  "message": "Notification archived",
  "notification": {
    "id": "...",
    "isArchived": true,
    "archivedAt": "2024-01-01T12:00:00.000Z"
  }
}`

const unarchiveResponse = `{
  "message": "Notification unarchived",
  "notification": {
    "id": "...",
    "isArchived": false,
    "archivedAt": null
  }
}`

// Create Notification
const createNotificationParams = [
  { name: 'userId', type: 'string', required: false, description: 'Target user ID (optional)' },
  { name: 'type', type: 'string', required: true, description: 'Notification type: reservation_created, reservation_confirmed, reservation_cancelled, reservation_updated, reservation_reminder, system, promotional' },
  { name: 'title', type: 'string', required: true, description: 'Notification title (1-100 characters)' },
  { name: 'body', type: 'string', required: true, description: 'Notification body (1-500 characters)' },
  { name: 'priority', type: 'string', required: false, description: 'Priority: low, normal, high, urgent' },
  { name: 'reservationId', type: 'string', required: false, description: 'Associated reservation ID' }
]

const createNotificationResponse = `{
  "message": "Notification created successfully",
  "notification": {
    "id": "...",
    "userId": "...",
    "type": "reservation_confirmed",
    "title": "Reservation Confirmed",
    "body": "Your reservation has been confirmed.",
    "isRead": false,
    "isArchived": false,
    "priority": "normal",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}`

// Cleanup Notifications
const cleanupParams = [
  { name: 'daysOld', type: 'number', required: false, description: 'Delete notifications older than X days (default: 30)' }
]

const cleanupResponse = `{
  "message": "Notifications older than 30 days deleted",
  "deletedCount": 25
}`

// Notification Statistics
const notificationStatsResponse = `{
  "total": 500,
  "read": 350,
  "unread": 150,
  "archived": 75,
  "user": {
    "total": 45,
    "unread": 5,
    "archived": 3
  }
}`

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Notifications</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Manage user notifications, track read status, archive notifications, and handle notification history.
        </p>
      </div>

      <div className="space-y-6">
        <EndpointCard
          method="GET"
          path="/api/notifications"
          title="Get Notifications"
          description="Retrieve notifications for the current user with filtering and pagination."
          parameters={getNotificationsParams}
          responseExample={getNotificationsResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/notifications/unread-count"
          title="Get Unread Count"
          description="Get the count of unread notifications for a user."
          parameters={[]}
          responseExample={unreadCountResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/notifications/:id"
          title="Get Specific Notification"
          description="Retrieve a specific notification by ID."
          parameters={[]}
          responseExample={getNotificationResponse}
        />

        <EndpointCard
          method="PATCH"
          path="/api/notifications/:id/read"
          title="Mark as Read"
          description="Mark a notification as read."
          parameters={[]}
          responseExample={markAsReadResponse}
        />

        <EndpointCard
          method="PATCH"
          path="/api/notifications/:id/unread"
          title="Mark as Unread"
          description="Mark a notification as unread."
          parameters={[]}
          responseExample={markAsUnreadResponse}
        />

        <EndpointCard
          method="PATCH"
          path="/api/notifications/mark-all-read"
          title="Mark All as Read"
          description="Mark all notifications as read for a user."
          parameters={markAllAsReadParams}
          responseExample={markAllAsReadResponse}
        />

        <EndpointCard
          method="PATCH"
          path="/api/notifications/:id/archive"
          title="Archive Notification"
          description="Archive a notification."
          parameters={[]}
          responseExample={archiveResponse}
        />

        <EndpointCard
          method="PATCH"
          path="/api/notifications/:id/unarchive"
          title="Unarchive Notification"
          description="Unarchive a notification."
          parameters={[]}
          responseExample={unarchiveResponse}
        />

        <EndpointCard
          method="DELETE"
          path="/api/notifications/:id"
          title="Delete Notification"
          description="Permanently delete a notification."
          parameters={[]}
          responseExample={`{
  "message": "Notification deleted successfully"
}`}
        />

        <EndpointCard
          method="POST"
          path="/api/notifications"
          title="Create Notification"
          description="Create a new notification (admin/system use)."
          parameters={createNotificationParams}
          responseExample={createNotificationResponse}
        />

        <EndpointCard
          method="POST"
          path="/api/notifications/cleanup"
          title="Cleanup Old Notifications"
          description="Delete old notifications (admin only)."
          parameters={cleanupParams}
          responseExample={cleanupResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/notifications/stats/summary"
          title="Get Notification Statistics"
          description="Retrieve notification statistics (admin only)."
          parameters={[]}
          responseExample={notificationStatsResponse}
        />
      </div>
    </div>
  )
}
