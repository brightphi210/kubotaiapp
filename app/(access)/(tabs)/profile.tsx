import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Profile Section */}
        <View className="items-center py-8 px-4">
          <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-4">
            <MaterialIcons name='person-4' size={45} color={'gray'}/>
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-1">John Doe</Text>
          <Text className="text-gray-500 text-base mb-4">john.doe@example.com</Text>
          <TouchableOpacity className="bg-blue-500 px-6 py-2 rounded-lg">
            <Text className="text-white font-medium">Edit Profile</Text>
          </TouchableOpacity>
        </View>

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
          {/* Event Center */}
          <TouchableOpacity className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <MaterialIcons name='calendar-month' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">Event Center</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>

          {/* Invitation Code */}
          <TouchableOpacity className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <MaterialIcons name='person-4' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">Invitation code</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-red-500 rounded-full mr-2"></View>
              <Text className="text-gray-500 mr-2">Not Set</Text>
              <Text className="text-gray-400 text-lg">›</Text>
            </View>
          </TouchableOpacity>

          {/* Earning Team */}
          <TouchableOpacity className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <MaterialIcons name='people' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">Earning Team</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>

          {/* Account & Security */}
          <TouchableOpacity className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <MaterialIcons name='security' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">Account & Security</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>

          {/* Security Setting */}
          <TouchableOpacity className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <MaterialIcons name='settings' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">Security Setting</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>

          {/* KYC Verification */}
          <TouchableOpacity className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <Ionicons name='scan-outline' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">KYC Verification</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>

          {/* Notification Settings */}
          <TouchableOpacity className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <MaterialIcons name='notifications' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">Notification Settings</Text>
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

          <TouchableOpacity className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center mr-3">
                <Ionicons name='log-out' size={20} color={'gray'}/>
              </View>
              <Text className="text-gray-800 font-medium text-base">Logout</Text>
            </View>
            <Text className="text-gray-400 text-lg">›</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View className="h-14"></View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile