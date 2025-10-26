/**
 * Main Tab Navigator - Bottom tab navigation
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '@/types';
import {useTheme} from '@/hooks/useTheme';

// Screens
import {VaultListScreen} from '@/screens/VaultListScreen';
import {FavoritesScreen} from '@/screens/FavoritesScreen';
import {GeneratorScreen} from '@/screens/GeneratorScreen';
import {SettingsScreen} from '@/screens/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 83,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: theme.typography.caption1,
      }}
    >
      <Tab.Screen
        name="Vault"
        component={VaultListScreen}
        options={{
          tabBarLabel: 'Vault',
          tabBarIcon: ({color}) => <TabIcon name="lock" color={color} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({color}) => <TabIcon name="star" color={color} />,
        }}
      />
      <Tab.Screen
        name="Generator"
        component={GeneratorScreen}
        options={{
          tabBarLabel: 'Generator',
          tabBarIcon: ({color}) => <TabIcon name="key" color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color}) => <TabIcon name="gear" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Simple icon component (in production, use react-native-vector-icons or SF Symbols)
const TabIcon: React.FC<{name: string; color: string}> = ({name, color}) => {
  const icons: Record<string, string> = {
    lock: '🔒',
    star: '⭐',
    key: '🔑',
    gear: '⚙️',
  };
  return <>{icons[name] || '•'}</>;
};
