import { EndpointCard } from '@/components/EndpointCard'

export const metadata = {
  title: 'Push Tokens API - Sundate Matcha API Documentation',
  description: 'Manage push notification tokens for mobile and web applications'
}

// Register Push Token
const registerTokenParams = [
  { name: 'token', type: 'string', required: true, description: 'Push notification token from device' },
  { name: 'deviceId', type: 'string', required: true, description: 'Unique device identifier' },
  { name: 'platform', type: 'string', required: true, description: 'Platform: ios, android, or web' },
  { name: 'userId', type: 'string', required: false, description: 'Associated user ID (optional)' },
  { name: 'deviceInfo', type: 'string', required: false, description: 'Additional device information' }
]

const registerTokenResponse = `{
  "message": "Push token registered successfully",
  "token": {
    "id": "...",
    "token": "device_push_token_here",
    "deviceId": "device_123",
    "platform": "ios",
    "userId": "...",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}`

// Get Push Tokens
const getTokensParams = [
  { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' },
  { name: 'limit', type: 'number', required: false, description: 'Items per page (default: 50)' },
  { name: 'isActive', type: 'boolean', required: false, description: 'Filter by active status' },
  { name: 'platform', type: 'string', required: false, description: 'Filter by platform (ios, android, web)' },
  { name: 'userId', type: 'string', required: false, description: 'Filter by user ID' }
]

const getTokensResponse = `{
  "tokens": [
    {
      "id": "...",
      "token": "device_push_token_here",
      "deviceId": "device_123",
      "platform": "ios",
      "userId": {
        "id": "...",
        "email": "user@example.com",
        "name": "John Doe"
      },
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 2,
  "currentPage": 1,
  "total": 45
}`

// Token Statistics
const tokenStatsResponse = `{
  "total": 150,
  "active": 120,
  "inactive": 30,
  "platforms": {
    "ios": 60,
    "android": 45,
    "web": 15
  }
}`

// Test Notification
const testNotificationParams = [
  { name: 'title', type: 'string', required: false, description: 'Notification title (default: "Test Notification")' },
  { name: 'body', type: 'string', required: false, description: 'Notification body (default: "This is a test notification")' },
  { name: 'userId', type: 'string', required: false, description: 'Send to specific user (optional)' }
]

const testNotificationResponse = `{
  "message": "Test notification sent",
  "result": {
    "successCount": 5,
    "failureCount": 0,
    "details": [...]
  }
}`

// Refresh Token
const refreshTokenResponse = `{
  "message": "Token refreshed successfully",
  "token": {
    "id": "...",
    "token": "device_push_token_here",
    "lastUsed": "2024-01-01T12:00:00.000Z"
  }
}`

// Cleanup Tokens
const cleanupTokensResponse = `{
  "message": "Old tokens deactivated",
  "deactivated": 15
}`

export default function PushTokensPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Push Tokens</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Manage push notification tokens for mobile and web applications. Register devices, track token usage, and send test notifications.
        </p>
      </div>

      <div className="space-y-6">
        <EndpointCard
          method="POST"
          path="/api/push-tokens"
          title="Register Push Token"
          description="Register a new push notification token for a device."
          parameters={registerTokenParams}
          responseExample={registerTokenResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/push-tokens"
          title="Get Push Tokens"
          description="Retrieve all registered push tokens with filtering and pagination (admin only)."
          parameters={getTokensParams}
          responseExample={getTokensResponse}
        />

        <EndpointCard
          method="DELETE"
          path="/api/push-tokens/:token"
          title="Unregister Push Token"
          description="Remove a push token from the system."
          parameters={[]}
          responseExample={`{
  "message": "Push token unregistered successfully"
}`}
        />

        <EndpointCard
          method="GET"
          path="/api/push-tokens/stats/summary"
          title="Get Token Statistics"
          description="Retrieve statistics about registered push tokens (admin only)."
          parameters={[]}
          responseExample={tokenStatsResponse}
        />

        <EndpointCard
          method="POST"
          path="/api/push-tokens/test"
          title="Send Test Notification"
          description="Send a test push notification to registered devices (admin only)."
          parameters={testNotificationParams}
          responseExample={testNotificationResponse}
        />

        <EndpointCard
          method="PATCH"
          path="/api/push-tokens/:token/refresh"
          title="Refresh Token"
          description="Update the last used timestamp for a push token."
          parameters={[]}
          responseExample={refreshTokenResponse}
        />

        <EndpointCard
          method="POST"
          path="/api/push-tokens/cleanup"
          title="Cleanup Old Tokens"
          description="Deactivate old push tokens that haven't been used recently (admin only)."
          parameters={[]}
          responseExample={cleanupTokensResponse}
        />
      </div>
    </div>
  )
}
