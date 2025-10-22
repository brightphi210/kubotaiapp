import Header from '@/components/Header'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'

const WhitePaper = () => {

  return (
    <View className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
      <StatusBar style='light'/> 
      <Header text=''/>

      <ScrollView className='px-6 pt-4'>
        <View>
            <Text className='text-2xl text-center font-extrabold' style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>WHITE PAPER</Text>
            <Text className='text-lg pt-4 font-extrabold' style={{fontFamily: 'HankenGrotesk_500Medium'}}>KUBOT Token</Text>
            <Text className='text-base text-gray-500 ' style={{fontFamily: 'HankenGrotesk_400Regular'}}>Reimagining Value Exchange in the Digital Economy</Text>
        </View>
        <View className='pt-8'>
            <Text className='text-base' style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>Introduction</Text>
            <Text className='text-sm text-gray-500 font-normal leading-loose' style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                In a world rapidly moving toward decentralization, 
                AURA Token emerges as a community-driven digital asset designed to 
                empower users, businesses, and creators. The token aims to serve as a 
                bridge between real-world value and decentralized finance (DeFi), offering 
                a seamless ecosystem for payments, rewards, staking, and governance.
            </Text>
        </View>

        <View className='pt-4'>
            <Text className='text-base' style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>Vision & Mission</Text>
            <Text className='text-sm text-gray-500 font-normal leading-loose' style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                Vision:
                To create a decentralized ecosystem that promotes transparency, 
                inclusivity, and financial empowerment for everyone.
            </Text>

            <Text className='text-sm text-gray-500 font-normal leading-loose' style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                Vision:
                To create a decentralized ecosystem that promotes transparency, 
                inclusivity, and financial empowerment for everyone.
            </Text>
        </View>

        <View className='pt-4'>
            <Text className='text-base' style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>The Problem</Text>
            <Text className='text-sm text-gray-500 font-normal leading-loose' style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                Despite the explosive growth of blockchain technology, mainstream adoption is hindered by:{'\n'}
                . Complex user experiences.{'\n'}
                . Lack of real-world integration.{'\n'}
                . Centralized governance in supposedly decentralized systems.{'\n'}
                . Unstable token models with no sustainable utility.
            </Text>
        </View>

        <View className='pt-4'>
            <Text className='text-base' style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>The Solution – KUBOT Ecosystem</Text>
            <Text className='text-sm text-gray-500 font-normal leading-loose' style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                Despite the explosive growth of blockchain technology, mainstream adoption is hindered by:{'\n'}
                Complex user experiences.{'\n'}
                Lack of real-world integration.{'\n'}
                Centralized governance in supposedly decentralized systems.{'\n'}
                Unstable token models with no sustainable utility.
            </Text>
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  )
}

export default WhitePaper