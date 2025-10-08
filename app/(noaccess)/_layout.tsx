import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from 'expo-router';
import React, { useEffect } from 'react';

const StackPagesLayout = () => {
  useEffect(() => {
    (async () => {
      try {
        const onboarded = await AsyncStorage.getItem("ku_onboarding");
        const token = await AsyncStorage.getItem("ku_token");
        if (token) {
          router.replace("/home");
          return;
        }

        if (onboarded) {
          router.replace("/login");
          return;
        } else {
          router.replace("/onboarding");
          return;
        }
  
      } catch (error) {
        console.error(error);
        router.replace("/login");
        return;
      }
    })();
      return () => {};
    }, []);
  return (
    <Stack
      screenOptions={{
      headerShown: false,
    }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
    </Stack>
  )
}

export default StackPagesLayout