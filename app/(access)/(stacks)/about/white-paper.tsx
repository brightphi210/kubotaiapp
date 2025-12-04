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
            <Text className='text-lg pt-4 font-extrabold text-center' style={{fontFamily: 'HankenGrotesk_500Medium'}}>KUBOT AI / KU NETWORK </Text>
            <Text className='text-base text-gray-500 text-center' style={{fontFamily: 'HankenGrotesk_400Regular'}}>Version 1.0 | October 2025</Text>
        </View>

        <View className='pt-8'>
            <Text className='text-base' style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>Abstract</Text>
            <Text className='text-sm text-gray-500 font-normal leading-loose' style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                Kubot AI, operating through the KU Network, is a 
                next-generation Web3 ecosystem built to democratize crypto mining, 
                digital utility, and AI automation across the globe. Our mission is 
                to create an intelligent, accessible, and community-driven cryptocurrency 
                project that allows users to mine tokens effortlessly using mobile and Web2 
                applications—while integrating Web3 wallets for seamless blockchain interaction. 
                Rewards scale with user participation and contribution. KU Network bridges artificial 
                intelligence and blockchain, promoting inclusive adoption, transparent governance, 
                and value-backed digital currency.
            </Text>
        </View>

        <View className='pt-8'>
            <Text className='text-base' style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>Introduction & Vission</Text>
            <Text className='text-sm text-gray-500 font-normal leading-loose' style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                The world is rapidly transitioning toward decentralized economies powered by AI and blockchain. Yet, accessibility remains the biggest challenge. KU Network (symbol: KU) simplifies entry into the crypto economy for everyone—especially emerging markets—through AI-assisted mining, user education, and community engagement.
                {'\n'}
                {'\n'}
                Our unique value proposition: combining AI-driven mining optimization, fair reward distribution, and real-world utility adoption. We also focus on sustainable, energy-efficient mining practices.
            </Text>
        </View>

        <View className='pt-4'>
            <Text className='text-base' style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>Problem Statement</Text>
            <Text className='text-sm text-gray-500 font-normal leading-loose' style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                Despite blockchain growth, key challenges persist:
            </Text>

            <Text className='text-sm text-gray-500 font-normal leading-loose' style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                • Complex mining setups exclude everyday users. {'\n'}
                • Lack of transparency erodes public trust.{'\n'}
                • Many projects focus on hype rather than utility.{'\n'}
                • Few projects connect real-world adoption to mining rewards.{'\n'}
                • Regulatory uncertainty and jurisdictional legal risks remain unaddressed in most projects.

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