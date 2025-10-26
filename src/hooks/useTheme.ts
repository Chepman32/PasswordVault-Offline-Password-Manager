/**
 * useTheme hook - provides theme context and utilities
 */

import {useColorScheme} from 'react-native';
import {useSettingsStore} from '@/store/settingsStore';
import {lightTheme, darkTheme, Theme} from '@/theme';

export function useTheme(): Theme {
  const systemColorScheme = useColorScheme();
  const themePreference = useSettingsStore((state) => state.theme);

  // Determine effective color scheme
  const effectiveScheme =
    themePreference === 'auto'
      ? systemColorScheme || 'light'
      : themePreference;

  return effectiveScheme === 'dark' ? darkTheme : lightTheme;
}

export function useColors() {
  const theme = useTheme();
  return theme.colors;
}

export function useSpacing() {
  const theme = useTheme();
  return theme.spacing;
}

export function useBorderRadius() {
  const theme = useTheme();
  return theme.borderRadius;
}

export function useShadows() {
  const theme = useTheme();
  return theme.shadows;
}

export function useTypography() {
  const theme = useTheme();
  const dynamicTypeSize = useSettingsStore((state) => state.dynamicTypeSize);

  // Apply dynamic type scaling
  const multiplier = {
    xs: 0.85,
    sm: 0.92,
    md: 1.0,
    lg: 1.15,
    xl: 1.3,
    xxl: 1.5,
    xxxl: 1.75,
  }[dynamicTypeSize];

  return Object.fromEntries(
    Object.entries(theme.typography).map(([key, style]) => [
      key,
      {
        ...style,
        fontSize: style.fontSize * multiplier,
        lineHeight: style.lineHeight * multiplier,
      },
    ])
  ) as typeof theme.typography;
}
