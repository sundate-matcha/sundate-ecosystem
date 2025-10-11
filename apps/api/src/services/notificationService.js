import { Expo } from 'expo-server-sdk'
import PushToken from '../models/PushToken.js'
import ReservationLog from '../models/ReservationLog.js'
import Notification from '../models/Notification.js'

// Create a new Expo SDK client
const expo = new Expo()

/**
 * Notification Service for Push Notifications
 * Handles sending push notifications via Expo to mobile devices
 */
class NotificationService {
  /**
   * Send push notification to specific tokens
   * @param {Array} tokens - Array of Expo push tokens
   * @param {String} title - Notification title
   * @param {String} body - Notification body
   * @param {Object} data - Additional data to send
   * @returns {Object} Result object with success/failure counts
   */
  async sendPushNotification(tokens, title, body, data = {}) {
    if (!tokens || tokens.length === 0) {
      return {
        success: 0,
        failed: 0,
        results: []
      }
    }

    // Filter valid Expo push tokens
    const validTokens = tokens.filter(token => Expo.isExpoPushToken(token))

    if (validTokens.length === 0) {
      console.warn('No valid Expo push tokens provided')
      return {
        success: 0,
        failed: tokens.length,
        results: []
      }
    }

    // Create messages
    const messages = validTokens.map(token => ({
      to: token,
      sound: 'default',
      title,
      body,
      data,
      priority: 'high'
    }))

    // Send notifications in chunks
    const chunks = expo.chunkPushNotifications(messages)
    const results = []
    let successCount = 0
    let failedCount = 0

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk)

