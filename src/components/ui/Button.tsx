/**
 * Button Component - Production-ready button with gesture handling
 * Implements press spring animation and haptic feedback
 */

import React from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {usePressScaleSpring} from '@/hooks/useAnimations';
import {useTheme} from '@/hooks/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: boolean;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
  hapticFeedback = true,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const {animatedStyle, onPressIn, onPressOut} = usePressScaleSpring();

  const handlePress = () => {
    if (disabled || loading) return;

    if (hapticFeedback) {
      ReactNativeHapticFeedback.trigger('impactLight');
    }

    onPress();
  };

  const tap = Gesture.Tap()
    .onBegin(onPressIn)
    .onFinalize(onPressOut)
    .onEnd(handlePress);

  const buttonStyles = [
    styles.base,
    styles[size],
    styles[variant],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    {
      backgroundColor: getBackgroundColor(variant, theme, disabled),
      borderColor: getBorderColor(variant, theme),
    },
    style,
  ];

  const textStyles = [
    theme.typography.body,
    styles[`${size}Text`],
    {color: getTextColor(variant, theme, disabled)},
    textStyle,
  ];

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[buttonStyles, animatedStyle]}
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityState={{disabled, busy: loading}}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor(variant, theme, disabled)} />
        ) : (
          <>
            {icon && <>{icon}</>}
            <Text style={textStyles}>{title}</Text>
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

function getBackgroundColor(variant: ButtonVariant, theme: any, disabled: boolean) {
  if (disabled) return theme.colors.backgroundTertiary;

  switch (variant) {
    case 'primary':
      return theme.colors.primary;
    case 'secondary':
      return theme.colors.backgroundSecondary;
    case 'outline':
    case 'ghost':
      return 'transparent';
    case 'danger':
      return theme.colors.error;
    default:
      return theme.colors.primary;
  }
}

function getBorderColor(variant: ButtonVariant, theme: any) {
  return variant === 'outline' ? theme.colors.border : 'transparent';
}

function getTextColor(variant: ButtonVariant, theme: any, disabled: boolean) {
  if (disabled) return theme.colors.textTertiary;

  switch (variant) {
    case 'primary':
    case 'danger':
      return theme.colors.textInverse;
    case 'secondary':
    case 'outline':
    case 'ghost':
      return theme.colors.text;
    default:
      return theme.colors.textInverse;
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  small: {
    height: 36,
    paddingHorizontal: 16,
  },
  medium: {
    height: 48,
    paddingHorizontal: 24,
  },
  large: {
    height: 56,
    paddingHorizontal: 32,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primary: {},
  secondary: {},
  outline: {},
  ghost: {},
  danger: {},
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
