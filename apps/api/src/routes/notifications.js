import express from 'express'
import { body, validationResult } from 'express-validator'
import Notification from '../models/Notification.js'

const router = express.Router()

/**
 * GET /api/notifications - Get notifications for current user
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      includeRead = 'true',
      includeArchived = 'false',
      type
    } = req.query

    // In production, get userId from authenticated user (req.user._id)
    // For now, we'll accept it as a query param for testing
    const userId = req.query.userId || req.user?._id

    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required',
        message: 'Please provide userId in query params or authenticate'
      })
    }

    const result = await Notification.getUserNotifications(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      includeRead: includeRead === 'true',
      includeArchived: includeArchived === 'true',
      type
    })

    res.json(result)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    res.status(500).json({
      error: 'Failed to fetch notifications',
      message: error.message
    })
  }
})

/**
 * GET /api/notifications/unread-count - Get unread notification count
 */
router.get('/unread-count', async (req, res) => {
  try {
    const userId = req.query.userId || req.user?._id

    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required'
      })
    }

    const count = await Notification.getUnreadCount(userId)

    res.json({
      userId,
      unreadCount: count
    })
  } catch (error) {
    console.error('Error getting unread count:', error)
    res.status(500).json({
      error: 'Failed to get unread count',
      message: error.message
    })
  }
})

/**
 * GET /api/notifications/:id - Get a specific notification
 */
router.get('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('reservationId')

    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found'
      })
    }

    res.json(notification)
  } catch (error) {
    console.error('Error fetching notification:', error)
    res.status(500).json({
      error: 'Failed to fetch notification',
      message: error.message
    })
  }
})

/**
 * PATCH /api/notifications/:id/read - Mark notification as read
 */
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found'
      })
    }

    await notification.markAsRead()

    res.json({
      message: 'Notification marked as read',
      notification
    })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    res.status(500).json({
      error: 'Failed to mark notification as read',
      message: error.message
    })
  }
})

/**
 * PATCH /api/notifications/:id/unread - Mark notification as unread
 */
router.patch('/:id/unread', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found'
      })
    }

    await notification.markAsUnread()

    res.json({
      message: 'Notification marked as unread',
      notification
    })
  } catch (error) {
    console.error('Error marking notification as unread:', error)
    res.status(500).json({
      error: 'Failed to mark notification as unread',
      message: error.message
    })
  }
})

/**
 * PATCH /api/notifications/mark-all-read - Mark all notifications as read
 */
router.patch('/mark-all-read', async (req, res) => {
  try {
    const userId = req.body.userId || req.user?._id

    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required'
      })
    }

    const result = await Notification.markAllAsRead(userId)

    res.json({
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    console.error('Error marking all as read:', error)
    res.status(500).json({
      error: 'Failed to mark all as read',
      message: error.message
    })
  }
})

/**
 * PATCH /api/notifications/:id/archive - Archive notification
 */
router.patch('/:id/archive', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found'
      })
    }

    await notification.archive()

    res.json({
      message: 'Notification archived',
      notification
    })
  } catch (error) {
    console.error('Error archiving notification:', error)
    res.status(500).json({
      error: 'Failed to archive notification',
      message: error.message
    })
  }
})

/**
 * PATCH /api/notifications/:id/unarchive - Unarchive notification
 */
router.patch('/:id/unarchive', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found'
      })
    }

    await notification.unarchive()

    res.json({
      message: 'Notification unarchived',
      notification
    })
  } catch (error) {
    console.error('Error unarchiving notification:', error)
    res.status(500).json({
      error: 'Failed to unarchive notification',
      message: error.message
    })
  }
})

/**
 * DELETE /api/notifications/:id - Delete a notification
 */
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found'
      })
    }

    await Notification.findByIdAndDelete(req.params.id)

    res.json({
      message: 'Notification deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting notification:', error)
    res.status(500).json({
      error: 'Failed to delete notification',
      message: error.message
    })
  }
})

/**
 * POST /api/notifications - Create a notification (admin/system)
 */
router.post('/', [
  body('userId').optional().isMongoId().withMessage('Invalid user ID'),
  body('type').isIn([
    'reservation_created',
    'reservation_confirmed',
    'reservation_cancelled',
    'reservation_updated',
    'reservation_reminder',
    'system',
    'promotional'
  ]).withMessage('Invalid notification type'),
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('body').trim().isLength({ min: 1, max: 500 }).withMessage('Body must be between 1 and 500 characters'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const notification = await Notification.createNotification(req.body)

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    res.status(500).json({
      error: 'Failed to create notification',
      message: error.message
    })
  }
})

/**
 * POST /api/notifications/cleanup - Delete old notifications (admin)
 */
router.post('/cleanup', async (req, res) => {
  try {
    const { daysOld = 30 } = req.body

    const result = await Notification.deleteOldNotifications(parseInt(daysOld))

    res.json({
      message: `Notifications older than ${daysOld} days deleted`,
      deletedCount: result.deletedCount
    })
  } catch (error) {
    console.error('Error cleaning up notifications:', error)
    res.status(500).json({
      error: 'Failed to cleanup notifications',
      message: error.message
    })
  }
})

/**
 * GET /api/notifications/stats/summary - Get notification statistics (admin)
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const userId = req.query.userId || req.user?._id

    let stats = {
      total: await Notification.countDocuments(),
      read: await Notification.countDocuments({ isRead: true }),
      unread: await Notification.countDocuments({ isRead: false }),
      archived: await Notification.countDocuments({ isArchived: true })
    }

    if (userId) {
      stats.user = {
        total: await Notification.countDocuments({ userId }),
        unread: await Notification.getUnreadCount(userId),
        archived: await Notification.countDocuments({ userId, isArchived: true })
      }
    }

    res.json(stats)
  } catch (error) {
    console.error('Error getting notification stats:', error)
    res.status(500).json({
      error: 'Failed to get notification statistics',
      message: error.message
    })
  }
})

export default router
