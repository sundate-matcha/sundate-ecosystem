import { broadcastEvent, getActiveConnectionsCount, getConnectionsByUserId } from '../routes/events.js'

/**
 * SSE Service for broadcasting real-time events
 */
class SSEService {
  /**
   * Broadcast reservation created event
   * @param {Object} reservation - Reservation object
   * @param {String} userId - User ID (optional, if null sends to all admin users)
   */
  async broadcastReservationCreated(reservation, userId = null) {
    const eventData = {
      reservation: {
        id: reservation._id,
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        status: reservation.status,
        tableCategory: reservation.tableCategory,
        specialRequests: reservation.specialRequests,
        createdAt: reservation.createdAt
      },
      message: `New reservation created for ${reservation.name}`,
      action: 'reservation_created'
    }

    return await broadcastEvent('reservation_created', eventData, userId)
  }

  /**
   * Broadcast reservation updated event
   * @param {Object} reservation - Reservation object
   * @param {Object} changes - Changes made to reservation
   * @param {String} userId - User ID (optional, if null sends to all admin users)
   */
  async broadcastReservationUpdated(reservation, changes = {}, userId = null) {
    const eventData = {
      reservation: {
        id: reservation._id,
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        status: reservation.status,
        tableCategory: reservation.tableCategory,
        specialRequests: reservation.specialRequests,
        updatedAt: reservation.updatedAt
      },
      changes,
      message: `Reservation for ${reservation.name} has been updated`,
      action: 'reservation_updated'
    }

    return await broadcastEvent('reservation_updated', eventData, userId)
  }

  /**
   * Broadcast reservation confirmed event
   * @param {Object} reservation - Reservation object
   * @param {String} userId - User ID (optional, if null sends to all admin users)
   */
  async broadcastReservationConfirmed(reservation, userId = null) {
    const eventData = {
      reservation: {
        id: reservation._id,
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        status: reservation.status,
        tableCategory: reservation.tableCategory,
        specialRequests: reservation.specialRequests,
        confirmedAt: reservation.confirmedAt
      },
      message: `Reservation for ${reservation.name} has been confirmed`,
      action: 'reservation_confirmed'
    }

    return await broadcastEvent('reservation_confirmed', eventData, userId)
  }

  /**
   * Broadcast reservation cancelled event
   * @param {Object} reservation - Reservation object
   * @param {String} userId - User ID (optional, if null sends to all admin users)
   */
  async broadcastReservationCancelled(reservation, userId = null) {
    const eventData = {
      reservation: {
        id: reservation._id,
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        status: reservation.status,
        tableCategory: reservation.tableCategory,
        specialRequests: reservation.specialRequests,
        cancelledAt: reservation.cancelledAt
      },
      message: `Reservation for ${reservation.name} has been cancelled`,
      action: 'reservation_cancelled'
    }

    return await broadcastEvent('reservation_cancelled', eventData, userId)
  }

  /**
   * Broadcast reservation deleted event
   * @param {String} reservationId - Reservation ID
   * @param {String} reservationName - Reservation name
   * @param {String} userId - User ID (optional, if null sends to all admin users)
   */
  async broadcastReservationDeleted(reservationId, reservationName, userId = null) {
    const eventData = {
      reservation: {
        id: reservationId,
        name: reservationName
      },
      message: `Reservation for ${reservationName} has been deleted`,
      action: 'reservation_deleted'
    }

    return await broadcastEvent('reservation_deleted', eventData, userId)
  }

  /**
   * Broadcast notification created event
   * @param {Object} notification - Notification object
   * @param {String} userId - User ID (optional, if null sends to all admin users)
   */
  async broadcastNotificationCreated(notification, userId = null) {
    const eventData = {
      notification: {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        body: notification.body,
        priority: notification.priority,
        isRead: notification.isRead,
        isTimeSensitive: notification.isTimeSensitive,
        reservationId: notification.reservationId,
        createdAt: notification.createdAt
      },
      message: `New notification: ${notification.title}`,
      action: 'notification_created'
    }

    return await broadcastEvent('notification_created', eventData, userId)
  }

  /**
   * Broadcast notification read event
   * @param {String} notificationId - Notification ID
   * @param {String} userId - User ID (optional, if null sends to all admin users)
   */
  async broadcastNotificationRead(notificationId, userId = null) {
    const eventData = {
      notification: {
        id: notificationId
      },
      message: 'Notification marked as read',
      action: 'notification_read'
    }

    return await broadcastEvent('notification_read', eventData, userId)
  }

  /**
   * Broadcast system status update
   * @param {String} status - System status
   * @param {String} message - Status message
   * @param {Object} data - Additional data
   */
  async broadcastSystemStatus(status, message, data = {}) {
    const eventData = {
      status,
      message,
      data,
      timestamp: new Date().toISOString(),
      action: 'system_status'
    }

    return await broadcastEvent('system_status', eventData)
  }

  /**
   * Broadcast custom event
   * @param {String} type - Event type
   * @param {Object} data - Event data
   * @param {String} userId - User ID (optional, if null sends to all admin users)
   * @param {String} reservationId - Reservation ID (optional)
   */
  async broadcastCustomEvent(type, data, userId = null, reservationId = null) {
    return await broadcastEvent(type, data, userId, reservationId)
  }

  /**
   * Get SSE service statistics
   */
  getStats() {
    return {
      activeConnections: getActiveConnectionsCount(),
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Get connections for a specific user
   * @param {String} userId - User ID
   */
  getUserConnections(userId) {
    return getConnectionsByUserId(userId)
  }
}

export default new SSEService()
