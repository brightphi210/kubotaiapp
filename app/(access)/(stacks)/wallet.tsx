import Header from '@/components/Header';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

const Wallet = () => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [slideAnim] = useState(new Animated.Value(screenHeight));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showComingSoonModal) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [showComingSoonModal]);

  const handleConnectWallet = () => {
    setShowComingSoonModal(true);
  };

  const closeComingSoonModal = () => {
    // Animated.spring(slideAnim, {
    //   toValue: screenHeight,
    //   useNativeDriver: true,
    //   tension: 100,
    //   friction: 8,
    // }).start(() => {
    // });
    setShowComingSoonModal(false);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style='dark'/>
      <Header text='Wallet'/>
      <View className="flex-1 justify-center items-center px-6">
        {/* Wallet Icon Animation */}
        <View className="mb-8">
          <View className="w-56 h-56 rounded-full bg-blue-500/10 justify-center items-center mb-4">
            <View className="w-40 h-40 rounded-full bg-blue-500/20 justify-center items-center">
              <View className="w-24 h-24 rounded-full bg-blue-500/30 justify-center items-center">
                <MaterialIcons name="account-balance-wallet" size={45} color="#3B82F6" />
              </View>
            </View>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-900 text-center mb-2" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
            Connect Your Wallet
          </Text>
          <Text className="text-gray-600 text-center text-base leading-6" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
            Connect your wallet to view balance and claim rewards
          </Text>
        </View>

        {/* Connect Button */}
        <TouchableOpacity
          onPress={handleConnectWallet}
          disabled={isLoading}
          className="bg-[#016FEC] rounded-xl py-4 px-8 w-full max-w-xs shadow-lg active:opacity-80"
        >
          <Text className="text-white text-base font-medium text-center" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
            Connect Wallet
          </Text>
        </TouchableOpacity>
      </View>

      {/* Coming Soon Modal */}
      <Modal
        visible={showComingSoonModal}
        transparent={true}
        animationType="none"
        onRequestClose={closeComingSoonModal}
      >
        <View className="flex-1 bg-black/50">
          <TouchableOpacity 
            className="flex-1"
            activeOpacity={1}
            onPress={closeComingSoonModal}
          />
          
          <Animated.View
            style={{
              transform: [{ translateX: slideAnim }],
            }}
            className="bg-white rounded-t-3xl border-t border-gray-200"
          >
            {/* Modal Header */}
            <View className="flex-row items-center justify-between px-6 py-5 border-b border-gray-200">
              <Text className="text-gray-900 text-xl font-bold" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                Wallet Connect
              </Text>
              <TouchableOpacity 
                onPress={closeComingSoonModal}
                className="p-1 active:bg-gray-100 rounded-lg"
              >
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <View className="px-6 py-8 items-center">
              <View className="w-20 h-20 rounded-full bg-blue-500/10 justify-center items-center mb-4">
                <MaterialIcons name="schedule" size={40} color="#3B82F6" />
              </View>
              
              <Text className="text-2xl font-bold text-gray-900 text-center mb-3" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                Coming Soon!
              </Text>
              
              <Text className="text-gray-600 text-center text-base leading-6 mb-6" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                We're working hard to bring wallet connectivity to you. Stay tuned for updates!
              </Text>

              <TouchableOpacity
                onPress={closeComingSoonModal}
                className="bg-[#016FEC] rounded-xl py-4 px-8 w-full shadow-lg active:opacity-80"
              >
                <Text className="text-white text-base font-medium text-center" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
                  Got It
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default Wallet;