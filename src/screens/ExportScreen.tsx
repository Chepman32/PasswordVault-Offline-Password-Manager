/**
 * ExportScreen - Export vault data in various formats
 */

import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, Alert} from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {useVaultStore} from '@/store/vaultStore';
import {useTheme} from '@/hooks/useTheme';
import {Button} from '@/components/ui/Button';
import {ExportFormat} from '@/types';

export const ExportScreen: React.FC = () => {
  const theme = useTheme();
  const entries = useVaultStore((state) => state.entries);
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async (format: ExportFormat) => {
    setIsExporting(true);

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'json':
          content = JSON.stringify(entries, null, 2);
          filename = `passwordvault_export_${Date.now()}.json`;
          mimeType = 'application/json';
          break;

        case 'csv':
          content = convertToCSV(entries);
          filename = `passwordvault_export_${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;

        case 'markdown':
          content = convertToMarkdown(entries);
          filename = `passwordvault_export_${Date.now()}.md`;
          mimeType = 'text/markdown';
          break;

        case 'pdf':
          // PDF generation would require a library like react-native-pdf-lib
          Alert.alert('PDF Export', 'PDF export coming soon');
          setIsExporting(false);
          return;

        default:
          throw new Error('Unsupported format');
      }

      const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
      await RNFS.writeFile(path, content, 'utf8');

      await Share.open({
        url: `file://${path}`,
        type: mimeType,
        title: 'Export PasswordVault Data',
      });

      Alert.alert('Success', 'Data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Text style={[theme.typography.largeTitle, {color: theme.colors.text}]}>
          Export Data
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.warning, {backgroundColor: theme.colors.warningLight}]}>
          <Text style={[theme.typography.footnote, {color: theme.colors.text}]}>
            ⚠️ Exported files contain sensitive data. Handle with care and delete after use.
          </Text>
        </View>

        <Text style={[theme.typography.body, {color: theme.colors.textSecondary, marginBottom: 24}]}>
          Select a format to export your password vault:
        </Text>

        <Button
          title="Export as JSON"
          onPress={() => exportData('json')}
          variant="primary"
          fullWidth
          loading={isExporting}
          style={{marginBottom: 12}}
        />

        <Button
          title="Export as CSV"
          onPress={() => exportData('csv')}
          variant="secondary"
          fullWidth
          loading={isExporting}
          style={{marginBottom: 12}}
        />

        <Button
          title="Export as Markdown"
          onPress={() => exportData('markdown')}
          variant="secondary"
          fullWidth
          loading={isExporting}
          style={{marginBottom: 12}}
        />

        <Button
          title="Export as PDF"
          onPress={() => exportData('pdf')}
          variant="secondary"
          fullWidth
          loading={isExporting}
          disabled
        />

        <View style={styles.info}>
          <Text style={[theme.typography.caption1, {color: theme.colors.textTertiary}]}>
            Total entries: {entries.length}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function convertToCSV(entries: any[]): string {
  const headers = ['Title', 'Username', 'Password', 'URL', 'Category', 'Notes'];
  const rows = entries.map((entry) => [
    entry.title,
    entry.username,
    entry.password,
    entry.url || '',
    entry.category,
    entry.notes || '',
  ]);

  return [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');
}

function convertToMarkdown(entries: any[]): string {
  return `# PasswordVault Export\n\nExported: ${new Date().toISOString()}\n\n${entries
    .map(
      (entry) =>
        `## ${entry.title}\n\n- **Username:** ${entry.username}\n- **Password:** ${entry.password}\n- **URL:** ${entry.url || 'N/A'}\n- **Category:** ${entry.category}\n- **Notes:** ${entry.notes || 'N/A'}\n`
    )
    .join('\n---\n\n')}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  content: {
    padding: 24,
  },
  warning: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  info: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
});
