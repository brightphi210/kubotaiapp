import { SolidLightButton, SolidMainButton } from '@/components/Btns';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useGetSingleNews, useGetSingleNewsComment } from '@/hooks/queries/allQueries'
import { usePostComment, useLikePost } from '@/hooks/mutation/allMutation'
import React, { useState, useEffect } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useToast } from 'react-native-toast-notifications';
import LoadingOverlay from '@/components/LoadingOverlay'


interface CommentFormData {
  word: string;
}

const Blog = () => {
  const toast = useToast();
  const {blogPostData} = useLocalSearchParams()
  const myPosts = JSON.parse(blogPostData as string);

  const {getSingleNews, isLoading} = useGetSingleNews(myPosts?.id)
  const {getSingleNewsComment, isLoading:commentLoading, refetch} = useGetSingleNewsComment(myPosts?.id)
  const comments = getSingleNewsComment?.data || []
  
  const {mutate: commentMutate, isPending: isCommentPending} = usePostComment(myPosts?.id)
  const {mutate: likeMutate, isPending: isLikePending} = useLikePost(myPosts?.id)
  

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    defaultValues: {
      word: '',
    },
  })
  
  // State management
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(myPosts.likes_count);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Reset comments when post ID changes
  useEffect(() => {
    // This will force refetch when the post changes
    refetch();
  }, [myPosts?.id]);

  // Handle like toggle
  const handleLike = () => {
    if (isLikePending) return; // Prevent multiple clicks while loading

    likeMutate({}, {
      onSuccess: (response: any) => {
        console.log('Like toggled', response?.data)
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        toast.show(isLiked ? 'Post unliked!' : 'Post liked!', { type: 'success' })
      },
      onError: (error: any) => {
        console.error('Like error:', error)
        let errorMessage = 'Failed to like post. Please try again.'
        
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error?.response?.data?.error) {
          errorMessage = error.response.data.error
        } else if (error?.message) {
          errorMessage = error.message
        }
        
        toast.show(errorMessage, { type: 'danger' })
      },
    })
  };

  const onSubmit = (data: CommentFormData) => {
    try {
      commentMutate(data, {
        onSuccess: (response: any) => {
          console.log('Comment added', response?.data)
          toast.show('Comment added successfully!', { type: 'success' })
          reset(); // Clear the form
          setIsModalVisible(false); // Close the modal
          refetch(); // Refresh comments list
        },
        onError: (error: any) => {
          console.error('Update error:', error)
          let errorMessage = 'Failed to add comment. Please try again.'
          
          if (error?.response?.data?.message) {
            errorMessage = error.response.data.message
          } else if (error?.response?.data?.error) {
            errorMessage = error.response.data.error
          } else if (error?.message) {
            errorMessage = error.message
          }
          
          toast.show(errorMessage, { type: 'danger' })
        },
      })
    } catch (error) {
      console.error('Submit error:', error)
      toast.show('An unexpected error occurred.', { type: 'danger' })
    }
  }

  const handleCancel = () => {
    reset(); // Clear the form
    setIsModalVisible(false);
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style='dark'/>
      <LoadingOverlay visible={isCommentPending} />
      
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

          <TouchableOpacity 
            onPress={handleLike} 
            className="flex-row items-center gap-2"
            disabled={isLikePending}
          >
            {isLikePending ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <MaterialIcons 
                name={isLiked ? 'favorite' : 'favorite-border'} 
                size={24} 
                color={isLiked ? '#ef4444' : '#6B7280'}
              />
            )}
            <Text className="text-base text-gray-500 ml-1" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
              {likesCount}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View className="border-t border-gray-200 pt-6">
          <Text className="text-xl font-bold text-gray-900 mb-4" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
            Comments ({comments.length})
          </Text>

          {commentLoading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#EAB308" />
            </View>
          ) : comments && comments.length > 0 ? (
            <>  
              {comments.map((commentItem: any) => (
                <View key={commentItem.id} className="mb-4 pb-4 border-b border-gray-100">
                  <View className="flex-row items-center gap-2 mb-2">
                    
                    <View className='bg-gray-200 rounded-full overflow-hidden w-8 h-8'>
                      {commentItem.owner.profile.image !== null ? 
                      <Image source={{uri: commentItem.owner.profile.image}} className=" w-full h-full object-cover"/> :
                      <View className='bg-gray-200 p-2 rounded-full'>
                        <MaterialIcons name='person-4' size={13}/>
                      </View>
                      }
                    </View>
                    

                    <Text className="text-base font-semibold text-gray-900" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
                      @{commentItem.owner.username}
                    </Text>

                    <Text className="text-xs text-gray-400 ml-auto" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                      {new Date(commentItem.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-700 pt-3" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    {commentItem.word}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <>
              <Text className="text-base text-center pt-5 text-gray-400" style={{fontFamily: 'HankenGrotesk_500Medium'}}>No comment yet</Text>
            </>
          )}
        </View>

        <View className="h-32" />
      </ScrollView>

      {/* Floating Action Button */}
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
        onRequestClose={handleCancel}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={handleCancel}
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

                <Controller
                  name="word"
                  control={control}
                  rules={{
                    required: 'Comment cannot be empty',
                    minLength: {
                      value: 1,
                      message: 'Comment must have at least 1 character',
                    },
                    validate: (value) => value.trim().length > 0 || 'Comment cannot be empty or just spaces',
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <TextInput
                        className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-2"
                        style={{fontFamily: 'HankenGrotesk_400Regular', minHeight: 100}}
                        placeholder="Share your thoughts..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        editable={!isCommentPending}
                      />
                    </>
                  )}
                />

                <ErrorMessage
                  errors={errors}
                  name="word"
                  render={({ message }) => (
                    <View className='flex-row items-center mb-3'>
                      <Ionicons name="alert-circle" size={16} color="#EF4444" />
                      <Text className='ml-1 text-sm text-red-600' style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                        {message}
                      </Text>
                    </View>
                  )}
                />

                <View className="flex-row gap-3 mt-2">
                  <View className='flex-1'>
                    <SolidLightButton 
                      text='Cancel'
                      onPress={handleCancel}
                    />
                  </View>
                  
                  <View className='flex-1'>
                    <SolidMainButton 
                      text={isCommentPending ? 'Posting...' : 'Post Comment'}
                      onPress={handleSubmit(onSubmit)}
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