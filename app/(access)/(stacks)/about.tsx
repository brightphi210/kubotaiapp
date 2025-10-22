import { SolidMainButton } from '@/components/Btns'
import Header from '@/components/Header'
import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const About = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteAccount = () => {
    // Add your delete account logic here
    console.log('Account deleted')
    setShowDeleteModal(false)
    // You might want to navigate to login or perform other actions
    // router.replace('/(auth)/login')
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
      <StatusBar style='light'/> 
      <Header text='About'/>

      <ScrollView className='px-6 pt-4'>
        <TouchableOpacity onPress={()=>router.push('/(access)/(stacks)/about/white-paper')} className='flex-row items-center justify-between py-4 px-4 bg-gray-100 rounded-lg mb-4'>
            <Text className='text-base' style={{fontFamily: 'HankenGrotesk_500Medium'}}>White Paper</Text>
            <MaterialIcons name='chevron-right' size={20}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>router.push('/(access)/(stacks)/about/faq')} className='flex-row items-center justify-between py-4 px-4 bg-gray-100 rounded-lg mb-4'>
            <Text className='text-base' style={{fontFamily: 'HankenGrotesk_500Medium'}}>FAQs</Text>
            <MaterialIcons name='chevron-right' size={20}/>
        </TouchableOpacity>

        <TouchableOpacity className='flex-row items-center justify-between py-4 px-4 bg-gray-100 rounded-lg mb-4'>
            <Text className='text-base' style={{fontFamily: 'HankenGrotesk_500Medium'}}>Contact Us</Text>
            <MaterialIcons name='chevron-right' size={20}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowDeleteModal(true)} className='flex-row items-center justify-between py-4 px-4 bg-gray-100 rounded-lg mb-4'>
            <Text className='text-base' style={{fontFamily: 'HankenGrotesk_500Medium'}}>Delete Account</Text>
            <MaterialIcons name='chevron-right' size={20}/>
        </TouchableOpacity>
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View className='flex-1 justify-center items-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View className='bg-white rounded-2xl mx-6 p-6' style={{ width: '87%', maxWidth: 400 }}>
            {/* Icon */}
            <View className='items-center mb-4'>
              <View className='bg-gray-100 rounded-full p-4 px-4.5'>
                <MaterialIcons name='warning' size={30} color='gray' />
              </View>
            </View>

            {/* Title */}
            <Text className='text-xl text-center font-bold mb-2' style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
              Delete Account?
            </Text>

            {/* Description */}
            <Text className='text-sm text-center text-gray-500 mb-6 leading-relaxed' style={{fontFamily: 'HankenGrotesk_400Regular'}}>
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </Text>

            {/* Buttons */}
            <View className='gap-3'>
             <SolidMainButton text='Delete Account'/>

              <TouchableOpacity 
                onPress={() => setShowDeleteModal(false)}
                className='py-4 rounded-lg bg-gray-100'
              >
                <Text className='text-center text-gray-700 text-base font-semibold' style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default About