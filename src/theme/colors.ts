/**
 * Color tokens for PasswordVault
 * Supports light and dark modes with semantic colors
 */

export const ColorTokens = {
  light: {
    // Primary brand colors
    primary: '#007AFF',
    primaryDark: '#0051D5',
    primaryLight: '#4DA3FF',

    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F2F2F7',
    backgroundTertiary: '#E5E5EA',

    // Surface colors
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceOverlay: 'rgba(0, 0, 0, 0.4)',

    // Text colors
    text: '#000000',
    textSecondary: '#3C3C43',
    textTertiary: '#8E8E93',
    textInverse: '#FFFFFF',

    // Semantic colors
    success: '#34C759',
    successLight: '#A8E6B7',
    warning: '#FF9500',
    warningLight: '#FFCC80',
    error: '#FF3B30',
    errorLight: '#FF8A80',
    info: '#5AC8FA',
    infoLight: '#B3E5FC',

    // Border colors
    border: '#C6C6C8',
    borderSecondary: '#E5E5EA',

    // Component specific
    card: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
    input: '#F2F2F7',
    inputBorder: '#C6C6C8',
    inputFocused: '#007AFF',

    // Password strength colors
    strengthWeak: '#FF3B30',
    strengthMedium: '#FF9500',
    strengthStrong: '#34C759',
    strengthVeryStrong: '#00C7BE',

    // Category colors
    category1: '#FF3B30',
    category2: '#FF9500',
    category3: '#FFCC00',
    category4: '#34C759',
    category5: '#5AC8FA',
    category6: '#007AFF',
    category7: '#5856D6',
    category8: '#AF52DE',
  },
  dark: {
    // Primary brand colors
    primary: '#0A84FF',
    primaryDark: '#409CFF',
    primaryLight: '#007AFF',

    // Background colors
    background: '#000000',
    backgroundSecondary: '#1C1C1E',
    backgroundTertiary: '#2C2C2E',

    // Surface colors
    surface: '#1C1C1E',
    surfaceElevated: '#2C2C2E',
    surfaceOverlay: 'rgba(0, 0, 0, 0.7)',

    // Text colors
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textTertiary: '#8E8E93',
    textInverse: '#000000',

    // Semantic colors
    success: '#32D74B',
    successLight: '#48DB5C',
    warning: '#FF9F0A',
    warningLight: '#FFB340',
    error: '#FF453A',
    errorLight: '#FF6961',
    info: '#64D2FF',
    infoLight: '#8AE0FF',

    // Border colors
    border: '#38383A',
    borderSecondary: '#48484A',

    // Component specific
    card: '#1C1C1E',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    input: '#2C2C2E',
    inputBorder: '#38383A',
    inputFocused: '#0A84FF',

    // Password strength colors
    strengthWeak: '#FF453A',
    strengthMedium: '#FF9F0A',
    strengthStrong: '#32D74B',
    strengthVeryStrong: '#30D158',

    // Category colors
    category1: '#FF453A',
    category2: '#FF9F0A',
    category3: '#FFD60A',
    category4: '#32D74B',
    category5: '#64D2FF',
    category6: '#0A84FF',
    category7: '#5E5CE6',
    category8: '#BF5AF2',
  },
};

export type ColorScheme = 'light' | 'dark';
export type ColorKey = keyof typeof ColorTokens.light;
