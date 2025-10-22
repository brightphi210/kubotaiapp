import { SolidMainButton } from '@/components/Btns'
import Header from '@/components/Header'
import LoadingOverlay from '@/components/LoadingOverlay'
import { useUpdateUserProfile } from '@/hooks/mutation/useAuth'
import { useGetProfile } from '@/hooks/queries/allQueries'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { ErrorMessage } from '@hookform/error-message'
import * as ImagePicker from 'expo-image-picker'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useToast } from 'react-native-toast-notifications'

const ProfileEdit = () => {
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateUserProfile()
  const { getProfile, isLoading, refetch } = useGetProfile()
  const [image, setImage] = useState<string | null>(null)
  const toast = useToast()
  const profile = getProfile?.data

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      username: '',
      bio: '',
    },
  })

  // Prefill form fields when profile data is loaded
  useEffect(() => {
    if (profile && !isLoading) {
      reset({
        username: profile?.data?.username || '',
        bio: profile?.data?.bio || '',
      })

      // Set existing profile picture if available
      if (profile?.data?.profile_picture) {
        setImage(profile?.data?.profile_picture)
      }
    }
  }, [profile, isLoading, reset])

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    
    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData()
      
      // Add text fields to FormData
      formData.append('username', data.username)
      formData.append('bio', data.bio)

      // Add image if selected AND it's a new local image (not an existing URL)
      if (image && !image.startsWith('http')) {
        const imageUri = image
        const filename = imageUri.split('/').pop()
        const match = /\.(\w+)$/.exec(filename || '')
        const type = match ? `image/${match[1]}` : 'image/jpeg'
        
        formData.append('profile_picture', {
          uri: imageUri,
          name: filename || 'profile.jpg',
          type,
        } as any)
      }

      updateProfile(formData, {
        onSuccess: (response) => {
          console.log('Profile updated:', response?.data)
          toast.show('Profile Updated Successfully', { type: 'success' })
          refetch()
        },
        onError: (error: any) => {
          console.error('Update error:', error)
          
          // Extract actual error message from API response
          let errorMessage = 'Error Updating Profile'
          
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
    } catch (error: any) {
      console.error('Submit error:', error)
      
      // Extract actual error message
      let errorMessage = 'An error occurred'
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast.show(errorMessage, { type: 'danger' })
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1 bg-gray-100'
    >
      <StatusBar style='light'/> 
      <LoadingOverlay visible={isUpdating || isLoading} />
      <Header text='Edit Profile'/>

      <ScrollView 
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className='px-6 pt-6'>
          {/* Profile Image Section */}
          <View className='items-center mb-8'>
            <TouchableOpacity 
              onPress={pickImage}
              activeOpacity={0.8}
              className='relative'
            >
              <View style={styles.avatarContainer}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={48} color="#FFFFFF" />
                )}
              </View>
              <View style={styles.editBadge}>
                <MaterialIcons name="drive-folder-upload" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.imageHintStyle} className='mt-3 text-center'>
              Tap to change profile picture
            </Text>
          </View>

          {/* Username Input */}
          <View className='mb-5'>
            <Text style={styles.labelStyle} className='mb-2'>
              Username
            </Text>
            <Controller
              name="username"
              control={control}
              rules={{
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput 
                  placeholder='Enter your username'
                  placeholderTextColor="#AFAFAF"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  style={styles.inputStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isUpdating}
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name="username"
              render={({ message }) => (
                <Text className='pl-2 pt-2 text-sm text-red-600'>{message}</Text>
              )}
            />
          </View>

          {/* Bio Input */}
          <View className='mb-5'>
            <Text style={styles.labelStyle} className='mb-2'>
              Bio
            </Text>
            <Controller
              name="bio"
              control={control}
              rules={{
                maxLength: {
                  value: 150,
                  message: 'Bio cannot exceed 150 characters',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput 
                    placeholder='Tell us about yourself'
                    placeholderTextColor="#AFAFAF"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    style={[styles.inputStyle, styles.textAreaStyle]}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    autoCapitalize="sentences"
                    editable={!isUpdating}
                    maxLength={150}
                  />
                  {value && value.length > 0 && (
                    <Text style={styles.helperTextStyle} className='mt-2 text-right'>
                      {value.length}/150
                    </Text>
                  )}
                </>
              )}
            />
            <ErrorMessage
              errors={errors}
              name="bio"
              render={({ message }) => (
                <Text className='pl-2 pt-2 text-sm text-red-600'>{message}</Text>
              )}
            />
          </View>

          <View>
            <SolidMainButton 
              text='Update' 
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default ProfileEdit

const styles = StyleSheet.create({
  inputStyle: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontFamily: "HankenGrotesk_400Regular",
    backgroundColor: '#F6F6F6',
    color: '#3A3541',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textAreaStyle: {
    height: 100,
    paddingTop: 16,
  },
  labelStyle: {
    fontFamily: "HankenGrotesk_500Medium",
    fontSize: 15,
    color: "#3A3541",
  },
  helperTextStyle: {
    fontFamily: "HankenGrotesk_400Regular",
    fontSize: 12,
    color: "#9CA3AF",
  },
  imageHintStyle: {
    fontFamily: "HankenGrotesk_400Regular",
    fontSize: 13,
    color: "#6B7280",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3A3541',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    fontFamily: "HankenGrotesk_600SemiBold",
    fontSize: 32,
    color: '#FFFFFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3A3541',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F3F4F6',
  },
});