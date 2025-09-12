import { LightBlue, SolidMainButton, SolidMainButtonInactive } from '@/components/Btns'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import {
  Animated,
  AppState,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle } from 'react-native-svg'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const Home = () => {
  const [isMining, setIsMining] = useState(false)
  const [balance, setBalance] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [miningStartTime, setMiningStartTime] = useState<number | null>(null)
  const [progress] = useState(new Animated.Value(0))
  const [circleProgress] = useState(new Animated.Value(0))
  const [tokensMinedThisSession, setTokensMinedThisSession] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  // Mining configuration
  const TOKENS_PER_12_HOURS = 5
  const MINING_DURATION = 12 * 60 * 60 // 12 hours in seconds
  const TOKENS_PER_SECOND = TOKENS_PER_12_HOURS / MINING_DURATION // ~0.0001157 tokens per second
  const TOKENS_PER_HOUR = TOKENS_PER_SECOND * 3600 // ~0.4166 tokens per hour

  // Pull to refresh function
  const onRefresh = async () => {
    setRefreshing(true)
    
    // Simulate data refresh
    try {
      const savedState = await loadMiningState()
      if (savedState && savedState.isMining && savedState.miningStartTime) {
        const currentTime = Date.now()
        const { timeElapsed, tokensEarned, progressValue, isComplete } = 
          calculateMiningProgress(savedState.miningStartTime, currentTime)
        
        setBalance(savedState.balance + tokensEarned)
        setTimeElapsed(timeElapsed)
        setTokensMinedThisSession(tokensEarned)
        circleProgress.setValue(progressValue)
        
        if (isComplete) {
          setIsMining(false)
          await saveMiningState({
            ...savedState,
            isMining: false,
            balance: savedState.balance + tokensEarned
          })
        }
      }
    } catch (error) {
      console.log('Error refreshing:', error)
    }
    
    setRefreshing(false)
  }

  // Save mining state to AsyncStorage
  const saveMiningState = async (miningState:any) => {
    try {
      await AsyncStorage.setItem('miningState', JSON.stringify(miningState))
    } catch (error) {
      console.log('Error saving mining state:', error)
    }
  }

  // Load mining state from AsyncStorage
  const loadMiningState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('miningState')
      if (savedState) {
        return JSON.parse(savedState)
      }
    } catch (error) {
      console.log('Error loading mining state:', error)
    }
    return null
  }

  // Calculate mining progress based on elapsed time
  const calculateMiningProgress = (startTime: any, currentTime: any) => {
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000)
    const clampedElapsed = Math.min(elapsedSeconds, MINING_DURATION)
    const tokensEarned = clampedElapsed * TOKENS_PER_SECOND
    const progressValue = clampedElapsed / MINING_DURATION
    
    return {
      timeElapsed: clampedElapsed,
      tokensEarned,
      progressValue,
      isComplete: clampedElapsed >= MINING_DURATION
    }
  }

  // Initialize app state on mount
  useEffect(() => {
    const initializeApp = async () => {
      const savedState = await loadMiningState()
      
      if (savedState && savedState.isMining && savedState.miningStartTime) {
        const currentTime = Date.now()
        const { timeElapsed, tokensEarned, progressValue, isComplete } = 
          calculateMiningProgress(savedState.miningStartTime, currentTime)
        
        setMiningStartTime(savedState.miningStartTime)
        setBalance(savedState.balance + tokensEarned)
        setTimeElapsed(timeElapsed)
        setTokensMinedThisSession(tokensEarned)
        circleProgress.setValue(progressValue)
        
        if (isComplete) {
          setIsMining(false)
          // Save completed state
          await saveMiningState({
            ...savedState,
            isMining: false,
            balance: savedState.balance + tokensEarned
          })
        } else {
          setIsMining(true)
        }
      } else if (savedState) {
        // Load saved balance even if not mining
        setBalance(savedState.balance || 0)
      }
    }
    
    initializeApp()
  }, [])

  // Handle app state changes (when app goes to background/foreground)
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: any) => {
      if (isMining && miningStartTime) {
        const currentTime = Date.now()
        const { timeElapsed, tokensEarned, progressValue } = 
          calculateMiningProgress(miningStartTime, currentTime)
        
        // Update state and save to storage
        const newBalance = balance + tokensEarned - tokensMinedThisSession
        await saveMiningState({
          isMining: true,
          miningStartTime,
          balance: newBalance,
          timeElapsed,
          tokensMinedThisSession: tokensEarned
        })
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)
    return () => subscription?.remove()
  }, [isMining, miningStartTime, balance, tokensMinedThisSession])

  useEffect(() => {
    let interval: any
    if (isMining && miningStartTime) {
      interval = setInterval(() => {
        const currentTime = Date.now()
        const { timeElapsed, tokensEarned, progressValue, isComplete } = 
          calculateMiningProgress(miningStartTime, currentTime)
        
        setTimeElapsed(timeElapsed)
        setBalance(balance - tokensMinedThisSession + tokensEarned)
        setTokensMinedThisSession(tokensEarned)
        
        // Animate the progress smoothly
        Animated.timing(circleProgress, {
          toValue: progressValue,
          duration: 500,
          useNativeDriver: false,
        }).start()
        
        // Stop mining after 12 hours
        if (isComplete) {
          setIsMining(false)
          saveMiningState({
            isMining: false,
            balance: balance - tokensMinedThisSession + tokensEarned,
            miningStartTime: null,
            timeElapsed: 0,
            tokensMinedThisSession: 0
          })
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isMining, miningStartTime, balance, tokensMinedThisSession])

  const formatTime = (seconds:any) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getMiningStatusText = () => {
    if (!isMining) return 'Start Mining'
    if (timeElapsed >= MINING_DURATION) return 'Mining Complete - Start New Session'
    return 'Mining in progress..'
  }

  const getMiningRateDisplay = () => {
    return `+${TOKENS_PER_HOUR.toFixed(4)} KU/hr`
  }

  const handleBoost = () => {
    console.log('Boost activated!')
  }

  // Static Sand Background Component
  const SandBackground = () => {
    const createSandParticles = () => {
      const particles = []
      for (let i = 0; i < 50; i++) {
        particles.push(
          <View
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              backgroundColor: '#FCD34D',
              borderRadius: 50,
              left: Math.random() * screenWidth,
              top: Math.random() * screenHeight,
              opacity: Math.random() * 0.1 + 0.05,
            }}
          />
        )
      }
      return particles
    }

    return (
      <View style={{ position: 'absolute', top: 0, left: 0, width: screenWidth, height: screenHeight }}>
        {createSandParticles()}
      </View>
    )
  }

  const CircularProgress = ({ progress, size = 280, strokeWidth = 12 }: any) => {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    
    const AnimatedCircle = Animated.createAnimatedComponent(Circle)
    
    return (
      <View className="relative justify-center items-center" style={{ width: size, height: size }}>
        <Svg width={size} height={size} style={{ position: 'absolute' }}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#404040"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F59E0B"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress.interpolate({
              inputRange: [0, 1],
              outputRange: [circumference, 0],
            })}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        
        {/* Center Content */}
        <View className="justify-center items-center">
          <Text className="text-sm text-neutral-400 mb-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
            Balance
          </Text>
          <Text className="text-3xl font-bold text-neutral-100" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
            {balance.toFixed(4)}
          </Text>
          <Text className="text-sm text-green-500 mt-3" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
            {getMiningRateDisplay()}
          </Text>
          <View className="flex-row gap-1.5 items-center mt-2">
            <MaterialIcons name='people' size={20} color={'white'}/>
            <Text className="text-sm text-neutral-500" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
              1/2
            </Text>
          </View>
        </View>
      </View>
    )
  }

  const handleMiningToggle = async () => {
    if (timeElapsed >= MINING_DURATION) {
      // Reset for new mining session
      setTimeElapsed(0)
      setTokensMinedThisSession(0)
      circleProgress.setValue(0)
      await saveMiningState({
        isMining: false,
        balance,
        miningStartTime: null,
        timeElapsed: 0,
        tokensMinedThisSession: 0
      })
    }
    
    const newMiningState = !isMining
    setIsMining(newMiningState)
    
    if (newMiningState) {
      const startTime = Date.now()
      setMiningStartTime(startTime)
      await saveMiningState({
        isMining: true,
        miningStartTime: startTime,
        balance,
        timeElapsed: 0,
        tokensMinedThisSession: 0
      })
    } else {
      await saveMiningState({
        isMining: false,
        balance,
        miningStartTime: null,
        timeElapsed: 0,
        tokensMinedThisSession: 0
      })
    }
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#0a0a0a' }}>
      <StatusBar style='light'/>
      
      {/* Static Sand Background Effect */}
      <SandBackground />
      
      <ScrollView 
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F59E0B"
            colors={["#F59E0B"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section - Better spacing */}
        <View className="flex-row items-center py-4 mt-2">
          <View className="w-10 h-10 bg-neutral-800 rounded-full mr-4 justify-center items-center" style={{borderRadius: 24}}>
            <MaterialIcons name='person-3' color={'white'} size={22}/>
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-white" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
              iamkvisuals
            </Text>
            <Text className="text-xs text-neutral-400" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
              @iamkvisuals
            </Text>
          </View>
          <LightBlue text='Level 1'/>
        </View>

        {/* Main Mining Interface - Centered and spaced better */}
        <View className="justify-center items-center py-8 mt-4">
          <CircularProgress progress={circleProgress} />
          
          {/* Timer and Boost Section */}
          <View className="flex-row items-center gap-3 mt-8 mb-8">
            {/* Timer with yellow background */}
            <View className="flex-row items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900" >
              <MaterialIcons name='timer' size={22} color={'white'}/>
              <Text className="text-base font-medium" style={{fontFamily: 'HankenGrotesk_500Medium', color: 'white'}}>
                {isMining ? formatTime(timeElapsed) : "00:00:00"}
              </Text>
            </View>
            
            {/* Boost Button */}
            <TouchableOpacity 
              onPress={handleBoost}
              className="flex-row items-center gap-1 px-5 py-2.5 rounded-full"
              style={{ 
                backgroundColor: '#FCD34D', 
              }}
            >
              <MaterialIcons name='flash-on' size={20} color={'black'}/>
              <Text className="text-base font-medium" style={{fontFamily: 'HankenGrotesk_500Medium', color: 'black'}}>
                Boost
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-between mb-6">
          <View className="flex-1 bg-neutral-900 rounded-xl p-4 mr-2">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name='access-time' size={18} color={'#F59E0B'}/>
              <Text className="text-xs text-neutral-400 ml-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                Session Time
              </Text>
            </View>
            <Text className="text-lg font-bold text-white" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
              {formatTime(timeElapsed)}
            </Text>
          </View>
          
          <View className="flex-1 bg-neutral-900 rounded-xl p-4 ml-2">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name='trending-up' size={18} color={'#10B981'}/>
              <Text className="text-xs text-neutral-400 ml-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                Token Earned
              </Text>
            </View>
            <Text className="text-lg font-bold text-white" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
              {tokensMinedThisSession.toFixed(4)} <Text className='text-neutral-500 text-base'>(KU)</Text>
            </Text>
          </View>
        </View>

        {/* Earnings Card - Better visual hierarchy */}
        <TouchableOpacity 
          className="flex-row items-center justify-between px-6 py-5 rounded-xl mb-3"
          style={{ backgroundColor: '#DEECFD' }}
        >
          <View className="flex-row gap-3 items-center">
             <View className="p-2 bg-blue-500/20 rounded-full">
                <MaterialIcons name='trending-up' size={20} color={'#3B82F6'}/>
              </View>
            <View>
              <Text className="text-[#016FEC] text-base font-medium" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
                Check your earnings
              </Text>
              <Text className="text-[#016FEC] text-xs opacity-75" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                View detailed mining history
              </Text>
            </View>
          </View>
          <MaterialIcons name='chevron-right' size={24} color={'#016FEC'}/>
        </TouchableOpacity>
        

        {/* Mining Control Button */}
        <View className="pb-3">
          {(!isMining || timeElapsed >= MINING_DURATION) ? 
            <SolidMainButton 
              text={getMiningStatusText()} 
              onPress={handleMiningToggle}
            /> : 
            <SolidMainButtonInactive text={getMiningStatusText()}/>
          }
        </View>

     
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home