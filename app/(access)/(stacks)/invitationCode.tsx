import Header from '@/components/Header'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const SetUsername = () => {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = () => {
    // Handle username submission
    console.log('Username:', username)
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1 bg-gray-100'
    >
      <StatusBar style='light'/> 
      <Header text='Invitation Code'/>

      <View className='flex-1 px-6 pt-10'>
        {/* Title Section */}
        <View className='items-center mb-8'>
          <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className='text-2xl text-center mb-2'>
            Set your username
          </Text>
          <Text style={{fontFamily: 'HankenGrotesk_400Regular'}} className='text-sm text-center text-gray-500'>
            Choose a unique username as invitation {'\n'} for your account
          </Text>
        </View>

        {/* Input Section */}
        <View className='w-full'>
          <Text style={{fontFamily: 'HankenGrotesk_500Medium'}} className='mb-2'>
            Username
          </Text>
          <TextInput 
            placeholder='Enter username'
            placeholderTextColor="#AFAFAF"
            onChangeText={setUsername}
            value={username}
            style={styles.inputStyle}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            maxLength={20}
          />
          
          {/* Character count */}
          {username.length > 0 && (
            <Text style={styles.helperTextStyle} className='mt-2 text-right'>
              {username.length}/20
            </Text>
          )}

          {/* Helper text */}
          <Text style={styles.helperTextStyle} className='mt-2'>
            Username must be 3-20 characters with no spaces
          </Text>
        </View>

        {/* Button Section */}
        <View className='mt-8'>
          <TouchableOpacity 
            style={[
              styles.buttonStyle,
              (!username || username.length < 3 || isLoading) && styles.buttonDisabled
            ]}
            onPress={handleContinue}
            disabled={!username || username.length < 3 || isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonTextStyle}>
              {isLoading ? 'Please wait...' : 'Continue'}
            </Text>
          </TouchableOpacity>
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
  buttonStyle: {
    backgroundColor: '#3A3541',
    borderRadius: 7,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  buttonTextStyle: {
    fontFamily: "HankenGrotesk_600SemiBold",
    fontSize: 14,
    color: '#FFFFFF',
  },
});