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
  ExternalLink,
  Play,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [expandedFeatures, setExpandedFeatures] = useState(false)

  const sections = [
    { id: 'overview', label: 'Overview', icon: BookOpen, level: 0 },
    { 
      id: 'features', 
      label: 'Features', 
      icon: Settings, 
      level: 0,
      children: [
        { id: 'reservations', label: 'Reservations', icon: Calendar },
        { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
        { id: 'contact', label: 'Contact', icon: MessageSquare },
        { id: 'authentication', label: 'Authentication', icon: Shield },
      ]
    },
    { id: 'testing', label: 'API Testing', icon: Play, level: 0 },
    { id: 'errors', label: 'Error Handling', icon: Zap, level: 0 },
  ]

  const handleSectionClick = (sectionId: string) => {
    if (sectionId === 'features') {
      setExpandedFeatures(!expandedFeatures)
    } else {
      setActiveSection(sectionId)
      // Auto-expand features if a child item is selected
      if (['reservations', 'menu', 'contact', 'authentication'].includes(sectionId)) {
        setExpandedFeatures(true)
      }
    }
  }

  const renderNavigationItem = (section: any, isChild = false) => {
    const Icon = section.icon
    const isActive = activeSection === section.id
    const isFeaturesExpanded = expandedFeatures || ['reservations', 'menu', 'contact', 'authentication'].includes(activeSection)
    
    if (section.children) {
      return (
        <div key={section.id}>
          <button
            onClick={() => handleSectionClick(section.id)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all text-md",
              isActive
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5" />
              <span className="font-medium">{section.label}</span>
            </div>
            <svg
              className={cn(
                "w-4 h-4 transition-transform",
                isFeaturesExpanded ? "rotate-180" : ""
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isFeaturesExpanded && (
            <div className="ml-4 mt-2 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-2">
              {section.children.map((child: any) => renderNavigationItem(child, true))}
            </div>
          )}
        </div>
      )
    }

    return (
      <button
        key={section.id}
        onClick={() => setActiveSection(section.id)}
        className={cn(
          "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all text-md",
          isActive
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
        )}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{section.label}</span>
      </button>
    )
  }

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
              {sections.map((section) => renderNavigationItem(section))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {activeSection === 'overview' && <OverviewSection />}
            {activeSection === 'reservations' && <ReservationsSection />}
            {activeSection === 'menu' && <MenuSection />}
            {activeSection === 'contact' && <ContactSection />}
            {activeSection === 'testing' && <APITestingSection />}
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

      {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
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
      </div> */}
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

function APITestingSection() {
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:5001')
  const [selectedEndpoint, setSelectedEndpoint] = useState('reservations-get')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const endpoints = [
    {
      id: 'reservations-get',
      method: 'GET',
      path: '/api/reservations',
      title: 'Get All Reservations',
      description: 'Retrieve a paginated list of all reservations with filtering and sorting options.',
      hasParams: true,
      hasBody: false
    },
    {
      id: 'reservations-create',
      method: 'POST',
      path: '/api/reservations',
      title: 'Create Reservation',
      description: 'Create a new table reservation with validation and availability checking.',
      hasParams: false,
      hasBody: true
    },
    {
      id: 'reservations-availability',
      method: 'GET',
      path: '/api/reservations/availability/check',
      title: 'Check Availability',
      description: 'Check if a specific time slot is available for a given number of guests.',
      hasParams: true,
      hasBody: false
    },
    {
      id: 'menu-get',
      method: 'GET',
      path: '/api/menu',
      title: 'Get Menu Items',
      description: 'Retrieve menu items with advanced filtering, search, and pagination.',
      hasParams: true,
      hasBody: false
    },
    {
      id: 'menu-categories',
      method: 'GET',
      path: '/api/menu/categories',
      title: 'Get Categories',
      description: 'Retrieve all available menu categories.',
      hasParams: false,
      hasBody: false
    },
    {
      id: 'contact-create',
      method: 'POST',
      path: '/api/contact',
      title: 'Submit Contact Form',
      description: 'Submit a new contact form with customer inquiry or feedback.',
      hasParams: false,
      hasBody: true
    },
    {
      id: 'health-check',
      method: 'GET',
      path: '/api/health',
      title: 'Health Check',
      description: 'Check API health status.',
      hasParams: false,
      hasBody: false
    }
  ]

  const selectedEndpointData = endpoints.find(ep => ep.id === selectedEndpoint)

  const handleApiCall = async () => {
    if (!selectedEndpointData) return
    
    setLoading(true)
    setError('')
    setResponse('')

    try {
      const url = new URL(selectedEndpointData.path, apiBaseUrl)
      
      // Add query parameters if they exist
      if (selectedEndpointData.hasParams) {
        const params = new FormData(document.getElementById('params-form') as HTMLFormElement)
        params.forEach((value, key) => {
          if (value) url.searchParams.append(key, value.toString())
        })
      }

      const options: RequestInit = {
        method: selectedEndpointData.method,
        headers: {
          'Content-Type': 'application/json',
        }
      }

      // Add body for POST requests
      if (selectedEndpointData.hasBody && selectedEndpointData.method === 'POST') {
        const formData = new FormData(document.getElementById('body-form') as HTMLFormElement)
        const bodyData: any = {}
        formData.forEach((value, key) => {
          if (value) bodyData[key] = value
        })
        options.body = JSON.stringify(bodyData)
      }

      const res = await fetch(url.toString(), options)
      const data = await res.json()

      setResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          API Testing
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Test the API endpoints directly from this documentation. Make sure your API server is running.
        </p>
      </div>

      {/* API Configuration */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          API Configuration
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Base URL
            </label>
            <input
              type="text"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="http://localhost:5001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Endpoint
            </label>
            <select
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {endpoints.map((endpoint) => (
                <option key={endpoint.id} value={endpoint.id}>
                  {endpoint.method} {endpoint.path} - {endpoint.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Endpoint Details */}
      {selectedEndpointData && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <span className={cn("method", selectedEndpointData.method.toLowerCase())}>
              {selectedEndpointData.method}
            </span>
            <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
              {selectedEndpointData.path}
            </code>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {selectedEndpointData.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {selectedEndpointData.description}
          </p>

          {/* Query Parameters Form */}
          {selectedEndpointData.hasParams && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Query Parameters</h4>
              <form id="params-form" className="space-y-3">
                                 {selectedEndpoint === 'reservations-get' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Page</label>
                        <input type="number" name="page" defaultValue="1" min="1" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Limit</label>
                        <input type="number" name="limit" defaultValue="10" min="1" max="100" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                        <select name="status" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option value="">All</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                        <select name="sortBy" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option value="date">Date</option>
                          <option value="name">Name</option>
                          <option value="guests">Guests</option>
                          <option value="createdAt">Created At</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort Order</label>
                      <select name="sortOrder" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </div>
                  </>
                )}
                                 {selectedEndpoint === 'reservations-availability' && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                      <input type="date" name="date" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                      <select name="time" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="6:00 PM">6:00 PM</option>
                        <option value="6:30 PM">6:30 PM</option>
                        <option value="7:00 PM">7:00 PM</option>
                        <option value="7:30 PM">7:30 PM</option>
                        <option value="8:00 PM">8:00 PM</option>
                        <option value="8:30 PM">8:30 PM</option>
                        <option value="9:00 PM">9:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guests</label>
                      <input type="number" name="guests" defaultValue="2" min="1" max="20" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                  </div>
                )}
                                 {selectedEndpoint === 'menu-get' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                      <select name="category" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="">All Categories</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Appetizers">Appetizers</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                      <input type="text" name="search" placeholder="Search menu items..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Price</label>
                      <input type="number" name="maxPrice" step="0.01" min="0" placeholder="50.00" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Featured Only</label>
                      <select name="isFeatured" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="">All Items</option>
                        <option value="true">Featured Only</option>
                        <option value="false">Not Featured</option>
                      </select>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Request Body Form */}
          {selectedEndpointData.hasBody && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Request Body</h4>
              <form id="body-form" className="space-y-3">
                                 {selectedEndpoint === 'reservations-create' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                        <input type="text" name="name" required placeholder="John Doe" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                        <input type="email" name="email" required placeholder="john@example.com" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
                        <input type="date" name="date" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time *</label>
                        <select name="time" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option value="6:00 PM">6:00 PM</option>
                          <option value="6:30 PM">6:30 PM</option>
                          <option value="7:00 PM">7:00 PM</option>
                          <option value="7:30 PM">7:30 PM</option>
                          <option value="8:00 PM">8:00 PM</option>
                          <option value="8:30 PM">8:30 PM</option>
                          <option value="9:00 PM">9:00 PM</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guests *</label>
                        <input type="number" name="guests" defaultValue="2" min="1" max="20" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                        <input type="tel" name="phone" placeholder="+1234567890" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Requests</label>
                      <textarea name="specialRequests" rows={3} placeholder="Any special requests or dietary restrictions..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                  </>
                )}
                                 {selectedEndpoint === 'contact-create' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                        <input type="text" name="name" required placeholder="John Doe" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                        <input type="email" name="email" required placeholder="john@example.com" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject *</label>
                      <input type="text" name="subject" required placeholder="General Inquiry" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
                      <textarea name="message" rows={4} required placeholder="Please describe your inquiry..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select name="category" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Reservation Question">Reservation Question</option>
                          <option value="Menu Question">Menu Question</option>
                          <option value="Feedback">Feedback</option>
                          <option value="Complaint">Complaint</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                        <input type="tel" name="phone" placeholder="+1234567890" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                  </>
                )}
              </form>
            </div>
          )}

          {/* Execute Button */}
          <button
            onClick={handleApiCall}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Execute Request</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Response Display */}
      {(response || error) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Response</h3>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error</h4>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
          
          {response && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Response Data</h4>
              <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto text-gray-800 dark:text-gray-200">
                {response}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* API Status */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">API Status</h3>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">
            Make sure your API server is running on the configured URL
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Default: http://localhost:5001 (update the base URL above if different)
        </p>
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
