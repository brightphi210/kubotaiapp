import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const names = [
  'Collins',
  'iamkvisuals', 
  'Bright'
]


  const leaderData = [
    { 
      id: 1, 
      name: 'Bright', 
      reward: 500, 
    },
    { 
      id: 2, 
      name: 'Grace Ige', 
      reward: 12000, 
    },
    { 
      id: 3, 
      name: 'Simon Opuene', 
      reward: 36000, 

    },
    { 
      id: 4, 
      name: 'Paul Tukur', 
      reward: 4400, 
    },

    { 
      id: 5, 
      name: 'Joshua Durojaiye', 
      reward: 9000, 
    },

    { 
      id: 6, 
      name: 'Timothy Anozie', 
      reward: 6400, 
    },
  ]


  const ReferralItem = ({ leader }:any) => (
    <View className="flex-row items-center justify-between py-4 border-b border-neutral-900 mb-3 bg-neutral-950  rounded-2xl">
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 bg-black rounded-xl mr-4 justify-center items-center">
          <MaterialIcons name='person' size={24} color={'#F59E0B'} />
        </View>
        
        <View className="flex-1">
          <Text className="text-white text-base font-semibold mb-1" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
            {leader.name}
          </Text>
        </View>
      </View>
      
      {/* Reward and Status */}
      <View className="items-end">
        <Text className="text-white text-base font-bold mb-1" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
          +{leader.reward} KU
        </Text>
      </View>
    </View>
  )

const Leaders = () => {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#0a0a0a' }}>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="py-5 pt-12">
          <Text className="text-3xl font-semibold text-white text-center mb-10" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
            Leaderboard
          </Text>
        </View>

        {/* Top 3 Podium */}
        <View className="flex-row justify-between border-b border-neutral-900 pb-10">
          {/* 2nd Place */}
          <View className="relative items-center flex-1" style={{ paddingTop: 45 }}>
            <View className="absolute z-10 w-24 h-24" style={{ top: 2 }}>
              <Image source={require('../../assets/images/leaders (1).png')} className="w-full h-full" resizeMode="contain" />
            </View>
            <View className="relative">
              <Image source={require('../../assets/images/holder (1).png')} className="w-40" resizeMode="contain" />
              <View className="absolute bottom-7 left-0 right-0 items-center">
                <Text className="text-xs font-semibold text-white">
                  {names[0].length >= 5 ? `${names[0].slice(0, 4)}..` : names[0]}
                </Text>
                <Text className="text-[9px] text-white opacity-80 mt-0.5">
                  50,000 KA
                </Text>
              </View>
            </View>
          </View>

          {/* 1st Place */}
          <View className="relative items-center flex-1" style={{ paddingTop: 7 }}>
            <View className="absolute z-10 w-24 h-24" style={{ top: -30,  }}>
              <Image source={require('../../assets/images/leaders (2).png')} className="w-full h-full" resizeMode="contain" />
            </View>
            <View className="relative">
              <Image source={require('../../assets/images/holder (2).png')} className="w-40" resizeMode="contain" />
              <View className="absolute bottom-7 left-0 right-0 items-center">
                <Text className="text-xs font-semibold text-white">
                  {names[1].length >= 5 ? `${names[1].slice(0, 4)}..` : names[1]}
                </Text>
                <Text className="text-[9px] text-white opacity-80 mt-0.5">
                  50,000 KA
                </Text>
              </View>
            </View>
          </View>

          {/* 3rd Place */}
          <View className="relative items-center flex-1 w-full" style={{ paddingTop: 45 }}>
            <View className="absolute z-10 w-24 h-24 rounded-full overflow-hidden" style={{ top: 2 }}>
              <Image source={require('../../assets/images/leaders (3).png')} className="w-full h-full" resizeMode="contain" />
            </View>
            <View className="relative">
              <Image source={require('../../assets/images/holder (3).png')} className="" resizeMode="contain" />
              <View className="absolute bottom-7 left-0 right-0 items-center">
                <Text className="text-xs font-semibold text-white">
                  {names[2].length >= 5 ? `${names[2].slice(0, 4)}..` : names[2]}
                </Text>
                <Text className="text-[9px] text-white opacity-80 mt-0.5">
                  50,000 KA
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Referral List */}
        <View className="pb-6">
          {leaderData.map((leader:any) => (
            <ReferralItem key={leader.id} leader={leader} />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Leaders