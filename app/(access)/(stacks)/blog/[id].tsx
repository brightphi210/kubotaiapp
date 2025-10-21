import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const Blog = () => {

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

            <View className='flex-row items-center gap-2 mt-2 mb-6'>
              <View className='bg-gray-200 p-2 rounded-full'>
                <MaterialIcons name='person-4' size={13}/>
              </View>
              <Text className="text-base text-gray-500" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                  {myPosts.author_name}
              </Text>
            </View>

            <View className="mb-6 pb-5 border-b border-gray-100">
                <Text className="text-sm text-gray-700 leading-6 mb-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                {myPosts.content}
                </Text>

                {/* Optional Note */}
                {myPosts.note && (
                <Text className="text-sm text-gray-600 border-t border-gray-100 leading-6 mt-2 pt-4" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    {myPosts.note}
                </Text>
                )}
            </View>

            <View className='flex-row items-center justify-between'>
                <Text className="text-sm text-gray-400 mb-6" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    {new Date(myPosts.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Text>

                <View className="flex-row items-center">
                  <MaterialIcons name='favorite-border' size={16} color={'#6B7280'}/>
                  <Text className="text-sm text-gray-500 ml-1" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    {myPosts.likes_count}
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