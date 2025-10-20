#!/usr/bin/env node

/**
 * Test script for Server-Sent Events (SSE) implementation
 * 
 * This script tests the SSE endpoints and broadcasts test events
 * to verify the real-time functionality is working correctly.
 */

import fetch from 'node-fetch'
import EventSource from 'eventsource'

const API_BASE = 'http://localhost:5001/api'

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

/**
 * Test SSE connection
 */
async function testSSEConnection() {
  logInfo('Testing SSE connection...')
  
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(`${API_BASE}/events?userId=test-user&types=reservation_created,reservation_updated`)
    
    let eventCount = 0
    const maxEvents = 3
    const timeout = setTimeout(() => {
      eventSource.close()
      reject(new Error('SSE connection timeout'))
    }, 10000)

    eventSource.onopen = () => {
      logSuccess('SSE connection established')
      clearTimeout(timeout)
    }

    eventSource.onmessage = (event) => {
      eventCount++
      const data = JSON.parse(event.data)
      logInfo(`Received event #${eventCount}: ${data.type}`)
      
      if (data.type === 'connection_established') {
        logSuccess('Connection established event received')
      }
      
      if (eventCount >= maxEvents) {
        eventSource.close()
        clearTimeout(timeout)
        resolve()
      }
    }

    eventSource.onerror = (error) => {
      logError(`SSE connection error: ${error.message}`)
      clearTimeout(timeout)
      reject(error)
    }
  })
}

/**
 * Test broadcasting events
 */
async function testBroadcastEvents() {
  logInfo('Testing event broadcasting...')
  
  try {
    // Test reservation created event to specific user
    const reservationEvent = {
      type: 'reservation_created',
      data: {
        reservation: {
          id: 'test-reservation-123',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          date: '2025-01-15',
          time: '19:00',
          guests: 2,
          status: 'pending'
        },
        message: 'New reservation created for John Doe',
        action: 'reservation_created'
      },
      targetUserId: 'test-user'
    }

    const response = await fetch(`${API_BASE}/events/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservationEvent)
    })

    if (response.ok) {
      const result = await response.json()
      logSuccess(`Event broadcasted to specific user: ${result.stats.sent} sent, ${result.stats.filtered} filtered`)
    } else {
      const error = await response.text()
      logError(`Failed to broadcast event: ${error}`)
    }

    // Test notification event to all admin users (no targetUserId)
    const notificationEvent = {
      type: 'notification_created',
      data: {
        notification: {
          id: 'test-notification-123',
          type: 'reservation_created',
          title: 'New Reservation',
          body: 'You have a new reservation',
          priority: 'normal',
          isRead: false
        },
        message: 'New notification: New Reservation',
        action: 'notification_created'
      }
      // No targetUserId - should go to all admin users
    }

    const response2 = await fetch(`${API_BASE}/events/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notificationEvent)
    })

    if (response2.ok) {
      const result = await response2.json()
      logSuccess(`Notification event broadcasted to all admin users: ${result.stats.sent} sent, ${result.stats.filtered} filtered`)
      logInfo(`Target admin users: ${result.stats.targetUserIds.length} found`)
    } else {
      const error = await response2.text()
      logError(`Failed to broadcast notification event: ${error}`)
    }

    // Test system event to all admin users
    const systemEvent = {
      type: 'system_status',
      data: {
        status: 'info',
        message: 'Test system status update',
        data: {
          timestamp: new Date().toISOString(),
          test: true
        },
        action: 'system_status'
      }
      // No targetUserId - should go to all admin users
    }

    const response3 = await fetch(`${API_BASE}/events/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(systemEvent)
    })

    if (response3.ok) {
      const result = await response3.json()
      logSuccess(`System event broadcasted to all admin users: ${result.stats.sent} sent, ${result.stats.filtered} filtered`)
    } else {
      const error = await response3.text()
      logError(`Failed to broadcast system event: ${error}`)
    }

  } catch (error) {
    logError(`Error testing broadcast: ${error.message}`)
  }
}

/**
 * Test connection management
 */
async function testConnectionManagement() {
  logInfo('Testing connection management...')
  
  try {
    const response = await fetch(`${API_BASE}/events/connections`)
    
    if (response.ok) {
      const result = await response.json()
      logSuccess(`Active connections: ${result.totalConnections}`)
      
      if (result.connections.length > 0) {
        logInfo('Connection details:')
        result.connections.forEach(conn => {
          log(`  - ${conn.id}: User ${conn.userId || 'anonymous'}, Duration: ${Math.round(conn.duration / 1000)}s`, 'blue')
        })
      }
    } else {
      const error = await response.text()
      logError(`Failed to get connections: ${error}`)
    }
  } catch (error) {
    logError(`Error testing connection management: ${error.message}`)
  }
}

/**
 * Test with multiple connections
 */
async function testMultipleConnections() {
  logInfo('Testing multiple connections...')
  
  const connections = []
  const connectionCount = 3
  
  try {
    // Create multiple connections
    for (let i = 0; i < connectionCount; i++) {
      const eventSource = new EventSource(`${API_BASE}/events?userId=test-user-${i}`)
      connections.push(eventSource)
      
      eventSource.onopen = () => {
        logSuccess(`Connection ${i + 1} established`)
      }
      
      eventSource.onerror = (error) => {
        logError(`Connection ${i + 1} error: ${error.message}`)
      }
    }
    
    // Wait a bit for connections to establish
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Test connection management
    await testConnectionManagement()
    
    // Close all connections
    connections.forEach((conn, index) => {
      conn.close()
      logInfo(`Connection ${index + 1} closed`)
    })
    
  } catch (error) {
    logError(`Error testing multiple connections: ${error.message}`)
  }
}

/**
 * Main test function
 */
async function runTests() {
  log(`${colors.bold}🚀 Starting SSE Tests${colors.reset}`)
  log('=' * 50)
  
  try {
    // Test 1: Basic SSE connection
    await testSSEConnection()
    
    // Test 2: Event broadcasting
    await testBroadcastEvents()
    
    // Test 3: Connection management
    await testConnectionManagement()
    
    // Test 4: Multiple connections
    await testMultipleConnections()
    
    logSuccess('All SSE tests completed successfully!')
    
  } catch (error) {
    logError(`Test failed: ${error.message}`)
    process.exit(1)
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error)
}

export { runTests, testSSEConnection, testBroadcastEvents, testConnectionManagement }
