/**
 * Typography system for PasswordVault
 * Using SF Pro Display/Text with dynamic type scaling
 */

import {Platform, TextStyle} from 'react-native';

const fontFamily = {
  regular: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'SF Pro Display',
    android: 'Roboto-Bold',
    default: 'System',
  }),
};

export const typography = {
  // Large titles (for main screens)
  largeTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0.37,
  },

  // Title styles
  title1: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0.36,
  },
  title2: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0.35,
  },
  title3: {
    fontFamily: fontFamily.semibold,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.38,
  },

  // Headlines
  headline: {
    fontFamily: fontFamily.semibold,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.41,
  },

  // Body text
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: -0.41,
  },
  bodyEmphasized: {
    fontFamily: fontFamily.semibold,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.41,
  },

  // Callout
  callout: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: -0.32,
  },

  // Subhead
  subhead: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: -0.24,
  },
  subheadEmphasized: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.24,
  },

  // Footnote
  footnote: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: -0.08,
  },
  footnoteEmphasized: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.08,
  },

  // Caption
  caption1: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  caption2: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0.07,
  },
};

// Dynamic type scaling multipliers (for accessibility)
export const dynamicTypeMultipliers = {
  xs: 0.85,
  sm: 0.92,
  md: 1.0, // Default
  lg: 1.15,
  xl: 1.3,
  xxl: 1.5,
  xxxl: 1.75,
};

export type TypographyKey = keyof typeof typography;
export type DynamicTypeSize = keyof typeof dynamicTypeMultipliers;
