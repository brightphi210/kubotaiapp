import Header from '@/components/Header'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import {
  Alert,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

const Friends = () => {
  const [activeTab, setActiveTab] = useState('Team')
  
  // Sample team member data
  const teamMembers = [
    { 
      id: 1, 
      name: 'KateAbah', 
      username: '@172371028',
      avatar: null,
      status: 'Inactive',
      canPing: true
    },
  ]

  // Sample referral data for stats
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

  const totalInvited = 0 // pioneers
  const totalMembers = teamMembers.length
  const activeMembers = teamMembers.filter(member => member.status === 'Active').length

  const handleCopyInviteLink = async () => {
    const inviteLink = 'https://kubot.app/invite/iamkvisuals'
    
    try {
      await Share.share({
        message: `Join me on Kubot and start mining tokens! Use my invite link: ${inviteLink}`,
        url: inviteLink,
      })
    } catch (error) {
      Alert.alert('Error', 'Could not copy invite link')
    }
  }

  const handlePing = (memberName : any) => {
    Alert.alert('Ping', `Ping sent to ${memberName}`)
  }

  const TeamMemberItem = ({ member }: any) => (
    <View className="flex-row items-center justify-between py-4 px-4 mb-3 bg-white rounded-xl">
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 bg-gray-200 rounded-full mr-4 justify-center items-center">
          <Text className="text-gray-700 text-lg font-bold" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
            {member.name.charAt(0)}
          </Text>
        </View>
        
        <View className="flex-1">
          <Text className="text-gray-700 text-base font-semibold mb-1" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
            {member.name}
          </Text>
          <Text className="text-neutral-400 text-sm mb-1" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
            {member.username}
          </Text>
          <Text className="text-neutral-500 text-xs" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
            {member.status}
          </Text>
        </View>
      </View>
      
      {member.canPing && (
        <TouchableOpacity
          onPress={() => handlePing(member.name)}
          className="bg-yellow-500/20 border border-yellow-500/40 rounded-full px-4 py-2"
        >
          <Text className="text-yellow-500 text-xs font-medium" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
            Ping
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )

  const ReferralItem = ({ referral }: any) => (
    <View className="flex-row items-center justify-between py-4 mb-5 border-b border-neutral-900 bg-neutral-950 rounded-2xl px-4">
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
      
      <View className="items-end">
        <Text className="text-white text-base font-bold mb-1" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
          +{referral.reward} KU
        </Text>
        <Text className="text-green-500 text-xs font-medium" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
          {referral.status}
        </Text>
      </View>
    </View>
  )

  return (
    <View className="flex-1" style={{ backgroundColor: '#f5f5f5' }}>
      <StatusBar style='light'/>      
      <Header text='Friend' />

      <View className="flex-1 bg-gray-100 px-4">
        <View className="flex-row mx-6 mt-6 mb-6">
          <TouchableOpacity
            onPress={() => setActiveTab('Team')}
            className={`flex-1 py-3 rounded-l-xl ${activeTab === 'Team' ? 'bg-black' : 'bg-white'}`}
          >
            <Text className={`text-center font-semibold ${activeTab === 'Team' ? 'text-white' : 'text-black'}`} style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
              Team
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveTab('Security Circle')}
            className={`flex-1 py-3 rounded-r-xl ${activeTab === 'Security Circle' ? 'bg-black' : 'bg-white'} flex-row items-center justify-center`}
          >
            <Text className={`font-semibold mr-1 ${activeTab === 'Security Circle' ? 'text-white' : 'text-black'}`} style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
              Security Circle
            </Text>
            <View className="w-4 h-4 bg-gray-400 rounded-full items-center justify-center">
              <Text className="text-white text-xs">?</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {activeTab === 'Team' && (
            <>
              {/* Stats Section */}
              <View className="mb-3">
                <View className="mb-4">
                  <Text className="text-gray-800 text-base mb-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    You have invited
                  </Text>
                  <Text className="text-gray-400 text-sm mb-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    {totalInvited} pioneer(s)
                  </Text>
                </View>

                <View className="mb-4">
                  <Text className="text-gray-800 text-base mb-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    Your team has
                  </Text>
                  <Text className="text-gray-400 text-sm mb-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    {totalMembers} member(s)
                  </Text>
                </View>

                <View className="mb-2">
                  <Text className="text-gray-800 text-base mb-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    Currently earning
                  </Text>
                  <Text className="text-gray-400 text-sm mb-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    {activeMembers} active member(s)
                  </Text>
                </View>
              </View>

              {/* Team Members List */}
              <View className="mb-6">
                {teamMembers.length > 0 ? (
                  teamMembers.map((member) => (
                    <TeamMemberItem key={member.id} member={member} />
                  ))
                ) : (
                  <View className="py-8">
                    <Text className="text-center text-gray-500" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                      No team members yet
                    </Text>
                  </View>
                )}
                
                {teamMembers.length > 0 && (
                  <View className="py-4">
                    <Text className="text-center text-gray-500" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                      No more
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}

          {activeTab === 'Security Circle' && (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-gray-500 text-center" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                Security Circle content coming soon
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Copy Invite Link Button - Always visible */}
        <View className="px-6 pb-8 pt-4 bg-gray-100">
          <TouchableOpacity
            onPress={handleCopyInviteLink}
            className="bg-[#016FEC] rounded-xl py-4 px-6 shadow-lg"
          >
            <View className="flex-row items-center justify-center">
              <MaterialIcons name='link' size={24} color={'white'} />
              <Text className="text-white text-sm font-medium ml-3" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
                Copy Invite Link
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Friends