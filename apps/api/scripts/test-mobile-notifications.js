/**
 * Test script to simulate mobile push notifications
 * This script tests the complete notification flow including push notifications
 */

import mongoose from 'mongoose'
import Notification from '../src/models/Notification.js'
import notificationService from '../src/services/notificationService.js'

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sundate-matcha'

async function testMobileNotifications() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Test 1: Register a test push token (simulate mobile app registration)
    console.log('\n📱 Testing push token registration...')
    const testToken = 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]' // Mock token for testing
    const deviceId = 'test-device-123'
    const platform = 'ios'
    const userId = new mongoose.Types.ObjectId()

    try {
      const pushToken = await notificationService.registerToken(
        testToken,
        deviceId,
        platform,
        userId,
        { model: 'iPhone 15', os: 'iOS 17.0' }
      )
      console.log('✅ Push token registered:', pushToken._id)
    } catch (error) {
      console.log('⚠️  Push token registration failed (expected in test environment):', error.message)
    }

    // Test 2: Create a reservation and trigger notifications
    console.log('\n🎯 Testing complete notification flow...')
    const reservation = {
      _id: new mongoose.Types.ObjectId(),
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      date: new Date('2025-01-15'),
      time: '19:00',
      guests: 2,
      status: 'pending'
    }

    // Test reservation created notification
    console.log('📝 Testing reservation created notification...')
    const createdResult = await notificationService.sendReservationCreatedNotification(
      reservation,
      null, // logId
      userId
    )
    console.log('✅ Reservation created notification sent:', createdResult)

    // Test reservation confirmed notification (time-sensitive)
    console.log('\n✅ Testing reservation confirmed notification (time-sensitive)...')
    const confirmedReservation = { ...reservation, status: 'confirmed' }
    const confirmedResult = await notificationService.sendReservationConfirmedNotification(
      confirmedReservation,
      null,
      userId
    )
    console.log('✅ Reservation confirmed notification sent:', confirmedResult)

    // Test urgent notification
    console.log('\n🚨 Testing urgent notification...')
    const urgentResult = await notificationService.sendUrgentNotification(
      userId,
      '🚨 URGENT: Table Change',
      'Your table has been changed due to maintenance. Please check your reservation.',
      'system',
      reservation._id,
      '⚠️'
    )
    console.log('✅ Urgent notification sent:', urgentResult)

    // Test 3: Verify in-app notifications were created
    console.log('\n📋 Testing in-app notifications...')
    const userNotifications = await Notification.getUserNotifications(userId, {
      page: 1,
      limit: 10,
      prioritizeTimeSensitive: true
    })
    
    console.log('✅ In-app notifications created:', userNotifications.notifications.length)
    console.log('📊 Time-sensitive notifications:', userNotifications.notifications.filter(n => n.isTimeSensitive).length)
    console.log('📊 Regular notifications:', userNotifications.notifications.filter(n => !n.isTimeSensitive).length)

    // Test 4: Test time-sensitive notifications endpoint
    console.log('\n⏰ Testing time-sensitive notifications endpoint...')
    const timeSensitiveNotifications = await Notification.getTimeSensitiveNotifications(userId, {
      page: 1,
      limit: 10
    })
    console.log('✅ Time-sensitive notifications retrieved:', timeSensitiveNotifications.notifications.length)

    // Test 5: Simulate mobile app behavior
    console.log('\n📱 Simulating mobile app behavior...')
    
    // Mark first notification as read (simulate user opening notification)
    if (userNotifications.notifications.length > 0) {
      const firstNotification = userNotifications.notifications[0]
      await firstNotification.markAsRead()
      console.log('✅ First notification marked as read (simulated user interaction)')
    }

    // Get unread count (simulate badge update)
    const unreadCount = await Notification.getUnreadCount(userId)
    console.log('📊 Unread notifications count:', unreadCount)

    // Test 6: Generate test data for mobile app testing
    console.log('\n🧪 Generating test data for mobile app...')
    
    const testNotifications = [
      {
        title: '🎉 Welcome to Sundate Matcha!',
        body: 'Your reservation system is ready to use.',
        type: 'system',
        isTimeSensitive: false,
        priority: 'normal'
      },
      {
        title: '⏰ Reservation Reminder',
        body: 'Your reservation is in 1 hour. Please arrive on time.',
        type: 'reservation_reminder',
        isTimeSensitive: true,
        priority: 'high'
      },
      {
        title: '🍵 Special Offer',
        body: 'Get 20% off your next visit with code WELCOME20',
        type: 'promotional',
        isTimeSensitive: false,
        priority: 'low'
      }
    ]

    for (const notificationData of testNotifications) {
      await Notification.createNotification({
        userId,
        ...notificationData,
        reservationId: Math.random() > 0.5 ? reservation._id : null
      })
    }
    console.log('✅ Test notifications created for mobile app testing')

    // Test 7: API endpoint simulation
    console.log('\n🌐 Simulating API endpoints...')
    
    // Simulate GET /api/notifications
    const apiResponse = {
      notifications: userNotifications.notifications,
      total: userNotifications.total,
      totalPages: userNotifications.totalPages,
      currentPage: userNotifications.currentPage,
      unreadCount: unreadCount
    }
    console.log('✅ API response structure:', {
      notificationCount: apiResponse.notifications.length,
      unreadCount: apiResponse.unreadCount,
      totalPages: apiResponse.totalPages
    })

    console.log('\n🎉 Mobile notification testing completed!')
    console.log('\n📱 Next steps for mobile app testing:')
    console.log('   1. Use Expo Go app or development build')
    console.log('   2. Register push token with this API')
    console.log('   3. Test notification display and interaction')
    console.log('   4. Verify time-sensitive notifications are prioritized')
    console.log('   5. Test notification actions (mark as read, archive)')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error(error.stack)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected from MongoDB')
  }
}

// Run the test
testMobileNotifications()
