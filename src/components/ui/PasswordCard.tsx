/**
 * PasswordCard - Displays a password entry in list view
 * Features: Swipe actions, long press, favorite toggle
 */

import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import Animated from 'react-native-reanimated';
import {Canvas, RoundedRect, Shadow, LinearGradient, vec} from '@shopify/react-native-skia';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {usePressScaleSpring, useDismissSwipe} from '@/hooks/useAnimations';
import {useTheme} from '@/hooks/useTheme';
import {PasswordEntry, PasswordCategory} from '@/types';
import {getStrengthColor} from '@/utils/passwordStrength';

interface PasswordCardProps {
  entry: PasswordEntry;
  onPress: () => void;
  onLongPress?: () => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
  showCategory?: boolean;
}

export const PasswordCard: React.FC<PasswordCardProps> = ({
  entry,
  onPress,
  onLongPress,
  onDelete,
  onToggleFavorite,
  showCategory = true,
}) => {
  const theme = useTheme();
  const {animatedStyle, onPressIn, onPressOut} = usePressScaleSpring();
  const {animatedStyle: swipeStyle, translateX} = useDismissSwipe();
  const [revealed, setRevealed] = useState(false);

  const tap = Gesture.Tap()
    .onBegin(onPressIn)
    .onFinalize(onPressOut)
    .onEnd(onPress);

  const longPress = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => onLongPress?.());

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > 100) {
        onDelete?.();
      } else {
        translateX.value = 0;
      }
    });

  const composed = Gesture.Exclusive(longPress, tap);

  const categoryColor = getCategoryColor(entry.category, theme);
  const strengthColor = entry.strength
    ? getStrengthColor(entry.strength, theme.colorScheme === 'dark')
    : theme.colors.textTertiary;

  return (
    <GestureDetector gesture={Gesture.Race(pan, composed)}>
      <Animated.View style={[styles.container, animatedStyle, swipeStyle]}>
        <Canvas style={styles.canvas}>
          <RoundedRect x={0} y={0} width={400} height={88} r={theme.borderRadius.md}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(400, 0)}
              colors={[theme.colors.card, theme.colors.backgroundSecondary]}
            />
            <Shadow dx={0} dy={2} blur={8} color={theme.colors.cardShadow} />
          </RoundedRect>
        </Canvas>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.categoryIndicator, {backgroundColor: categoryColor}]} />
            <View style={styles.titleContainer}>
              <Text style={[theme.typography.headline, {color: theme.colors.text}]} numberOfLines={1}>
                {entry.title}
              </Text>
              <Text style={[theme.typography.subhead, {color: theme.colors.textSecondary}]} numberOfLines={1}>
                {entry.username}
              </Text>
            </View>
            {entry.isFavorite && (
              <Text style={styles.favoriteIcon}>⭐</Text>
            )}
          </View>

          {showCategory && (
            <View style={styles.footer}>
              <Text style={[theme.typography.caption1, {color: theme.colors.textTertiary}]}>
                {entry.category}
              </Text>
              {entry.strength && (
                <View style={[styles.strengthBadge, {backgroundColor: strengthColor}]}>
                  <Text style={[theme.typography.caption2, {color: '#FFF'}]}>
                    {entry.strength}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

function getCategoryColor(category: PasswordCategory, theme: any): string {
  const colors: Record<PasswordCategory, string> = {
    [PasswordCategory.Login]: theme.colors.category1,
    [PasswordCategory.CreditCard]: theme.colors.category2,
    [PasswordCategory.SecureNote]: theme.colors.category3,
    [PasswordCategory.BankAccount]: theme.colors.category4,
    [PasswordCategory.Identity]: theme.colors.category5,
    [PasswordCategory.Software]: theme.colors.category6,
    [PasswordCategory.WiFi]: theme.colors.category7,
    [PasswordCategory.Custom]: theme.colors.category8,
  };
  return colors[category] || theme.colors.primary;
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    height: 88,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  favoriteIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
