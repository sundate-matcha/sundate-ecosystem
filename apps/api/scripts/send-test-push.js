/**
 * Send test push notifications to mobile devices
 * This script sends actual push notifications for testing
 */

import { Expo } from 'expo-server-sdk'
import mongoose from 'mongoose'
import PushToken from '../src/models/PushToken.js'

// Create a new Expo SDK client
const expo = new Expo()

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sundate-matcha'

async function sendTestPushNotifications() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Get all active push tokens
    const pushTokens = await PushToken.find({ isActive: true })
    console.log(`📱 Found ${pushTokens.length} active push tokens`)

    if (pushTokens.length === 0) {
      console.log('⚠️  No active push tokens found. Register a device first.')
      console.log('   Use: POST /api/push-tokens with your Expo push token')
      return
    }

    // Test notifications to send
    const testNotifications = [
      {
        title: '🎉 Test Notification',
        body: 'This is a test notification from Sundate Matcha API',
        data: {
          type: 'test',
          screen: 'Home',
          timestamp: new Date().toISOString()
        }
      },
      {
        title: '✅ Reservation Confirmed',
        body: 'Your reservation for 2 guests on Jan 15, 2025 at 7:00 PM has been confirmed',
        data: {
          type: 'reservation_confirmed',
          reservationId: '507f1f77bcf86cd799439011',
          screen: 'ReservationDetails',
          urgent: true
        }
      },
      {
        title: '⏰ Time-Sensitive Alert',
        body: 'This is a time-sensitive notification that should be prioritized',
        data: {
          type: 'urgent',
          screen: 'Notifications',
          urgent: true,
          priority: 'high'
        }
      }
    ]

    // Send each test notification
    for (let i = 0; i < testNotifications.length; i++) {
      const notification = testNotifications[i]
      console.log(`\n📤 Sending test notification ${i + 1}: ${notification.title}`)

      // Create messages for all tokens
      const messages = pushTokens.map(pushToken => ({
        to: pushToken.token,
        sound: 'default',
        title: notification.title,
        body: notification.body,
        data: notification.data,
        priority: 'high',
        badge: 1
      }))

      // Send notifications in chunks
      const chunks = expo.chunkPushNotifications(messages)
      let successCount = 0
      let failedCount = 0

      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
          
          ticketChunk.forEach((ticket, index) => {
            const token = chunk[index].to
            if (ticket.status === 'error') {
              console.error(`❌ Error sending to ${token}:`, ticket.message)
              failedCount++
            } else {
              console.log(`✅ Sent to ${token}:`, ticket.id)
              successCount++
            }
          })
        } catch (error) {
          console.error('❌ Error sending chunk:', error.message)
          failedCount += chunk.length
        }
      }

      console.log(`📊 Results: ${successCount} sent, ${failedCount} failed`)

      // Wait 2 seconds between notifications
      if (i < testNotifications.length - 1) {
        console.log('⏳ Waiting 2 seconds before next notification...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    console.log('\n🎉 Test push notifications completed!')
    console.log('\n📱 Check your mobile device for notifications')

  } catch (error) {
    console.error('❌ Error sending test notifications:', error.message)
    console.error(error.stack)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected from MongoDB')
  }
}

// Run the test
sendTestPushNotifications()
