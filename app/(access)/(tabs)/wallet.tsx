import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React, { useState } from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { height: screenHeight } = Dimensions.get('window')

const Wallet = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false) // Toggle this to test states
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [slideAnim] = useState(new Animated.Value(screenHeight))

  // Sample user data
  const userData = {
    name: 'iamkvisuals',
    handle: '@iamkvisuals',
    address: 'EQDk...qPrHF',
    balance: 134000,
    avatar: '👨‍💻' // You can replace with actual avatar component
  }

  const handleConnectWallet = () => {
    // Simulate wallet connection
    setIsWalletConnected(true)
    Alert.alert('Success', 'Wallet connected successfully!')
  }

  const handleWithdrawTokens = () => {
    setShowWithdrawModal(true)
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start()
  }

  const closeWithdrawModal = () => {
    Animated.spring(slideAnim, {
      toValue: screenHeight,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      setShowWithdrawModal(false)
    })
  }

  const handleConfirmWithdraw = () => {
    closeWithdrawModal()
    Alert.alert('Success', 'Withdrawal request submitted!')
  }

  // No Wallet Connected State
  if (!isWalletConnected) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#0a0a0a' }}>
        <View className="flex-1 justify-center items-center px-6">
          {/* Header */}
          

          {/* Wallet Icon Animation */}
          <View className="mb-5">
            <View className="w-56 h-56 rounded-full bg-blue-500/10 justify-center items-center mb-4">
              <View className="w-40 h-40 rounded-full bg-blue-500/20 justify-center items-center">
                <View className="w-24 h-24 rounded-full bg-blue-500/30 justify-center items-center">
                  <MaterialIcons name="account-balance-wallet" size={45} color="#3B82F6" />
                </View>
              </View>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-2xl font-bold text-white text-center mb-2" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
              Connect Wallet
            </Text>
            <Text className="text-neutral-400 text-center text-lg leading-7" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
              Connect your wallet to claim rewards
            </Text>
          </View>

          {/* Connect Button */}
          <TouchableOpacity
            onPress={handleConnectWallet}
            className="bg-[#016FEC] rounded-xl py-4 px-8 w-full max-w-xs"
          >
            <Text className="text-white text-base font-medium text-center" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
              Connect Wallet
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // Connected Wallet State
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#0a0a0a' }}>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="py-5 pt-12">
          <Text className="text-2xl font-bold text-white text-center mb-4" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
            Wallet
          </Text>
          <Text className="text-neutral-400 text-center text-lg leading-7" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
            Connect your wallet to{'\n'}claim rewards
          </Text>
        </View>

        {/* User Profile Card */}
        <View className="bg-neutral-900 border border-neutral-800 rounded-2xl px-6 py-6 mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-orange-500 rounded-xl mr-4 justify-center items-center">
              <Text className="text-white text-lg">{userData.avatar}</Text>
            </View>
            
            <View className="flex-1">
              <Text className="text-white text-base font-semibold mb-1" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
                {userData.name}
              </Text>
              <Text className="text-neutral-400 text-sm" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                {userData.handle}
              </Text>
            </View>

            <TouchableOpacity>
              <MaterialIcons name="keyboard-arrow-up" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Wallet Address */}
          <View className="flex-row items-center justify-between bg-neutral-950 rounded-xl px-4 py-3">
            <View className="flex-row items-center flex-1">
              <View className="w-6 h-6 bg-blue-500 rounded-full mr-3 justify-center items-center">
                <Text className="text-white text-xs font-bold">T</Text>
              </View>
              <Text className="text-white text-sm" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                {userData.address}
              </Text>
            </View>
            
            <TouchableOpacity>
              <MaterialIcons name="content-copy" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Withdraw Button */}
        <View className="pb-8">
          <TouchableOpacity
            onPress={handleWithdrawTokens}
            className="bg-[#016FEC] rounded-xl py-4 px-6 shadow-lg"
          >
            <Text className="text-white text-base font-medium text-center" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
              Withdraw Tokens
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Withdraw Modal/Bottom Sheet */}
      <Modal
        visible={showWithdrawModal}
        transparent={true}
        animationType="none"
        onRequestClose={closeWithdrawModal}
      >
        <View className="flex-1 bg-black/50">
          <TouchableOpacity 
            className="flex-1"
            onPress={closeWithdrawModal}
          />
          
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
            }}
            className="bg-neutral-900 rounded-t-3xl"
          >
            {/* Modal Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-neutral-800">
              <Text className="text-white text-lg font-semibold" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
                Withdraw Tokens
              </Text>
              <TouchableOpacity onPress={closeWithdrawModal}>
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <View className="px-6 py-6">
              {/* User Info */}
              <View className="flex-row items-center mb-6">
                <View className="w-12 h-12 bg-orange-500 rounded-xl mr-4 justify-center items-center">
                  <Text className="text-white text-lg">{userData.avatar}</Text>
                </View>
                
                <View className="flex-1">
                  <Text className="text-white text-base font-semibold mb-1" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
                    {userData.name}
                  </Text>
                  <Text className="text-neutral-400 text-sm" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    {userData.handle}
                  </Text>
                </View>

                <TouchableOpacity>
                  <MaterialIcons name="keyboard-arrow-up" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Wallet Address */}
              <View className="flex-row items-center justify-between bg-neutral-950 rounded-xl px-4 py-3 mb-6">
                <View className="flex-row items-center flex-1">
                  <View className="w-6 h-6 bg-blue-500 rounded-full mr-3 justify-center items-center">
                    <Text className="text-white text-xs font-bold">T</Text>
                  </View>
                  <Text className="text-white text-sm" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    {userData.address}
                  </Text>
                </View>
                
                <TouchableOpacity>
                  <MaterialIcons name="content-copy" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Total Balance */}
              <View className="mb-8">
                <Text className="text-neutral-400 text-sm mb-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                  Total Kubot
                </Text>
                <View className="flex-row items-center">
                  <View className="w-6 h-6 bg-blue-500 rounded-full mr-2 justify-center items-center">
                    <Text className="text-white text-xs font-bold">K</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                    {userData.balance.toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Confirm Button */}
              <TouchableOpacity
                onPress={handleConfirmWithdraw}
                className="bg-[#016FEC] rounded-xl py-4 px-6 mb-4"
              >
                <Text className="text-white text-base font-medium text-center" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
                  Withdraw Tokens
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default Wallet