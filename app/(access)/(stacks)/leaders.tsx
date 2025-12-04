import Header from '@/components/Header'
import { useGetGlobalTokens, useGetRegionalTokens } from '@/hooks/queries/allQueries'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const getRankColor = (rank: any) => {
  switch(rank) {
    case 1: return '#016FEC'
    case 2: return '#016FEC'
    case 3: return '#016FEC'
    default: return '#6B7280'
  }
}


const getInitials = (name: any) => {
  if (!name) return '?'
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
        {leader?.owner?.profile?.image ? (
          <Image 
            source={{ uri: leader?.owner?.profile?.image }} 
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
              {getInitials(leader?.owner?.username)}
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
          {leader?.owner?.username}
        </Text>
      </View>

      {/* Score */}
      <View>
        <Text 
          className="text-base font-bold text-gray-900"
          style={{ fontFamily: 'HankenGrotesk_700Bold' }}
        >
          {leader?.quantity && leader?.quantity.toLocaleString() || '0.00'} KU
        </Text>
      </View>
    </View>
  )
}

const Leaders = () => {
  const [selectedView, setSelectedView] = useState('Regional')

  const {getRegionalLeader, isLoading: regionalLoading} = useGetRegionalTokens()
  const regionalLeader = getRegionalLeader?.data?.results || []

  const {getGlobalLeader, isLoading: globalLoading} = useGetGlobalTokens()
  const globalLeader = getGlobalLeader?.data?.results || []

  // Sort the data by quantity (reward) in descending order
  const sortedRegionalData = [...regionalLeader].sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
  const sortedGlobalData = [...globalLeader].sort((a, b) => (b.quantity || 0) - (a.quantity || 0))

  // Select which data to display based on the active view
  const displayData = selectedView === 'Regional' ? sortedRegionalData : sortedGlobalData
  const isLoading = selectedView === 'Regional' ? regionalLoading : globalLoading

  console.log('Regional Leaders:', regionalLeader);
  console.log('Global Leaders:', globalLeader);

  return (
    <View className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
      <StatusBar style='light'/> 
      <Header text='Ranking'/>

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

      {/* Loading State */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#016FEC" />
        </View>
      ) : (
        /* Leaderboard List */
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="pb-6">
            {displayData.length > 0 ? (
              displayData.map((leader, index) => (
                <RankingItem key={leader.id || index} leader={leader} index={index} />
              ))
            ) : (
              <View className="items-center justify-center py-10">
                <Text 
                  className="text-gray-500 text-base"
                  style={{ fontFamily: 'HankenGrotesk_600SemiBold' }}
                >
                  No ranking data available
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

export default Leaders