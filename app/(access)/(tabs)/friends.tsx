import Header from '@/components/Header'
import LoadingOverlay from '@/components/LoadingOverlay'
import { useGetFriends, useGetInvitation } from '@/hooks/queries/allQueries'
import { Ionicons } from '@expo/vector-icons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import * as Clipboard from 'expo-clipboard'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'

import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { Toast } from 'react-native-toast-notifications'


const Friends = () => {
  const [activeTab, setActiveTab] = useState('Team')

  const {getFriendsData, isLoading} = useGetFriends()
  const myFriendsData = getFriendsData?.data?.data || []
  
  console.log('Friends', myFriendsData[0]?.referred_user)
  console.log('Friends Many', myFriendsData)
  
  const totalInvited = myFriendsData.length // pioneers


  const { getInvitationToken, isLoading: getInvitationLoading } = useGetInvitation()
  const inviteCode = getInvitationToken?.data.data?.referral_code
  console.log('This is invitation code', inviteCode)

  const handleCopyCode = async () => {
    if (inviteCode) {
      await Clipboard.setStringAsync(inviteCode);
      Toast.show('Referral code copied to clipboard!', { type: 'success' });
    }
  };


  const TeamMemberItem = ({ member }: any) => (
    <View className="flex-row items-center justify-between py-4 px-4 mb-3 bg-white rounded-xl">
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-gray-200 rounded-full object-cover overflow-hidden mr-4 justify-center items-center">
          <Ionicons name="person" size={20} color="gray" />
        </View>
        
        <View className="flex-1">
          <Text className="text-[#016FEC] text-base mb-1" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
            {member?.referred_user?.username|| 'Chibuzor Philip'}
          </Text>
          <Text className="text-neutral-400 text-xs" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
            {member?.referred_user?.username.slice(0, 20) || 'N/A'}...
          </Text>
        </View>

        <View className='self-end'>
          <Text className='text-xs text-gray-500'>
            {new Date(member?.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </Text>
        </View>
      </View>
    </View>
  )

  return (
    <View className="flex-1" style={{ backgroundColor: '#f5f5f5' }}>
      <StatusBar style='light'/>      
      <Header text='Friend' />
      <LoadingOverlay visible={isLoading}/>

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
                    {myFriendsData.length} member(s)
                  </Text>
                </View>
              </View>

              {/* Team Members List */}
              {!isLoading && (
                <View className="mb-6">
                  {myFriendsData.length > 0 ? (
                    myFriendsData.map((member: any) => (
                      <TeamMemberItem key={member.id} member={member} />
                    ))
                  ) : (
                    <View className="py-8 pt-10">
                      <View className='bg-gray-200 w-fit m-auto p-4 px-4.5 rounded-full'>
                        <Ionicons name='people' size={30} color={'gray'}/>
                      </View>
                      <Text className="text-center text-gray-500 pt-4 text-sm" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                        No team members yet
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </>
          )}

          {activeTab === 'Security Circle' && (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-gray-500 text-center" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                Content coming soon
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Copy Invite Link Button - Always visible */}
        <View className="px-6 pb-8 pt-4 bg-gray-100">
          <TouchableOpacity
            onPress={handleCopyCode}
            className="bg-[#016FEC] rounded-xl py-4 px-6 shadow-lg"
          >
            <View className="flex-row items-center justify-center">
              <MaterialIcons name='link' size={24} color={'white'} />
              <Text className="text-white text-sm font-medium ml-3" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
                Copy Code
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Friends