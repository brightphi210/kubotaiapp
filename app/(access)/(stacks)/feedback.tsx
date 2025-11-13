import { SolidMainButton } from "@/components/Btns"
import Header from '@/components/Header'
import LoadingOverlay from "@/components/LoadingOverlay"
import { Ionicons } from "@expo/vector-icons"
import { ErrorMessage } from "@hookform/error-message"
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Controller, useForm } from "react-hook-form"
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useToast } from "react-native-toast-notifications"

interface FeedbackFormData {
  questionType: string;
  problemDescription: string;
  contactEmail: string;
}

const Feedback = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<string>("");
  const [screenshots, setScreenshots] = React.useState<string[]>([]);
  const toast = useToast();

  const questionTypes = [
    "Crash",
    "Page misalignment",
    "Page stuck",
    "Complain about product features",
    "Feedback on other issues"
  ];

  // ========= REACT HOOK FORM =========
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FeedbackFormData>({
    defaultValues: {
      questionType: "",
      problemDescription: "",
      contactEmail: "",
    },
  });

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    setValue("questionType", type);
  };

  const handleAddScreenshot = async () => {
    if (screenshots.length >= 10) {
      toast.show('Maximum 10 screenshots allowed', { type: "warning" });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const newScreenshots = result.assets.map(asset => asset.uri);
      const combined = [...screenshots, ...newScreenshots].slice(0, 10);
      setScreenshots(combined);
    }
  };

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index));
  };

  const onSubmit = (data: FeedbackFormData) => {
    if (!selectedType) {
      toast.show('Please select a question type', { type: "warning" });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Feedback data:', { ...data, screenshots });
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        reset();
        setSelectedType("");
        setScreenshots([]);
        toast.show('Feedback submitted successfully', { type: "success" });
        router.back();
      }, 2000);
      
    } catch (error) {
      setIsLoading(false);
      console.error('Submit feedback error:', error);
      toast.show('An unexpected error occurred.', { type: "danger" });
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: 'white' }}>
      <StatusBar style='light'/> 
      <Header text='Feedback'/>
      <LoadingOverlay visible={isLoading} />

      <KeyboardAwareScrollView>
        <View className='px-7 mt-6'>
          <View className='pt-5'>

            {/* Question Type */}
            <View className='mb-5'>
              <Text style={styles.titleStyle}>Question Type</Text>
              <View className='flex-row flex-wrap gap-2 mt-2'>
                {questionTypes.map((type, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleSelectType(type)}
                    disabled={isLoading}
                    style={[
                      styles.typeButton,
                      selectedType === type && styles.typeButtonActive
                    ]}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      selectedType === type && styles.typeButtonTextActive
                    ]}>
                      {type}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Problem Description */}
            <View className='mb-5'>
              <Text style={styles.titleStyle}>Problem description</Text>
              <Controller
                name="problemDescription"
                control={control}
                rules={{
                  required: "Problem description is required",
                  maxLength: {
                    value: 300,
                    message: "Maximum 300 characters allowed"
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className='relative'>
                    <TextInput 
                      placeholder='Please fill in'
                      placeholderTextColor={"#AFAFAF"}
                      style={styles.textAreaStyle}
                      multiline
                      numberOfLines={6}
                      maxLength={300}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      editable={!isLoading}
                      textAlignVertical="top"
                    />
                    <Text style={styles.characterCount}>
                      {value.length}/300
                    </Text>
                  </View>
                )}
              />
              <ErrorMessage
                errors={errors}
                name="problemDescription"
                render={({ message }) => (
                  <Text className="pl-2 pt-3 text-sm text-red-600">
                    {message}
                  </Text>
                )}
              />
            </View>

            {/* Screenshots */}
            <View className='mb-5'>
              <Text style={styles.titleStyle}>Screenshots (optional)</Text>
              <View className='flex-row flex-wrap gap-3 mt-2'>
                {screenshots.map((uri, index) => (
                  <View key={index} style={styles.screenshotContainer}>
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => handleRemoveScreenshot(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF3B30" />
                    </Pressable>
                  </View>
                ))}
                
                {screenshots.length < 10 && (
                  <Pressable
                    onPress={handleAddScreenshot}
                    disabled={isLoading}
                    style={styles.addButton}
                  >
                    <Ionicons name="add" size={32} color="#AFAFAF" />
                  </Pressable>
                )}
              </View>
              <Text style={styles.screenshotCount}>
                {screenshots.length}/10
              </Text>
            </View>

            {/* Contact Email */}
            <View className='mb-5'>
              <Text style={styles.titleStyle}>Contact Email</Text>
              <Controller
                name="contactEmail"
                control={control}
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput 
                    placeholder='We will contact you if we need more information.'
                    placeholderTextColor={"#AFAFAF"}
                    style={styles.inputStyle}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    editable={!isLoading}
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name="contactEmail"
                render={({ message }) => (
                  <Text className="pl-2 pt-3 text-sm text-red-600">
                    {message}
                  </Text>
                )}
              />
            </View>

            {/* Submit Button */}
            <View className='flex-col gap-4 mt-5 mb-10'>
              <SolidMainButton 
                text={'Confirm'} 
                onPress={handleSubmit(onSubmit)}
              />
            </View>

          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

export default Feedback

const styles = StyleSheet.create({
  inputStyle: {
    borderRadius: 7,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontFamily: "HankenGrotesk_400Regular",
    backgroundColor: '#F6F6F6',
    color: 'gray'
  },
  textAreaStyle: {
    borderRadius: 7,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontFamily: "HankenGrotesk_400Regular",
    backgroundColor: '#F6F6F6',
    color: 'gray',
    minHeight: 140,
  },
  titleStyle: {
    fontFamily: "HankenGrotesk_500Medium",
    fontSize: 15,
    color: "#3A3541",
    paddingBottom: 8,
    paddingTop: 6
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
  },
  typeButtonActive: {
    backgroundColor: '#FFD700',
  },
  typeButtonText: {
    fontFamily: "HankenGrotesk_400Regular",
    fontSize: 13,
    color: '#AFAFAF',
  },
  typeButtonTextActive: {
    color: '#3A3541',
    fontFamily: "HankenGrotesk_500Medium",
  },
  characterCount: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    fontFamily: "HankenGrotesk_400Regular",
    fontSize: 12,
    color: '#AFAFAF',
  },
  screenshotContainer: {
    width: 80,
    height: 80,
    borderRadius: 7,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 1,
  },
  addButton: {
    width: 80,
    height: 80,
    borderRadius: 7,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  screenshotCount: {
    fontFamily: "HankenGrotesk_400Regular",
    fontSize: 12,
    color: '#AFAFAF',
    marginTop: 8,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFB84D',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});