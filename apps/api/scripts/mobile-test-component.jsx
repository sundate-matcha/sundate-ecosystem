/**
 * React Native/Expo component for testing notifications
 * Copy this into your mobile app for testing
 */

import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

const API_BASE_URL = 'http://localhost:5001/api' // Change to your API URL

export default function NotificationTestScreen() {
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [timeSensitiveNotifications, setTimeSensitiveNotifications] = useState([])

  // Register for push notifications
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token)
        registerTokenWithAPI(token)
      }
    })

    // Listen for notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('📱 Notification received:', notification)
      fetchNotifications() // Refresh notifications
    })

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', response)
      // Handle notification tap
      const data = response.notification.request.content.data
      if (data.screen) {
        // Navigate to specific screen
        console.log('Navigate to:', data.screen)
      }
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener)
      Notifications.removeNotificationSubscription(responseListener)
    }
  }, [])

  // Register for push notifications
  async function registerForPushNotificationsAsync() {
    let token

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!')
        return
      }
      token = (await Notifications.getExpoPushTokenAsync()).data
    } else {
      Alert.alert('Must use physical device for Push Notifications')
    }

    return token
  }

  // Register token with API
  async function registerTokenWithAPI(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/push-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          deviceId: Device.osInternalBuildId || 'test-device',
          platform: Platform.OS,
          deviceInfo: {
            model: Device.modelName,
            os: Device.osVersion,
          }
        })
      })

      if (response.ok) {
        console.log('✅ Push token registered with API')
      } else {
        console.error('❌ Failed to register push token')
      }
    } catch (error) {
      console.error('❌ Error registering push token:', error)
    }
  }

  // Fetch notifications from API
  async function fetchNotifications() {
    try {
      const userId = 'test-user-id' // Replace with actual user ID
      
      // Fetch all notifications
      const response = await fetch(`${API_BASE_URL}/notifications?userId=${userId}&prioritizeTimeSensitive=true`)
      const data = await response.json()
      
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)

      // Fetch time-sensitive notifications
      const timeSensitiveResponse = await fetch(`${API_BASE_URL}/notifications/time-sensitive?userId=${userId}`)
      const timeSensitiveData = await timeSensitiveResponse.json()
      
      setTimeSensitiveNotifications(timeSensitiveData.notifications || [])
    } catch (error) {
      console.error('❌ Error fetching notifications:', error)
    }
  }

  // Mark notification as read
  async function markAsRead(notificationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH'
      })

      if (response.ok) {
        console.log('✅ Notification marked as read')
        fetchNotifications() // Refresh
      }
    } catch (error) {
      console.error('❌ Error marking as read:', error)
    }
  }

  // Send test notification
  async function sendTestNotification() {
    try {
      const response = await fetch(`${API_BASE_URL}/push-tokens/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '🧪 Test from Mobile App',
          body: 'This is a test notification sent from the mobile app',
          data: {
            type: 'test',
            screen: 'TestScreen'
          }
        })
      })

      if (response.ok) {
        Alert.alert('Success', 'Test notification sent!')
      } else {
        Alert.alert('Error', 'Failed to send test notification')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔔 Notification Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Push Token</Text>
        <Text style={styles.token}>{expoPushToken || 'Not registered'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Unread Count: {unreadCount}</Text>
        <TouchableOpacity style={styles.button} onPress={fetchNotifications}>
          <Text style={styles.buttonText}>Refresh Notifications</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time-Sensitive Notifications ({timeSensitiveNotifications.length})</Text>
        {timeSensitiveNotifications.map((notification, index) => (
          <View key={index} style={[styles.notification, notification.isTimeSensitive && styles.timeSensitive]}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationBody}>{notification.body}</Text>
            <Text style={styles.notificationTime}>{notification.timeAgo}</Text>
            {!notification.isRead && (
              <TouchableOpacity 
                style={styles.readButton} 
                onPress={() => markAsRead(notification._id)}
              >
                <Text style={styles.readButtonText}>Mark as Read</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Notifications ({notifications.length})</Text>
        {notifications.map((notification, index) => (
          <View key={index} style={[styles.notification, notification.isTimeSensitive && styles.timeSensitive]}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationBody}>{notification.body}</Text>
            <Text style={styles.notificationTime}>{notification.timeAgo}</Text>
            <View style={styles.notificationMeta}>
              <Text style={styles.metaText}>Priority: {notification.priority}</Text>
              <Text style={styles.metaText}>Time-sensitive: {notification.isTimeSensitive ? 'Yes' : 'No'}</Text>
              <Text style={styles.metaText}>Read: {notification.isRead ? 'Yes' : 'No'}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.testButton} onPress={sendTestNotification}>
        <Text style={styles.testButtonText}>Send Test Notification</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  token: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  notification: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ddd',
  },
  timeSensitive: {
    borderLeftColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  notificationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
  readButton: {
    backgroundColor: '#34C759',
    padding: 5,
    borderRadius: 3,
    alignSelf: 'flex-start',
  },
  readButtonText: {
    color: 'white',
    fontSize: 12,
  },
  testButton: {
    backgroundColor: '#FF9500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
