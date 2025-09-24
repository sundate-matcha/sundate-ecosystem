'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  Settings,
  Menu,
  X,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { API_URL } from '@/lib/constants'

// Time slot options in 24-hour format
const TIME_SLOT_OPTIONS = [
  { value: '18:00', label: '18:00' },
  { value: '18:30', label: '18:30' },
  { value: '19:00', label: '19:00' },
  { value: '19:30', label: '19:30' },
  { value: '20:00', label: '20:00' },
  { value: '20:30', label: '20:30' },
  { value: '21:00', label: '21:00' }
]

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
      { id: 'admin-menu', label: 'Admin Menu', icon: Settings }
    ]
  },
  { id: 'errors', label: 'Error Handling', icon: Zap, level: 0 },
  { id: 'testing', label: 'API Testing', icon: Play, level: 0 }
]

// Create a wrapper component for the main content that uses search params
function HomePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [expandedFeatures, setExpandedFeatures] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Get active section from URL search params, default to 'overview'
  const activeSection = searchParams.get('section') || 'overview'

  // Update URL when section changes
  const updateSection = (sectionId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (sectionId === 'overview') {
      params.delete('section')
    } else {
      params.set('section', sectionId)
    }
    router.push(`?${params.toString()}`)
  }

  const handleSectionClick = (sectionId: string) => {
    if (sectionId === 'features') {
      setExpandedFeatures(!expandedFeatures)
    } else {
      updateSection(sectionId)
      // Auto-expand features if a child item is selected
      if (['reservations', 'menu', 'contact', 'authentication'].includes(sectionId)) {
        setExpandedFeatures(true)
      }
      // Close mobile navigation when a section is selected
      setMobileNavOpen(false)
    }
  }

  // Auto-expand features section when a child item is active
  useEffect(() => {
    if (['reservations', 'menu', 'contact', 'authentication'].includes(activeSection)) {
      setExpandedFeatures(true)
    }
  }, [activeSection])

  // Sync URL with current section on page load
  useEffect(() => {
    const section = searchParams.get('section')
    if (section && section !== 'overview') {
      // Ensure the URL reflects the current section
      const params = new URLSearchParams(searchParams.toString())
      if (!params.has('section')) {
        params.set('section', section)
        router.replace(`?${params.toString()}`)
      }
    }
  }, [searchParams, router])

  // Update document title based on current section
  useEffect(() => {
    const section = searchParams.get('section')
    if (section && section !== 'overview') {
      const sectionLabel =
        sections.find(s => s.id === section)?.label ||
        sections.flatMap(s => s.children || []).find(c => c.id === section)?.label
      if (sectionLabel) {
        document.title = `${sectionLabel} - Sundate API Documentation`
      }
    } else {
      document.title = 'Sundate API Documentation'
    }
  }, [searchParams])

  const renderNavigationItem = (section: any, isChild = false) => {
    const Icon = section.icon
    const isActive = activeSection === section.id
    const isFeaturesExpanded =
      expandedFeatures || ['reservations', 'menu', 'contact', 'authentication'].includes(activeSection)

    if (section.children) {
      return (
        <div key={section.id}>
          <button
            onClick={() => handleSectionClick(section.id)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all text-md',
              isActive
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
            )}
          >
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5" />
              <span className="font-medium">{section.label}</span>
              {isFeaturesExpanded && ['reservations', 'menu', 'contact', 'authentication'].includes(activeSection) && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <svg
              className={cn('w-4 h-4 transition-transform', isFeaturesExpanded ? 'rotate-180' : '')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isFeaturesExpanded && (
            <div className="ml-4 mt-2 space-y-1 border-l border-neutral-200 dark:border-neutral-700 pl-2">
              {section.children.map((child: any) => renderNavigationItem(child, true))}
            </div>
          )}
        </div>
      )
    }

    return (
      <button
        key={section.id}
        onClick={() => {
          updateSection(section.id)
          setMobileNavOpen(false)
        }}
        className={cn(
          'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all text-md relative',
          isActive
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500 shadow-sm'
            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
        )}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{section.label}</span>
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Header */}
      <header className="bg-white/60 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-700 to-red-600 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-amber-100" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Sundate Matcha API</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Coffee Shop Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/sundate-matcha/sundate-ecosystem/tree/main/apps/api/"
                className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href="/api/health"
                className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                <span className="hidden sm:inline">API Status</span>
              </a>

              {/* Mobile Navigation Toggle */}
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {/* {mobileNavOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )} */}
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileNavOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Mobile Navigation Sidebar */}
      <div
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 transform transition-transform duration-300 ease-in-out shadow-2xl',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Navigation</h2>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
          {sections.map(section => renderNavigationItem(section))}
        </nav>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-1">
            <nav className="sticky top-24 space-y-2">{sections.map(section => renderNavigationItem(section))}</nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {activeSection === 'overview' && <OverviewSection />}
            {activeSection === 'reservations' && <ReservationsSection />}
            {activeSection === 'menu' && <MenuSection />}
            {activeSection === 'contact' && <ContactSection />}
            {activeSection === 'testing' && (
              <Suspense fallback={<div>Loading API Testing...</div>}>
                <APITestingSection activeSection={activeSection} />
              </Suspense>
            )}
            {activeSection === 'authentication' && <AuthenticationSection />}
            {activeSection === 'admin-menu' && <AdminMenuSection />}
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
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">Welcome to Sundate Matcha API</h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
          A comprehensive REST API for managing restaurant reservations, menu items, and customer communications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Reservations</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage table reservations with availability checking, business hours (08:30 - 21:00), Sunday closure,
            and guest management.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Menu Management</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Handle menu items, categories, dietary options, and nutritional information. Includes admin CRUD operations
            and public landing page endpoints.
          </p>
        </div>

        {/* <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Customer Contact</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Process customer inquiries, feedback, and support requests efficiently.
          </p>
        </div> */}

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">User Authentication</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Secure user registration, login, logout, and profile management with JWT tokens and role-based access
            control.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Quick Start</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
              1
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white">Base URL</h4>
              <code className="text-sm bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">{API_URL}</code>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
              2
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white">Authentication</h4>
              <p className="text-neutral-600 dark:text-neutral-400">
                Most endpoints require authentication. Use JWT tokens for user authentication and admin operations.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
              3
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white">Test the API</h4>
              <p className="text-neutral-600 dark:text-neutral-400">
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
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-neutral-100 transition-colors">
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
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Reservations API</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
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
            { name: 'phone', type: 'string', required: true, description: 'Phone number (required)' },
            { name: 'date', type: 'string', required: true, description: 'Reservation date (ISO 8601, no Sundays)' },
            { name: 'time', type: 'string', required: true, description: 'Time slot (18:00 - 21:00)' },
            { name: 'guests', type: 'number', required: true, description: 'Number of guests (1-20)' },
            { name: 'email', type: 'string', required: false, description: 'Customer email (optional)' },
            {
              name: 'specialRequests',
              type: 'string',
              required: false,
              description: 'Special requests (max 500 chars)'
            },
            {
              name: 'notes',
              type: 'string',
              required: false,
              description: 'Additional notes (max 200 chars)'
            }
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
            "time": "19:00",
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
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Menu API</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
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

        <EndpointCard
          method="GET"
          path="/api/menu/public"
          title="Get Public Menu Items"
          description="Retrieve public menu items for landing page (only available items)."
          parameters={[
            { name: 'category', type: 'string', description: 'Filter by category' },
            { name: 'search', type: 'string', description: 'Search in name/description' },
            { name: 'dietary', type: 'string[]', description: 'Filter by dietary restrictions' },
            { name: 'maxPrice', type: 'number', description: 'Maximum price filter' },
            { name: 'minPrice', type: 'number', description: 'Minimum price filter' },
            { name: 'spicyLevel', type: 'number', description: 'Spicy level (0-5)' },
            { name: 'page', type: 'number', description: 'Page number (default: 1)' },
            { name: 'limit', type: 'number', description: 'Items per page (default: 20)' },
            { name: 'sortBy', type: 'string', description: 'Sort field (default: name)' },
            { name: 'sortOrder', type: 'string', description: 'Sort order: asc/desc (default: asc)' }
          ]}
          responseExample={`{
            "menuItems": [
              {
                "id": "...",
                "name": "Grilled Salmon",
                "description": "...",
                "price": 28.99,
                "category": "Dinner"
              }
            ],
            "totalPages": 3,
            "currentPage": 1,
            "total": 45,
            "filters": {...}
          }`}
        />
      </div>
    </div>
  )
}

function ContactSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Contact API</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
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

function AdminMenuSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Admin Menu Management</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Administrative endpoints for managing menu items. Requires admin authentication.
        </p>
      </div>

      <div className="space-y-6">
        <EndpointCard
          method="POST"
          path="/api/menu"
          title="Create Menu Item"
          description="Create a new menu item. Admin only."
          parameters={[
            { name: 'name', type: 'string', required: true, description: 'Item name (2-100 chars)' },
            { name: 'description', type: 'string', required: true, description: 'Description (10-500 chars)' },
            { name: 'price', type: 'number', required: true, description: 'Price (positive number)' },
            { name: 'category', type: 'string', required: true, description: 'Category from predefined list' },
            { name: 'ingredients', type: 'string[]', required: false, description: 'Array of ingredients' },
            { name: 'allergens', type: 'string[]', required: false, description: 'Array of allergens' },
            { name: 'dietary', type: 'string[]', required: false, description: 'Dietary options' },
            { name: 'spicyLevel', type: 'number', required: false, description: 'Spicy level (0-5)' },
            { name: 'preparationTime', type: 'number', required: false, description: 'Prep time in minutes' },
            { name: 'calories', type: 'number', required: false, description: 'Calorie content' },
            { name: 'protein', type: 'number', required: false, description: 'Protein content' },
            { name: 'carbs', type: 'number', required: false, description: 'Carbohydrate content' },
            { name: 'fat', type: 'number', required: false, description: 'Fat content' },
            { name: 'tags', type: 'string[]', required: false, description: 'Array of tags' }
          ]}
          responseExample={`{
  "message": "Menu item created successfully",
  "menuItem": {
    "id": "...",
    "name": "Grilled Salmon",
    "description": "...",
    "price": 28.99,
    "category": "Dinner"
  }
}`}
        />

        <EndpointCard
          method="PUT"
          path="/api/menu/:id"
          title="Update Menu Item"
          description="Update an existing menu item. Admin only."
          parameters={[
            { name: 'id', type: 'string', required: true, description: 'Menu item ID' },
            { name: 'name', type: 'string', required: false, description: 'Item name (2-100 chars)' },
            { name: 'description', type: 'string', required: false, description: 'Description (10-500 chars)' },
            { name: 'price', type: 'number', required: false, description: 'Price (positive number)' },
            { name: 'category', type: 'string', required: false, description: 'Category from predefined list' }
          ]}
          responseExample={`{
  "message": "Menu item updated successfully",
  "menuItem": {
    "id": "...",
    "name": "Updated Grilled Salmon",
    "description": "...",
    "price": 29.99,
    "category": "Dinner"
  }
}`}
        />

        <EndpointCard
          method="DELETE"
          path="/api/menu/:id"
          title="Delete Menu Item"
          description="Delete a menu item. Admin only."
          parameters={[{ name: 'id', type: 'string', required: true, description: 'Menu item ID' }]}
          responseExample={`{
  "message": "Menu item deleted successfully"
}`}
        />

        <EndpointCard
          method="PATCH"
          path="/api/menu/:id/toggle-availability"
          title="Toggle Availability"
          description="Toggle menu item availability. Admin only."
          parameters={[{ name: 'id', type: 'string', required: true, description: 'Menu item ID' }]}
          responseExample={`{
  "message": "Menu item made unavailable",
  "menuItem": {
    "id": "...",
    "isAvailable": false
  }
}`}
        />

        <EndpointCard
          method="PATCH"
          path="/api/menu/:id/toggle-featured"
          title="Toggle Featured Status"
          description="Toggle menu item featured status. Admin only."
          parameters={[{ name: 'id', type: 'string', required: true, description: 'Menu item ID' }]}
          responseExample={`{
  "message": "Menu item marked as featured",
  "menuItem": {
    "id": "...",
    "isFeatured": true
  }
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
          parameters={[
            {
              name: 'username',
              type: 'string',
              required: true,
              description: 'Username (3-30 chars, alphanumeric + underscore)'
            },
            { name: 'email', type: 'string', required: true, description: 'Valid email address' },
            { name: 'password', type: 'string', required: true, description: 'Password (min 6 chars)' },
            { name: 'firstName', type: 'string', required: true, description: 'First name (1-50 chars)' },
            { name: 'lastName', type: 'string', required: true, description: 'Last name (1-50 chars)' },
            { name: 'phone', type: 'string', required: false, description: 'Phone number (optional)' }
          ]}
          responseExample={`{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
        />

        <EndpointCard
          method="POST"
          path="/api/auth/login"
          title="User Login"
          description="Authenticate user and get JWT token."
          parameters={[
            { name: 'identifier', type: 'string', required: true, description: 'Email or username' },
            { name: 'password', type: 'string', required: true, description: 'User password' }
          ]}
          responseExample={`{
  "message": "Login successful",
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
        />

        <EndpointCard
          method="POST"
          path="/api/auth/logout"
          title="User Logout"
          description="Logout user (client-side token removal)."
          parameters={[]}
          responseExample={`{
  "message": "Logout successful",
  "note": "Please remove the token from client storage"
}`}
        />

        <EndpointCard
          method="GET"
          path="/api/auth/profile"
          title="Get User Profile"
          description="Get current user profile information."
          parameters={[]}
          responseExample={`{
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}`}
        />

        <EndpointCard
          method="PUT"
          path="/api/auth/profile"
          title="Update User Profile"
          description="Update current user profile information."
          parameters={[
            { name: 'firstName', type: 'string', required: false, description: 'First name (1-50 chars)' },
            { name: 'lastName', type: 'string', required: false, description: 'Last name (1-50 chars)' },
            { name: 'phone', type: 'string', required: false, description: 'Phone number (10-15 chars)' },
            { name: 'preferences', type: 'object', required: false, description: 'User preferences object' }
          ]}
          responseExample={`{
  "message": "Profile updated successfully",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890"
  }
}`}
        />

        <EndpointCard
          method="POST"
          path="/api/auth/change-password"
          title="Change Password"
          description="Change user password."
          parameters={[
            { name: 'currentPassword', type: 'string', required: true, description: 'Current password' },
            { name: 'newPassword', type: 'string', required: true, description: 'New password (min 6 chars)' }
          ]}
          responseExample={`{
  "message": "Password changed successfully"
}`}
        />

        <EndpointCard
          method="GET"
          path="/api/auth/verify"
          title="Verify Token"
          description="Verify JWT token validity."
          parameters={[]}
          responseExample={`{
  "valid": true,
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com"
  }
}`}
        />
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

function ErrorHandlingSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Error Handling</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Understand how the API handles errors and how to respond to them in your applications.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">HTTP Status Codes</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-green-600 dark:text-green-400">200</span>
              <span className="text-neutral-600 dark:text-neutral-400">Success</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-blue-600 dark:text-blue-400">201</span>
              <span className="text-neutral-600 dark:text-neutral-400">Created</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-yellow-600 dark:text-yellow-400">400</span>
              <span className="text-neutral-600 dark:text-neutral-400">Bad Request</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-red-600 dark:text-red-400">401</span>
              <span className="text-neutral-600 dark:text-neutral-400">Unauthorized</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-red-600 dark:text-red-400">404</span>
              <span className="text-neutral-600 dark:text-neutral-400">Not Found</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-red-600 dark:text-red-400">500</span>
              <span className="text-neutral-600 dark:text-neutral-400">Internal Server Error</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Error Response Format</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">All error responses follow a consistent format:</p>
          <pre className="text-sm bg-neutral-100 dark:bg-neutral-700 p-4 rounded overflow-x-auto">
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

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Common Error Scenarios</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Validation Errors (400)</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                When request data fails validation, you&apos;ll receive detailed field-specific error messages.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Authentication Errors (401)</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Invalid or missing API key will result in an authentication error.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Rate Limiting (429)</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Exceeding rate limits will result in a 429 status with retry-after header.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const endpoints = [
  {
    id: 'health-check',
    method: 'GET',
    path: '/api/health',
    title: 'Health Check',
    description: 'Check API health status.',
    hasParams: false,
    hasBody: false,
    testable: true
  },
  {
    id: 'reservations-get',
    method: 'GET',
    path: '/api/reservations',
    title: 'Get All Reservations',
    description: 'Retrieve a paginated list of all reservations with filtering and sorting options.',
    hasParams: true,
    hasBody: false,
    testable: true
  },
  {
    id: 'reservations-create',
    method: 'POST',
    path: '/api/reservations',
    title: 'Create Reservation',
    description: 'Create a new table reservation with validation and availability checking.',
    hasParams: false,
    hasBody: true,
    testable: false
  },
  {
    id: 'reservations-availability',
    method: 'GET',
    path: '/api/reservations/availability/check',
    title: 'Check Availability',
    description: 'Check if a specific time slot is available for a given number of guests.',
    hasParams: true,
    hasBody: false,
    testable: false
  },
  {
    id: 'menu-get',
    method: 'GET',
    path: '/api/menu',
    title: 'Get Menu Items',
    description: 'Retrieve menu items with advanced filtering, search, and pagination.',
    hasParams: true,
    hasBody: false,
    testable: true
  },
  {
    id: 'menu-public',
    method: 'GET',
    path: '/api/menu/public',
    title: 'Get Public Menu Items',
    description: 'Retrieve public menu items for landing page (only available items).',
    hasParams: true,
    hasBody: false,
    testable: true
  },
  {
    id: 'menu-categories',
    method: 'GET',
    path: '/api/menu/categories',
    title: 'Get Categories',
    description: 'Retrieve all available menu categories.',
    hasParams: false,
    hasBody: false,
    testable: true
  },
  {
    id: 'auth-register',
    method: 'POST',
    path: '/api/auth/register',
    title: 'User Registration',
    description: 'Register a new user account.',
    hasParams: false,
    hasBody: true,
    testable: false
  },
  {
    id: 'auth-login',
    method: 'POST',
    path: '/api/auth/login',
    title: 'User Login',
    description: 'Authenticate user and get JWT token.',
    hasParams: false,
    hasBody: true,
    testable: false
  },
  {
    id: 'auth-profile',
    method: 'GET',
    path: '/api/auth/profile',
    title: 'Get User Profile',
    description: 'Get current user profile information.',
    hasParams: false,
    hasBody: false,
    testable: false
  },
  {
    id: 'contact-create',
    method: 'POST',
    path: '/api/contact',
    title: 'Submit Contact Form',
    description: 'Submit a new contact form with customer inquiry or feedback.',
    hasParams: false,
    hasBody: true,
    testable: false
  }
]

function APITestingSection({ activeSection }: { activeSection: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [apiBaseUrl, setApiBaseUrl] = useState(API_URL)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [apiStatus, setApiStatus] = useState<{
    [key: string]: {
      status: 'idle' | 'checking' | 'success' | 'error'
      responseTime?: number
      statusCode?: number
      lastChecked?: Date
    }
  }>({})
  const [checkingAll, setCheckingAll] = useState(false)

  // Get selected endpoint from URL params, default to 'health-check'
  const selectedEndpoint = searchParams.get('endpoint') || 'health-check'
  const testableEndpoints = endpoints.filter(endpoint => endpoint.method === 'GET' && !!endpoint.testable)

  // Update URL when endpoint changes
  const updateSelectedEndpoint = (endpointId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (endpointId === 'health-check') {
      params.delete('endpoint')
    } else {
      params.set('endpoint', endpointId)
    }
    router.push(`?${params.toString()}`)
  }

  const checkEndpointStatus = async (endpointId: string) => {
    const endpoint = endpoints.find(ep => ep.id === endpointId)
    if (!endpoint) return

    // Check if API base URL is valid
    if (!apiBaseUrl || !apiBaseUrl.trim()) {
      setApiStatus(prev => ({
        ...prev,
        [endpointId]: {
          status: 'error',
          responseTime: 0,
          statusCode: undefined,
          lastChecked: new Date()
        }
      }))
      return
    }

    setApiStatus(prev => ({
      ...prev,
      [endpointId]: { status: 'checking' }
    }))

    const startTime = Date.now()

    try {
      const url = new URL(endpoint.path, apiBaseUrl)
      const res = await fetch(url.toString(), {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const responseTime = Date.now() - startTime

      setApiStatus(prev => ({
        ...prev,
        [endpointId]: {
          status: res.ok ? 'success' : 'error',
          responseTime,
          statusCode: res.status,
          lastChecked: new Date()
        }
      }))
    } catch (err) {
      console.log(err)
      const responseTime = Date.now() - startTime
      setApiStatus(prev => ({
        ...prev,
        [endpointId]: {
          status: 'error',
          responseTime,
          statusCode: undefined,
          lastChecked: new Date()
        }
      }))
    }
  }

  const checkAllEndpoints = async () => {
    if (!apiBaseUrl || !apiBaseUrl.trim()) {
      // Mark all endpoints as error if no base URL
      const errorStatus: {
        [key: string]: {
          status: 'idle' | 'checking' | 'success' | 'error'
          responseTime?: number
          statusCode?: number
          lastChecked?: Date
        }
      } = {}
      endpoints.forEach(endpoint => {
        errorStatus[endpoint.id] = {
          status: 'error',
          responseTime: 0,
          statusCode: undefined,
          lastChecked: new Date()
        }
      })
      setApiStatus(errorStatus)
      return
    }

    setCheckingAll(true)
    // Only check GET endpoints for API status monitoring
    const promises = testableEndpoints.map(endpoint => checkEndpointStatus(endpoint.id))
    await Promise.all(promises)
    setCheckingAll(false)
  }

  // Initialize API status for GET endpoints only
  useEffect(() => {
    const initialStatus: {
      [key: string]: {
        status: 'idle' | 'checking' | 'success' | 'error'
        responseTime?: number
        statusCode?: number
        lastChecked?: Date
      }
    } = {}
    // Only initialize status for GET endpoints
    testableEndpoints.forEach(endpoint => {
      initialStatus[endpoint.id] = { status: 'idle' }
    })
    setApiStatus(initialStatus)

    // Auto-check health endpoint when component mounts or API base URL changes
    if (apiBaseUrl) {
      checkEndpointStatus('health-check')
    }
  }, [apiBaseUrl])

  // Sync URL with current endpoint on page load
  useEffect(() => {
    const endpoint = searchParams.get('endpoint')
    if (endpoint && endpoint !== 'health-check') {
      // Ensure the URL reflects the current endpoint
      const params = new URLSearchParams(searchParams.toString())
      if (!params.has('endpoint')) {
        params.set('endpoint', endpoint)
        router.replace(`?${params.toString()}`)
      }
    }
  }, [searchParams, router])

  // Update document title for API testing section
  useEffect(() => {
    if (activeSection === 'testing') {
      const endpoint = searchParams.get('endpoint')
      if (endpoint && endpoint !== 'health-check') {
        const endpointData = endpoints.find(ep => ep.id === endpoint)
        if (endpointData) {
          document.title = `${endpointData.title} - API Testing - Sundate Matcha API Documentation`
        }
      } else {
        document.title = 'API Testing - Sundate Matcha API Documentation'
      }
    }
  }, [selectedEndpoint, activeSection, searchParams, endpoints])

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
          'Content-Type': 'application/json'
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
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">API Testing</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Test the API endpoints directly from this documentation. Make sure your API server is running.
        </p>

        {/* Endpoint Breadcrumb */}
        {selectedEndpoint !== 'health-check' && (
          <div className="mt-4">
            <nav className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
              <button
                onClick={() => updateSelectedEndpoint('health-check')}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Health Check
              </button>
              <span>/</span>
              <span className="text-neutral-900 dark:text-white font-medium">
                {endpoints.find(ep => ep.id === selectedEndpoint)?.title || selectedEndpoint}
              </span>
            </nav>
          </div>
        )}
      </div>

      {/* API Configuration */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">API Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              API Base URL
            </label>
            <input
              type="text"
              value={apiBaseUrl}
              onChange={e => setApiBaseUrl(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="http://localhost:5001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Select Endpoint
            </label>
            <div className="relative select-container">
              <select
                value={selectedEndpoint}
                onChange={e => updateSelectedEndpoint(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 shadow-sm"
              >
                {endpoints.map(endpoint => (
                  <option key={endpoint.id} value={endpoint.id}>
                    {endpoint.method} {endpoint.path} - {endpoint.title}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-neutral-400 dark:text-neutral-500 transition-transform duration-200 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Endpoint Details */}
      {selectedEndpointData && (
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center space-x-3 mb-4">
            <span className={cn('method', selectedEndpointData.method.toLowerCase())}>
              {selectedEndpointData.method}
            </span>
            <code className="text-sm font-mono bg-neutral-100 dark:bg-neutral-700 px-3 py-1 rounded">
              {selectedEndpointData.path}
            </code>
          </div>

          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">{selectedEndpointData.title}</h3>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">{selectedEndpointData.description}</p>

          {/* Query Parameters Form */}
          {selectedEndpointData.hasParams && (
            <div className="mb-6">
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Query Parameters</h4>
              <form id="params-form" className="space-y-3">
                {selectedEndpoint === 'reservations-get' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Page
                        </label>
                        <input
                          type="number"
                          name="page"
                          defaultValue="1"
                          min="1"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Limit
                        </label>
                        <input
                          type="number"
                          name="limit"
                          defaultValue="10"
                          min="1"
                          max="100"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Status
                        </label>
                        <select
                          name="status"
                          className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 shadow-sm"
                        >
                          <option value="">All</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Sort By
                        </label>
                        <select
                          name="sortBy"
                          className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 shadow-sm"
                        >
                          <option value="date">Date</option>
                          <option value="name">Name</option>
                          <option value="guests">Guests</option>
                          <option value="createdAt">Created At</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Sort Order
                      </label>
                      <select
                        name="sortOrder"
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 shadow-sm"
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </div>
                  </>
                )}
                {selectedEndpoint === 'reservations-availability' && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        required
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Time
                      </label>
                      <select
                        name="time"
                        required
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 shadow-sm"
                      >
                        {TIME_SLOT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Guests
                      </label>
                      <input
                        type="number"
                        name="guests"
                        defaultValue="2"
                        min="1"
                        max="20"
                        required
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
                {selectedEndpoint === 'menu-get' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 shadow-sm"
                      >
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
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Search
                      </label>
                      <input
                        type="text"
                        name="search"
                        placeholder="Search menu items..."
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Max Price
                      </label>
                      <input
                        type="number"
                        name="maxPrice"
                        step="0.01"
                        min="0"
                        placeholder="50.00"
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Featured Only
                      </label>
                      <select
                        name="isFeatured"
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 shadow-sm"
                      >
                        <option value="">All Items</option>
                        <option value="true">Featured Only</option>
                        <option value="false">Not Featured</option>
                      </select>
                    </div>
                  </div>
                )}
                {selectedEndpoint === 'menu-public' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 shadow-sm"
                      >
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
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Search
                      </label>
                      <input
                        type="text"
                        name="search"
                        placeholder="Search menu items..."
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Max Price
                      </label>
                      <input
                        type="number"
                        name="maxPrice"
                        step="0.01"
                        min="0"
                        placeholder="50.00"
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Min Price
                      </label>
                      <input
                        type="number"
                        name="minPrice"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Spicy Level
                      </label>
                      <select
                        name="spicyLevel"
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 shadow-sm"
                      >
                        <option value="">Any Level</option>
                        <option value="0">Not Spicy</option>
                        <option value="1">Mild</option>
                        <option value="2">Medium</option>
                        <option value="3">Hot</option>
                        <option value="4">Very Hot</option>
                        <option value="5">Extreme</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Dietary
                      </label>
                      <select
                        name="dietary"
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 shadow-sm"
                      >
                        <option value="">Any Dietary</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Gluten-Free">Gluten-Free</option>
                        <option value="Dairy-Free">Dairy-Free</option>
                        <option value="Nut-Free">Nut-Free</option>
                        <option value="Halal">Halal</option>
                        <option value="Kosher">Kosher</option>
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
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Request Body</h4>
              <form id="body-form" className="space-y-3">
                {selectedEndpoint === 'reservations-create' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="John Doe"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+1234567890"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Date *
                        </label>
                        <input
                          type="date"
                          name="date"
                          required
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Time *
                        </label>
                        <select
                          name="time"
                          required
                          className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 shadow-sm"
                        >
                          {TIME_SLOT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Guests *
                        </label>
                        <input
                          type="number"
                          name="guests"
                          defaultValue="2"
                          min="1"
                          max="20"
                          required
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Special Requests
                      </label>
                      <textarea
                        name="specialRequests"
                        rows={3}
                        placeholder="Any special requests or dietary restrictions..."
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        rows={2}
                        placeholder="Additional notes or comments..."
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </>
                )}
                {selectedEndpoint === 'contact-create' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="John Doe"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="john@example.com"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        placeholder="General Inquiry"
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        required
                        placeholder="Please describe your inquiry..."
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Category
                        </label>
                        <select
                          name="category"
                          className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 shadow-sm"
                        >
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
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+1234567890"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </>
                )}
                {selectedEndpoint === 'auth-register' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Username *
                        </label>
                        <input
                          type="text"
                          name="username"
                          required
                          placeholder="john_doe"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="john@example.com"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          placeholder="John"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          placeholder="Doe"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Password *
                        </label>
                        <input
                          type="password"
                          name="password"
                          required
                          placeholder="••••••••"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+1234567890"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </>
                )}
                {selectedEndpoint === 'auth-login' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Email or Username *
                      </label>
                      <input
                        type="text"
                        name="identifier"
                        required
                        placeholder="john@example.com or john_doe"
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        required
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      />
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
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Response</h3>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error</h4>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {response && (
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Response Data</h4>
              <pre className="text-sm bg-neutral-100 dark:bg-neutral-700 p-4 rounded overflow-x-auto text-neutral-800 dark:text-neutral-200">
                {response}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* API Status */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">API Status</h3>
            {(() => {
              const allStatuses = Object.values(apiStatus)
              const successCount = allStatuses.filter(s => s.status === 'success').length
              const errorCount = allStatuses.filter(s => s.status === 'error').length
              const totalChecked = allStatuses.filter(s => s.status !== 'idle').length

              if (totalChecked === 0) return null

              const overallStatus = errorCount === 0 ? 'success' : errorCount === totalChecked ? 'error' : 'partial'
              const statusColor =
                overallStatus === 'success'
                  ? 'bg-green-500'
                  : overallStatus === 'error'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
              const statusText =
                overallStatus === 'success'
                  ? 'All Endpoints Online'
                  : overallStatus === 'error'
                    ? 'All Endpoints Offline'
                    : 'Some Endpoints Offline'

              return (
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${statusColor} rounded-full`}></div>
                  <span
                    className={`text-sm font-medium ${
                      overallStatus === 'success'
                        ? 'text-green-700 dark:text-green-300'
                        : overallStatus === 'error'
                          ? 'text-red-700 dark:text-red-300'
                          : 'text-yellow-700 dark:text-yellow-300'
                    }`}
                  >
                    {statusText}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    ({successCount}/{totalChecked} online)
                  </span>
                </div>
              )
            })()}
          </div>
          <button
            onClick={checkAllEndpoints}
            disabled={checkingAll}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
            {checkingAll ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Checking...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Check All Endpoints</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-3">
          {endpoints.map(endpoint => {
            const status = apiStatus[endpoint.id]
            if (!status) return null

            const getStatusColor = () => {
              switch (status.status) {
                case 'success':
                  return 'bg-green-500'
                case 'error':
                  return 'bg-red-500'
                case 'checking':
                  return 'bg-yellow-500 animate-pulse'
                default:
                  return 'bg-neutral-400'
              }
            }

            const getStatusText = () => {
              switch (status.status) {
                case 'success':
                  return 'Online'
                case 'error':
                  return 'Offline'
                case 'checking':
                  return 'Checking...'
                default:
                  return 'Not Checked'
              }
            }

            const getStatusTextColor = () => {
              switch (status.status) {
                case 'success':
                  return 'text-green-700 dark:text-green-300'
                case 'error':
                  return 'text-red-700 dark:text-red-300'
                case 'checking':
                  return 'text-yellow-700 dark:text-yellow-300'
                default:
                  return 'text-neutral-500 dark:text-neutral-400'
              }
            }

            return (
              <div
                key={endpoint.id}
                className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 ${getStatusColor()} rounded-full`}></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {endpoint.method} {endpoint.path}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusTextColor()} bg-opacity-10`}>
                        {getStatusText()}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{endpoint.title}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  {status.statusCode && (
                    <span
                      className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                        status.statusCode >= 200 && status.statusCode < 300
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}
                    >
                      {status.statusCode}
                    </span>
                  )}

                  {status.responseTime && (
                    <span
                      className={`text-xs font-mono ${
                        status.responseTime < 100
                          ? 'text-green-600 dark:text-green-400'
                          : status.responseTime < 500
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {status.responseTime}ms
                    </span>
                  )}

                  {status.lastChecked && (
                    <span className="text-neutral-500 dark:text-neutral-400 text-xs">
                      {status.lastChecked.toLocaleTimeString()}
                    </span>
                  )}

                  <button
                    onClick={() => checkEndpointStatus(endpoint.id)}
                    disabled={status.status === 'checking'}
                    className="text-blue-600 hover:text-blue-700 disabled:text-blue-400 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    {status.status === 'checking' ? (
                      <div className="flex items-center space-x-1">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                        <span>Checking...</span>
                      </div>
                    ) : (
                      'Test'
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-700 dark:text-blue-300">
            <strong>Note:</strong> Make sure your API server is running on the configured URL above. The status
            indicators show real-time connectivity and response times for each endpoint.
          </p>
          {apiBaseUrl && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              <strong>Current Base URL:</strong> {apiBaseUrl}
            </p>
          )}
          {(!apiBaseUrl || !apiBaseUrl.trim()) && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
              <strong>Warning:</strong> Please enter a valid API base URL to test endpoints.
            </p>
          )}
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
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center space-x-3 mb-4">
        <span className={cn('method', method.toLowerCase())}>{method}</span>
        <code className="text-sm font-mono bg-neutral-100 dark:bg-neutral-700 px-3 py-1 rounded">{path}</code>
      </div>

      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">{title}</h3>

      <p className="text-neutral-600 dark:text-neutral-400 mb-4">{description}</p>

      {parameters.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Parameters</h4>
          <div className="space-y-2">
            {parameters.map(param => (
              <div key={param.name} className="flex items-start space-x-3">
                <code className="text-sm font-mono bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded min-w-[80px]">
                  {param.name}
                </code>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">{param.type}</span>
                    {param.required && (
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{param.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {responseExample && (
        <div>
          <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Response Example</h4>
          <pre className="text-sm bg-neutral-100 dark:bg-neutral-700 p-4 rounded overflow-x-auto">
            {responseExample}
          </pre>
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  )
}
