'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, RefreshCw, ChevronDown, Search } from 'lucide-react'
import { API_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'

const allEndpoints = [
  // Health & System
  {
    id: 'health-check',
    method: 'GET',
    path: '/api/health',
    title: 'Health Check',
    requiresAuth: false,
    testable: true
  },

  // Authentication
  { id: 'auth-register', method: 'POST', path: '/api/auth/register', title: 'User Registration', requiresAuth: false },
  { id: 'auth-login', method: 'POST', path: '/api/auth/login', title: 'User Login', requiresAuth: false },
  { id: 'auth-logout', method: 'POST', path: '/api/auth/logout', title: 'User Logout', requiresAuth: true },
  { id: 'auth-profile', method: 'GET', path: '/api/auth/profile', title: 'Get User Profile', requiresAuth: true },
  {
    id: 'auth-update-profile',
    method: 'PUT',
    path: '/api/auth/profile',
    title: 'Update User Profile',
    requiresAuth: true
  },
  {
    id: 'auth-change-password',
    method: 'POST',
    path: '/api/auth/change-password',
    title: 'Change Password',
    requiresAuth: true
  },
  { id: 'auth-verify-token', method: 'GET', path: '/api/auth/verify', title: 'Verify Token', requiresAuth: true },

  // Reservations
  {
    id: 'reservations-get',
    method: 'GET',
    path: '/api/reservations',
    title: 'Get All Reservations',
    requiresAuth: true
  },
  {
    id: 'reservations-create',
    method: 'POST',
    path: '/api/reservations',
    title: 'Create Reservation',
    requiresAuth: true
  },
  {
    id: 'reservations-availability',
    method: 'GET',
    path: '/api/reservations/availability/check',
    title: 'Check Availability',
    requiresAuth: false
  },
  {
    id: 'reservations-get-by-id',
    method: 'GET',
    path: '/api/reservations/:id',
    title: 'Get Reservation by ID',
    requiresAuth: true
  },
  {
    id: 'reservations-update',
    method: 'PUT',
    path: '/api/reservations/:id',
    title: 'Update Reservation',
    requiresAuth: true
  },
  {
    id: 'reservations-confirm',
    method: 'PATCH',
    path: '/api/reservations/:id/confirm',
    title: 'Confirm Reservation',
    requiresAuth: true
  },
  {
    id: 'reservations-cancel',
    method: 'PATCH',
    path: '/api/reservations/:id/cancel',
    title: 'Cancel Reservation',
    requiresAuth: true
  },
  {
    id: 'reservations-complete',
    method: 'PATCH',
    path: '/api/reservations/:id/complete',
    title: 'Complete Reservation',
    requiresAuth: true
  },
  {
    id: 'reservations-delete',
    method: 'DELETE',
    path: '/api/reservations/:id',
    title: 'Delete Reservation',
    requiresAuth: true
  },

  // Menu (Public)
  { id: 'menu-get', method: 'GET', path: '/api/menu', title: 'Get Menu Items', requiresAuth: false },
  { id: 'menu-categories', method: 'GET', path: '/api/menu/categories', title: 'Get Categories', requiresAuth: false },
  { id: 'menu-featured', method: 'GET', path: '/api/menu/featured', title: 'Get Featured Items', requiresAuth: false },
  { id: 'menu-public', method: 'GET', path: '/api/menu/public', title: 'Get Public Menu Items', requiresAuth: false },

  // Menu (Admin)
  { id: 'menu-create', method: 'POST', path: '/api/menu', title: 'Create Menu Item', requiresAuth: true },
  { id: 'menu-update', method: 'PUT', path: '/api/menu/:id', title: 'Update Menu Item', requiresAuth: true },
  { id: 'menu-delete', method: 'DELETE', path: '/api/menu/:id', title: 'Delete Menu Item', requiresAuth: true },
  {
    id: 'menu-toggle-availability',
    method: 'PATCH',
    path: '/api/menu/:id/toggle-availability',
    title: 'Toggle Availability',
    requiresAuth: true
  },
  {
    id: 'menu-toggle-featured',
    method: 'PATCH',
    path: '/api/menu/:id/toggle-featured',
    title: 'Toggle Featured Status',
    requiresAuth: true
  },

  // Table Categories (Public)
  {
    id: 'table-categories-get',
    method: 'GET',
    path: '/api/table-categories',
    title: 'Get All Table Categories',
    requiresAuth: false
  },
  {
    id: 'table-categories-public',
    method: 'GET',
    path: '/api/table-categories/public',
    title: 'Get Public Table Categories',
    requiresAuth: false
  },
  {
    id: 'table-categories-active',
    method: 'GET',
    path: '/api/table-categories/active',
    title: 'Get Active Table Categories',
    requiresAuth: false
  },
  {
    id: 'table-categories-stats',
    method: 'GET',
    path: '/api/table-categories/stats',
    title: 'Get Table Category Statistics',
    requiresAuth: true
  },
  {
    id: 'table-categories-get-by-id',
    method: 'GET',
    path: '/api/table-categories/:id',
    title: 'Get Table Category by ID',
    requiresAuth: false
  },

  // Table Categories (Admin)
  {
    id: 'table-categories-create',
    method: 'POST',
    path: '/api/table-categories',
    title: 'Create Table Category',
    requiresAuth: true
  },
  {
    id: 'table-categories-update',
    method: 'PUT',
    path: '/api/table-categories/:id',
    title: 'Update Table Category',
    requiresAuth: true
  },
  {
    id: 'table-categories-toggle-active',
    method: 'PATCH',
    path: '/api/table-categories/:id/toggle-active',
    title: 'Toggle Active Status',
    requiresAuth: true
  },
  {
    id: 'table-categories-update-sort',
    method: 'PATCH',
    path: '/api/table-categories/:id/sort-order',
    title: 'Update Sort Order',
    requiresAuth: true
  },
  {
    id: 'table-categories-update-gallery',
    method: 'PATCH',
    path: '/api/table-categories/:id/gallery',
    title: 'Update Gallery',
    requiresAuth: true
  },
  {
    id: 'table-categories-delete',
    method: 'DELETE',
    path: '/api/table-categories/:id',
    title: 'Delete Table Category',
    requiresAuth: true
  },
  {
    id: 'table-categories-bulk-update',
    method: 'POST',
    path: '/api/table-categories/bulk-update',
    title: 'Bulk Update Table Categories',
    requiresAuth: true
  },

  // Contact
  { id: 'contact-submit', method: 'POST', path: '/api/contact', title: 'Submit Contact Form', requiresAuth: false },
  {
    id: 'contact-stats',
    method: 'GET',
    path: '/api/contact/stats',
    title: 'Get Contact Statistics',
    requiresAuth: true
  }
]
const testableEndpoints = allEndpoints.filter(endpoint => endpoint.method === 'GET' && !!endpoint.testable)

export default function TestingPage() {
  const [apiBaseUrl, setApiBaseUrl] = useState(API_URL)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedEndpoint, setSelectedEndpoint] = useState('health-check')
  const [apiStatus, setApiStatus] = useState<{
    [key: string]: {
      status: 'idle' | 'checking' | 'success' | 'error'
      responseTime?: number
      statusCode?: number
    }
  }>({})

  // Searchable dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // JWT token and request body states
  const [jwtToken, setJwtToken] = useState('')
  const [requestBody, setRequestBody] = useState('')
  const [isTokenEnabled, setIsTokenEnabled] = useState(true)

  // Load JWT token and token enabled state from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('api-testing-jwt-token')
    const savedTokenEnabled = localStorage.getItem('api-testing-token-enabled')
    if (savedToken) {
      setJwtToken(savedToken)
    }
    if (savedTokenEnabled !== null) {
      setIsTokenEnabled(savedTokenEnabled === 'true')
    }
  }, [])

  // Save JWT token to localStorage when it changes
  const handleJwtTokenChange = (token: string) => {
    setJwtToken(token)
    if (token) {
      localStorage.setItem('api-testing-jwt-token', token)
    } else {
      localStorage.removeItem('api-testing-jwt-token')
    }
  }

  // Handle token enabled/disabled toggle
  const handleTokenToggle = (enabled: boolean) => {
    setIsTokenEnabled(enabled)
    localStorage.setItem('api-testing-token-enabled', enabled.toString())
  }

  // Handle JSON formatting in request body
  const handleRequestBodyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      try {
        // Parse and re-stringify with proper indentation
        const parsed = JSON.parse(requestBody)
        const formatted = JSON.stringify(parsed, null, 2)
        setRequestBody(formatted)
      } catch {
        // If JSON is invalid, show error but don't change the content
        setError('Invalid JSON format. Please check your syntax.')
        setTimeout(() => setError(''), 3000) // Clear error after 3 seconds
      }
    }
  }

  const selectedEndpointData = allEndpoints.find(ep => ep.id === selectedEndpoint)

  // Filter endpoints based on search query
  const filteredEndpoints = allEndpoints.filter(
    endpoint =>
      endpoint.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleApiCall = async () => {
    if (!selectedEndpointData) return

    setLoading(true)
    setError('')
    setResponse('')

    try {
      const url = new URL(selectedEndpointData.path, apiBaseUrl)
      const startTime = Date.now()

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      // Add authorization header if JWT token is provided, enabled, and endpoint requires auth
      if (jwtToken && isTokenEnabled && selectedEndpointData.requiresAuth) {
        headers['Authorization'] = `Bearer ${jwtToken}`
      }

      // Prepare request options
      const requestOptions: RequestInit = {
        method: selectedEndpointData.method,
        headers
      }

      // Add request body for POST, PUT, PATCH, DELETE methods
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(selectedEndpointData.method) && requestBody.trim()) {
        try {
          // Validate JSON format
          JSON.parse(requestBody)
          requestOptions.body = requestBody
        } catch {
          setError('Invalid JSON format in request body')
          setLoading(false)
          return
        }
      }

      const res = await fetch(url.toString(), requestOptions)

      const responseTime = Date.now() - startTime
      const data = await res.json()

      setApiStatus(prev => ({
        ...prev,
        [selectedEndpointData.id]: {
          status: res.ok ? 'success' : 'error',
          responseTime,
          statusCode: res.status
        }
      }))

      setResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const checkEndpointStatus = async (endpointId: string) => {
    const endpoint = allEndpoints.find(ep => ep.id === endpointId)
    if (!endpoint) return

    setApiStatus(prev => ({
      ...prev,
      [endpointId]: { status: 'checking' }
    }))

    const startTime = Date.now()

    try {
      const url = new URL(endpoint.path, apiBaseUrl)

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      // Add authorization header if JWT token is provided, enabled, and endpoint requires auth
      if (jwtToken && isTokenEnabled && endpoint.requiresAuth) {
        headers['Authorization'] = `Bearer ${jwtToken}`
      }

      const res = await fetch(url.toString(), {
        method: endpoint.method,
        headers
      })

      const responseTime = Date.now() - startTime

      setApiStatus(prev => ({
        ...prev,
        [endpointId]: {
          status: res.ok ? 'success' : 'error',
          responseTime,
          statusCode: res.status
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
          statusCode: undefined
        }
      }))
    }
  }

  const checkAllTestableEndpoints = async () => {
    const promises = testableEndpoints.map(endpoint => checkEndpointStatus(endpoint.id))
    await Promise.all(promises)
  }

  // Searchable dropdown handlers
  const handleEndpointSelect = (endpointId: string) => {
    setSelectedEndpoint(endpointId)
    setSearchQuery('')
    setIsDropdownOpen(false)
    setHighlightedIndex(-1)
    // Clear request body when switching endpoints
    setRequestBody('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setIsDropdownOpen(true)
    setHighlightedIndex(-1)
  }

  const handleInputFocus = () => {
    setIsDropdownOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsDropdownOpen(true)
        return
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => (prev < filteredEndpoints.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredEndpoints.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredEndpoints[highlightedIndex]) {
          handleEndpointSelect(filteredEndpoints[highlightedIndex].id)
        }
        break
      case 'Escape':
        setIsDropdownOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">API Testing</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Test the API endpoints directly from this documentation. Make sure your API server is running.
        </p>
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                JWT Token (Bearer)
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleTokenToggle(!isTokenEnabled)}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    isTokenEnabled ? 'bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-600'
                  )}>
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      isTokenEnabled ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </div>
            <input
              type="text"
              value={jwtToken}
              onChange={e => handleJwtTokenChange(e.target.value)}
              disabled={!isTokenEnabled}
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                isTokenEnabled
                  ? 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white'
                  : 'border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
              )}
              placeholder={isTokenEnabled ? 'Enter your JWT token for authenticated endpoints' : 'Token is disabled'}
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              The token is used for Bearer authentication on protected endpoints
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Select Endpoint
            </label>
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={isDropdownOpen ? searchQuery : selectedEndpointData?.title || ''}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={handleKeyDown}
                  placeholder="Search endpoints..."
                  className="w-full px-4 py-3 pr-10 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="w-4 h-4 text-neutral-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="absolute inset-y-0 right-8 flex items-center pr-2">
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredEndpoints.length > 0 ? (
                    filteredEndpoints.map((endpoint, index) => (
                      <button
                        key={endpoint.id}
                        type="button"
                        onClick={() => handleEndpointSelect(endpoint.id)}
                        className={cn(
                          'w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors',
                          index === highlightedIndex && 'bg-blue-50 dark:bg-blue-900/20',
                          selectedEndpoint === endpoint.id && 'bg-blue-100 dark:bg-blue-900/30'
                        )}>
                        <div className="flex items-center space-x-2">
                          <span
                            className={cn(
                              'text-xs font-semibold px-2 py-1 rounded',
                              endpoint.method === 'GET' &&
                                'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
                              endpoint.method === 'POST' &&
                                'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                              endpoint.method === 'PUT' &&
                                'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
                              endpoint.method === 'DELETE' &&
                                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            )}>
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono text-neutral-600 dark:text-neutral-300">
                            {endpoint.path}
                          </code>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{endpoint.title}</p>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">No endpoints found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Request Body for POST/PUT/PATCH/DELETE */}
          {selectedEndpointData && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(selectedEndpointData.method) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Request Body (JSON)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(requestBody)
                      const formatted = JSON.stringify(parsed, null, 2)
                      setRequestBody(formatted)
                    } catch {
                      setError('Invalid JSON format. Please check your syntax.')
                      setTimeout(() => setError(''), 3000)
                    }
                  }}
                  className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                  Format JSON
                </button>
              </div>
              <textarea
                value={requestBody}
                onChange={e => setRequestBody(e.target.value)}
                onKeyDown={handleRequestBodyKeyDown}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                rows={8}
                placeholder={`{
  "example": "Enter your JSON request body here",
  "required": "fields"
}`}
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Enter valid JSON for {selectedEndpointData.method} requests. Press{' '}
                <kbd className="px-1 py-0.5 bg-neutral-200 dark:bg-neutral-600 rounded text-xs">Ctrl+Enter</kbd> or
                click &quot;Format JSON&quot; to format and validate.
              </p>
            </div>
          )}
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

          <div className="flex items-center space-x-4 mb-6">
            {selectedEndpointData.requiresAuth ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                  Requires Authentication
                </span>
                {!jwtToken && <span className="text-xs text-red-500 dark:text-red-400">(No JWT token provided)</span>}
                {jwtToken && !isTokenEnabled && (
                  <span className="text-xs text-yellow-500 dark:text-yellow-400">(Token disabled)</span>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">Public Endpoint</span>
              </div>
            )}
          </div>

          <button
            onClick={handleApiCall}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
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
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">API Status</h3>
          <button
            onClick={checkAllTestableEndpoints}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Check All Endpoints</span>
          </button>
        </div>

        <div className="space-y-3">
          {testableEndpoints.map(endpoint => {
            const status = apiStatus[endpoint.id]

            const getStatusColor = () => {
              if (!status) return 'bg-neutral-400'
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

            return (
              <div
                key={endpoint.id}
                className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 ${getStatusColor()} rounded-full`}></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {endpoint.method} {endpoint.path}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{endpoint.title}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  {status?.statusCode && (
                    <span
                      className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                        status.statusCode >= 200 && status.statusCode < 300
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}>
                      {status.statusCode}
                    </span>
                  )}

                  {status?.responseTime && (
                    <span
                      className={`text-xs font-mono ${
                        status.responseTime < 100
                          ? 'text-green-600 dark:text-green-400'
                          : status.responseTime < 500
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                      }`}>
                      {status.responseTime}ms
                    </span>
                  )}

                  <button
                    onClick={() => checkEndpointStatus(endpoint.id)}
                    disabled={status?.status === 'checking'}
                    className="text-blue-600 hover:text-blue-700 disabled:text-blue-400 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    {status?.status === 'checking' ? 'Checking...' : 'Check'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
