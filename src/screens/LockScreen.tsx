/**
 * LockScreen - Biometric and PIN authentication
 * Features: Face ID/Touch ID, PIN fallback, physics-based animations
 */

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Alert} from 'react-native';
import Animated, {useSharedValue, withSpring, useAnimatedStyle} from 'react-native-reanimated';
import {Canvas, Circle, Group, BlurMask} from '@shopify/react-native-skia';
import ReactNativeBiometrics from 'react-native-biometrics';
import {useAuthStore} from '@/store/authStore';
import {useSettingsStore} from '@/store/settingsStore';
import {useTheme} from '@/hooks/useTheme';
import {Button} from '@/components/ui/Button';

export const LockScreen: React.FC = () => {
  const theme = useTheme();
  const unlock = useAuthStore((state) => state.unlock);
  const failedAttempts = useAuthStore((state) => state.failedAttempts);
  const biometricEnabled = useSettingsStore((state) => state.biometricEnabled);

  const [pin, setPin] = useState('');
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate logo on mount
    logoScale.value = withSpring(1, {stiffness: 150, damping: 12});
    logoOpacity.value = withSpring(1, {stiffness: 150, damping: 12});

    // Attempt biometric auth if enabled
    if (biometricEnabled) {
      attemptBiometricAuth();
    }
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{scale: logoScale.value}],
    opacity: logoOpacity.value,
  }));

  const attemptBiometricAuth = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const {success} = await rnBiometrics.simplePrompt({
        promptMessage: 'Unlock PasswordVault',
        cancelButtonText: 'Use PIN',
      });

      if (success) {
        unlock();
      }
    } catch (error) {
      console.log('Biometric authentication failed:', error);
    }
  };

  const handlePinSubmit = () => {
    // In production, verify against stored PIN (hashed)
    const correctPin = '1234'; // Demo only

    if (pin === correctPin) {
      unlock();
    } else {
      Alert.alert('Incorrect PIN', 'Please try again');
      setPin('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Canvas style={styles.canvas}>
            <Group>
              <Circle cx={100} cy={100} r={60} color={theme.colors.primary}>
                <BlurMask blur={10} style="solid" />
              </Circle>
              <Circle cx={100} cy={100} r={40} color={theme.colors.primaryLight} />
            </Group>
          </Canvas>
        </Animated.View>

        <Text style={[theme.typography.largeTitle, {color: theme.colors.text, textAlign: 'center', marginTop: 24}]}>
          PasswordVault
        </Text>
        <Text style={[theme.typography.body, {color: theme.colors.textSecondary, textAlign: 'center', marginTop: 8}]}>
          Your passwords are safe and secure
        </Text>

        <View style={styles.authContainer}>
          {biometricEnabled && (
            <Button
              title="Unlock with Biometrics"
              onPress={attemptBiometricAuth}
              variant="primary"
              size="large"
              fullWidth
              accessibilityLabel="Unlock with Face ID or Touch ID"
            />
          )}

          <View style={styles.pinContainer}>
            <Text style={[theme.typography.subhead, {color: theme.colors.textSecondary, marginBottom: 16}]}>
              Or enter PIN
            </Text>
            {/* In production, use a proper PIN input component */}
            <Button
              title={pin.length > 0 ? '••••'.substring(0, pin.length) : 'Enter PIN'}
              onPress={handlePinSubmit}
              variant="outline"
              fullWidth
            />
          </View>
        </View>

        {failedAttempts > 0 && (
          <Text style={[theme.typography.caption1, {color: theme.colors.error, textAlign: 'center', marginTop: 16}]}>
            {failedAttempts} failed attempt{failedAttempts > 1 ? 's' : ''}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 200,
    height: 200,
  },
  canvas: {
    width: 200,
    height: 200,
  },
  authContainer: {
    width: '100%',
    marginTop: 48,
  },
  pinContainer: {
    marginTop: 24,
    width: '100%',
  },
});
