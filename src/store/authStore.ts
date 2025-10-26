/**
 * Authentication store - manages app lock state and biometric authentication
 */

import {create} from 'zustand';

interface AuthState {
  isLocked: boolean;
  isAuthenticated: boolean;
  lastActiveTime: number;
  failedAttempts: number;
  isSetupComplete: boolean;

  // Actions
  unlock: () => void;
  lock: () => void;
  authenticate: (success: boolean) => void;
  updateLastActiveTime: () => void;
  resetFailedAttempts: () => void;
  completeSetup: () => void;
  checkAutoLock: (timeout: number) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLocked: true,
  isAuthenticated: false,
  lastActiveTime: Date.now(),
  failedAttempts: 0,
  isSetupComplete: false,

  unlock: () => {
    set({
      isLocked: false,
      isAuthenticated: true,
      failedAttempts: 0,
      lastActiveTime: Date.now(),
    });
  },

  lock: () => {
    set({
      isLocked: true,
      isAuthenticated: false,
      lastActiveTime: Date.now(),
    });
  },

  authenticate: (success) => {
    if (success) {
      get().unlock();
    } else {
      set((state) => ({
        failedAttempts: state.failedAttempts + 1,
      }));
    }
  },

  updateLastActiveTime: () => {
    set({lastActiveTime: Date.now()});
  },

  resetFailedAttempts: () => {
    set({failedAttempts: 0});
  },

  completeSetup: () => {
    set({isSetupComplete: true});
  },

  checkAutoLock: (timeout) => {
    const now = Date.now();
    const {lastActiveTime, isAuthenticated} = get();
    const timeSinceActive = (now - lastActiveTime) / 1000; // Convert to seconds

    if (isAuthenticated && timeSinceActive >= timeout) {
      get().lock();
    }
  },
}));
