/**
 * Spacing system based on 8pt grid
 * All values are multiples of 8 for consistency
 */

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  huge: 64,
  massive: 96,
};

/**
 * Border radius values for consistent rounded corners
 */
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999, // Fully rounded (pill shape)
};

/**
 * Shadow elevations (based on Material Design)
 */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.20,
    shadowRadius: 3.84,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.22,
    shadowRadius: 5.46,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.23,
    shadowRadius: 8.30,
    elevation: 8,
  },
  xxl: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.25,
    shadowRadius: 16.00,
    elevation: 12,
  },
};

/**
 * Common layout constants
 */
export const layout = {
  // Hit slop for touchable elements (minimum 44x44 touch target)
  minTouchTarget: 44,

  // Screen padding
  screenPaddingHorizontal: spacing.md,
  screenPaddingVertical: spacing.lg,

  // Card dimensions
  cardMinHeight: 80,
  cardMaxWidth: 400,

  // Input heights
  inputHeight: 48,
  inputHeightSmall: 40,
  inputHeightLarge: 56,

  // Bottom tab bar
  tabBarHeight: 83,

  // Header
  headerHeight: 44,
};

export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
export type ShadowKey = keyof typeof shadows;
