import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'


interface HeaderProps{
    text: string
}
const Header = ({text}: HeaderProps) => {
  return (
    <View className="px-4 py-3 pt-12 mb-4 bg-[#016FEC] border-b border-gray-200">
        <View className="flex-row items-center">
            <TouchableOpacity className="mr-4 bg-black/10 p-2 rounded-full" onPress={()=>router.back()}>
                <MaterialIcons name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
            <Text 
            className="text-2xl font-semibold text-white flex-1 text-center"
            style={{ fontFamily: 'HankenGrotesk_600SemiBold' }}
            >
                {text}
            </Text>
            <View className="w-6" />
        </View>
    </View>
  )
}

export default Header