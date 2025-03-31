import { FontAwesome5 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol'; // Using FontAwesome5 now
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index" // This is the actual file name for the home screen
        options={{
          title: 'الرئيسية', // Home in Arabic
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'الخدمات', // Services in Arabic
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="cogs" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="agents"
        options={{
          title: 'الوكلاء', // Agents in Arabic
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="robot" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'الأدوات', // Tools in Arabic
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="tools" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="blog"
        options={{
          title: 'المدونة', // Blog in Arabic
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="newspaper" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'المنتجات', // Products in Arabic
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="shopping-bag" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="DataAnalysis1" // Use the actual filename
        options={{
          title: 'تحليل البيانات', // Data Analysis in Arabic
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="chart-line" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
