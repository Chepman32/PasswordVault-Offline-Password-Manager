/**
 * Generator store - manages password generation settings and history
 */

import {create} from 'zustand';
import {GeneratorSettings} from '@/types';

interface GeneratorState extends GeneratorSettings {
  generatedPassword: string;
  history: string[];

  // Actions
  updateSettings: (updates: Partial<GeneratorSettings>) => void;
  generatePassword: () => void;
  copyToHistory: (password: string) => void;
  clearHistory: () => void;
}

const defaultSettings: GeneratorSettings = {
  length: 16,
  useUppercase: true,
  useLowercase: true,
  useNumbers: true,
  useSymbols: true,
  excludeSimilar: false,
  excludeAmbiguous: false,
};

export const useGeneratorStore = create<GeneratorState>((set, get) => ({
  ...defaultSettings,
  generatedPassword: '',
  history: [],

  updateSettings: (updates) => {
    set((state) => ({...state, ...updates}));
    // Regenerate password with new settings
    get().generatePassword();
  },

  generatePassword: () => {
    const settings = get();
    const password = generatePasswordString(settings);
    set({generatedPassword: password});
  },

  copyToHistory: (password) => {
    set((state) => ({
      history: [password, ...state.history].slice(0, 50), // Keep last 50
    }));
  },

  clearHistory: () => {
    set({history: []});
  },
}));

// Password generation logic
function generatePasswordString(settings: GeneratorSettings): string {
  const {
    length,
    useUppercase,
    useLowercase,
    useNumbers,
    useSymbols,
    excludeSimilar,
    excludeAmbiguous,
    customSymbols,
  } = settings;

  let charset = '';

  if (useUppercase) {
    charset += excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }

  if (useLowercase) {
    charset += excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
  }

  if (useNumbers) {
    charset += excludeSimilar ? '23456789' : '0123456789';
  }

  if (useSymbols) {
    const symbols = customSymbols || '!@#$%^&*()_+-=[]{}|;:,.<>?';
    charset += excludeAmbiguous ? symbols.replace(/[{}[\]()\/\\'"~,;:.<>]/g, '') : symbols;
  }

  if (charset.length === 0) {
    charset = 'abcdefghijklmnopqrstuvwxyz0123456789'; // Fallback
  }

  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }

  // Ensure password meets requirements by replacing first characters if needed
  if (useUppercase && !/[A-Z]/.test(password)) {
    const upperChars = excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    password = upperChars[Math.floor(Math.random() * upperChars.length)] + password.slice(1);
  }

  if (useLowercase && !/[a-z]/.test(password)) {
    const lowerChars = excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    password = password.slice(0, -1) + lowerChars[Math.floor(Math.random() * lowerChars.length)];
  }

  if (useNumbers && !/[0-9]/.test(password)) {
    const numbers = excludeSimilar ? '23456789' : '0123456789';
    const pos = Math.floor(Math.random() * (password.length - 2)) + 1;
    password = password.slice(0, pos) + numbers[Math.floor(Math.random() * numbers.length)] + password.slice(pos + 1);
  }

  if (useSymbols && !/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) {
    const symbols = customSymbols || '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const cleanSymbols = excludeAmbiguous ? symbols.replace(/[{}[\]()\/\\'"~,;:.<>]/g, '') : symbols;
    const pos = Math.floor(Math.random() * (password.length - 2)) + 1;
    password = password.slice(0, pos) + cleanSymbols[Math.floor(Math.random() * cleanSymbols.length)] + password.slice(pos + 1);
  }

  return password;
}
