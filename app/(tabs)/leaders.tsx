import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Leaders = () => {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#0a0a0a' }}>
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            <View className="py-5 pt-12">
              <Text className="text-2xl font-bold text-white text-center mb-4" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                Leaderboard
              </Text>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default Leaders