/**
 * VaultDetailScreen - View and edit password details
 */

import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Clipboard} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useVaultStore} from '@/store/vaultStore';
import {useTheme} from '@/hooks/useTheme';
import {RootStackParamList} from '@/types';
import {Button} from '@/components/ui/Button';
import {analyzePasswordStrength} from '@/utils/passwordStrength';

type RouteParams = RouteProp<RootStackParamList, 'VaultDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VaultDetail'>;

export const VaultDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteParams>();
  const navigation = useNavigation<NavigationProp>();

  const {entryId} = route.params;
  const entry = useVaultStore((state) => state.getEntry(entryId));
  const toggleFavorite = useVaultStore((state) => state.toggleFavorite);
  const deleteEntry = useVaultStore((state) => state.deleteEntry);

  const [showPassword, setShowPassword] = useState(false);

  if (!entry) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <Text style={[theme.typography.body, {color: theme.colors.text}]}>Entry not found</Text>
      </SafeAreaView>
    );
  }

  const passwordAnalysis = analyzePasswordStrength(entry.password);

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    // In production, show a toast notification
    console.log(`${label} copied to clipboard`);
  };

  const handleDelete = () => {
    deleteEntry(entryId);
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate('VaultEditor', {entryId});
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{fontSize: 24, color: theme.colors.primary}}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleFavorite(entryId)}>
          <Text style={{fontSize: 24}}>{entry.isFavorite ? '⭐' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={[theme.typography.largeTitle, {color: theme.colors.text, marginBottom: 8}]}>
          {entry.title}
        </Text>
        <Text style={[theme.typography.subhead, {color: theme.colors.textSecondary, marginBottom: 24}]}>
          {entry.category}
        </Text>

        <View style={styles.field}>
          <Text style={[theme.typography.footnote, {color: theme.colors.textTertiary, marginBottom: 4}]}>
            Username
          </Text>
          <View style={styles.fieldRow}>
            <Text style={[theme.typography.body, {color: theme.colors.text, flex: 1}]}>
              {entry.username}
            </Text>
            <TouchableOpacity onPress={() => copyToClipboard(entry.username, 'Username')}>
              <Text style={{fontSize: 20}}>📋</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[theme.typography.footnote, {color: theme.colors.textTertiary, marginBottom: 4}]}>
            Password
          </Text>
          <View style={styles.fieldRow}>
            <Text style={[theme.typography.body, {color: theme.colors.text, flex: 1}]}>
              {showPassword ? entry.password : '••••••••'}
            </Text>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{marginRight: 12}}>
              <Text style={{fontSize: 20}}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => copyToClipboard(entry.password, 'Password')}>
              <Text style={{fontSize: 20}}>📋</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.strengthBar, {marginTop: 8}]}>
            <View
              style={[
                styles.strengthFill,
                {
                  width: `${passwordAnalysis.score}%`,
                  backgroundColor: theme.colors.success,
                },
              ]}
            />
          </View>
          <Text style={[theme.typography.caption1, {color: theme.colors.textTertiary, marginTop: 4}]}>
            Strength: {entry.strength || 'Unknown'} ({passwordAnalysis.score}/100)
          </Text>
        </View>

        {entry.url && (
          <View style={styles.field}>
            <Text style={[theme.typography.footnote, {color: theme.colors.textTertiary, marginBottom: 4}]}>
              URL
            </Text>
            <Text style={[theme.typography.body, {color: theme.colors.primary}]}>
              {entry.url}
            </Text>
          </View>
        )}

        {entry.notes && (
          <View style={styles.field}>
            <Text style={[theme.typography.footnote, {color: theme.colors.textTertiary, marginBottom: 4}]}>
              Notes
            </Text>
            <Text style={[theme.typography.body, {color: theme.colors.text}]}>
              {entry.notes}
            </Text>
          </View>
        )}

        <View style={styles.actions}>
          <Button
            title="Edit"
            onPress={handleEdit}
            variant="primary"
            fullWidth
          />
          <Button
            title="Delete"
            onPress={handleDelete}
            variant="danger"
            fullWidth
            style={{marginTop: 12}}
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
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
  },
  actions: {
    marginTop: 32,
  },
});
