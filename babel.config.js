module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@store': './src/store',
          '@utils': './src/utils',
          '@database': './src/database',
          '@types': './src/types',
          '@theme': './src/theme',
          '@hooks': './src/hooks',
        },
      },
    ],
  ],
};
