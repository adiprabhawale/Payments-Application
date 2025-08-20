import { Tabs } from 'expo-router';
import { Chrome as Home, Send, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: Platform.select({
          web: {
            maxWidth: 600,
            width: '100%',
            left: 0,
            right: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            position: 'fixed',
            bottom: 0,
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
            paddingBottom: 8,
            paddingTop: 8,
            height: 80,
            zIndex: 1000,
          },
          default: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
            paddingBottom: 8,
            paddingTop: 8,
            height: 80,
          }
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="domestic-transfer"
        options={{
          title: 'Domestic',
          tabBarIcon: ({ size, color }) => (
            <Send size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="international-transfer"
        options={{
          title: 'International',
          tabBarIcon: ({ size, color }) => (
            <Send size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}