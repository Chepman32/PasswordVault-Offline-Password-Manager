/**
 * Root Navigator - Main navigation structure
 * Implements gesture-based navigation with custom transitions
 */

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';

import {RootStackParamList} from '@/types';
import {useAuthStore} from '@/store/authStore';
import {useSettingsStore} from '@/store/settingsStore';

// Screens
import {LockScreen} from '@/screens/LockScreen';
import {MainTabNavigator} from './MainTabNavigator';
import {VaultDetailScreen} from '@/screens/VaultDetailScreen';
import {VaultEditorScreen} from '@/screens/VaultEditorScreen';
import {GeneratorScreen} from '@/screens/GeneratorScreen';
import {SettingsScreen} from '@/screens/SettingsScreen';
import {ExportScreen} from '@/screens/ExportScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const isLocked = useAuthStore((state) => state.isLocked);
  const autoLockTimeout = useSettingsStore((state) => state.autoLockTimeout);
  const checkAutoLock = useAuthStore((state) => state.checkAutoLock);

  // Auto-lock functionality
  useEffect(() => {
    const interval = setInterval(() => {
      checkAutoLock(autoLockTimeout);
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [autoLockTimeout, checkAutoLock]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        >
          {isLocked ? (
            <Stack.Screen name="Lock" component={LockScreen} />
          ) : (
            <>
              <Stack.Screen name="MainTabs" component={MainTabNavigator} />
              <Stack.Screen
                name="VaultDetail"
                component={VaultDetailScreen}
                options={{
                  animation: 'slide_from_bottom',
                  presentation: 'card',
                }}
              />
              <Stack.Screen
                name="VaultEditor"
                component={VaultEditorScreen}
                options={{
                  animation: 'slide_from_bottom',
                  presentation: 'modal',
                }}
              />
              <Stack.Screen
                name="Generator"
                component={GeneratorScreen}
                options={{
                  animation: 'fade',
                }}
              />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen
                name="Export"
                component={ExportScreen}
                options={{
                  animation: 'slide_from_bottom',
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
