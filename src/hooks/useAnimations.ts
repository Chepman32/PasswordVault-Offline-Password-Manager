/**
 * Animation hooks using Reanimated 3
 * Implements the motion specifications from the SDD
 */

import {useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing} from 'react-native-reanimated';
import {useCallback} from 'react';

interface SpringConfig {
  stiffness: number;
  damping: number;
}

interface TimingConfig {
  duration: number;
  easing: typeof Easing.out;
}

const DEFAULT_SPRING: SpringConfig = {
  stiffness: 240,
  damping: 18,
};

const DEFAULT_TIMING: TimingConfig = {
  duration: 260,
  easing: Easing.out(Easing.cubic),
};

/**
 * Hook for press scale spring animation (Motion 1-1 through 1-10)
 * Animates scale, translateY, and opacity on press
 */
export function usePressScaleSpring() {
  const t = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: 1 + 0.06 * t.value},
      {translateY: -8 * t.value},
    ],
    opacity: 0.75 + 0.25 * t.value,
  }));

  const onPressIn = useCallback(() => {
    t.value = withSpring(1, DEFAULT_SPRING);
  }, [t]);

  const onPressOut = useCallback(() => {
    t.value = withTiming(0, DEFAULT_TIMING);
  }, [t]);

  return {animatedStyle, onPressIn, onPressOut};
}

/**
 * Hook for focus transition animation
 * Smooth border and shadow transitions on focus
 */
export function useFocusTransition() {
  const focused = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    borderWidth: 1 + focused.value,
    shadowOpacity: 0.1 + 0.15 * focused.value,
    shadowRadius: 4 + 8 * focused.value,
  }));

  const onFocus = useCallback(() => {
    focused.value = withSpring(1, {stiffness: 200, damping: 16});
  }, [focused]);

  const onBlur = useCallback(() => {
    focused.value = withTiming(0, {duration: 200, easing: Easing.out(Easing.ease)});
  }, [focused]);

  return {animatedStyle, onFocus, onBlur};
}

/**
 * Hook for dismiss swipe animation
 * Handles swipe-to-dismiss gesture with physics
 */
export function useDismissSwipe() {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
    opacity: opacity.value,
  }));

  const dismiss = useCallback(() => {
    translateX.value = withTiming(400, {duration: 300, easing: Easing.out(Easing.cubic)});
    opacity.value = withTiming(0, {duration: 300});
  }, [translateX, opacity]);

  const reset = useCallback(() => {
    translateX.value = withSpring(0, DEFAULT_SPRING);
    opacity.value = withTiming(1, {duration: 200});
  }, [translateX, opacity]);

  return {animatedStyle, dismiss, reset, translateX, opacity};
}

/**
 * Hook for reveal fling animation
 * Quick reveal animation with overshoot
 */
export function useRevealFling() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  const reveal = useCallback(() => {
    scale.value = withSpring(1, {stiffness: 300, damping: 20});
    opacity.value = withTiming(1, {duration: 200});
  }, [scale, opacity]);

  const hide = useCallback(() => {
    scale.value = withTiming(0, {duration: 150, easing: Easing.in(Easing.cubic)});
    opacity.value = withTiming(0, {duration: 150});
  }, [scale, opacity]);

  return {animatedStyle, reveal, hide};
}

/**
 * Hook for card morph animation
 * Expands a card with smooth transitions
 */
export function useCardMorph() {
  const height = useSharedValue(80);
  const borderRadius = useSharedValue(12);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    borderRadius: borderRadius.value,
  }));

  const expand = useCallback((targetHeight: number) => {
    height.value = withSpring(targetHeight, {stiffness: 220, damping: 20});
    borderRadius.value = withSpring(20, {stiffness: 220, damping: 20});
  }, [height, borderRadius]);

  const collapse = useCallback(() => {
    height.value = withSpring(80, {stiffness: 220, damping: 20});
    borderRadius.value = withSpring(12, {stiffness: 220, damping: 20});
  }, [height, borderRadius]);

  return {animatedStyle, expand, collapse};
}

/**
 * Hook for parallax scrolling effect
 * Creates depth illusion during scroll
 */
export function useParallax(multiplier: number = 0.5) {
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value * multiplier}],
  }));

  return {animatedStyle, translateY};
}

/**
 * Hook for fade in animation
 * Simple fade in with optional delay
 */
export function useFadeIn(delay: number = 0) {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const fadeIn = useCallback(() => {
    if (delay > 0) {
      setTimeout(() => {
        opacity.value = withTiming(1, {duration: 300, easing: Easing.out(Easing.ease)});
      }, delay);
    } else {
      opacity.value = withTiming(1, {duration: 300, easing: Easing.out(Easing.ease)});
    }
  }, [opacity, delay]);

  return {animatedStyle, fadeIn, opacity};
}

/**
 * Hook for rotation animation
 * Smooth rotation with spring physics
 */
export function useRotation() {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  const rotate = useCallback((degrees: number) => {
    rotation.value = withSpring(degrees, {stiffness: 180, damping: 15});
  }, [rotation]);

  return {animatedStyle, rotate, rotation};
}
