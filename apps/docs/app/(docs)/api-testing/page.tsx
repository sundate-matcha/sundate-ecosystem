'use client'

import { useState } from 'react'
import { Play, RefreshCw } from 'lucide-react'
import { API_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'

const testableEndpoints = [
  { id: 'health-check', method: 'GET', path: '/api/health', title: 'Health Check' },
  { id: 'reservations-get', method: 'GET', path: '/api/reservations', title: 'Get All Reservations' },
  { id: 'menu-get', method: 'GET', path: '/api/menu', title: 'Get Menu Items' },
  { id: 'menu-categories', method: 'GET', path: '/api/menu/categories', title: 'Get Categories' },
  { id: 'table-categories-get', method: 'GET', path: '/api/table-categories', title: 'Get All Table Categories' },
  { id: 'table-categories-active', method: 'GET', path: '/api/table-categories/active', title: 'Get Active Table Categories' }
]

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

  const selectedEndpointData = testableEndpoints.find(ep => ep.id === selectedEndpoint)

  const handleApiCall = async () => {
    if (!selectedEndpointData) return

    setLoading(true)
    setError('')
    setResponse('')

    try {
      const url = new URL(selectedEndpointData.path, apiBaseUrl)
      const startTime = Date.now()
      
      const res = await fetch(url.toString(), {
        method: selectedEndpointData.method,
        headers: {
          'Content-Type': 'application/json'
        }
      })

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
    const endpoint = testableEndpoints.find(ep => ep.id === endpointId)
    if (!endpoint) return

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

  const checkAllEndpoints = async () => {
    const promises = testableEndpoints.map(endpoint => checkEndpointStatus(endpoint.id))
    await Promise.all(promises)
  }

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
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Select Endpoint
            </label>
            <select
              value={selectedEndpoint}
              onChange={e => setSelectedEndpoint(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {testableEndpoints.map(endpoint => (
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
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center space-x-3 mb-4">
            <span className={cn('method', selectedEndpointData.method.toLowerCase())}>
              {selectedEndpointData.method}
            </span>
            <code className="text-sm font-mono bg-neutral-100 dark:bg-neutral-700 px-3 py-1 rounded">
              {selectedEndpointData.path}
            </code>
          </div>

          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">{selectedEndpointData.title}</h3>

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
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">API Status</h3>
          <button
            onClick={checkAllEndpoints}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
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

            const getStatusText = () => {
              if (!status) return 'Not Checked'
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
                      }`}
                    >
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
                      }`}
                    >
                      {status.responseTime}ms
                    </span>
                  )}

                  <button
                    onClick={() => checkEndpointStatus(endpoint.id)}
                    disabled={status?.status === 'checking'}
                    className="text-blue-600 hover:text-blue-700 disabled:text-blue-400 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
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

