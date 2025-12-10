import "@walletconnect/react-native-compat";

import {
  HankenGrotesk_100Thin,
  HankenGrotesk_300Light,
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  HankenGrotesk_900Black
} from '@expo-google-fonts/hanken-grotesk';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { ToastProvider } from 'react-native-toast-notifications';

import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import '../global.css';

import 'react-native-get-random-values';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// import { AppKitProvider, createAppKit } from '@reown/appkit-react-native';
// import { WagmiAdapter } from '@reown/appkit-wagmi-react-native';
// import { WagmiProvider } from 'wagmi';
// import { arbitrum, mainnet, polygon } from 'wagmi/chains';

// const projectId = 'ebad43e08295b99f1b3637c329d65e8b';

// const metadata = {
//   name: 'Kubot Farming',
//   description: 'Farm and earn tokens',
//   url: 'https://kubotai.org',
//   icons: [
//     'https://res.cloudinary.com/dphb7gqus/image/upload/v1764816400/logo_6._jmahgz.png',
//   ],
// };

// export const wagmiAdapter = new WagmiAdapter({
//   projectId,
//   networks: [mainnet, polygon, arbitrum],
// });

// const appKit = createAppKit({
//   adapters: [wagmiAdapter],
//   projectId,
//   metadata,
// });

// Create QueryClient instance outside of component
const queryClient = new QueryClient({
  defaultOptions: { 
    queries: { 
      retry: 2,
      refetchOnWindowFocus: false,
    } 
  },
});

// ---------- Root layout ----------

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
    HankenGrotesk_900Black,
  });

  if (!loaded) return null;

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
          <QueryClientProvider client={queryClient}>
            <KeyboardProvider>
              <GestureHandlerRootView>
                <Stack>
                  <Stack.Screen name="(noaccess)" options={{ headerShown: false }} />
                  <Stack.Screen name="(access)" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </GestureHandlerRootView>
            </KeyboardProvider>

          </QueryClientProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}