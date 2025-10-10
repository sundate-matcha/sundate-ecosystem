import express from 'express'
import { body, validationResult } from 'express-validator'
import notificationService from '../services/notificationService.js'
import PushToken from '../models/PushToken.js'

const router = express.Router()

// Validation middleware for token registration
const validateTokenRegistration = [
  body('token').trim().notEmpty().withMessage('Push token is required'),
  body('deviceId').trim().notEmpty().withMessage('Device ID is required'),
  body('platform').isIn(['ios', 'android', 'web']).withMessage('Platform must be ios, android, or web'),
  body('userId').optional().isMongoId().withMessage('Invalid user ID'),
  body('deviceInfo').optional().isString().withMessage('Device info must be a string')
]

/**
 * POST /api/push-tokens - Register a new push token
 */
router.post('/', validateTokenRegistration, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const { token, deviceId, platform, userId, deviceInfo } = req.body

    // Register token
    const pushToken = await notificationService.registerToken(
      token,
      deviceId,
      platform,
      userId,
      deviceInfo
    )

    res.status(201).json({
      message: 'Push token registered successfully',
      token: pushToken
    })
  } catch (error) {
    console.error('Error registering push token:', error)
    res.status(500).json({
      error: 'Failed to register push token',
      message: error.message
    })
  }
})

/**
 * DELETE /api/push-tokens/:token - Unregister a push token
 */
router.delete('/:token', async (req, res) => {
  try {
    const { token } = req.params

    const result = await notificationService.unregisterToken(token)

    if (!result) {
      return res.status(404).json({
        error: 'Push token not found'
      })
    }

    res.json({
      message: 'Push token unregistered successfully'
    })
  } catch (error) {
    console.error('Error unregistering push token:', error)
    res.status(500).json({
      error: 'Failed to unregister push token',
      message: error.message
    })
  }
})

/**
 * GET /api/push-tokens - Get all registered push tokens (admin only)
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, isActive, platform, userId } = req.query

    const query = {}
    if (isActive !== undefined) {
      query.isActive = isActive === 'true'
    }
    if (platform) {
      query.platform = platform
    }
    if (userId) {
      query.userId = userId
    }

    const tokens = await PushToken.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'email name')
      .exec()

    const total = await PushToken.countDocuments(query)

    res.json({
      tokens,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (error) {
    console.error('Error fetching push tokens:', error)
    res.status(500).json({
      error: 'Failed to fetch push tokens',
      message: error.message
    })
  }
})

/**
 * GET /api/push-tokens/stats - Get push token statistics (admin only)
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await PushToken.countDocuments()
    const active = await PushToken.countDocuments({ isActive: true })
    const inactive = await PushToken.countDocuments({ isActive: false })
    const ios = await PushToken.countDocuments({ platform: 'ios', isActive: true })
    const android = await PushToken.countDocuments({ platform: 'android', isActive: true })
    const web = await PushToken.countDocuments({ platform: 'web', isActive: true })

    res.json({
      total,
      active,
      inactive,
      platforms: {
        ios,
        android,
        web
      }
    })
  } catch (error) {
    console.error('Error getting token stats:', error)
    res.status(500).json({
      error: 'Failed to get token statistics',
      message: error.message
    })
  }
})

/**
 * POST /api/push-tokens/test - Send a test notification (admin only)
 */
router.post('/test', async (req, res) => {
  try {
    const { title = 'Test Notification', body = 'This is a test notification', userId } = req.body

    let tokens
    if (userId) {
      tokens = await notificationService.getActiveTokens(userId)
    } else {
      tokens = await notificationService.getActiveTokens()
    }

    if (tokens.length === 0) {
      return res.status(404).json({
        error: 'No active tokens found'
      })
    }

    const result = await notificationService.sendPushNotification(tokens, title, body, {
      type: 'test',
      timestamp: new Date().toISOString()
    })

    res.json({
      message: 'Test notification sent',
      result
    })
  } catch (error) {
    console.error('Error sending test notification:', error)
    res.status(500).json({
      error: 'Failed to send test notification',
      message: error.message
    })
  }
})

/**
 * PATCH /api/push-tokens/:token/refresh - Refresh a token's last used timestamp
 */
router.patch('/:token/refresh', async (req, res) => {
  try {
    const { token } = req.params

    const pushToken = await PushToken.findOne({ token })
    if (!pushToken) {
      return res.status(404).json({
        error: 'Push token not found'
      })
    }

    pushToken.lastUsed = new Date()
    await pushToken.save()

    res.json({
      message: 'Token refreshed successfully',
      token: pushToken
    })
  } catch (error) {
    console.error('Error refreshing token:', error)
    res.status(500).json({
      error: 'Failed to refresh token',
      message: error.message
    })
  }
})

/**
 * POST /api/push-tokens/cleanup - Deactivate old tokens (admin only)
 */
router.post('/cleanup', async (req, res) => {
  try {
    const result = await PushToken.deactivateOldTokens()

    res.json({
      message: 'Old tokens deactivated',
      deactivated: result.modifiedCount
    })
  } catch (error) {
    console.error('Error cleaning up tokens:', error)
    res.status(500).json({
      error: 'Failed to cleanup tokens',
      message: error.message
    })
  }
})

export default router
