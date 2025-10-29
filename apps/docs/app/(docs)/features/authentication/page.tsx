import { EndpointCard } from '@/components/EndpointCard'

export const metadata = {
  title: 'Authentication - Sundate Matcha API Documentation',
  description: 'Learn how to authenticate your API requests and manage access'
}

// User Registration
const userRegistrationParams = [
  { name: 'username', type: 'string', required: true, description: 'Username (3-30 chars, alphanumeric + underscore)' },
  { name: 'email', type: 'string', required: true, description: 'Valid email address' },
  { name: 'password', type: 'string', required: true, description: 'Password (min 6 chars)' },
  { name: 'firstName', type: 'string', required: true, description: 'First name (1-50 chars)' },
  { name: 'lastName', type: 'string', required: true, description: 'Last name (1-50 chars)' },
  { name: 'phone', type: 'string', required: false, description: 'Phone number (optional)' }
]

const userRegistrationResponse = `{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`

// User Login
const userLoginParams = [
  { name: 'identifier', type: 'string', required: true, description: 'Email or username' },
  { name: 'password', type: 'string', required: true, description: 'User password' }
]

const userLoginResponse = `{
  "message": "Login successful",
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`

// User Logout
const userLogoutResponse = `{
  "message": "Logout successful",
  "note": "Please remove the token from client storage"
}`

// Get User Profile
const getUserProfileResponse = `{
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}`

// Update User Profile
const updateUserProfileParams = [
  { name: 'firstName', type: 'string', required: false, description: 'First name (1-50 chars)' },
  { name: 'lastName', type: 'string', required: false, description: 'Last name (1-50 chars)' },
  { name: 'phone', type: 'string', required: false, description: 'Phone number (10-15 chars)' },
  { name: 'preferences', type: 'object', required: false, description: 'User preferences object' }
]

const updateUserProfileResponse = `{
  "message": "Profile updated successfully",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890"
  }
}`

// Change Password
const changePasswordParams = [
  { name: 'currentPassword', type: 'string', required: true, description: 'Current password' },
  { name: 'newPassword', type: 'string', required: true, description: 'New password (min 6 chars)' }
]

const changePasswordResponse = `{
  "message": "Password changed successfully"
}`

// Verify Token
const verifyTokenResponse = `{
  "valid": true,
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com"
  }
}`

// Get Users Test (No Auth)
const getUsersTestQueryParams = [
  { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' },
  { name: 'limit', type: 'number', required: false, description: 'Items per page (default: 20)' },
  { name: 'role', type: 'string', required: false, description: 'Filter by role (user, staff, admin)' },
  { name: 'isActive', type: 'boolean', required: false, description: 'Filter by active status' },
  { name: 'search', type: 'string', required: false, description: 'Search by username, email, or name' }
]

const getUsersTestResponse = `{
  "users": [
    {
      "id": "...",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "total": 1
}`

export default function AuthenticationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Authentication</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Learn how to authenticate your API requests and manage access.
        </p>
      </div>

      <div className="space-y-6">
        <EndpointCard
          method="POST"
          path="/api/auth/register"
          title="User Registration"
          description="Register a new user account."
          parameters={userRegistrationParams}
          responseExample={userRegistrationResponse}
        />

        <EndpointCard
          method="POST"
          path="/api/auth/login"
          title="User Login"
          description="Authenticate user and get JWT token."
          parameters={userLoginParams}
          responseExample={userLoginResponse}
        />

        <EndpointCard
          method="POST"
          path="/api/auth/logout"
          title="User Logout"
          description="Logout user (client-side token removal)."
          parameters={[]}
          responseExample={userLogoutResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/auth/profile"
          title="Get User Profile"
          description="Get current user profile information."
          parameters={[]}
          responseExample={getUserProfileResponse}
        />

        <EndpointCard
          method="PUT"
          path="/api/auth/profile"
          title="Update User Profile"
          description="Update current user profile information."
          parameters={updateUserProfileParams}
          responseExample={updateUserProfileResponse}
        />

        <EndpointCard
          method="POST"
          path="/api/auth/change-password"
          title="Change Password"
          description="Change user password."
          parameters={changePasswordParams}
          responseExample={changePasswordResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/auth/verify"
          title="Verify Token"
          description="Verify JWT token validity."
          parameters={[]}
          responseExample={verifyTokenResponse}
        />
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4">⚠️ Testing Endpoint (No Authentication)</h2>
        <p className="text-red-700 dark:text-red-300 mb-4">
          The following endpoint is for <strong>TESTING ONLY</strong> and should be disabled in production environments.
          It does not require authentication and exposes user data.
        </p>
        
        <div className="space-y-6">
          <EndpointCard
            method="GET"
            path="/api/auth/users-test"
            title="Get Users (Test - No Auth)"
            description="Get list of all users WITHOUT authentication. FOR TESTING ONLY - DISABLE IN PRODUCTION!"
            parameters={getUsersTestQueryParams}
            responseExample={getUsersTestResponse}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">JWT Token Authentication</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          The API uses JWT (JSON Web Tokens) for authentication. Include your token in the Authorization header.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Header Format</h3>
            <code className="text-sm bg-neutral-100 dark:bg-neutral-700 px-3 py-2 rounded block">
              Authorization: Bearer YOUR_JWT_TOKEN_HERE
            </code>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Example Request</h3>
            <pre className="text-sm bg-neutral-100 dark:bg-neutral-700 p-4 rounded overflow-x-auto">
              {`curl -X GET "https://api.sundate.com/api/auth/profile" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -H "Content-Type: application/json"`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-4">🔐 Getting Your API Key</h2>
        <p className="text-yellow-700 dark:text-yellow-300 mb-4">
          To obtain an API key, please contact our development team or visit the developer portal.
        </p>
        <ul className="text-yellow-700 dark:text-yellow-300 space-y-2">
          <li>• Email: dev@sundate.com</li>
          <li>• Developer Portal: https://dev.sundate.com</li>
          <li>• Support: https://support.sundate.com</li>
        </ul>
      </div>
    </div>
  )
}
