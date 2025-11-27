import { SolidMainButton } from '@/components/Btns'
import Header from '@/components/Header'
import LoadingOverlay from '@/components/LoadingOverlay'
import { useSetInvitationCode } from '@/hooks/mutation/allMutation'
import { useGetInvitation } from '@/hooks/queries/allQueries'
import { Ionicons } from '@expo/vector-icons'
import { ErrorMessage } from '@hookform/error-message'
import * as Clipboard from 'expo-clipboard'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useToast } from 'react-native-toast-notifications'

interface InviteCodeFormData {
  referral_code: string
}

const SetUsername = () => {
  const toast = useToast()
  const [isEditing, setIsEditing] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<InviteCodeFormData>({
    defaultValues: {
      referral_code: '',
    },
  })

  // Replace this with your actual mutation hook when ready
  // const { mutate: updateInviteCode, isPending } = useUpdateInviteCode()
  const { getInvitationToken, isLoading } = useGetInvitation()
  const {mutate, isPending} = useSetInvitationCode()
  const inviteCode = getInvitationToken?.data.data?.referral_code

  console.log('This is invitation code', inviteCode)

  // Set the invite code when it's loaded
  React.useEffect(() => {
    if (inviteCode) {
      setValue('referral_code', inviteCode)
    }
  }, [inviteCode, setValue])

  const handleCopy = async () => {
    if (inviteCode) {
      await Clipboard.setStringAsync(inviteCode)
      toast.show('Invite code copied!', { type: 'success' })
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original code
    if (inviteCode) {
      setValue('referral_code', inviteCode)
    }
  }

  const onSubmit = (data: InviteCodeFormData) => {
    try {
      //When you have the actual hook, use this format:
      mutate(data, {
        onSuccess: (response: any) => {
          console.log('Invite code updated:', response?.data)
          toast.show('Invite code updated successfully!', { type: 'success' })
        },
        onError: (error: any) => {
          console.error('Update error:', error)
          let errorMessage = 'Failed to update invite code. Please try again.'
          
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

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1 bg-gray-100'
    >
      <StatusBar style='light'/> 
      <LoadingOverlay visible={isPending || isLoading} />
      <Header text='Invitation Code'/>

      <View className='flex-1 px-6 pt-10'>
        {/* Title Section */}
        <View className='items-center mb-8'>
          <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className='text-2xl text-center mb-2'>
            {isEditing ? 'Edit Your Invitation Code' : 'Your Invitation Code'}
          </Text>
          <Text style={{fontFamily: 'HankenGrotesk_400Regular'}} className='text-sm text-center text-gray-500'>
            {isEditing 
              ? 'Update your unique invitation code' 
              : 'Share this code with friends to invite them'}
          </Text>
        </View>

        {/* Display/Edit Section */}
        {!isEditing ? (
          // Display Mode
          <View className='w-full mb-8'>
            <Text style={styles.labelStyle} className='mb-2'>
              Invite Code
            </Text>
            
            {/* Code Display Card */}
            <View 
              className='bg-white rounded-xl p-4 border border-gray-200 mb-4'
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                elevation: 0.2,
              }}
            >
              <View className='flex-row items-center justify-between'>
                <View className='flex-1'>
                  <Text 
                    style={{fontFamily: 'HankenGrotesk_700Bold'}} 
                    className='text-xl text-gray-800'
                  >
                    {inviteCode || '----'}
                  </Text>
                </View>
                
                {/* Action Buttons */}
                <View className='flex-row gap-2'>
                  {/* Copy Button */}
                  <Pressable
                    onPress={handleCopy}
                    className='bg-[#016FEC] rounded-lg p-2 px-2.5 active:opacity-70'
                    disabled={!inviteCode}
                  >
                    <Ionicons name="copy-outline" size={16} color="white" />
                  </Pressable>
                  
                  {/* Edit Button */}
                  <Pressable
                    onPress={handleEdit}
                    className='bg-neutral-800 rounded-lg p-2 px-2.5 active:opacity-70'
                    disabled={!inviteCode}
                  >
                    <Ionicons name="pencil-outline" size={16} color="white" />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Helper text */}
            <View className='bg-blue-50 rounded-lg p-4 border border-blue-100'>
              <View className='flex-row items-start'>
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <Text style={styles.helperTextStyle} className='ml-2 flex-1 text-[#016FEC]'>
                  Tap the copy button to share your invite code with friends. Use the edit button to change it.
                </Text>
              </View>
            </View>
          </View>
        ) : (
          // Edit Mode
          <View className='w-full mb-8'>
            <Text style={styles.labelStyle} className='mb-2'>
              New Invite Code
            </Text>
            
            <Controller
              name="referral_code"
              control={control}
              rules={{
                required: 'Invite code is required',
                minLength: {
                  value: 3,
                  message: 'Code must be at least 3 characters',
                },
                maxLength: {
                  value: 20,
                  message: 'Code cannot exceed 20 characters',
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Code can only contain letters, numbers, and underscores',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput 
                    placeholder='Enter invite code'
                    placeholderTextColor="#AFAFAF"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    style={[
                      styles.inputStyle,
                      errors.referral_code && { borderColor: '#EF4444', borderWidth: 1.5 }
                    ]}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    editable={!isPending}
                    maxLength={20}
                    autoFocus
                  />
                  
                  {/* Character count */}
                  {value && value.length > 0 && (
                    <Text style={styles.helperTextStyle} className='mt-2 text-right'>
                      {value.length}/20
                    </Text>
                  )}
                </>
              )}
            />

            <ErrorMessage
              errors={errors}
              name="referral_code"
              render={({ message }) => (
                <View className='flex-row items-center mt-2'>
                  <Ionicons name="alert-circle" size={16} color="#EF4444" />
                  <Text className='ml-1 text-sm text-red-600' style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                    {message}
                  </Text>
                </View>
              )}
            />

            {/* Helper text */}
            <Text style={styles.helperTextStyle} className='mt-2'>
              Code must be 3-20 characters with no spaces
            </Text>
          </View>
        )}

        {/* Button Section */}
        <View className='gap-3'>
          {isEditing ? (
            <>
              <SolidMainButton 
                text='Update' 
                onPress={handleSubmit(onSubmit)}
              />
              
              <Pressable
                onPress={handleCancel}
                className='bg-gray-200 rounded-lg py-4 active:opacity-70'
                disabled={isPending}
              >
                <Text 
                  className='text-center text-base'
                  style={{fontFamily: 'HankenGrotesk_600SemiBold', color: '#374151'}}
                >
                  Cancel
                </Text>
              </Pressable>
            </>
          ) : (

              <SolidMainButton 
                text='Copy Invite Code' 
                onPress={handleCopy}
              />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default SetUsername

const styles = StyleSheet.create({
  inputStyle: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontFamily: "HankenGrotesk_400Regular",
    backgroundColor: '#F6F6F6',
    color: '#3A3541',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
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
})