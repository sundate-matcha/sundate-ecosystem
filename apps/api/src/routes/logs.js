import express from 'express'
import logService from '../services/logService.js'
import ReservationLog from '../models/ReservationLog.js'

const router = express.Router()

/**
 * GET /api/logs - Get all logs with filtering (admin only)
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      action,
      reservationId,
      startDate,
      endDate,
      notificationStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    const query = {}

    // Add filters
    if (action) {
      query.action = action
    }
    if (reservationId) {
      query.reservationId = reservationId
    }
    if (notificationStatus) {
      query.notificationStatus = notificationStatus
    }
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) {
        query.createdAt.$gte = new Date(startDate)
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate)
      }
    }

    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1

    const logs = await ReservationLog.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('reservationId')
      .populate('metadata.userId', 'email name')
      .exec()

    const total = await ReservationLog.countDocuments(query)

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    res.status(500).json({
      error: 'Failed to fetch logs',
      message: error.message
    })
  }
})

/**
 * GET /api/logs/reservations/:id - Get logs for a specific reservation
 */
router.get('/reservations/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { limit = 50 } = req.query

    const logs = await logService.getReservationLogs(id, parseInt(limit))

    res.json({
      reservationId: id,
      logs,
      total: logs.length
    })
  } catch (error) {
    console.error('Error fetching reservation logs:', error)
    res.status(500).json({
      error: 'Failed to fetch reservation logs',
      message: error.message
    })
  }
})

/**
 * GET /api/logs/recent - Get recent logs
 */
router.get('/recent', async (req, res) => {
  try {
    const { limit = 100, action } = req.query

    const logs = await logService.getRecentLogs(parseInt(limit), action)

    res.json({
      logs,
      total: logs.length
    })
  } catch (error) {
    console.error('Error fetching recent logs:', error)
    res.status(500).json({
      error: 'Failed to fetch recent logs',
      message: error.message
    })
  }
})

/**
 * GET /api/logs/stats - Get log statistics (admin only)
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await ReservationLog.countDocuments()
    const created = await ReservationLog.countDocuments({ action: 'created' })
    const confirmed = await ReservationLog.countDocuments({ action: 'confirmed' })
    const cancelled = await ReservationLog.countDocuments({ action: 'cancelled' })
    const updated = await ReservationLog.countDocuments({ action: 'updated' })
    const deleted = await ReservationLog.countDocuments({ action: 'deleted' })

    // Notification statistics
    const notificationStats = await logService.getNotificationStats()

    // Recent activity (last 24 hours)
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
    const recentActivity = await ReservationLog.countDocuments({
      createdAt: { $gte: twentyFourHoursAgo }
    })

    res.json({
      total,
      byAction: {
        created,
        confirmed,
        cancelled,
        updated,
        deleted
      },
      notifications: notificationStats,
      recentActivity
    })
  } catch (error) {
    console.error('Error getting log stats:', error)
    res.status(500).json({
      error: 'Failed to get log statistics',
      message: error.message
    })
  }
})

/**
 * GET /api/logs/date-range - Get logs by date range
 */
router.get('/date-range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'Both startDate and endDate are required'
      })
    }

    const logs = await logService.getLogsByDateRange(startDate, endDate)

    res.json({
      startDate,
      endDate,
      logs,
      total: logs.length
    })
  } catch (error) {
    console.error('Error fetching logs by date range:', error)
    res.status(500).json({
      error: 'Failed to fetch logs by date range',
      message: error.message
    })
  }
})

/**
 * GET /api/logs/:id - Get a specific log entry
 */
router.get('/:id', async (req, res) => {
  try {
    const log = await ReservationLog.findById(req.params.id)
      .populate('reservationId')
      .populate('metadata.userId', 'email name')

    if (!log) {
      return res.status(404).json({
        error: 'Log not found'
      })
    }

    res.json(log)
  } catch (error) {
    console.error('Error fetching log:', error)
    res.status(500).json({
      error: 'Failed to fetch log',
      message: error.message
    })
  }
})

/**
 * DELETE /api/logs/:id - Delete a log entry (admin only)
 */
router.delete('/:id', async (req, res) => {
  try {
    const log = await ReservationLog.findById(req.params.id)

    if (!log) {
      return res.status(404).json({
        error: 'Log not found'
      })
    }

    await ReservationLog.findByIdAndDelete(req.params.id)

    res.json({
      message: 'Log deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting log:', error)
    res.status(500).json({
      error: 'Failed to delete log',
      message: error.message
    })
  }
})

/**
 * POST /api/logs/cleanup - Clean up old logs (admin only)
 */
router.post('/cleanup', async (req, res) => {
  try {
    const { daysOld = 90 } = req.body

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await ReservationLog.deleteMany({
      createdAt: { $lt: cutoffDate }
    })

    res.json({
      message: `Logs older than ${daysOld} days deleted`,
      deleted: result.deletedCount
    })
  } catch (error) {
    console.error('Error cleaning up logs:', error)
    res.status(500).json({
      error: 'Failed to cleanup logs',
      message: error.message
    })
  }
})

export default router
