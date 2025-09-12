import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React from 'react'
import {
  Alert,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Friends = () => {
  // Sample referral data
  const referrals = [
    { 
      id: 1, 
      name: 'Bright', 
      reward: 500, 
      date: 'January 27 at 09:56',
      status: 'Received'
    },
    { 
      id: 2, 
      name: 'Bright', 
      reward: 500, 
      date: 'January 27 at 09:56',
      status: 'Received'
    },
    { 
      id: 3, 
      name: 'Bright', 
      reward: 500, 
      date: 'January 27 at 09:56',
      status: 'Received'
    },
    { 
      id: 4, 
      name: 'Bright', 
      reward: 500, 
      date: 'January 27 at 09:56',
      status: 'Received'
    },
  ]

  const totalReferrals = referrals.length
  const totalEarnings = referrals.reduce((sum, ref) => sum + ref.reward, 0)

  const handleCopyInviteLink = async () => {
    const inviteLink = 'https://kubot.app/invite/iamkvisuals'
    
    try {
      await Share.share({
        message: `Join me on Kubot and start mining tokens! Use my invite link: ${inviteLink}`,
        url: inviteLink,
      })
    } catch (error: any) {
      Alert.alert('Error', 'Could not copy invite link')
    }
  }

  const ReferralItem = ({ referral }:any) => (
    <View className="flex-row items-center justify-between py-4 mb-3 bg-neutral-950  rounded-2xl">
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 bg-black rounded-xl mr-4 justify-center items-center">
          <MaterialIcons name='person' size={24} color={'#F59E0B'} />
        </View>
        
        <View className="flex-1">
          <Text className="text-white text-base font-semibold mb-1" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
            {referral.name}
          </Text>
          <Text className="text-neutral-400 text-sm" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
            {referral.date}
          </Text>
        </View>
      </View>
      
      {/* Reward and Status */}
      <View className="items-end">
        <Text className="text-white text-base font-bold mb-1" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
          +{referral.reward} Kubot
        </Text>
        <Text className="text-green-500 text-xs font-medium" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
          {referral.status}
        </Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#0a0a0a' }}>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="py-5 pt-12">
          <Text className="text-2xl font-bold text-white text-center mb-4" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
            Invite Friends
          </Text>
          <Text className="text-neutral-400 text-center text-lg leading-7 px-4" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
            Earn 3% daily mining{'\n'}pool for every of your{'\n'}referrals
          </Text>
        </View>

        {/* Stats Banner */}
        <View className="bg-gradient-to-r from-blue-900/20 to-green-900/20 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 py-3 mb-8">
          <View className="flex-row justify-between items-center">
            <View className="">
              <Text className="text-white text-lg font-bold mb-1" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                Total
              </Text>
              <Text className="text-blue-400 text-xs font-bold" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                {totalReferrals} Referrals
              </Text>
            </View>
            <View className="w-px h-12 bg-neutral-700"></View>
            <View className="">
              <Text className="text-white text-lg font-bold mb-1" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                Earned
              </Text>
              <Text className="text-green-500 text-xs font-bold" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                {totalEarnings.toLocaleString()} KU
              </Text>
            </View>
          </View>
        </View>

        {/* Referral List */}
        <View className="pb-6">
          <Text className="text-white text-lg font-semibold mb-4" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
            Recent Referrals
          </Text>
          {referrals.map((referral) => (
            <ReferralItem key={referral.id} referral={referral} />
          ))}
        </View>

        {/* Copy Invite Link Button */}
        <View className="pb-8">
          <TouchableOpacity
            onPress={handleCopyInviteLink}
            className="bg-[#016FEC] rounded-xl py-4 px-6 shadow-lg"
          >
            <View className="flex-row items-center justify-center">
              <MaterialIcons name='link' size={24} color={'white'} />
              <Text className="text-white text-sm  ml-3" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
                Copy Invite Link
              </Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Friends