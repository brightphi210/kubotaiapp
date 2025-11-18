import { SolidMainButton } from "@/components/Btns"
import LoadingOverlay from "@/components/LoadingOverlay"
import { OnboardHeader } from "@/components/OnboardHeader"
import { useLogin } from "@/hooks/mutation/useAuth"
import { Ionicons } from "@expo/vector-icons"
import { ErrorMessage } from "@hookform/error-message"
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { Button, Icon } from "@rneui/themed"
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Controller, useForm } from "react-hook-form"
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import Animated, { FadeInDown } from "react-native-reanimated"
import { SafeAreaView } from 'react-native-safe-area-context'
import { useToast } from "react-native-toast-notifications"

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();

  // ========= REACT HOOK FORM =========
 const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {mutate, isPending, } = useLogin();
  // const loginMutation = useLogin();

  const onSubmit = (data: LoginFormData) => {
    try {
      mutate(data, {

        onSuccess: (response: any) => {
          AsyncStorage.setItem('ku_token', response?.data?.token?.access);
          reset()
          toast.show('Login Successfull', { type: "success" });
          router.replace('/(access)/(tabs)/home');
          console.log('Login successful:', response?.data.token.access);
        },
        onError: (error: any) => {
          console.log('Login failed:', error.response.detail);
          
          let errorMessage = 'Login failed. Please try again.';
          let noAccountFound = error.response.data.error
          
          try {
            if (error?.response?.data?.detail) {
              errorMessage = error.response.data.detail;
            } 

            if (error?.response?.data?.message) {
              errorMessage = error.response.data.message;
            } 
            
            if (error?.message) {
              errorMessage = error.message;
            }
            
            if (noAccountFound) {
              errorMessage = 'Invalid Credentials';
            }

            
            if (typeof errorMessage !== 'string') {
              errorMessage = 'Login failed. Please try again.';
            }
            
            toast.show(errorMessage, { type: "danger" });
          } catch (toastError) {
            console.error('Toast error:', toastError);
            toast.show('Login failed. Please try again.', { type: "danger" });
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      toast.show('An unexpected error occurred.', { type: "danger" });
    }
  };

  return (
    <SafeAreaView className='flex-1 flex w-full bg-white'>
      <StatusBar style='dark'/>
      <LoadingOverlay visible={isPending} />

      <KeyboardAwareScrollView>
        <View className='px-7 mt-10'>
          <OnboardHeader text='Welcome back!' description="Login to farm and earn on KubotAi"/>
          <View className='pt-10'>

            <Animated.View className='mb-5' entering={FadeInDown.duration(200).springify()}>
              <Text style={styles.titleStyle}>Email Address</Text>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput 
                    placeholder='E.g - johndoe@gmail.com'
                    placeholderTextColor={"#AFAFAF"}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    keyboardType="email-address"
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                )}
              />

              <ErrorMessage
                errors={errors}
                name="email"
                render={({ message }) => (
                  <Text className="pl-2 pt-3 text-sm text-red-600">
                    {message}
                  </Text>
                )}
              />
            </Animated.View>

            <Animated.View className='mb-5' entering={FadeInDown.duration(300).delay(100).springify()}>
              <Text style={styles.titleStyle}>Password</Text>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className='relative'>
                    <TextInput 
                      placeholder='*********'
                      placeholderTextColor={"#AFAFAF"}
                      style={styles.inputStyle}
                      secureTextEntry={!showPassword}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      editable={!isLoading}
                    />

                    <View className='absolute right-0 top-0 justify-center items-center h-full w-20'>
                      <Pressable
                        onPress={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        <Ionicons
                          name={showPassword ? "eye-off-outline" : "eye-outline"}
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
                name="password"
                render={({ message }) => (
                  <Text className="pl-2 pt-3 text-sm text-red-600">
                    {message}
                  </Text>
                )}
              />
            </Animated.View>

            <Animated.View className='flex-col gap-4' entering={FadeInDown.duration(400).delay(200).springify()}>
              <SolidMainButton 
                text={'Login'} 
                onPress={handleSubmit(onSubmit)}
              />
            </Animated.View>

            <View className='pt-5 flex-row gap-4 justify-center'>
                 <Text className='text-[#3A3541] text-base' style={{fontFamily: 'HankenGrotesk_400Regular'}}>{"Don't have an account?"}</Text>
   
                 <Pressable
                   className=""
                   onPress={() => router.push("/(noaccess)/register")}
                 >
                   <Text className='text-[#016FEC] text-base' style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>Register</Text>
                 </Pressable>
               </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default Login

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