import Header from '@/components/Header'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

const Earnings = () => {
  const earningsData = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop',
      date: 'Oct 20, 2025',
      time: '2:30 PM',
      title: 'Complete Survey on User Experience',
      tokens: 150
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop',
      date: 'Oct 19, 2025',
      time: '10:15 AM',
      title: 'Watch Marketing Video',
      tokens: 50
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop',
      date: 'Oct 18, 2025',
      time: '4:45 PM',
      title: 'Data Entry Task',
      tokens: 200
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
      date: 'Oct 17, 2025',
      time: '11:20 AM',
      title: 'Product Review Task',
      tokens: 100
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop',
      date: 'Oct 16, 2025',
      time: '3:00 PM',
      title: 'Social Media Engagement',
      tokens: 75
    }
  ]

  const totalTokens = earningsData.reduce((sum, item) => sum + item.tokens, 0)

  return (
    <View className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
      <StatusBar style='light'/> 
      <Header text='Earnings'/>

      <ScrollView className='px-6 pt-4'>

        {/* Recent Earnings */}
        <Text style={{ fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 18, color: '#111827', marginBottom: 16 }}>
          Recent Earnings
        </Text>

        {earningsData.map((item) => (
          <View 
            key={item.id}
            className='bg-white rounded-xl border border-gray-100 p-5 mb-4 flex-row items-center'
            style={{ 
              shadowColor: '#000',
            }}
          >
            {/* Task Image */}
            <Image 
              source={{ uri: item.image }}
              style={{ width: 40, height: 40, borderRadius: 5, backgroundColor: '#E5E7EB' }}
            />

            {/* Task Details */}
            <View className='flex-1 ml-4'>
                {item.title.length >= 20 ? 
                    <Text className='text-base' style={{ fontFamily: 'HankenGrotesk_600SemiBold' }} numberOfLines={1}>
                        {item.title.slice(0, 20)}...
                    </Text>: 

                    <Text className='text-base' style={{ fontFamily: 'HankenGrotesk_600SemiBold' }} numberOfLines={1}>
                        {item.title}
                    </Text>
                }
              <Text className='text-sm text-gray-400' style={{ fontFamily: 'HankenGrotesk_500Medium' }}>
                {item.date} • {item.time}
              </Text>
            </View>

            {/* Tokens Earned */}
            <View className='items-end'>
              <Text className='text-base' style={{ fontFamily: 'HankenGrotesk_700Bold' }}>
                +{item.tokens} KU
              </Text>
              <Text className='text-xs text-green-600' style={{ fontFamily: 'HankenGrotesk_500Medium' }}>
                recieved
              </Text>
            </View>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  )
}

export default Earnings