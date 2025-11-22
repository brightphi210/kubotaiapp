import { SolidMainButton } from "@/components/Btns"
import LoadingOverlay from "@/components/LoadingOverlay"
import { OnboardHeader } from "@/components/OnboardHeader"
import { useRegistration } from "@/hooks/mutation/useAuth"
import { Ionicons } from "@expo/vector-icons"
import { ErrorMessage } from "@hookform/error-message"
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Controller, useForm } from "react-hook-form"
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import Animated, { FadeInDown } from "react-native-reanimated"
import { SafeAreaView } from 'react-native-safe-area-context'
import { Toast } from "react-native-toast-notifications"

interface RegisterFormData {
    fullname: string;
    phone_number: string;
    email: string;
    code: string;
    password: string;
    password2: string;
}

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);
  const {mutate, isPending} = useRegistration();


  // ========= REACT HOOK FORM =========
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
        fullname: "",
        phone_number: "",
        email: "",
        code: "",
        password: "",
        password2: "",
    },
  });


  const onSubmit = (data: RegisterFormData) => {
    const form_data = {
      fullname: data.fullname,
      phone_number: data.phone_number,
      email: data.email,
      code: data.code,
      password: data.password,
      password2: data.password2,
    };

    try {
      mutate(form_data, {
        onSuccess: async (response) => {
          Toast.show("Registration successful!", {
            type: "success",
          });
          setIsSuccessModalVisible(true);
          reset();
          console.log(response);
        },

        onError: (error: any) => {
          console.error('This is was the first error', error.response);
          if (error.response?.data?.email) {
            Toast.show(error.response.data.email, {
              type: "danger",
            });
          } 

          if (error.response?.data?.password) {
            Toast.show(error.response.data.password, {
              type: "danger",
            });
          } 

          if (error.response?.data?.phone_number) {
            Toast.show(error.response.data.phone_number, {
              type: "danger",
            });
          }
        },
      });
    } catch(error) {
      console.error('there is an error', error);
    }
  }

  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false)


  const CustomSuccessModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    if (!visible) return null
    return (
      <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Ionicons name="checkmark-circle" size={100} color="green" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.modalTitle}>Registration Successful!</Text>
              <Text style={styles.modalDescription}>Your account has been created successfully. You can now login to continue.</Text>
              <View className="flex-row justify-between gap-1">
                <View className="w-full">
                  <SolidMainButton
                    text="Login"
                    onPress={() => {
                      onClose()
                      router.replace("/(noaccess)/login")
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    )
  }


  return (
    <SafeAreaView className='flex-1 flex w-full bg-white'>
      <StatusBar style='dark'/>
      <LoadingOverlay visible={isPending}/>

      <KeyboardAwareScrollView>
        <View className='px-7 mt-10'>
          <OnboardHeader text='Create Account' description="Sign up to start farming, and earning"/>
          <View className='pt-10'>

            <Animated.View className='mb-5' entering={FadeInDown.duration(500).springify()}>
              <Text style={styles.titleStyle}>Full Name</Text>
              <Controller
                name="fullname"
                control={control}
                rules={{
                  required: "Full name is required",
                  minLength: {
                    value: 3,
                    message: "Full name must be at least 3 characters"
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput 
                    placeholder='E.g - John Doe'
                    placeholderTextColor={"#AFAFAF"}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    style={styles.inputStyle}
                    autoCapitalize="words"
                    editable={!isPending}
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name="fullname"
                render={({ message }) => (
                  <Text className="pl-2 pt-3 text-sm text-red-600">
                    {message}
                  </Text>
                )}
              />
            </Animated.View>

            <Animated.View className='mb-5' entering={FadeInDown.duration(500).delay(200).springify()}>
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
                    editable={!isPending}
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

            <Animated.View className='mb-5' entering={FadeInDown.duration(500).delay(200).springify()}>
              <Text style={styles.titleStyle}>Invite Code</Text>
              <Controller
                name="code"
                control={control}
                rules={{
                  required: "Code is required",
                  pattern: {
                    value: /^[A-Za-z0-9]+$/,
                    message: "Invalid code number"
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput 
                    placeholder='E.g - KUBA1234d'
                    placeholderTextColor={"#AFAFAF"}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    keyboardType="default"
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isPending}
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name="code"
                render={({ message }) => (
                  <Text className="pl-2 pt-3 text-sm text-red-600">
                    {message}
                  </Text>
                )}
              />
            </Animated.View>


            <Animated.View className='mb-5' entering={FadeInDown.duration(500).delay(200).springify()}>
              <Text style={styles.titleStyle}>Phone Number</Text>
              <Controller
                name="phone_number"
                control={control}
                rules={{
                  required: "Phone is required",
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: "Invalid phone number"
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput 
                    placeholder='E.g - +2348094422807'
                    placeholderTextColor={"#AFAFAF"}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    keyboardType="phone-pad"
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isPending}
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name="phone_number"
                render={({ message }) => (
                  <Text className="pl-2 pt-3 text-sm text-red-600">
                    {message}
                  </Text>
                )}
              />
            </Animated.View>

            <Animated.View className='mb-5' entering={FadeInDown.duration(600).delay(300).springify()}>
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
                      editable={!isPending}
                    />
                    <View className='absolute right-0 top-0 justify-center items-center h-full w-20'>
                      <Pressable
                        onPress={() => setShowPassword(!showPassword)}
                        disabled={isPending}
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

            <Animated.View className='mb-5' entering={FadeInDown.duration(600).delay(400).springify()}>
              <Text style={styles.titleStyle}>Confirm Password</Text>
              <Controller
                name="password2"
                control={control}
                rules={{
                  required: "Please confirm your password",
                  validate: (value) => value === watch('password') || "Passwords do not match"
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className='relative'>
                    <TextInput 
                      placeholder='*********'
                      placeholderTextColor={"#AFAFAF"}
                      style={styles.inputStyle}
                      secureTextEntry={!showPassword2}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      editable={!isPending}
                    />
                    <View className='absolute right-0 top-0 justify-center items-center h-full w-20'>
                      <Pressable
                        onPress={() => setShowPassword2(!showPassword2)}
                        disabled={isPending}
                      >
                        <Ionicons
                          name={showPassword2 ? "eye-off-outline" : "eye-outline"}
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
                name="password2"
                render={({ message }) => (
                  <Text className="pl-2 pt-3 text-sm text-red-600">
                    {message}
                  </Text>
                )}
              />
            </Animated.View>

            <Animated.View className='flex-col gap-4' entering={FadeInDown.duration(600).delay(500).springify()}>
              <SolidMainButton 
                text={'Register'} 
                onPress={handleSubmit(onSubmit)}
              />
            </Animated.View>

            <View className='pt-5 flex-row gap-4 justify-center'>
              <Text className='text-[#3A3541] text-base' style={{fontFamily: 'HankenGrotesk_400Regular'}}>Already have an account?</Text>

              <Pressable
                className=""
                onPress={() => router.push("/(noaccess)/login")}
              >
                <Text className='text-[#016FEC] text-base' style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>Login</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <CustomSuccessModal visible={isSuccessModalVisible} onClose={() => setIsSuccessModalVisible(false)} />
    </SafeAreaView>
  )
}

export default Register

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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    paddingVertical: 30,
    alignItems: "center",
    width: "95%",
  },
  modalContent: {
    alignItems: "center",
    marginBottom: 20,
  },
  successImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  textContainer: {
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "HankenGrotesk_600SemiBold",
  },
  modalDescription: {
    fontSize: 14,
    paddingHorizontal: 20,
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
    fontFamily: "HankenGrotesk_400Regular",
  },
  buttonContainer: {
    width: "100%",
  },
  fixedBottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  modalOverlaya: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});