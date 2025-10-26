/**
 * SettingsScreen - App settings and preferences
 */

import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, Switch} from 'react-native';
import {useSettingsStore} from '@/store/settingsStore';
import {useTheme} from '@/hooks/useTheme';

export const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const settings = useSettingsStore();

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Text style={[theme.typography.largeTitle, {color: theme.colors.text}]}>
          Settings
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[theme.typography.headline, {color: theme.colors.text, marginBottom: 16}]}>
            Security
          </Text>

          <View style={styles.toggle}>
            <Text style={[theme.typography.body, {color: theme.colors.text}]}>
              Biometric Authentication
            </Text>
            <Switch
              value={settings.biometricEnabled}
              onValueChange={settings.toggleBiometric}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
            />
          </View>

          <View style={styles.toggle}>
            <Text style={[theme.typography.body, {color: theme.colors.text}]}>
              Lock on Background
            </Text>
            <Switch
              value={settings.lockOnBackground}
              onValueChange={(value) => settings.updateSettings({lockOnBackground: value})}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
            />
          </View>

          <View style={styles.toggle}>
            <Text style={[theme.typography.body, {color: theme.colors.text}]}>
              Hide Passwords by Default
            </Text>
            <Switch
              value={settings.hidePasswordByDefault}
              onValueChange={(value) => settings.updateSettings({hidePasswordByDefault: value})}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.headline, {color: theme.colors.text, marginBottom: 16}]}>
            Appearance
          </Text>

          <View style={styles.toggle}>
            <Text style={[theme.typography.body, {color: theme.colors.text}]}>
              Theme: {settings.theme}
            </Text>
          </View>

          <View style={styles.toggle}>
            <Text style={[theme.typography.body, {color: theme.colors.text}]}>
              Haptic Feedback
            </Text>
            <Switch
              value={settings.hapticFeedback}
              onValueChange={(value) => settings.updateSettings({hapticFeedback: value})}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.headline, {color: theme.colors.text, marginBottom: 16}]}>
            Notifications
          </Text>

          <View style={styles.toggle}>
            <Text style={[theme.typography.body, {color: theme.colors.text}]}>
              Enable Notifications
            </Text>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(value) => settings.updateSettings({notificationsEnabled: value})}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.caption1, {color: theme.colors.textTertiary, textAlign: 'center'}]}>
            PasswordVault v1.0.0
          </Text>
          <Text style={[theme.typography.caption1, {color: theme.colors.textTertiary, textAlign: 'center', marginTop: 8}]}>
            Offline Password Manager
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
});
