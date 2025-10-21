import { SolidLightButton, SolidMainButton } from '@/components/Btns'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')

const OnBoardingPage = () => {

    const handleRedirectSignup = async () => {
      await AsyncStorage.setItem("ku_onboarding", "true");
      router.replace("/(noaccess)/register");
    };
    const handleRedirectLogin = async () => {
      await AsyncStorage.setItem("ku_onboarding", "true");
      router.replace("/(noaccess)/login");
    };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='dark'/>
      
      <View style={styles.content}>
        {/* Illustration Section */}
        <Animated.View 
          style={styles.illustrationContainer}
          entering={FadeInDown.duration(500).springify()}
        >
          <Image 
            source={require('../../assets/images/onboarding.png')} 
            style={styles.illustration}
            resizeMode='contain'
          />
        </Animated.View>

        {/* Text Content */}
        <Animated.View 
          style={styles.textContainer}
          entering={FadeInDown.duration(600).delay(200).springify()}
        >
          <Text style={styles.title}>Welcome to Ku Network!</Text>
          <Text style={styles.subtitle}>
            Get Rewarded for Mining and Completing simple tasks. 
          </Text>
        </Animated.View>
        
        {/* Buttons */}
        <Animated.View 
          style={styles.buttonContainer}
          entering={FadeInDown.duration(600).delay(400).springify()}
        >
          <SolidMainButton 
            text='Get Started' 
            onPress={() => handleRedirectSignup()}
          />
          <SolidLightButton 
            text='Login' 
            onPress={() => handleRedirectLogin()}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

export default OnBoardingPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DEECFD',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  illustration: {
    width: width * 0.95,
    height: height * 0.5,
    maxHeight: 500,
  },
  textContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1F2937',
    fontFamily: 'HankenGrotesk_600SemiBold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 24,
    fontFamily: 'HankenGrotesk_400Regular',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    gap: 16,
    paddingHorizontal: 20,
  },
});