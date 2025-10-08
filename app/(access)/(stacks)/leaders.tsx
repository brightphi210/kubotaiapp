import Header from '@/components/Header'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const leaderData = [
  { 
    id: 1, 
    name: 'Bright', 
    reward: 500000, 
    avatar: null
  },
  { 
    id: 2, 
    name: 'Grace Ige', 
    reward: 450000, 
    avatar: null
  },
  { 
    id: 3, 
    name: 'Simon Opuene', 
    reward: 400000, 
    avatar: null
  },
  { 
    id: 4, 
    name: 'Paul Tukur', 
    reward: 350000, 
    avatar: null
  },
  { 
    id: 5, 
    name: 'Joshua Durojaiye', 
    reward: 300000, 
    avatar: null
  },
  { 
    id: 6, 
    name: 'Timothy Anozie', 
    reward: 250000, 
    avatar: null
  },
  { 
    id: 7, 
    name: 'Collins Adebayo', 
    reward: 200000, 
    avatar: null
  },
  { 
    id: 8, 
    name: 'Michael Johnson', 
    reward: 150000, 
    avatar: null
  },
]

const getRankColor = (rank: any) => {
  switch(rank) {
    case 1: return '#016FEC'
    case 2: return '#016FEC'
    case 3: return '#016FEC'
    default: return '#6B7280'
  }
}

const formatNumber = (num: any) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const getInitials = (name: any) => {
  return name.split(' ').map((word: any) => word[0]).join('').toUpperCase()
}

const RankingItem = ({ leader, index }: any) => {
  const rank = index + 1
  const isTopThree = rank <= 3
  
  return (
    <View className="flex-row items-center py-5 px-4 mx-4 mb-4 bg-white rounded-xl">
      {/* Rank Number */}
      <View className="w-8 mr-4 items-center">
        <Text 
          className="text-lg font-bold" 
          style={{ 
            fontFamily: 'HankenGrotesk_700Bold',
            color: getRankColor(rank)
          }}
        >
          {rank}
        </Text>
      </View>

      {/* Avatar */}
      <View className="mr-3">
        {leader.avatar ? (
          <Image 
            source={{ uri: leader.avatar }} 
            className="w-12 h-12 rounded-full" 
          />
        ) : (
          <View 
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: '#F3F4F6' }}
          >
            <Text 
              className="text-lg font-semibold text-gray-600"
              style={{ fontFamily: 'HankenGrotesk_700Bold' }}
            >
              {getInitials(leader.name)}
            </Text>
          </View>
        )}
        
        {/* Crown for top 3 */}
        {isTopThree && (
          <View className="absolute -top-1 -right-1">
            <MaterialIcons name="emoji-events" size={16} color="#FBBC05" />
          </View>
        )}
      </View>

      {/* Name */}
      <View className="flex-1">
        <Text 
          className="text-base font-semibold text-gray-900"
          style={{ fontFamily: 'HankenGrotesk_600SemiBold' }}
        >
          {leader.name}
        </Text>
      </View>

      {/* Score */}
      <View>
        <Text 
          className="text-base font-bold text-gray-900"
          style={{ fontFamily: 'HankenGrotesk_700Bold' }}
        >
          {formatNumber(leader.reward)}.{(Math.random() * 9999).toFixed(0).padStart(4, '0')}
        </Text>
      </View>
    </View>
  )
}

const Leaders = () => {
  const [activeTab, setActiveTab] = useState('KU')
  const [selectedView, setSelectedView] = useState('Regional')
  const sortedLeaderData = [...leaderData].sort((a, b) => b.reward - a.reward)

  return (
    <View className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
      <StatusBar style='light'/> 
      <Header text='Ranking'/>

      {/* Tab Buttons */}
      <View className="flex-row mx-4 mt-4 mb-6">
        <TouchableOpacity
          onPress={() => setActiveTab('KU')}
          className={`flex-1 py-3 rounded-l-xl ${activeTab === 'KU' ? 'bg-gray-800' : 'bg-gray-200'}`}
        >
          <Text 
            className={`text-center font-semibold ${activeTab === 'KU' ? 'text-white' : 'text-gray-600'}`}
            style={{ fontFamily: 'HankenGrotesk_600SemiBold' }}
          >
            KU
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab('Users')}
          className={`flex-1 py-3 rounded-r-xl ${activeTab === 'Users' ? 'bg-gray-800' : 'bg-gray-200'}`}
        >
          <Text 
            className={`text-center font-semibold ${activeTab === 'Users' ? 'text-white' : 'text-gray-600'}`}
            style={{ fontFamily: 'HankenGrotesk_600SemiBold' }}
          >
            Users by region
          </Text>
        </TouchableOpacity>
      </View>

      {/* Regional/Global Toggle */}
      <View className="flex-row mx-4 mb-4">
        <TouchableOpacity
          onPress={() => setSelectedView('Regional')}
          className="mr-6"
        >
          <Text 
            className={`text-base font-semibold pb-2 ${selectedView === 'Regional' ? 'text-gray-900' : 'text-gray-500'}`}
            style={{ fontFamily: 'HankenGrotesk_600SemiBold' }}
          >
            Regional
          </Text>
          {selectedView === 'Regional' && (
            <View 
              className="h-1 rounded-full"
              style={{ backgroundColor: '#016FEC' }}
            />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setSelectedView('Global')}
        >
          <Text 
            className={`text-base font-semibold pb-2 ${selectedView === 'Global' ? 'text-gray-900' : 'text-gray-500'}`}
            style={{ fontFamily: 'HankenGrotesk_600SemiBold' }}
          >
            Global
          </Text>
          {selectedView === 'Global' && (
            <View 
              className="h-1 rounded-full"
              style={{ backgroundColor: '#016FEC' }}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Leaderboard List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-6">
          {sortedLeaderData.map((leader, index) => (
            <RankingItem key={leader.id} leader={leader} index={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default Leaders