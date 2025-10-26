/**
 * Component 1.1 - Reusable UI Component
 * Purpose: Base building block with gesture-first UX
 * Gestures: longPress, scroll, tap, longPress
 * Animations: onFocusTransition, onPressScaleSpring, onDismissSwipe, onRevealFling
 */

import React from 'react';
import {View, StyleSheet, Pressable, AccessibilityRole} from 'react-native';
import Animated from 'react-native-reanimated';
import {Canvas, RoundedRect, Shadow, LinearGradient, vec} from '@shopify/react-native-skia';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {usePressScaleSpring, useFocusTransition} from '@/hooks/useAnimations';
import {useTheme} from '@/hooks/useTheme';

interface Component1_1Props {
  prop1: string; // color
  prop2: string; // icon
  prop3: string; // imageUri
  prop4: string; // color
  prop5: number;
  prop6: string; // color
  prop7: number; // length
  prop8: string;
  onTap?: () => void;
  onLongPress?: () => void;
  children?: React.ReactNode;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
}

export const Component1_1: React.FC<Component1_1Props> = ({
  prop1,
  prop2,
  prop3,
  prop4,
  prop5,
  prop6,
  prop7,
  prop8,
  onTap,
  onLongPress,
  children,
  accessible = true,
  accessibilityLabel = 'Interactive component',
  accessibilityRole = 'button',
}) => {
  const theme = useTheme();
  const {animatedStyle, onPressIn, onPressOut} = usePressScaleSpring();
  const {animatedStyle: focusStyle, onFocus, onBlur} = useFocusTransition();

  // Gesture handlers
  const tap = Gesture.Tap().onEnd(() => {
    onTap?.();
  });

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      onLongPress?.();
    });

  const composed = Gesture.Exclusive(longPressGesture, tap);

  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        style={[styles.container, animatedStyle, focusStyle]}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
      >
        <Canvas style={styles.canvas}>
          <RoundedRect
            x={0}
            y={0}
            width={200}
            height={prop7 || 80}
            r={theme.borderRadius.md}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, prop7 || 80)}
              colors={[prop1, prop4]}
            />
            <Shadow dx={0} dy={4} blur={8} color="rgba(0,0,0,0.2)" />
          </RoundedRect>
        </Canvas>
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 8,
  },
  canvas: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
});
