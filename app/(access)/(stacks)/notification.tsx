import Header from '@/components/Header'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

interface NotificationItem {
  id: string
  type: 'info' | 'success' | 'warning' | 'message'
  title: string
  message: string
  timestamp: string
  read: boolean
  avatar?: string
}

const Notification = () => {
  const notifications: NotificationItem[] = [
    {
      id: '1',
      type: 'success',
      title: 'Payment Successful',
      message: 'Your payment of $25.99 has been processed successfully.',
      timestamp: '2 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message from Sarah',
      message: 'Hey! Are we still on for lunch tomorrow?',
      timestamp: '5 min ago',
      read: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: '3',
      type: 'info',
      title: 'App Update Available',
      message: 'Version 2.1.0 is now available with new features and bug fixes.',
      timestamp: '1 hour ago',
      read: true,
    },
    {
      id: '4',
      type: 'warning',
      title: 'Account Security Alert',
      message: 'We detected a login attempt from a new device.',
      timestamp: '3 hours ago',
      read: false,
    },
    {
      id: '5',
      type: 'info',
      title: 'Weekly Report Ready',
      message: 'Your weekly activity report is now available to view.',
      timestamp: '1 day ago',
      read: true,
    },
    {
      id: '6',
      type: 'message',
      title: 'Team Update',
      message: 'The project deadline has been moved to next Friday.',
      timestamp: '2 days ago',
      read: true,
    }
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle', color: '#10B981' }
      case 'warning':
        return { name: 'warning', color: '#F59E0B' }
      case 'info':
        return { name: 'information-circle', color: '#3B82F6' }
      case 'message':
        return { name: 'chatbubble', color: '#8B5CF6' }
      default:
        return { name: 'notifications', color: '#6B7280' }
    }
  }

  const handleNotificationPress = (id: string) => {
    console.log('Notification pressed:', id)
    // Handle notification tap
  }

  const handleMarkAllRead = () => {
    console.log('Mark all as read')
    // Handle mark all as read
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style='light'/> 
      <Header text='Notifications'/>
      
      {/* Header Actions */}
      <View className="flex-row justify-between items-center px-5 py-4 bg-white border-b border-gray-100">
        <Text 
          className="text-base font-semibold text-gray-700"
          style={{fontFamily: 'HankenGrotesk_400Regular'}}
        >
          {unreadCount} unread notifications
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text 
              className="text-sm text-blue-600 font-medium"
              style={{fontFamily: 'HankenGrotesk_400Regular'}}
            >
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="flex-1">
        {notifications.map((notification) => {
          const icon = getNotificationIcon(notification.type)
          
          return (
            <TouchableOpacity
              key={notification.id}
              onPress={() => handleNotificationPress(notification.id)}
              className={`${
                notification.read ? 'bg-white' : 'bg-gray-50'
              } px-5 py-6 border-b border-gray-100 flex-row items-start`}
            >
              {/* Icon or Avatar */}
              <View className="mr-3 mt-0.5">
                {notification.avatar ? (
                  <Image
                    source={{ uri: notification.avatar }}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <View 
                    className="w-10 h-10 rounded-full justify-center items-center"
                    style={{ backgroundColor: `${icon.color}20` }}
                  >
                    <Ionicons name={icon.name as any} size={20} color={icon.color} />
                  </View>
                )}
              </View>

              {/* Content */}
              <View className="flex-1">
                <View className="flex-row justify-between items-start mb-1">
                  <Text 
                    className="text-base font-semibold text-gray-900 flex-1 mr-2"
                    style={{fontFamily: 'HankenGrotesk_600SemiBold'}}
                  >
                    {notification.title}
                  </Text>
                  <Text 
                    className="text-xs text-gray-500 mt-0.5"
                    style={{fontFamily: 'HankenGrotesk_400Regular'}}
                  >
                    {notification.timestamp}
                  </Text>
                </View>
                
                <Text 
                  className="text-sm text-gray-600 leading-5"
                  style={{fontFamily: 'HankenGrotesk_400Regular'}}
                >
                  {notification.message}
                </Text>
              </View>

              {/* Unread Indicator */}
              {!notification.read && (
                <View className="w-2 h-2 rounded-full bg-blue-600 ml-2 mt-2" />
              )}
            </TouchableOpacity>
          )
        })}
        
        {/* Empty State */}
        {notifications.length === 0 && (
          <View className="flex-1 justify-center items-center py-15">
            <Ionicons name="notifications-outline" size={64} color="#D1D5DB" />
            <Text 
              className="text-lg font-semibold text-gray-700 mt-4 mb-2"
              style={{fontFamily: 'HankenGrotesk_400Regular'}}
            >
              No notifications yet
            </Text>
            <Text 
              className="text-sm text-gray-500 text-center"
              style={{fontFamily: 'HankenGrotesk_400Regular'}}
            >
              When you receive notifications, they will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default Notification