import LoadingOverlay from '@/components/LoadingOverlay'
import { useGetNews, useGetProfile } from '@/hooks/queries/allQueries'
import { Ionicons } from '@expo/vector-icons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  AppState,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Svg, { Circle } from 'react-native-svg'

const Home = () => {
  const [isMining, setIsMining] = useState(false)
  const [balance, setBalance] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [miningStartTime, setMiningStartTime] = useState<number | null>(null)
  const [circleProgress] = useState(new Animated.Value(0))
  const [tokensMinedThisSession, setTokensMinedThisSession] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const [pulseAnimation] = useState(new Animated.Value(1))


  // Mining configuration
  const TOKENS_PER_12_HOURS = 5
  const MINING_DURATION = 12 * 60 * 60
  const TOKENS_PER_SECOND = TOKENS_PER_12_HOURS / MINING_DURATION
  const TOKENS_PER_HOUR = TOKENS_PER_SECOND * 3600


  const {getNews, isLoading, refetch: refetchNews} = useGetNews()
  const getNewsData = getNews?.data.data
  const {getProfile, isLoading: profileLoading, refetch: refetchProfile} = useGetProfile()
  const profileData = getProfile?.data.data
  console.log('News data', getNewsData)
  console.log('Profile Data data', profileData)

  // Pulse animation for mining
  useEffect(() => {
    if (isMining) {
      const pulseLoop = () => {
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isMining) pulseLoop()
        })
      }
      pulseLoop()
    } else {
      pulseAnimation.setValue(1)
    }
  }, [isMining])


  // Pull to refresh function - UPDATED TO REFETCH DATA
  const onRefresh = async () => {
    setRefreshing(true)
    
    try {
      // Refetch both news and profile data
      await Promise.all([
        refetchNews(),
        refetchProfile()
      ])

      // Update mining state
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

  const CircularProgress = ({ progress, size = 280, strokeWidth = 12 }: any) => {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    
    const AnimatedCircle = Animated.createAnimatedComponent(Circle)
    
    return (
      <TouchableOpacity onPress={handleMiningToggle} activeOpacity={0.9}>
        <Animated.View 
          className="relative justify-center items-center" 
          style={{ 
            width: size, 
            height: size,
            transform: [{ scale: pulseAnimation }],
          }}
        >
          <Svg width={size} height={size} style={{ position: 'absolute' }}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            
            {/* Progress Circle - More visible animation */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isMining ? "#10B981" : "#F59E0B"}
              strokeWidth={strokeWidth + 2}
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progress.interpolate({
                inputRange: [0, 1],
                outputRange: [circumference, 0],
              })}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              opacity={0.9}
            />
          </Svg>
          
          {/* Center Content */}
          <View className="justify-center items-center">
            <Text className="text-sm text-gray-600 mb-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
              Token Earned
            </Text>
            <Text className="text-3xl font-bold text-gray-900" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
              {tokensMinedThisSession.toFixed(4)}
            </Text>
            <Text className="text-sm text-green-600 mt-3" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
              {getMiningRateDisplay()}
            </Text>
            <View className="flex-row gap-1.5 items-center mt-2">
              <MaterialIcons name='people' size={20} color={'#4B5563'}/>
              <Text className="text-sm text-gray-600" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
                1/2
              </Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
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

  const handleRedirectItem = (post: any) => {
    router.push({
      pathname: "/(access)/(stacks)/blog/[id]",
      params: { id: post.id, blogPostData: JSON.stringify(post) }
    })
  }


  const BlogPost = ({ post }: { post: any }) => (
    <TouchableOpacity onPress={()=>{handleRedirectItem(post)}} className="mb-4 bg-white rounded-xl  overflow-hidden border border-gray-100 w-[49%]">
        <View className="relative">
          <View 
            className="w-full h-32 rounded-t-xl object-cover overflow-hidden justify-center items-center"
          >
            <Image source={{uri: post?.image_url}} className='w-full h-full object-cover'/>
          </View>
          <Pressable className='absolute bottom-[-14px] right-1 bg-white/80 shadow rounded-full p-3 flex-row items-center' onPress={() => console.log('Share post', post.id)}>
            <Ionicons name='share-outline' size={16} color={'black'}/>
          </Pressable>
        </View>
        
        {/* Blog Content */}
        <View className="flex-1 p-4 px-3">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3"> 
              {/* Title */}
              <Text 
                className="text-base font-semibold text-gray-900 mb-3 leading-5" 
                style={{fontFamily: 'HankenGrotesk_600SemiBold'}}
                numberOfLines={2}
              >
                {post.title}
              </Text>
              
              {/* Date and Likes */}
              <View className="flex-row items-center justify-between">
               <Text className="text-xs text-gray-400" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Text>

                <View className="flex-row items-center">
                  <MaterialIcons name='favorite-border' size={14} color={'#6B7280'}/>
                  <Text className="text-xs text-gray-500 ml-1" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    {post.likes_count}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
    </TouchableOpacity>
  )


  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <StatusBar style='light'/>
      <LoadingOverlay visible={isLoading}/>
      
      {/* Fixed Header */}
      <View 
        className="px-6 py-4 pt-12"
        style={{ backgroundColor: '#016FEC' }}
      >
        <View className="flex-row items-center justify-between">

          {
            profileLoading ? 
            <View>
              <ActivityIndicator size={'small'} color={'white'}/>
            </View>: 
          
          <Pressable onPress={()=>router.push('/(access)/(tabs)/profile')} className="flex-row items-center">
            {
              profileData?.image === null || profileData?.image === undefined ?
              <View className="w-10 h-10 bg-white/20 overflow-hidden object-cover rounded-full mr-3 justify-center items-center" style={{borderRadius: 50}}>
                <Image source={require('../../../assets/images/avatar2.png')} className='w-full h-full object-cover'/>
              </View> :
              <View className="w-10 h-10 bg-white/20 overflow-hidden object-cover rounded-full mr-3 justify-center items-center" style={{borderRadius: 50}}>
                <Image source={{uri: profileData?.image}} className='w-full h-full object-cover'/>
              </View>
            }
            <View>
              {profileData?.username &&
              <Text className="text-lg font-semibold text-white" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
                @{profileData.username.toUpperCase().slice(0, 8)}...
              </Text>
              }
            </View>
          </Pressable>
          }
          
          {/* Header Icons */}
          <View className="flex-row items-center gap-2">
            <TouchableOpacity className="p-2.5 bg-black/10 rounded-full" onPress={()=>router.push('/(access)/(stacks)/notification')}>
              <MaterialIcons name='notifications-none' size={22} color={'white'}/>
            </TouchableOpacity>
            <TouchableOpacity className="p-2.5 bg-black/10 rounded-full" onPress={()=>router.push('/(access)/(stacks)/leaders')}>
              <MaterialIcons name='emoji-events' size={22} color={'white'}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>router.push('/(access)/(stacks)/wallet')} className="p-2.5 bg-black/10 rounded-full">
              <MaterialIcons name='wallet' size={22} color={'white'}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>router.push('/(access)/(stacks)/earnings')} className="p-2.5 bg-black/10 rounded-full ">
              <MaterialIcons name='trending-up' size={22} color={'white'}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
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
        {/* Main Mining Interface */}
        <View className="justify-center items-center py-8 mt-4" >
          <CircularProgress progress={circleProgress} />
          
          {/* Timer and Boost Section - Moved under circle */}
          <View className="flex-row items-center gap-3 mt-6 mb-4">
            {/* Timer with darker background */}
            <View className="flex-row items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200">
              <MaterialIcons name='timer' size={22} color={'#374151'}/>
              <Text className="text-base font-medium" style={{fontFamily: 'HankenGrotesk_500Medium', color: '#111827'}}>
                {isMining ? formatTime(timeElapsed) : "00:00:00"}
              </Text>
            </View>
            
            {/* Boost Button with yellow color */}
            <TouchableOpacity 
              onPress={handleBoost}
              className="flex-row items-center gap-1 px-5 py-2.5 rounded-full border border-yellow-300"
              style={{ 
                backgroundColor: '#F59E0B',
                shadowColor: '#F59E0B',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2
              }}
            >
              <MaterialIcons name='flash-on' size={20} color={'white'}/>
              <Text className="text-base font-medium" style={{fontFamily: 'HankenGrotesk_500Medium', color: 'white'}}>
                Boost
              </Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* Stats Cards */}
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 bg-gray-100 rounded-xl p-4 mr-2 border border-gray-200">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name='access-time' size={18} color={'#D97706'}/>
              <Text className="text-xs text-gray-600 ml-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                Session Time
              </Text>
            </View>
            <Text className="text-lg font-bold text-gray-900" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
              {formatTime(timeElapsed)}
            </Text>
          </View>
          
          <View className="flex-1 bg-gray-100 rounded-xl p-4 ml-2 border border-gray-200">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name='account-balance-wallet' size={18} color={'#059669'}/>
              <Text className="text-xs text-gray-600 ml-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                Total Balance
              </Text>
            </View>
            <Text className="text-lg font-bold text-gray-900" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
              {balance.toFixed(4)} <Text className='text-gray-600 text-base'>(KU)</Text>
            </Text>
          </View>
        </View>


        {/* Action Buttons Row - Start Mining and Check Earnings */}
        <View className="flex-row justify-between items-center mb-10 gap-3">
          {/* Start Mining Button */}
          <View className="flex-1">
            {(!isMining || timeElapsed >= MINING_DURATION) ? 
              <TouchableOpacity
                onPress={handleMiningToggle}
                className="px-6 py-4 rounded-xl items-center justify-center"
                style={{ 
                  backgroundColor: '#016FEC',
                }}
              >
                <Text className="text-white text-sm font-semibold" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
                  {getMiningStatusText()}
                </Text>
              </TouchableOpacity>
              : 
              <View
                className="px-6 py-4 rounded-xl items-center justify-center bg-gray-400"
              >
                <Text className="text-gray-100 text-sm font-semibold" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
                  {getMiningStatusText()}
                </Text>
              </View>
            }
          </View>

          {/* Check Earnings Button */}
          <View className="flex-1">
            <TouchableOpacity 
              onPress={()=>router.push('/(access)/(stacks)/earnings')}
              className="flex-row gap-3 items-center px-6 py-4 rounded-xl justify-center"
              style={{ backgroundColor: '#DBEAFE' }}
            >
              <Text className="text-blue-700 text-sm font-medium text-center" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
                Check Earnings
              </Text>
              <MaterialIcons name='trending-up' size={18} color={'#1D4ED8'}/>
            </TouchableOpacity>
          </View>
        </View>


        {/* Blog Section */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-4" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
            News
          </Text>
          
          <View className="flex-row flex-wrap justify-between">
            {getNewsData === undefined || getNewsData.length === 0 ?
              <View className='justify-center mt-10 m-auto'>
                <MaterialIcons name='dataset' size={25} color={'gray'} style={{margin: 'auto'}}/>
                <Text className='text-sm text-center text-gray-500'>No data available</Text>
              </View>: 
              <>
                {
                  isLoading ? 
                  <View className='justify-center m-auto mt-10'>
                    <ActivityIndicator size={'small'} color={'#016FEC'}/>
                  </View>: 
                  <>
                    {getNewsData.map((post: any) => (
                      <BlogPost key={post.id} post={post} />
                    ))}
                  </>
                }
              </>
            }
          </View>
        </View>


        {/* Bottom spacing */}
        <View className="h-6" />
      </ScrollView>
    </View>
  )
}


export default Home