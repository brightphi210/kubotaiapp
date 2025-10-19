import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const Blog = () => {
  const updates = [
    {
      id: 1,
      icon: '🎮',
      number: '1',
      title: '40 Games Crash-Landed!',
      content: 'Bee Network x ecosystem partners just ported Cut Fruit Ninja and 40+ other casual hits to the Game Center! Tired of mining? Slice-and-dice your way through watermelons or pop bubbles for a dopamine hit!',
      note: 'PS: Wanna see your dream game here? Comment under official X post – your wish might go live! 😊'
    },
    {
      id: 2,
      icon: '💳',
      number: '2',
      title: 'Wallet 2.0: Baked to Perfection (coming soon, available on Version 1.28)',
      content: 'DING! Bee Wallet 2.0 is 100% baked and ready to serve this May 🎉 Create/upgrade your decentralized wallet now. Remember: "Your keys, your honey, no compromises." 🐝✨',
      footer: 'Bee Network Wallet 2.0 — Your Decentralized Future'
    },
    {
      id: 3,
      icon: '🎨',
      number: '3',
      title: 'Game Center Got a UI Glow-Up (Also Version 1.28 New Feature)',
      content: 'New look, who dis? We redesigned the Game Center based on YOUR votes via DAO – smoother navigation and visuals, and bee-friendly controls. This update\'s your jam! 🐝'
    },
    {
      id: 4,
      icon: '📋',
      number: '4',
      title: 'About KYC',
      content: 'Handling KYC for 45M+ Believers? It\'s literally a Mission: Impossible. So it took our much time to tailor the process. Anyway new KYC rollout is next month. 👍'
    }
  ];

  const {blogPostData} = useLocalSearchParams()
  const myPosts = JSON.parse(blogPostData as string);
  console.log('This is blog', myPosts)

  return (
    <View className="flex-1 bg-white">
      <StatusBar style='dark'/>
      
      <View className="h-80 relative">
        <Image 
          source={{uri: myPosts.image}}
          className="w-full h-full"
          resizeMode="cover"
        />
        
        <View className="absolute inset-0">
          <View className="flex-row justify-between items-center px-4 pt-12">
            <TouchableOpacity onPress={()=>router.back()} className="w-12 h-12 rounded-full bg-white/80 items-center justify-center">
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="w-12 h-12 rounded-full bg-white/80 items-center justify-center">
              <Ionicons name="share-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
            <Text className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                {myPosts.title}
            </Text>

            <Text className="text-sm text-gray-400 mb-6" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                {myPosts.category}
            </Text>

            <View className="mb-6 pb-5 border-b border-gray-100">
                <Text className="text-sm text-gray-700 leading-6 mb-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                {myPosts.content}
                </Text>

                {/* Optional Note */}
                {myPosts.note && (
                <Text className="text-sm text-gray-600 leading-6 mt-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    {myPosts.note}
                </Text>
                )}
            </View>

            <View className='flex-row items-center justify-between'>
                <Text className="text-sm text-gray-400 mb-6" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    {myPosts.date}
                </Text>

                <View className="flex-row items-center">
                  <MaterialIcons name='favorite-border' size={16} color={'#6B7280'}/>
                  <Text className="text-sm text-gray-500 ml-1" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    {myPosts.likes}
                  </Text>
                </View>
            </View>
        
            <View className="h-20" />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute right-5 bottom-8 w-14 h-14 rounded-full bg-orange-500 items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default Blog;