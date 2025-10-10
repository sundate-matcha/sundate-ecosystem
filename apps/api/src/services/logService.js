import ReservationLog from '../models/ReservationLog.js'

/**
 * Logging Service for Reservation Events
 * Handles logging all reservation-related actions
 */
class LogService {
  /**
   * Create a log entry
   * @param {Object} logData - Log data
   * @returns {Object} Created log entry
   */
  async createLog(logData) {
    try {
      const log = new ReservationLog(logData)
      await log.save()
      return log
    } catch (error) {
      console.error('Error creating log:', error)
      throw error
    }
  }

  /**
   * Log reservation creation
   * @param {Object} reservation - Reservation object
   * @param {Object} metadata - Additional metadata (IP, user agent, etc.)
   * @returns {Object} Created log entry
   */
  async logReservationCreated(reservation, metadata = {}) {
    const logData = {
      reservationId: reservation._id,
      action: 'created',
      newStatus: reservation.status,
      details: `Reservation created for ${reservation.name} on ${new Date(reservation.date).toLocaleDateString()} at ${reservation.time}`,
      metadata: {
        ...metadata,
        source: metadata.source || 'api'
      },
      notificationStatus: 'pending'
    }

    return this.createLog(logData)
  }

  /**
   * Log reservation status change
   * @param {Object} reservation - Reservation object
   * @param {String} oldStatus - Previous status
   * @param {String} newStatus - New status
   * @param {Object} metadata - Additional metadata
   * @returns {Object} Created log entry
   */
  async logReservationStatusChanged(reservation, oldStatus, newStatus, metadata = {}) {
    const logData = {
      reservationId: reservation._id,
      action: 'status_changed',
      previousStatus: oldStatus,
      newStatus: newStatus,
      details: `Status changed from ${oldStatus} to ${newStatus} for ${reservation.name}`,
      metadata: {
        ...metadata,
        source: metadata.source || 'api'
      },
      notificationStatus: 'pending'
    }

    return this.createLog(logData)
  }

  /**
   * Log reservation confirmation
   * @param {Object} reservation - Reservation object
   * @param {Object} metadata - Additional metadata
   * @returns {Object} Created log entry
   */
  async logReservationConfirmed(reservation, metadata = {}) {
    const logData = {
      reservationId: reservation._id,
      action: 'confirmed',
      previousStatus: 'pending',
      newStatus: 'confirmed',
      details: `Reservation confirmed for ${reservation.name} on ${new Date(reservation.date).toLocaleDateString()} at ${reservation.time}`,
      metadata: {
        ...metadata,
        source: metadata.source || 'api'
      },
      notificationStatus: 'pending'
    }

    return this.createLog(logData)
  }

  /**
   * Log reservation cancellation
   * @param {Object} reservation - Reservation object
   * @param {String} previousStatus - Previous status
   * @param {Object} metadata - Additional metadata
   * @returns {Object} Created log entry
   */
  async logReservationCancelled(reservation, previousStatus, metadata = {}) {
    const logData = {
      reservationId: reservation._id,
      action: 'cancelled',
      previousStatus: previousStatus,
      newStatus: 'cancelled',
      details: `Reservation cancelled for ${reservation.name}. Previous status: ${previousStatus}`,
      metadata: {
        ...metadata,
        source: metadata.source || 'api'
      },
      notificationStatus: 'pending'
    }

    return this.createLog(logData)
  }

  /**
   * Log reservation update
   * @param {Object} reservation - Reservation object
   * @param {Object} changes - Object containing changed fields
   * @param {Object} metadata - Additional metadata
   * @returns {Object} Created log entry
   */
  async logReservationUpdated(reservation, changes = {}, metadata = {}) {
    const changedFields = Object.keys(changes).join(', ')
    
    const logData = {
      reservationId: reservation._id,
      action: 'updated',
      changes: changes,
      details: `Reservation updated for ${reservation.name}. Changed fields: ${changedFields}`,
      metadata: {
        ...metadata,
        source: metadata.source || 'api'
      },
      notificationStatus: 'pending'
    }

    return this.createLog(logData)
  }

  /**
   * Log reservation deletion
   * @param {Object} reservation - Reservation object
   * @param {Object} metadata - Additional metadata
   * @returns {Object} Created log entry
   */
  async logReservationDeleted(reservation, metadata = {}) {
    const logData = {
      reservationId: reservation._id,
      action: 'deleted',
      previousStatus: reservation.status,
      details: `Reservation deleted for ${reservation.name}`,
      metadata: {
        ...metadata,
        source: metadata.source || 'api'
      },
      notificationStatus: 'not_applicable'
    }

    return this.createLog(logData)
  }

  /**
   * Get logs for a specific reservation
   * @param {String} reservationId - Reservation ID
   * @param {Number} limit - Maximum number of logs to return
   * @returns {Array} Array of log entries
   */
  async getReservationLogs(reservationId, limit = 50) {
    try {
      return await ReservationLog.getReservationLogs(reservationId, limit)
    } catch (error) {
      console.error('Error getting reservation logs:', error)
      throw error
    }
  }

  /**
   * Get recent logs
   * @param {Number} limit - Maximum number of logs to return
   * @param {String} action - Optional action filter
   * @returns {Array} Array of log entries
   */
  async getRecentLogs(limit = 100, action = null) {
    try {
      return await ReservationLog.getRecentLogs(limit, action)
    } catch (error) {
      console.error('Error getting recent logs:', error)
      throw error
    }
  }

  /**
   * Get logs by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array} Array of log entries
   */
  async getLogsByDateRange(startDate, endDate) {
    try {
      return await ReservationLog.getLogsByDateRange(startDate, endDate)
    } catch (error) {
      console.error('Error getting logs by date range:', error)
      throw error
    }
  }

  /**
   * Extract metadata from request
   * @param {Object} req - Express request object
   * @returns {Object} Metadata object
   */
  extractMetadata(req) {
    return {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      userId: req.user?._id || null,
      source: req.get('x-source') || 'api'
    }
  }

  /**
   * Get notification statistics
   * @returns {Object} Notification statistics
   */
  async getNotificationStats() {
    try {
      const total = await ReservationLog.countDocuments()
      const sent = await ReservationLog.countDocuments({ notificationStatus: 'sent' })
      const failed = await ReservationLog.countDocuments({ notificationStatus: 'failed' })
      const pending = await ReservationLog.countDocuments({ notificationStatus: 'pending' })

      return {
        total,
        sent,
        failed,
        pending,
        successRate: total > 0 ? ((sent / total) * 100).toFixed(2) : 0
      }
    } catch (error) {
      console.error('Error getting notification stats:', error)
      throw error
    }
  }
}

// Export singleton instance
const logService = new LogService()
export default logService
