/**
 * GeneratorScreen - Password generator with customizable options
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Clipboard, Switch} from 'react-native';
import Slider from '@react-native-community/slider';
import {useGeneratorStore} from '@/store/generatorStore';
import {useTheme} from '@/hooks/useTheme';
import {Button} from '@/components/ui/Button';

export const GeneratorScreen: React.FC = () => {
  const theme = useTheme();

  const generatedPassword = useGeneratorStore((state) => state.generatedPassword);
  const length = useGeneratorStore((state) => state.length);
  const useUppercase = useGeneratorStore((state) => state.useUppercase);
  const useLowercase = useGeneratorStore((state) => state.useLowercase);
  const useNumbers = useGeneratorStore((state) => state.useNumbers);
  const useSymbols = useGeneratorStore((state) => state.useSymbols);
  const excludeSimilar = useGeneratorStore((state) => state.excludeSimilar);
  const excludeAmbiguous = useGeneratorStore((state) => state.excludeAmbiguous);

  const updateSettings = useGeneratorStore((state) => state.updateSettings);
  const generatePassword = useGeneratorStore((state) => state.generatePassword);
  const copyToHistory = useGeneratorStore((state) => state.copyToHistory);

  useEffect(() => {
    generatePassword();
  }, []);

  const handleCopy = () => {
    if (generatedPassword) {
      Clipboard.setString(generatedPassword);
      copyToHistory(generatedPassword);
      // Show toast notification in production
      console.log('Password copied!');
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[theme.typography.largeTitle, {color: theme.colors.text, marginBottom: 24}]}>
          Password Generator
        </Text>

        <View style={[styles.passwordDisplay, {backgroundColor: theme.colors.input}]}>
          <Text
            style={[theme.typography.title3, {color: theme.colors.text, fontFamily: 'monospace'}]}
            selectable
          >
            {generatedPassword || 'Generating...'}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Generate New"
            onPress={generatePassword}
            variant="primary"
            fullWidth
          />
          <Button
            title="Copy"
            onPress={handleCopy}
            variant="secondary"
            fullWidth
            style={{marginTop: 12}}
          />
        </View>

        <View style={styles.settings}>
          <Text style={[theme.typography.headline, {color: theme.colors.text, marginBottom: 16}]}>
            Settings
          </Text>

          <View style={styles.setting}>
            <Text style={[theme.typography.body, {color: theme.colors.text}]}>
              Length: {length}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={8}
              maximumValue={64}
              step={1}
              value={length}
              onValueChange={(value) => updateSettings({length: value})}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
            />
          </View>

          <View style={styles.toggle}>
            <Text style={[theme.typography.body, {color: theme.colors.text}]}>
              Uppercase (A-Z)
            </Text>
            <Switch
              value={useUppercase}
              onValueChange={(value) => updateSettings({useUppercase: value})}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
            />
          </View>

          <View style={styles.toggle}>
            <Text style={[theme.typography.body, {color: theme.colors.text}]}>
              Lowercase (a-z)
            </Text>
            <Switch
              value={useLowercase}
              onValueChange={(value) => updateSettings({useLowercase: value})}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
            />
          </View>

          <View style={styles.toggle}>
            <Text style={[theme.typography.body, {color: theme.colors.text}]}>
              Numbers (0-9)
            </Text>
            <Switch
              value={useNumbers}
              onValueChange={(value) => updateSettings({useNumbers: value})}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
            />
          </View>

          <View style={styles.toggle}>
            <Text style={[theme.typography.body, {color: theme.colors.text}]}>
              Symbols (!@#$%)
            </Text>
            <Switch
              value={useSymbols}
              onValueChange={(value) => updateSettings({useSymbols: value})}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
            />
          </View>

          <View style={styles.toggle}>
            <Text style={[theme.typography.body, {color: theme.colors.text}]}>
              Exclude Similar (i, l, 1, L, o, 0, O)
            </Text>
            <Switch
              value={excludeSimilar}
              onValueChange={(value) => updateSettings({excludeSimilar: value})}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
            />
          </View>

          <View style={styles.toggle}>
            <Text style={[theme.typography.body, {color: theme.colors.text}]}>
              Exclude Ambiguous ({`{ } [ ] ( ) / \\ ' " ~`})
            </Text>
            <Switch
              value={excludeAmbiguous}
              onValueChange={(value) => updateSettings({excludeAmbiguous: value})}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  passwordDisplay: {
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    marginBottom: 32,
  },
  settings: {
    marginTop: 8,
  },
  setting: {
    marginBottom: 24,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
});
