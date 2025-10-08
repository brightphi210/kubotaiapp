import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => null,
        tabBarStyle: {
          paddingTop: 6,
          height: 75,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          borderTopWidth: 0,
          borderTopColor: 'transparent',
        },
        tabBarIconStyle: {
          width: 48,
          height: 48,
        },
        tabBarItemStyle: {
          marginHorizontal: 15,
        },
        tabBarLabelStyle: {
          display: 'none'
        }
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
           tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <MaterialIcons name='home-filled' size={22} color={ focused ? "#016FEC": "#5F5F5F"} />
              <Text className={`text-xs ${focused ? "text-[#016FEC]": "text-[#5F5F5F]"}` } style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>Home</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
           tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <MaterialIcons name='people-outline' size={22} color={ focused ? "#016FEC": "#5F5F5F"} />
              <Text className={`text-xs ${focused ? "text-[#016FEC]": "text-[#5F5F5F]"}` } style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>Friends</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
           tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <MaterialIcons name='explore' size={35} color={ focused ? "#016FEC": "#5F5F5F"} />
              <Text className={`text-xs ${focused ? "text-[#016FEC]": "text-[#5F5F5F]"}` } style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>Market</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
           tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons name='wallet-outline' size={22} color={ focused ? "#016FEC": "#5F5F5F"} />
              <Text className={`text-xs ${focused ? "text-[#016FEC]": "text-[#5F5F5F]"}` } style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>Wallet</Text>
            </View>
          ),
        }}
      />


      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
           tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <MaterialIcons name='person-outline' size={22} color={ focused ? "#016FEC": "#5F5F5F"} />
              <Text className={`text-xs ${focused ? "text-[#016FEC]": "text-[#5F5F5F]"}` } style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>Profile</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
