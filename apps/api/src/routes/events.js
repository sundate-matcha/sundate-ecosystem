import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'

const router = express.Router()

// Store active SSE connections
const activeConnections = new Map()

/**
 * GET /api/events - Server-Sent Events endpoint for real-time updates
 * Query params:
 * - userId: User ID to filter events (optional)
 * - types: Comma-separated event types to subscribe to (optional)
 * - reservationId: Specific reservation ID to monitor (optional)
 */
router.get('/', (req, res) => {
  const { userId, types, reservationId } = req.query
  
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
    'X-Accel-Buffering': 'no' // Disable nginx buffering
  })

  // Create connection ID
  const connectionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  // Parse event types filter
  const eventTypes = types ? types.split(',').map(t => t.trim()) : null
  
  // Store connection info
  const connection = {
    id: connectionId,
    response: res,
    userId,
    eventTypes,
    reservationId,
    connectedAt: new Date(),
    lastPing: new Date()
  }
  
  activeConnections.set(connectionId, connection)
  
  console.log(`🔌 SSE Connection established: ${connectionId} (User: ${userId || 'anonymous'})`)
  
  // Send initial connection event
  res.write(`data: ${JSON.stringify({
    type: 'connection_established',
    connectionId,
    timestamp: new Date().toISOString(),
    message: 'Connected to real-time updates'
  })}\n\n`)

  // Send ping every 30 seconds to keep connection alive
  const pingInterval = setInterval(() => {
    if (activeConnections.has(connectionId)) {
      try {
        res.write(`data: ${JSON.stringify({
          type: 'ping',
          timestamp: new Date().toISOString()
        })}\n\n`)
        connection.lastPing = new Date()
      } catch (error) {
        console.log(`❌ SSE Connection lost: ${connectionId}`)
        clearInterval(pingInterval)
        activeConnections.delete(connectionId)
      }
    } else {
      clearInterval(pingInterval)
    }
  }, 30000)

  // Handle client disconnect
  req.on('close', () => {
    console.log(`🔌 SSE Connection closed: ${connectionId}`)
    clearInterval(pingInterval)
    activeConnections.delete(connectionId)
  })

  req.on('error', (error) => {
    console.log(`❌ SSE Connection error: ${connectionId}`, error.message)
    clearInterval(pingInterval)
    activeConnections.delete(connectionId)
  })
})

/**
 * GET /api/events/connections - Get active SSE connections (admin)
 */
router.get('/connections', (req, res) => {
  const connections = Array.from(activeConnections.values()).map(conn => ({
    id: conn.id,
    userId: conn.userId,
    eventTypes: conn.eventTypes,
    reservationId: conn.reservationId,
    connectedAt: conn.connectedAt,
    lastPing: conn.lastPing,
    duration: Date.now() - conn.connectedAt.getTime()
  }))

  res.json({
    totalConnections: connections.length,
    connections
  })
})

/**
 * POST /api/events/broadcast - Broadcast event to all connections (admin)
 */
router.post('/broadcast', [
  body('type').notEmpty().withMessage('Event type is required'),
  body('data').isObject().withMessage('Event data must be an object'),
  body('targetUserId').optional().isMongoId().withMessage('Invalid target user ID'),
  body('targetReservationId').optional().isMongoId().withMessage('Invalid target reservation ID')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const { type, data, targetUserId, targetReservationId } = req.body
    
    // Use the updated broadcastEvent function
    const result = await broadcastEvent(type, data, targetUserId, targetReservationId)

    res.json({
      message: 'Event broadcasted successfully',
      event: {
        type,
        data,
        timestamp: new Date().toISOString()
      },
      stats: {
        sent: result.sent,
        filtered: result.filtered,
        totalConnections: activeConnections.size,
        targetUserIds: result.targetUserIds
      }
    })

  } catch (error) {
    console.error('Error broadcasting event:', error)
    res.status(500).json({
      error: 'Failed to broadcast event',
      message: error.message
    })
  }
})

/**
 * Get admin user IDs
 * @returns {Promise<Array>} Array of admin user IDs
 */
const getAdminUserIds = async () => {
  try {
    const adminUsers = await User.find({ role: 'admin', isActive: true }).select('_id')
    return adminUsers.map(user => user._id.toString())
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return []
  }
}

/**
 * Check if user is admin
 * @param {string} userId - User ID to check
 * @returns {Promise<boolean>} True if user is admin
 */
const isUserAdmin = async (userId) => {
  try {
    const user = await User.findById(userId).select('role isActive')
    return user && user.role === 'admin' && user.isActive
  } catch (error) {
    console.error('Error checking user admin status:', error)
    return false
  }
}

/**
 * Broadcast event to all connections
 * @param {string} type - Event type
 * @param {Object} data - Event data
 * @param {string} targetUserId - Optional target user ID (if null, sends to all admin users)
 * @param {string} targetReservationId - Optional target reservation ID
 */
export const broadcastEvent = async (type, data, targetUserId = null, targetReservationId = null) => {
  const event = {
    type,
    data,
    timestamp: new Date().toISOString(),
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  let sentCount = 0
  let filteredCount = 0
  let targetUserIds = []

  // If no specific userId provided, get all admin user IDs
  if (!targetUserId) {
    targetUserIds = await getAdminUserIds()
  } else {
    targetUserIds = [targetUserId]
  }

  for (const [connectionId, connection] of activeConnections) {
    try {
      // Apply filters
      if (targetUserIds.length > 0 && !targetUserIds.includes(connection.userId)) {
        filteredCount++
        continue
      }
      
      if (targetReservationId && connection.reservationId !== targetReservationId) {
        filteredCount++
        continue
      }
      
      if (connection.eventTypes && !connection.eventTypes.includes(type)) {
        filteredCount++
        continue
      }

      // Send event
      connection.response.write(`data: ${JSON.stringify(event)}\n\n`)
      sentCount++
      
    } catch (error) {
      console.log(`❌ Error sending to connection ${connectionId}:`, error.message)
      activeConnections.delete(connectionId)
    }
  }

  const targetDescription = targetUserId ? `user ${targetUserId}` : `all admin users (${targetUserIds.length})`
  console.log(`📡 SSE Event broadcasted: ${type} to ${targetDescription} (sent: ${sentCount}, filtered: ${filteredCount})`)
  return { sent: sentCount, filtered: filteredCount, targetUserIds }
}

/**
 * Get active connections count
 */
export const getActiveConnectionsCount = () => activeConnections.size

/**
 * Get connections by user ID
 */
export const getConnectionsByUserId = (userId) => {
  return Array.from(activeConnections.values()).filter(conn => conn.userId === userId)
}

export default router
