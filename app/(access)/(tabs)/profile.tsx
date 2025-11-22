import { SolidLightButton, SolidMainButton } from '@/components/Btns'
import { useGetProfile } from '@/hooks/queries/allQueries'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Toast } from 'react-native-toast-notifications'

const CustomModal = ({ visible, onClose, children }:any) => {
if (!visible) return null;

return (
  <View className='absolute inset-0 flex-1 justify-center items-center bg-black/50 z-50'>
    <TouchableOpacity 
      className='absolute inset-0' 
      onPress={onClose}
      activeOpacity={1}
    />
    {children}
  </View>
);
};
const Profile = () => {

  const [showDialog, setShowDialog] = useState(false);
  
  const handlePress = () => {
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };
  const handleLogout = async () => {

      await AsyncStorage.removeItem("ku_token");
      await AsyncStorage.removeItem("ku_onboarding");
      router.replace("/login");
    };


    const {isLoading, getProfile} = useGetProfile()
    const profile = getProfile?.data.data

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style='dark'/>
      <ScrollView className="flex-1">
        {isLoading? 
          <View className='justify-center m-auto mt-10'>
            <ActivityIndicator size={'small'} color={'#016FEC'}/>
          </View>
          :
          <View className="items-center py-8 px-4">
            {
              profile.image === null || profile.image === undefined ? 
                <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-4">
                  <MaterialIcons name='person-4' size={45} color={'gray'}/>
                </View> :
              
                <View className="w-24 h-24 bg-gray-200 overflow-hidden object-cover rounded-full items-center justify-center mb-4">
                  <Image source={{uri: profile.image}} className='w-full h-full object-cover'/>
                </View>
            }
            <Text className="text-gray-500 text-base mb-4">@{profile.username}</Text>
            <TouchableOpacity onPress={()=>router.push('/(access)/(stacks)/profileEdit')} className="bg-blue-500 px-6 py-2 rounded-full flex-row items-center gap-2">
              <Text className="text-white font-medium">Edit Profile</Text>
              <MaterialIcons name='edit' color={'white'} size={15}/>
            </TouchableOpacity>
          </View>
        }

        {/* Menu Options */}
        <View className="px-4 space-y-1">
            <View style={{backgroundColor: '#FEEEE6', borderRadius: 10}} className="mx-4 mb-4 p-4 rounded-xl flex-row items-center justify-between">
                <View className="flex-row gap-3 items-center flex-1">
                    <Text className="" style={{fontSize: 30}}>🎁</Text>
                    <View className="flex-1">
                        <Text style={{color:'#A53F0E'}} className=" font-semibold text-base">Referral Challenge</Text>
                        <Text style={{color: '#A53F0E'}} className="text-sm">24/7 Rewards from Every Deal</Text>
                    </View>
                </View>
                <TouchableOpacity className="bg-white px-4 py-2 rounded-full">
                    <Text className="text-gray-700 text-sm font-medium">invite</Text>
                </TouchableOpacity>
            </View>
          
          {/* Invitation Code */}
          <TouchableOpacity 
            onPress={()=>router.push('/(access)/(stacks)/invitationCode')} 
            className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <MaterialIcons name='person-4' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">Invitation code</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-400 text-lg">›</Text>
            </View>
          </TouchableOpacity>

          {/* Earning Team */}
          <TouchableOpacity onPress={()=>router.push('/(access)/(tabs)/friends')} className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <MaterialIcons name='people' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">Earning Team</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>

          {/* Account & Security */}
          <TouchableOpacity onPress={()=>router.push('/(access)/(stacks)/change-password')} className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <MaterialIcons name='security' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">Account & Security</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>

    
          {/* KYC Verification */}
          <TouchableOpacity onPress={()=>{Toast.show('KYC verification coming Soon', {type: 'success'})}} className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <Ionicons name='scan-outline' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">KYC Verification</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>router.push('/(access)/(stacks)/about')} className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <MaterialIcons name='settings' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">About</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>

          {/* Event Center */}
          <TouchableOpacity onPress={()=>router.push('/(access)/(stacks)/feedback')} className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <MaterialIcons name='feedback' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">Feedback</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>



          {/* Feedback */}
          <TouchableOpacity className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <Ionicons name='globe' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">Language</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePress} className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <Ionicons name='log-out' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">Logout</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>
        </View>

        <View className="h-14"></View>
      </ScrollView>

      <CustomModal visible={showDialog} onClose={closeDialog}>
          <View className='bg-white rounded-2xl p-8 mx-6 w-[90%]'>
            <View className='items-center justify-center m-auto rounded-full p-5 bg-neutral-100 w-fit mb-5'>
              <Ionicons name="log-out-outline" size={30} color={'gray'}/>
            </View>
            <Text className='text-xl text-center mb-2' style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
              Logout from account
            </Text>
            <Text className='text-neutral-500 text-center mb-6 w-[90%] m-auto text-sm' style={{fontFamily: 'HankenGrotesk_500Medium'}}>
              Are you sure you want to logout from your account? {'\n'} You can always login again later.
            </Text>

            <View className='flex-row items-center justify-between'>
              <View className='w-[49%]'>
                <SolidLightButton onPress={closeDialog} text='Cancle'/>
              </View>

              <View className='w-[49%]'>
                <SolidMainButton onPress={handleLogout} text='Logout'/>
              </View>
            </View>
          </View>
        </CustomModal>
    </SafeAreaView>
  )
}

export default Profile