/**
 * FavoritesScreen - Shows favorite password entries
 */

import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useVaultStore, vaultSelectors} from '@/store/vaultStore';
import {useTheme} from '@/hooks/useTheme';
import {PasswordCard} from '@/components/ui/Password Card';

export const FavoritesScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const entries = useVaultStore((state) => state.entries);
  const favorites = vaultSelectors.getFavorites({entries} as any);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Text style={[theme.typography.largeTitle, {color: theme.colors.text}]}>
          Favorites
        </Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <PasswordCard
            entry={item}
            onPress={() => navigation.navigate('VaultDetail' as any, {entryId: item.id})}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[theme.typography.headline, {color: theme.colors.textSecondary, textAlign: 'center'}]}>
              No favorites yet
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
});
