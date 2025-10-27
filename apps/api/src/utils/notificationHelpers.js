/**
 * Notification Helper Utilities
 * Format and generate notification messages for different events
 */

/**
 * Format date for notification display
 * @param {Date} date - Date object
 * @returns {String} Formatted date string
 */
export const formatNotificationDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format time for notification display
 * @param {String} time - Time string (HH:mm format)
 * @returns {String} Formatted time string
 */
export const formatNotificationTime = (time) => {
  return time
}

/**
 * Generate notification title based on action
 * @param {String} action - Action type (created, confirmed, cancelled, updated)
 * @param {Object} reservation - Reservation object
 * @returns {String} Notification title
 */
export const generateNotificationTitle = (action, reservation) => {
  const titles = {
    created: '🎉 New Reservation!',
    confirmed: '✅ Reservation Confirmed!',
    cancelled: '❌ Reservation Cancelled',
    updated: '📝 Reservation Updated',
    deleted: '🗑️ Reservation Deleted'
  }

  return titles[action] || '📱 Reservation Notification'
}

/**
 * Generate notification body based on action
 * @param {String} action - Action type
 * @param {Object} reservation - Reservation object
 * @param {Object} changes - Optional changes object for updates
 * @returns {String} Notification body
 */
export const generateNotificationBody = (action, reservation, changes = {}) => {
  const name = reservation.name
  const date = formatNotificationDate(reservation.date)
  const time = formatNotificationTime(reservation.time)
  const guests = reservation.guests

  switch (action) {
    case 'created':
      return `New reservation for ${name} - ${guests} guest${guests > 1 ? 's' : ''} on ${date} at ${time}`

    case 'confirmed':
      return `Reservation for ${name} on ${date} at ${time} has been confirmed`

    case 'cancelled':
      return `Reservation for ${name} on ${date} at ${time} has been cancelled`

    case 'updated':
      const changedFields = Object.keys(changes)
      if (changedFields.length > 0) {
        const changesText = changedFields
          .map(field => {
            const change = changes[field]
            return `${field}: ${change.old} → ${change.new}`
          })
          .join(', ')
        return `Reservation for ${name} updated: ${changesText}`
      }
      return `Reservation for ${name} has been updated`

    case 'deleted':
      return `Reservation for ${name} on ${date} at ${time} has been deleted`

    default:
      return `Reservation for ${name} - ${action}`
  }
}

/**
 * Generate push notification data payload (for mobile push notifications only)
 * @param {String} action - Action type
 * @param {Object} reservation - Reservation object
 * @param {Object} additionalData - Additional data to include
 * @returns {Object} Push notification data payload
 */
export const generatePushNotificationData = (action, reservation, additionalData = {}) => {
  return {
    type: `reservation_${action}`,
    reservationId: reservation._id.toString(),
    action,
    screen: 'ReservationDetails',
    timestamp: new Date().toISOString(),
    ...additionalData
  }
}

/**
 * Format reservation details for notification
 * @param {Object} reservation - Reservation object
 * @returns {Object} Formatted reservation details
 */
export const formatReservationForNotification = (reservation) => {
  return {
    id: reservation._id.toString(),
    name: reservation.name,
    email: reservation.email,
    phone: reservation.phone,
    date: formatNotificationDate(reservation.date),
    time: formatNotificationTime(reservation.time),
    guests: reservation.guests,
    status: reservation.status,
    specialRequests: reservation.specialRequests
  }
}

/**
 * Check if notification should be sent based on action and settings
 * @param {String} action - Action type
 * @param {Object} settings - Notification settings
 * @returns {Boolean} Whether notification should be sent
 */
export const shouldSendNotification = (action, settings = {}) => {
  // By default, send notifications for all actions
  const defaultActions = ['created', 'confirmed', 'cancelled', 'updated']
  
  if (settings.enabledActions) {
    return settings.enabledActions.includes(action)
  }

  return defaultActions.includes(action)
}

/**
 * Generate notification sound based on action
 * @param {String} action - Action type
 * @returns {String} Sound identifier
 */
export const getNotificationSound = (action) => {
  const sounds = {
    created: 'default',
    confirmed: 'success',
    cancelled: 'error',
    updated: 'default',
    deleted: 'default'
  }

  return sounds[action] || 'default'
}

/**
 * Generate notification priority based on action
 * @param {String} action - Action type
 * @returns {String} Priority level (high, normal, low)
 */
export const getNotificationPriority = (action) => {
  const priorities = {
    created: 'high',
    confirmed: 'high',
    cancelled: 'high',
    updated: 'normal',
    deleted: 'low'
  }

  return priorities[action] || 'normal'
}

/**
 * Batch notifications by user
 * @param {Array} notifications - Array of notification objects
 * @returns {Object} Notifications grouped by user ID
 */
export const batchNotificationsByUser = (notifications) => {
  return notifications.reduce((batches, notification) => {
    const userId = notification.userId || 'all'
    if (!batches[userId]) {
      batches[userId] = []
    }
    batches[userId].push(notification)
    return batches
  }, {})
}

/**
 * Create notification summary for multiple reservations
 * @param {Array} reservations - Array of reservations
 * @param {String} action - Action type
 * @returns {Object} Notification summary
 */
export const createBatchNotificationSummary = (reservations, action) => {
  const count = reservations.length
  const title = `${count} Reservation${count > 1 ? 's' : ''} ${action}`
  const body = `You have ${count} reservation${count > 1 ? 's' : ''} that ${action === 'created' ? 'were' : 'have been'} ${action}`

  return {
    title,
    body,
    pushData: {
      type: 'batch_notification',
      action,
      count,
      reservationIds: reservations.map(r => r._id.toString())
    }
  }
}

/**
 * Validate Expo push token format
 * @param {String} token - Expo push token
 * @returns {Boolean} Whether token is valid
 */
export const isValidExpoPushToken = (token) => {
  if (!token || typeof token !== 'string') {
    return false
  }

  // Expo push token format: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
  const expoTokenRegex = /^ExponentPushToken\[[a-zA-Z0-9_-]+\]$/
  return expoTokenRegex.test(token)
}

/**
 * Generate error message for failed notification
 * @param {Object} error - Error object
 * @returns {String} User-friendly error message
 */
export const getNotificationErrorMessage = (error) => {
  const errorMessages = {
    DeviceNotRegistered: 'Device is no longer registered for push notifications',
    MessageTooBig: 'Notification message is too large',
    MessageRateExceeded: 'Too many notifications sent, please try again later',
    InvalidCredentials: 'Invalid push notification credentials',
    MismatchSenderId: 'Sender ID mismatch'
  }

  if (error && error.message) {
    for (const [key, message] of Object.entries(errorMessages)) {
      if (error.message.includes(key)) {
        return message
      }
    }
  }

  return 'Failed to send push notification'
}

export default {
  formatNotificationDate,
  formatNotificationTime,
  generateNotificationTitle,
  generateNotificationBody,
  generatePushNotificationData,
  formatReservationForNotification,
  shouldSendNotification,
  getNotificationSound,
  getNotificationPriority,
  batchNotificationsByUser,
  createBatchNotificationSummary,
  isValidExpoPushToken,
  getNotificationErrorMessage
}
