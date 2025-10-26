/**
 * Settings store - manages app settings and preferences
 */

import {create} from 'zustand';
import {AppSettings, ExportFormat} from '@/types';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState extends AppSettings {
  // Actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  toggleBiometric: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setAutoLockTimeout: (timeout: number) => void;
  setDynamicTypeSize: (size: AppSettings['dynamicTypeSize']) => void;
}

const defaultSettings: AppSettings = {
  biometricEnabled: false,
  autoLockTimeout: 300, // 5 minutes
  lockOnBackground: true,
  hidePasswordByDefault: true,
  clearClipboardTimeout: 60, // 1 minute
  theme: 'auto',
  hapticFeedback: true,
  showPasswordStrength: true,
  requireMasterPassword: true,
  exportFormat: 'json',
  notificationsEnabled: true,
  dynamicTypeSize: 'md',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,

      updateSettings: (updates) => {
        set((state) => ({...state, ...updates}));
      },

      resetSettings: () => {
        set(defaultSettings);
      },

      toggleBiometric: () => {
        set((state) => ({biometricEnabled: !state.biometricEnabled}));
      },

      setTheme: (theme) => {
        set({theme});
      },

      setAutoLockTimeout: (timeout) => {
        set({autoLockTimeout: timeout});
      },

      setDynamicTypeSize: (size) => {
        set({dynamicTypeSize: size});
      },
    }),
    {
      name: 'password-vault-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
