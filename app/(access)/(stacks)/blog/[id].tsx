import { SolidLightButton, SolidMainButton } from '@/components/Btns';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Blog = () => {
  const {blogPostData} = useLocalSearchParams()
  const myPosts = JSON.parse(blogPostData as string);
  
  // State management
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(myPosts.likes_count);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    // Sample comments - replace with real data
    {
      id: 1,
      author: 'John Doe',
      text: 'Great article! Very insightful.',
      date: new Date().toISOString(),
    },
    {
      id: 2,
      author: 'Jane Smith',
      text: 'Thanks for sharing this information.',
      date: new Date().toISOString(),
    }
  ]);

  // Handle like toggle
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  // Handle comment submission
  const handleSubmitComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        author: 'Current User', // Replace with actual user name
        text: comment,
        date: new Date().toISOString(),
      };
      setComments([newComment, ...comments]);
      setComment('');
      setIsModalVisible(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style='dark'/>
      
      {/* Header Image */}
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

          {myPosts.note && (
            <Text className="text-sm text-gray-600 border-t border-gray-100 leading-6 mt-2 pt-4" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
              {myPosts.note}
            </Text>
          )}
        </View>

        <View className='flex-row items-center justify-between mb-6'>
          <Text className="text-sm text-gray-400" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
            {new Date(myPosts.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </Text>

          <TouchableOpacity onPress={handleLike} className="flex-row items-center">
            <MaterialIcons 
              name={isLiked ? 'favorite' : 'favorite-border'} 
              size={16} 
              color={isLiked ? '#ef4444' : '#6B7280'}
            />
            <Text className="text-sm text-gray-500 ml-1" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
              {likesCount}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View className="border-t border-gray-200 pt-6">
          <Text className="text-xl font-bold text-gray-900 mb-4" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
            Comments ({comments.length})
          </Text>

          {comments.map((commentItem) => (
            <View key={commentItem.id} className="mb-4 pb-4 border-b border-gray-100">
              <View className="flex-row items-center gap-2 mb-2">
                <View className='bg-gray-200 p-2 rounded-full'>
                  <MaterialIcons name='person-4' size={12}/>
                </View>
                <Text className="text-sm font-semibold text-gray-900" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
                  {commentItem.author}
                </Text>
                <Text className="text-xs text-gray-400" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                  {new Date(commentItem.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </Text>
              </View>
              <Text className="text-sm text-gray-700 ml-8" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                {commentItem.text}
              </Text>
            </View>
          ))}
        </View>

        <View className="h-32" />
      </ScrollView>

      {/* Floating Action Button - Made Bigger */}
      <TouchableOpacity 
        onPress={() => setIsModalVisible(true)}
        className="absolute right-5 bottom-8 w-16 h-16 rounded-full bg-yellow-500 items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={36} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Sheet Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={() => setIsModalVisible(false)}
            className="flex-1 bg-black/50 justify-center items-center px-5"
          >
            <TouchableOpacity 
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-2xl"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              {/* Modal Content */}
              <View className="px-5 py-6">
                <Text className="text-xl font-bold text-gray-900 mb-4" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                  Add Comment
                </Text>

                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-4"
                  style={{fontFamily: 'HankenGrotesk_400Regular', minHeight: 100}}
                  placeholder="Share your thoughts..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  textAlignVertical="top"
                  value={comment}
                  onChangeText={setComment}
                />

                <View className="flex-row gap-3">
                  <View className='flex-1'>
                    <SolidLightButton 
                      text='Cancel'
                      onPress={() => setIsModalVisible(false)}
                    />
                  </View>
                  

                  <View className='flex-1'>
                    <SolidMainButton 
                      text='Post Comment'
                      onPress={handleSubmitComment}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default Blog;