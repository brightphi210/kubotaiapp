import { SolidMainButton } from '@/components/Btns'
import Header from '@/components/Header'
import LoadingOverlay from '@/components/LoadingOverlay'
import { useGetInvitation } from '@/hooks/queries/allQueries'
import { ErrorMessage } from '@hookform/error-message'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import { useToast } from 'react-native-toast-notifications'

interface UsernameFormData {
  code: string
}

const SetUsername = () => {
  const toast = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UsernameFormData>({
    defaultValues: {
      code: '',
    },
  })

  // Replace this with your actual mutation hook when ready
  // const { mutate: setUsername, isPending } = useSetUsername()
    const [isPending, setIsPending] = React.useState(false)
    const {getInvitationToken, isLoading} = useGetInvitation()

    console.log('This is invitation', getInvitationToken)

  const onSubmit = (data: UsernameFormData) => {
    try {
      // Temporary: Simulate API call
      setIsPending(true)
      
      // Replace this block with your actual mutation
      setTimeout(() => {
        console.log('Username submitted:', data.code)
        toast.show('Username set successfully!', { type: 'success' })
        reset()
        setIsPending(false)
        // router.push('/next-screen') // Navigate to next screen
      }, 1500)

      /* 
      // When you have the actual hook, use this format:
      mutate(data, {
        onSuccess: (response: any) => {
          console.log('Username set:', response?.data)
          toast.show('Username set successfully!', { type: 'success' })
          reset()
          router.push('/next-screen')
        },
        onError: (error: any) => {
          console.error('Username error:', error)
          
          let errorMessage = 'Failed to set username. Please try again.'
          
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
      */
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
      <LoadingOverlay visible={isPending} />
      <Header text='Set Invite Code'/>

      <View className='flex-1 px-6 pt-10'>
        {/* Title Section */}
        <View className='items-center mb-8'>
          <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className='text-2xl text-center mb-2'>
            Set your invitation code
          </Text>
          <Text style={{fontFamily: 'HankenGrotesk_400Regular'}} className='text-sm text-center text-gray-500'>
            Choose a unique code as invitation {'\n'} for your account
          </Text>
        </View>

        {/* Input Section */}
        <View className='w-full mb-8'>
          <Text style={styles.labelStyle} className='mb-2'>
            Invite Code
          </Text>
          
          <Controller
            name="code"
            control={control}
            rules={{
              required: 'code is required',
              minLength: {
                value: 3,
                message: 'code must be at least 3 characters',
              },
              maxLength: {
                value: 20,
                message: 'code cannot exceed 20 characters',
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'code can only contain letters, numbers, and underscores',
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
                  style={styles.inputStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isPending}
                  maxLength={20}
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
            name="code"
            render={({ message }) => (
              <Text className='pl-2 pt-2 text-sm text-red-600'>{message}</Text>
            )}
          />

          {/* Helper text */}
          <Text style={styles.helperTextStyle} className='mt-2'>
            Username must be 3-20 characters with no spaces
          </Text>
        </View>

        {/* Button Section */}
        <View>
          <SolidMainButton 
            text='Continue' 
            onPress={handleSubmit(onSubmit)}
          />
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