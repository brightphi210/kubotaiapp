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
          backgroundColor: 'black',
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
        name="index"
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
        name="task"
        options={{
          title: 'Task',
           tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <MaterialIcons name='notes' size={22} color={ focused ? "#016FEC": "#5F5F5F"} />
              <Text className={`text-xs ${focused ? "text-[#016FEC]": "text-[#5F5F5F]"}` } style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>Task</Text>
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
        name="leaders"
        options={{
          title: 'Leader',
           tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons name='trophy-outline' size={22} color={ focused ? "#016FEC": "#5F5F5F"} />
              <Text className={`text-xs ${focused ? "text-[#016FEC]": "text-[#5F5F5F]"}` } style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>Leaders</Text>
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
    </Tabs>
  );
}
