/**
 * VaultEditorScreen - Create or edit password entries
 */

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useVaultStore} from '@/store/vaultStore';
import {useTheme} from '@/hooks/useTheme';
import {RootStackParamList, PasswordCategory, PasswordStrength} from '@/types';
import {Button} from '@/components/ui/Button';
import {analyzePasswordStrength} from '@/utils/passwordStrength';

type RouteParams = RouteProp<RootStackParamList, 'VaultEditor'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VaultEditor'>;

export const VaultEditorScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteParams>();
  const navigation = useNavigation<NavigationProp>();

  const {entryId} = route.params;
  const existingEntry = entryId ? useVaultStore((state) => state.getEntry(entryId)) : null;
  const addEntry = useVaultStore((state) => state.addEntry);
  const updateEntry = useVaultStore((state) => state.updateEntry);

  const [title, setTitle] = useState(existingEntry?.title || '');
  const [username, setUsername] = useState(existingEntry?.username || '');
  const [password, setPassword] = useState(existingEntry?.password || '');
  const [url, setUrl] = useState(existingEntry?.url || '');
  const [notes, setNotes] = useState(existingEntry?.notes || '');
  const [category, setCategory] = useState<PasswordCategory>(existingEntry?.category || PasswordCategory.Login);

  const handleSave = () => {
    const passwordAnalysis = analyzePasswordStrength(password);

    if (entryId) {
      updateEntry(entryId, {
        title,
        username,
        password,
        url,
        notes,
        category,
        strength: passwordAnalysis.strength,
      });
    } else {
      addEntry({
        title,
        username,
        password,
        url,
        notes,
        category,
        isFavorite: false,
        tags: [],
        customFields: [],
        strength: passwordAnalysis.strength,
      });
    }

    navigation.goBack();
  };

  const handleGeneratePassword = () => {
    navigation.navigate('Generator');
  };

  const isValid = title.trim() && username.trim() && password.trim();

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{fontSize: 20, color: theme.colors.primary}}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[theme.typography.headline, {color: theme.colors.text}]}>
          {entryId ? 'Edit Entry' : 'New Entry'}
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={!isValid}>
          <Text style={{fontSize: 20, color: isValid ? theme.colors.primary : theme.colors.textTertiary}}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.field}>
          <Text style={[theme.typography.footnote, {color: theme.colors.textTertiary, marginBottom: 4}]}>
            Title *
          </Text>
          <TextInput
            style={[styles.input, theme.typography.body, {backgroundColor: theme.colors.input, color: theme.colors.text}]}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Gmail Account"
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={[theme.typography.footnote, {color: theme.colors.textTertiary, marginBottom: 4}]}>
            Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.values(PasswordCategory).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: category === cat ? theme.colors.primary : theme.colors.backgroundSecondary,
                  },
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    theme.typography.caption1,
                    {color: category === cat ? theme.colors.textInverse : theme.colors.text},
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.field}>
          <Text style={[theme.typography.footnote, {color: theme.colors.textTertiary, marginBottom: 4}]}>
            Username *
          </Text>
          <TextInput
            style={[styles.input, theme.typography.body, {backgroundColor: theme.colors.input, color: theme.colors.text}]}
            value={username}
            onChangeText={setUsername}
            placeholder="e.g., user@example.com"
            placeholderTextColor={theme.colors.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={[theme.typography.footnote, {color: theme.colors.textTertiary, marginBottom: 4}]}>
            Password *
          </Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, theme.typography.body, {flex: 1, backgroundColor: theme.colors.input, color: theme.colors.text}]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor={theme.colors.textTertiary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.generateButton} onPress={handleGeneratePassword}>
              <Text style={{fontSize: 20}}>🔑</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[theme.typography.footnote, {color: theme.colors.textTertiary, marginBottom: 4}]}>
            URL
          </Text>
          <TextInput
            style={[styles.input, theme.typography.body, {backgroundColor: theme.colors.input, color: theme.colors.text}]}
            value={url}
            onChangeText={setUrl}
            placeholder="e.g., https://gmail.com"
            placeholderTextColor={theme.colors.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </View>

        <View style={styles.field}>
          <Text style={[theme.typography.footnote, {color: theme.colors.textTertiary, marginBottom: 4}]}>
            Notes
          </Text>
          <TextInput
            style={[styles.input, styles.textArea, theme.typography.body, {backgroundColor: theme.colors.input, color: theme.colors.text}]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional notes..."
            placeholderTextColor={theme.colors.textTertiary}
            multiline
            numberOfLines={4}
          />
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  field: {
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  generateButton: {
    marginLeft: 12,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
