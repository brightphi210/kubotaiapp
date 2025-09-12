import {
  HankenGrotesk_100Thin,
  HankenGrotesk_300Light,
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  HankenGrotesk_900Black
} from "@expo-google-fonts/hanken-grotesk";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from "react-native-keyboard-controller";
import 'react-native-reanimated';
import { ToastProvider } from 'react-native-toast-notifications';
import '../global.css';


import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
       HankenGrotesk_100Thin,
    HankenGrotesk_300Light,
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
    HankenGrotesk_900Black
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ToastProvider
        placement="top"
        offset={50}
        textStyle={{
          fontFamily: "HankenGrotesk_500Medium",
          width: "90%",
          fontSize: 13,
        }}

        style={{
          flexDirection: 'row',
          gap: 10,
          borderRadius: 10
        }}

          dangerIcon={
            <MaterialIcons
              name="dangerous"
              size={22}
              color={"#fff"}
              
            />
          }
          successIcon={
            <MaterialIcons name="check-circle" size={22} color="#fff" />
          }
          warningIcon={
            <MaterialIcons name="warning" size={22} color="#fff" />
          }
        >
          <KeyboardProvider>
            <GestureHandlerRootView>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </GestureHandlerRootView>
          </KeyboardProvider>
      </ToastProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
