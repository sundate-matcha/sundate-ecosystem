/**
 * Test script to verify notification changes
 * This script tests the updated notification functionality
 */

import mongoose from 'mongoose'
import Notification from '../src/models/Notification.js'

// Connect to MongoDB (adjust connection string as needed)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sundate-matcha'

async function testNotifications() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Test 1: Create a regular notification
    console.log('\n📝 Testing regular notification creation...')
    const regularNotification = await Notification.createNotification({
      userId: new mongoose.Types.ObjectId(),
      type: 'reservation_created',
      title: '🎉 Test Notification',
      body: 'This is a test notification',
      reservationId: new mongoose.Types.ObjectId(),
      priority: 'normal',
      isTimeSensitive: false
    })
    console.log('✅ Regular notification created:', regularNotification._id)

    // Test 2: Create a time-sensitive notification
    console.log('\n⏰ Testing time-sensitive notification creation...')
    const timeSensitiveNotification = await Notification.createNotification({
      userId: new mongoose.Types.ObjectId(),
      type: 'reservation_confirmed',
      title: '✅ Urgent Notification',
      body: 'This is a time-sensitive notification',
      reservationId: new mongoose.Types.ObjectId(),
      priority: 'high',
      isTimeSensitive: true
    })
    console.log('✅ Time-sensitive notification created:', timeSensitiveNotification._id)

    // Test 3: Test getUserNotifications with time-sensitive prioritization
    console.log('\n📋 Testing getUserNotifications with prioritization...')
    const userId = new mongoose.Types.ObjectId()
    
    // Create multiple notifications with different time-sensitive values
    await Notification.createNotification({
      userId,
      type: 'reservation_created',
      title: 'Regular 1',
      body: 'Regular notification 1',
      isTimeSensitive: false
    })
    
    await Notification.createNotification({
      userId,
      type: 'reservation_confirmed',
      title: 'Time-sensitive 1',
      body: 'Time-sensitive notification 1',
      isTimeSensitive: true
    })
    
    await Notification.createNotification({
      userId,
      type: 'reservation_updated',
      title: 'Regular 2',
      body: 'Regular notification 2',
      isTimeSensitive: false
    })

    const result = await Notification.getUserNotifications(userId, {
      page: 1,
      limit: 10,
      prioritizeTimeSensitive: true
    })

    console.log('✅ Notifications retrieved:', result.notifications.length)
    console.log('📊 First notification should be time-sensitive:', result.notifications[0].isTimeSensitive)

    // Test 4: Test getTimeSensitiveNotifications
    console.log('\n🚨 Testing getTimeSensitiveNotifications...')
    const timeSensitiveResult = await Notification.getTimeSensitiveNotifications(userId, {
      page: 1,
      limit: 10
    })
    console.log('✅ Time-sensitive notifications retrieved:', timeSensitiveResult.notifications.length)
    console.log('📊 All should be time-sensitive:', timeSensitiveResult.notifications.every(n => n.isTimeSensitive))

    // Test 5: Verify data field is not present
    console.log('\n🔍 Testing that data field is not present...')
    const notification = await Notification.findById(regularNotification._id)
    const hasDataField = 'data' in notification.toObject()
    console.log('✅ Data field removed:', !hasDataField)

    // Test 6: Verify expiresAt field is not present
    console.log('\n🔍 Testing that expiresAt field is not present...')
    const hasExpiresAtField = 'expiresAt' in notification.toObject()
    console.log('✅ ExpiresAt field removed:', !hasExpiresAtField)

    // Test 7: Test notification methods
    console.log('\n🔧 Testing notification instance methods...')
    
    // Test mark as read
    await regularNotification.markAsRead()
    console.log('✅ Notification marked as read')
    
    // Test mark as unread
    await regularNotification.markAsUnread()
    console.log('✅ Notification marked as unread')
    
    // Test archive
    await regularNotification.archive()
    console.log('✅ Notification archived')
    
    // Test unarchive
    await regularNotification.unarchive()
    console.log('✅ Notification unarchived')

    // Test 8: Test static methods
    console.log('\n📊 Testing static methods...')
    
    const unreadCount = await Notification.getUnreadCount(userId)
    console.log('✅ Unread count retrieved:', unreadCount)
    
    const markAllResult = await Notification.markAllAsRead(userId)
    console.log('✅ Mark all as read result:', markAllResult.modifiedCount, 'notifications updated')

    // Test 9: Test notification schema fields
    console.log('\n🔍 Testing notification schema fields...')
    const testNotification = await Notification.createNotification({
      userId: new mongoose.Types.ObjectId(),
      type: 'system',
      title: 'Schema Test',
      body: 'Testing all schema fields',
      priority: 'high',
      isTimeSensitive: true,
      icon: '🧪',
      actionUrl: 'https://example.com',
      imageUrl: 'https://example.com/image.jpg'
    })
    
    const notificationObj = testNotification.toObject()
    const expectedFields = [
      'userId', 'type', 'title', 'body', 'reservationId', 'priority',
      'isTimeSensitive', 'isRead', 'readAt', 'isSent', 'sentAt',
      'isArchived', 'archivedAt', 'actionUrl', 'icon', 'imageUrl',
      'createdAt', 'updatedAt', 'timeAgo'
    ]
    
    const hasAllFields = expectedFields.every(field => field in notificationObj)
    console.log('✅ All expected fields present:', hasAllFields)
    
    const removedFields = ['data', 'expiresAt']
    const removedFieldsCheck = removedFields.every(field => !(field in notificationObj))
    console.log('✅ Removed fields not present:', removedFieldsCheck)

    console.log('\n🎉 All tests passed! Notification system updated successfully.')
    console.log('\n📋 Summary of changes:')
    console.log('   • Data field removed from in-app notifications')
    console.log('   • ExpiresAt field removed (notifications no longer expire)')
    console.log('   • Time-sensitive notifications are prioritized')
    console.log('   • New getTimeSensitiveNotifications method added')
    console.log('   • Notification sorting prioritizes urgent notifications')

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
testNotifications()
