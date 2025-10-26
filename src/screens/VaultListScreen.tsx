/**
 * VaultListScreen - Main password list with search and filtering
 * Features: Pull-to-refresh, search, category filters, floating action button
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useVaultStore, vaultSelectors} from '@/store/vaultStore';
import {useTheme} from '@/hooks/useTheme';
import {RootStackParamList, PasswordCategory} from '@/types';
import {PasswordCard} from '@/components/ui/PasswordCard';
import {Button} from '@/components/ui/Button';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const VaultListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const entries = useVaultStore((state) => state.filteredEntries);
  const searchQuery = useVaultStore((state) => state.searchQuery);
  const searchEntries = useVaultStore((state) => state.searchEntries);
  const deleteEntry = useVaultStore((state) => state.deleteEntry);
  const toggleFavorite = useVaultStore((state) => state.toggleFavorite);
  const updateLastAccessed = useVaultStore((state) => state.updateLastAccessed);
  const loadEntries = useVaultStore((state) => state.loadEntries);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PasswordCategory | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    await loadEntries();
    setIsLoading(false);
  };

  const handleEntryPress = (entryId: string) => {
    updateLastAccessed(entryId);
    navigation.navigate('VaultDetail', {entryId});
  };

  const handleAddNew = () => {
    navigation.navigate('VaultEditor', {});
  };

  const handleSearch = (text: string) => {
    searchEntries(text);
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Text style={[theme.typography.largeTitle, {color: theme.colors.text}]}>
          Vault
        </Text>
        <TouchableOpacity onPress={handleAddNew}>
          <Text style={{fontSize: 32, color: theme.colors.primary}}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, {backgroundColor: theme.colors.input}]}>
        <TextInput
          style={[theme.typography.body, styles.searchInput, {color: theme.colors.text}]}
          placeholder="Search passwords..."
          placeholderTextColor={theme.colors.textTertiary}
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.categoryFilters}>
        {Object.values(PasswordCategory).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  selectedCategory === category ? theme.colors.primary : theme.colors.backgroundSecondary,
              },
            ]}
            onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
          >
            <Text
              style={[
                theme.typography.caption1,
                {
                  color: selectedCategory === category ? theme.colors.textInverse : theme.colors.text,
                },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <PasswordCard
            entry={item}
            onPress={() => handleEntryPress(item.id)}
            onDelete={() => deleteEntry(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[theme.typography.headline, {color: theme.colors.textSecondary, textAlign: 'center'}]}>
              No passwords yet
            </Text>
            <Text style={[theme.typography.body, {color: theme.colors.textTertiary, textAlign: 'center', marginTop: 8}]}>
              Tap the + button to add your first password
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchInput: {
    height: 48,
  },
  categoryFilters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
});
