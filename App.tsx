/**
 * PasswordVault - Offline Password Manager
 * Main App Entry Point
 *
 * Features:
 * - Offline-first architecture with WatermelonDB
 * - Biometric authentication
 * - Gesture-based navigation
 * - Physics-based animations with Reanimated 3
 * - Skia-powered visual effects
 * - Full accessibility support
 */

import React, {useEffect} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {RootNavigator} from './src/navigation/RootNavigator';
import {useTheme} from './src/hooks/useTheme';
import {useVaultStore} from './src/store/vaultStore';
import {useAuthStore} from './src/store/authStore';
import {useSettingsStore} from './src/store/settingsStore';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const App: React.FC = () => {
  const theme = useTheme();
  const loadEntries = useVaultStore((state) => state.loadEntries);
  const isSetupComplete = useAuthStore((state) => state.isSetupComplete);

  useEffect(() => {
    // Initialize app
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Load vault entries from database
      await loadEntries();

      // Check if this is first launch
      if (!isSetupComplete) {
        // In production, show onboarding flow
        console.log('First launch - show onboarding');
      }
    } catch (error) {
      console.error('App initialization error:', error);
    }
  };

  return (
    <>
      <StatusBar
        barStyle={theme.colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <RootNavigator />
    </>
  );
};

export default App;
