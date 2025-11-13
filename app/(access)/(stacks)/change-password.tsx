import { SolidMainButton } from "@/components/Btns"
import Header from '@/components/Header'
import LoadingOverlay from "@/components/LoadingOverlay"
import { Ionicons } from "@expo/vector-icons"
import { ErrorMessage } from "@hookform/error-message"
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Controller, useForm } from "react-hook-form"
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useToast } from "react-native-toast-notifications"

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();

  // ========= REACT HOOK FORM =========
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = (data: ChangePasswordFormData) => {
    try {
      setIsLoading(true);
      console.log('Password change data:', data);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        reset();
        toast.show('Password changed successfully', { type: "success" });
        router.back();
      }, 2000);
      
    } catch (error) {
      setIsLoading(false);
      console.error('Change password error:', error);
      toast.show('An unexpected error occurred.', { type: "danger" });
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: 'white' }}>
      <StatusBar style='light'/> 
      <Header text='Change Password'/>
      <LoadingOverlay visible={isLoading} />

      <KeyboardAwareScrollView>
        <View className='px-7 mt-10'>
          <View className='pt-5'>

            <View className='mb-5'>
              <Text style={styles.titleStyle}>Current Password</Text>
              <Controller
                name="currentPassword"
                control={control}
                rules={{
                  required: "Current password is required",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className='relative'>
                    <TextInput 
                      placeholder='Enter current password'
                      placeholderTextColor={"#AFAFAF"}
                      style={styles.inputStyle}
                      secureTextEntry={!showCurrentPassword}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      editable={!isLoading}
                    />

                    <View className='absolute right-0 top-0 justify-center items-center h-full w-20'>
                      <Pressable
                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                        disabled={isLoading}
                      >
                        <Ionicons
                          name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color={"#3A3541AD"}
                        />
                      </Pressable>
                    </View>
                  </View>
                )}
              />
              <ErrorMessage
                errors={errors}
                name="currentPassword"
                render={({ message }) => (
                  <Text className="pl-2 pt-3 text-sm text-red-600">
                    {message}
                  </Text>
                )}
              />
            </View>

            <View className='mb-5'>
              <Text style={styles.titleStyle}>New Password</Text>
              <Controller
                name="newPassword"
                control={control}
                rules={{
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className='relative'>
                    <TextInput 
                      placeholder='Enter new password'
                      placeholderTextColor={"#AFAFAF"}
                      style={styles.inputStyle}
                      secureTextEntry={!showNewPassword}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      editable={!isLoading}
                    />

                    <View className='absolute right-0 top-0 justify-center items-center h-full w-20'>
                      <Pressable
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        disabled={isLoading}
                      >
                        <Ionicons
                          name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color={"#3A3541AD"}
                        />
                      </Pressable>
                    </View>
                  </View>
                )}
              />
              <ErrorMessage
                errors={errors}
                name="newPassword"
                render={({ message }) => (
                  <Text className="pl-2 pt-3 text-sm text-red-600">
                    {message}
                  </Text>
                )}
              />
            </View>

            <View className='mb-5'>
              <Text style={styles.titleStyle}>Confirm New Password</Text>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match"
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className='relative'>
                    <TextInput 
                      placeholder='Re-enter new password'
                      placeholderTextColor={"#AFAFAF"}
                      style={styles.inputStyle}
                      secureTextEntry={!showConfirmPassword}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      editable={!isLoading}
                    />

                    <View className='absolute right-0 top-0 justify-center items-center h-full w-20'>
                      <Pressable
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        <Ionicons
                          name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color={"#3A3541AD"}
                        />
                      </Pressable>
                    </View>
                  </View>
                )}
              />
              <ErrorMessage
                errors={errors}
                name="confirmPassword"
                render={({ message }) => (
                  <Text className="pl-2 pt-3 text-sm text-red-600">
                    {message}
                  </Text>
                )}
              />
            </View>

            <View className='flex-col gap-4 mt-5'>
              <SolidMainButton 
                text={'Change Password'} 
                onPress={handleSubmit(onSubmit)}
              />
            </View>

          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

export default ChangePassword

const styles = StyleSheet.create({
  inputStyle: {
    borderRadius: 7,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontFamily: "HankenGrotesk_400Regular",
    backgroundColor: '#F6F6F6',
    color: 'gray'
  },
  titleStyle: {
    fontFamily: "HankenGrotesk_500Medium",
    fontSize: 15,
    color: "#3A3541",
    paddingBottom: 8,
    paddingTop: 6
  }
});