        ticketChunk.forEach((ticket, index) => {
          const token = chunk[index].to

          if (ticket.status === 'error') {
            console.error(`Error sending notification to ${token}:`, ticket.message)
            failedCount++

            // Mark token as failed in database
            this.handleFailedToken(token, ticket.message)
          } else {
            successCount++

            // Mark token as successful
            this.handleSuccessfulToken(token)
          }

          results.push({
            token,
            status: ticket.status,
            id: ticket.id,
            message: ticket.message
          })
        })
      } catch (error) {
        console.error('Error sending push notification chunk:', error)
        failedCount += chunk.length

        chunk.forEach(msg => {
          results.push({
            token: msg.to,
            status: 'error',
            message: error.message
          })
        })
      }
    }

    return {
      success: successCount,
      failed: failedCount,
      results
    }
  }

  /**
   * Handle failed token by updating database
   * @param {String} token - Expo push token
   * @param {String} errorMessage - Error message
   */
  async handleFailedToken(token, errorMessage) {
    try {
      const pushToken = await PushToken.findOne({ token })
      if (pushToken) {
        await pushToken.markFailure()

        // If error is DeviceNotRegistered, deactivate immediately
        if (errorMessage && errorMessage.includes('DeviceNotRegistered')) {
          pushToken.isActive = false
          await pushToken.save()
        }
      }
    } catch (error) {
      console.error('Error handling failed token:', error)
    }
  }

  /**
   * Handle successful token by updating database
   * @param {String} token - Expo push token
   */
  async handleSuccessfulToken(token) {
    try {
      const pushToken = await PushToken.findOne({ token })
      if (pushToken) {
        await pushToken.markSuccess()
      }
    } catch (error) {
      console.error('Error handling successful token:', error)
    }
  }

  /**
   * Get all active push tokens
   * @param {String} userId - Optional user ID filter
   * @returns {Array} Array of token strings
   */
  async getActiveTokens(userId = null) {
    try {
      const tokens = await PushToken.getActiveTokens(userId)
      return tokens.map(t => t.token)
    } catch (error) {
      console.error('Error getting active tokens:', error)
      return []
    }
  }

  /**
   * Send notification when reservation is created
   * @param {Object} reservation - Reservation object
   * @param {String} logId - Optional log ID to update
   * @param {String} userId - Optional user ID for in-app notification
   */
  async sendReservationCreatedNotification(reservation, logId = null, userId = null) {
    const title = '🎉 Reservation Created!'
    const body = `New reservation for ${reservation.name} on ${new Date(reservation.date).toLocaleDateString()} at ${reservation.time}`
    const data = {
      type: 'reservation_created',
      reservationId: reservation._id.toString(),
      screen: 'ReservationDetails'
    }

    // Create in-app notification
    await this.createInAppNotification({
      userId,
      type: 'reservation_created',
      title,
      body,
      data,
      reservationId: reservation._id,
      priority: 'high',
      icon: '🎉'
    })

    const tokens = await this.getActiveTokens(userId)
    const result = await this.sendPushNotification(tokens, title, body, data)

    // Update log if provided
    if (logId) {
      await this.updateLogNotificationStatus(logId, result.success > 0, result)
    }

    return result
  }

  /**
   * Send notification when reservation is confirmed
   * @param {Object} reservation - Reservation object
   * @param {String} logId - Optional log ID to update
   * @param {String} userId - Optional user ID for in-app notification
   */
  async sendReservationConfirmedNotification(reservation, logId = null, userId = null) {
    const title = '✅ Reservation Confirmed!'
    const body = `Reservation for ${reservation.name} on ${new Date(reservation.date).toLocaleDateString()} at ${reservation.time} has been confirmed`
    const data = {
      type: 'reservation_confirmed',
      reservationId: reservation._id.toString(),
      screen: 'ReservationDetails'
    }

    // Create in-app notification
    await this.createInAppNotification({
      userId,
      type: 'reservation_confirmed',
      title,
      body,
      data,
      reservationId: reservation._id,
      priority: 'high',
      icon: '✅'
    })

    const tokens = await this.getActiveTokens(userId)
    const result = await this.sendPushNotification(tokens, title, body, data)

    // Update log if provided
    if (logId) {
      await this.updateLogNotificationStatus(logId, result.success > 0, result)
    }

    return result
  }

  /**
   * Send notification when reservation is cancelled
   * @param {Object} reservation - Reservation object
   * @param {String} logId - Optional log ID to update
   * @param {String} userId - Optional user ID for in-app notification
   */
  async sendReservationCancelledNotification(reservation, logId = null, userId = null) {
    const title = '❌ Reservation Cancelled'
    const body = `Reservation for ${reservation.name} on ${new Date(reservation.date).toLocaleDateString()} at ${reservation.time} has been cancelled`
    const data = {
      type: 'reservation_cancelled',
      reservationId: reservation._id.toString(),
      screen: 'ReservationDetails'
    }

    // Create in-app notification
    await this.createInAppNotification({
      userId,
      type: 'reservation_cancelled',
      title,
      body,
      data,
      reservationId: reservation._id,
      priority: 'high',
      icon: '❌'
    })

    const tokens = await this.getActiveTokens(userId)
    const result = await this.sendPushNotification(tokens, title, body, data)

    // Update log if provided
    if (logId) {
      await this.updateLogNotificationStatus(logId, result.success > 0, result)
    }

    return result
  }

  /**
   * Send notification when reservation is updated
   * @param {Object} reservation - Reservation object
   * @param {Object} changes - Changes made to reservation
   * @param {String} logId - Optional log ID to update
   * @param {String} userId - Optional user ID for in-app notification
   */
  async sendReservationUpdatedNotification(reservation, changes = {}, logId = null, userId = null) {
    const title = '📝 Reservation Updated'
    const changesText = Object.keys(changes).join(', ')
    const body = `Reservation for ${reservation.name} has been updated. Changes: ${changesText}`
    const data = {
      type: 'reservation_updated',
      reservationId: reservation._id.toString(),
      changes,
      screen: 'ReservationDetails'
    }

    // Create in-app notification
    await this.createInAppNotification({
      userId,
      type: 'reservation_updated',
      title,
      body,
      data,
      reservationId: reservation._id,
      priority: 'normal',
      icon: '📝'
    })

    const tokens = await this.getActiveTokens(userId)
    const result = await this.sendPushNotification(tokens, title, body, data)

    // Update log if provided
    if (logId) {
      await this.updateLogNotificationStatus(logId, result.success > 0, result)
    }

    return result
  }

  /**
   * Update log notification status
   * @param {String} logId - Log ID
   * @param {Boolean} success - Whether notification was successful
   * @param {Object} result - Notification result
   */
  async updateLogNotificationStatus(logId, success, result = {}) {
    try {
      await ReservationLog.findByIdAndUpdate(logId, {
        notificationSent: success,
        notificationStatus: success ? 'sent' : 'failed',
        notificationError: success ? null : JSON.stringify(result)
      })
    } catch (error) {
      console.error('Error updating log notification status:', error)
    }
  }

  /**
   * Register a new push token
   * @param {String} token - Expo push token
   * @param {String} deviceId - Device ID
   * @param {String} platform - Platform (ios/android/web)
   * @param {String} userId - Optional user ID
   * @param {String} deviceInfo - Optional device info
   */
  async registerToken(token, deviceId, platform, userId = null, deviceInfo = null) {
    try {
      // Validate token
      if (!Expo.isExpoPushToken(token)) {
        throw new Error('Invalid Expo push token')
      }

      // Check if token already exists
      let pushToken = await PushToken.findOne({ token })

      if (pushToken) {
        // Update existing token
        pushToken.deviceId = deviceId
        pushToken.platform = platform
        pushToken.userId = userId
        pushToken.deviceInfo = deviceInfo
        pushToken.isActive = true
        pushToken.lastUsed = new Date()
        pushToken.failureCount = 0
      } else {
        // Create new token
        pushToken = new PushToken({
          token,
          deviceId,
          platform,
          userId,
          deviceInfo,
          isActive: true
        })
      }

      await pushToken.save()
      return pushToken
    } catch (error) {
      console.error('Error registering token:', error)
      throw error
    }
  }

  /**
   * Unregister a push token
   * @param {String} token - Expo push token
   */
  async unregisterToken(token) {
    try {
      const pushToken = await PushToken.findOne({ token })
      if (pushToken) {
        pushToken.isActive = false
        await pushToken.save()
        return true
      }
      return false
    } catch (error) {
      console.error('Error unregistering token:', error)
      throw error
    }
  }

  /**
   * Create in-app notification
   * @param {Object} notificationData - Notification data
   * @returns {Object} Created notification
   */
  async createInAppNotification(notificationData) {
    try {
      const notification = await Notification.createNotification({
        ...notificationData,
        isSent: true,
        sentAt: new Date()
      })
      return notification
    } catch (error) {
      console.error('Error creating in-app notification:', error)
      // Don't throw error - notification creation shouldn't break the flow
      return null
    }
  }
}

// Export singleton instance
const notificationService = new NotificationService()
export default notificationService
