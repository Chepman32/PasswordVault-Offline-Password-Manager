/**
 * Main theme export file
 * Combines all theme tokens and provides theme context
 */

import {ColorTokens, ColorScheme, ColorKey} from './colors';
import {typography, TypographyKey, dynamicTypeMultipliers, DynamicTypeSize} from './typography';
import {spacing, borderRadius, shadows, layout} from './spacing';

export interface Theme {
  colors: typeof ColorTokens.light;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  layout: typeof layout;
  colorScheme: ColorScheme;
}

export const lightTheme: Theme = {
  colors: ColorTokens.light,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  colorScheme: 'light',
};

export const darkTheme: Theme = {
  colors: ColorTokens.dark,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  colorScheme: 'dark',
};

// Export all sub-modules
export {ColorTokens, ColorScheme, ColorKey};
export {typography, TypographyKey, dynamicTypeMultipliers, DynamicTypeSize};
export {spacing, borderRadius, shadows, layout};
export type {SpacingKey, BorderRadiusKey, ShadowKey} from './spacing';
