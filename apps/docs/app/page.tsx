'use client'

import { useState } from 'react'
import { 
  BookOpen, 
  Code, 
  MessageSquare, 
  Calendar, 
  UtensilsCrossed,
  Zap,
  Shield,
  Github,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'contact', label: 'Contact', icon: MessageSquare },
    { id: 'authentication', label: 'Authentication', icon: Shield },
    { id: 'errors', label: 'Error Handling', icon: Zap },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  SunDate Café API
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Restaurant Management System
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/sundate-cafe/api"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href="/api/health"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                <span className="hidden sm:inline">API Status</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <nav className="sticky top-24 space-y-2">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all",
                      activeSection === section.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {activeSection === 'overview' && <OverviewSection />}
            {activeSection === 'reservations' && <ReservationsSection />}
            {activeSection === 'menu' && <MenuSection />}
            {activeSection === 'contact' && <ContactSection />}
            {activeSection === 'authentication' && <AuthenticationSection />}
            {activeSection === 'errors' && <ErrorHandlingSection />}
          </main>
        </div>
      </div>
    </div>
  )
}

function OverviewSection() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome to SunDate Café API
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          A comprehensive REST API for managing restaurant reservations, menu items, and customer communications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Reservations
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Manage table reservations with availability checking, time slots, and guest management.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Menu Management
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Handle menu items, categories, dietary options, and nutritional information.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Customer Contact
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Process customer inquiries, feedback, and support requests efficiently.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Start
        </h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Base URL</h4>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                https://api.sundate-cafe.com
              </code>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Authentication</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Most endpoints require authentication. Include your API key in the Authorization header.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Test the API</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Try our interactive examples or use tools like Postman to explore the endpoints.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-4 opacity-90">
          Explore our detailed endpoint documentation, test the API, and integrate it into your applications.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            View Examples
          </button>
          <button className="border border-white text-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Download SDK
          </button>
        </div>
      </div>
    </div>
  )
}

function ReservationsSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Reservations API
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Manage table reservations, check availability, and handle guest requests.
        </p>
      </div>

      <div className="space-y-6">
        <EndpointCard
          method="GET"
          path="/api/reservations"
          title="Get All Reservations"
          description="Retrieve a paginated list of all reservations with filtering and sorting options."
          parameters={[
            { name: 'page', type: 'number', description: 'Page number (default: 1)' },
            { name: 'limit', type: 'number', description: 'Items per page (default: 10)' },
            { name: 'status', type: 'string', description: 'Filter by reservation status' },
            { name: 'date', type: 'string', description: 'Filter by specific date' },
            { name: 'sortBy', type: 'string', description: 'Sort field (default: date)' },
            { name: 'sortOrder', type: 'string', description: 'Sort order: asc/desc (default: asc)' }
          ]}
          responseExample={`{
  "reservations": [...],
  "totalPages": 5,
  "currentPage": 1,
  "total": 48
}`}
        />

        <EndpointCard
          method="POST"
          path="/api/reservations"
          title="Create Reservation"
          description="Create a new table reservation with validation and availability checking."
          parameters={[
            { name: 'name', type: 'string', required: true, description: 'Customer name (2-100 chars)' },
            { name: 'email', type: 'string', required: true, description: 'Customer email' },
            { name: 'date', type: 'string', required: true, description: 'Reservation date (ISO 8601)' },
            { name: 'time', type: 'string', required: true, description: 'Time slot (6:00 PM - 9:00 PM)' },
            { name: 'guests', type: 'number', required: true, description: 'Number of guests (1-20)' },
            { name: 'phone', type: 'string', required: false, description: 'Phone number' },
            { name: 'specialRequests', type: 'string', required: false, description: 'Special requests (max 500 chars)' }
          ]}
          responseExample={`{
  "message": "Reservation created successfully",
  "reservation": {...},
  "confirmationNumber": "ABC12345"
}`}
        />

        <EndpointCard
          method="GET"
          path="/api/reservations/availability/check"
          title="Check Availability"
          description="Check if a specific time slot is available for a given number of guests."
          parameters={[
            { name: 'date', type: 'string', required: true, description: 'Date to check' },
            { name: 'time', type: 'string', required: true, description: 'Time slot to check' },
            { name: 'guests', type: 'number', required: true, description: 'Number of guests' }
          ]}
          responseExample={`{
  "date": "2024-01-15",
  "time": "7:00 PM",
  "guests": 4,
  "available": true,
  "currentOccupancy": 12,
  "remainingCapacity": 8
}`}
        />
      </div>
    </div>
  )
}

function MenuSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Menu API
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Manage menu items, categories, and dietary information.
        </p>
      </div>

      <div className="space-y-6">
        <EndpointCard
          method="GET"
          path="/api/menu"
          title="Get Menu Items"
          description="Retrieve menu items with advanced filtering, search, and pagination."
          parameters={[
            { name: 'category', type: 'string', description: 'Filter by category' },
            { name: 'search', type: 'string', description: 'Search in name/description' },
            { name: 'dietary', type: 'string[]', description: 'Filter by dietary restrictions' },
            { name: 'maxPrice', type: 'number', description: 'Maximum price filter' },
            { name: 'minPrice', type: 'number', description: 'Minimum price filter' },
            { name: 'spicyLevel', type: 'number', description: 'Spicy level (0-5)' },
            { name: 'isAvailable', type: 'boolean', description: 'Filter by availability' },
            { name: 'isFeatured', type: 'boolean', description: 'Filter featured items' }
          ]}
          responseExample={`{
  "menuItems": [...],
  "totalPages": 3,
  "currentPage": 1,
  "total": 45,
  "filters": {...}
}`}
        />

        <EndpointCard
          method="GET"
          path="/api/menu/categories"
          title="Get Categories"
          description="Retrieve all available menu categories."
          parameters={[]}
          responseExample={`[
  "Breakfast",
  "Lunch", 
  "Dinner",
  "Beverages",
  "Desserts",
  "Appetizers"
]`}
        />

        <EndpointCard
          method="GET"
          path="/api/menu/featured"
          title="Get Featured Items"
          description="Retrieve all featured menu items."
          parameters={[]}
          responseExample={`[
  {
    "id": "...",
    "name": "Grilled Salmon",
    "description": "...",
    "price": 28.99,
    "isFeatured": true
  }
]`}
        />
      </div>
    </div>
  )
}

function ContactSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Contact API
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Handle customer inquiries, feedback, and support requests.
        </p>
      </div>

      <div className="space-y-6">
        <EndpointCard
          method="POST"
          path="/api/contact"
          title="Submit Contact Form"
          description="Submit a new contact form with customer inquiry or feedback."
          parameters={[
            { name: 'name', type: 'string', required: true, description: 'Customer name (2-100 chars)' },
            { name: 'email', type: 'string', required: true, description: 'Customer email' },
            { name: 'subject', type: 'string', required: true, description: 'Subject (5-200 chars)' },
            { name: 'message', type: 'string', required: true, description: 'Message content (10-2000 chars)' },
            { name: 'phone', type: 'string', required: false, description: 'Phone number' },
            { name: 'category', type: 'string', required: false, description: 'Inquiry category' },
            { name: 'source', type: 'string', required: false, description: 'Contact source' },
            { name: 'isNewsletterSignup', type: 'boolean', required: false, description: 'Newsletter signup flag' }
          ]}
          responseExample={`{
  "message": "Contact submission received successfully",
  "contact": {...},
  "referenceNumber": "CONT12345"
}`}
        />

        <EndpointCard
          method="GET"
          path="/api/contact/stats"
          title="Get Contact Statistics"
          description="Retrieve contact form statistics and analytics (admin only)."
          parameters={[]}
          responseExample={`{
  "totalContacts": 156,
  "newContacts": 23,
  "inProgressContacts": 8,
  "resolvedContacts": 125,
  "urgentContacts": 5,
  "categoryStats": [...],
  "priorityStats": [...],
  "monthlyTrend": [...]
}`}
        />
      </div>
    </div>
  )
}

function AuthenticationSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Authentication
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Learn how to authenticate your API requests and manage access.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          API Key Authentication
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Most endpoints require authentication using an API key. Include your key in the Authorization header.
        </p>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Header Format</h3>
            <code className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded block">
              Authorization: Bearer YOUR_API_KEY_HERE
            </code>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Example Request</h3>
            <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto">
{`curl -X GET "https://api.sundate-cafe.com/api/reservations" \\
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \\
  -H "Content-Type: application/json"`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
          🔐 Getting Your API Key
        </h2>
        <p className="text-yellow-700 dark:text-yellow-300 mb-4">
          To obtain an API key, please contact our development team or visit the developer portal.
        </p>
        <ul className="text-yellow-700 dark:text-yellow-300 space-y-2">
          <li>• Email: dev@sundate-cafe.com</li>
          <li>• Developer Portal: https://dev.sundate-cafe.com</li>
          <li>• Support: https://support.sundate-cafe.com</li>
        </ul>
      </div>
    </div>
  )
}

function ErrorHandlingSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Error Handling
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Understand how the API handles errors and how to respond to them in your applications.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            HTTP Status Codes
          </h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-green-600 dark:text-green-400">200</span>
              <span className="text-gray-600 dark:text-gray-400">Success</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-blue-600 dark:text-blue-400">201</span>
              <span className="text-gray-600 dark:text-gray-400">Created</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-yellow-600 dark:text-yellow-400">400</span>
              <span className="text-gray-600 dark:text-gray-400">Bad Request</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-red-600 dark:text-red-400">401</span>
              <span className="text-gray-600 dark:text-gray-400">Unauthorized</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-red-600 dark:text-red-400">404</span>
              <span className="text-gray-600 dark:text-gray-400">Not Found</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-red-600 dark:text-red-400">500</span>
              <span className="text-gray-600 dark:text-gray-400">Internal Server Error</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Error Response Format
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All error responses follow a consistent format:
          </p>
          <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto">
{`{
  "error": "Error type description",
  "message": "Detailed error message",
  "details": [
    {
      "field": "fieldName",
      "message": "Field-specific error message"
    }
  ]
}`}
          </pre>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Common Error Scenarios
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Validation Errors (400)</h3>
              <p className="text-gray-600 dark:text-gray-400">
                When request data fails validation, you&apos;ll receive detailed field-specific error messages.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Authentication Errors (401)</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Invalid or missing API key will result in an authentication error.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Rate Limiting (429)</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Exceeding rate limits will result in a 429 status with retry-after header.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EndpointCard({ 
  method, 
  path, 
  title, 
  description, 
  parameters = [], 
  responseExample 
}: {
  method: string
  path: string
  title: string
  description: string
  parameters?: Array<{
    name: string
    type: string
    required?: boolean
    description: string
  }>
  responseExample?: string
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-4">
        <span className={cn("method", method.toLowerCase())}>
          {method}
        </span>
        <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
          {path}
        </code>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {description}
      </p>

      {parameters.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Parameters</h4>
          <div className="space-y-2">
            {parameters.map((param) => (
              <div key={param.name} className="flex items-start space-x-3">
                <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded min-w-[80px]">
                  {param.name}
                </code>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {param.type}
                    </span>
                    {param.required && (
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {param.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {responseExample && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Response Example</h4>
          <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto">
            {responseExample}
          </pre>
        </div>
      )}
    </div>
  )
}
