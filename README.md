# PasswordVault - Offline Password Manager

> Production-ready, offline-first password manager built with React Native, featuring biometric authentication, gesture-first UX, and physics-based animations.

## Overview

PasswordVault is a fully offline, secure password manager designed for iOS with a focus on:

- **Offline-First Architecture**: All data stays on device, no cloud sync
- **Gesture-First UX**: Intuitive swipe, long-press, and gesture-based navigation
- **Physics-Based Animations**: Smooth, natural animations using Reanimated 3
- **Biometric Security**: Face ID/Touch ID with PIN fallback
- **Accessibility**: Full VoiceOver support and Dynamic Type

## Features

### Core Features
- ✅ Secure local password storage with encryption
- ✅ Biometric authentication (Face ID/Touch ID)
- ✅ Password generator with customizable options
- ✅ Password strength analysis
- ✅ Category-based organization
- ✅ Search and filter functionality
- ✅ Favorites system
- ✅ Export to JSON/CSV/Markdown/PDF

### Advanced Features
- ✅ Gesture-based navigation with custom transitions
- ✅ Physics-based animations (Reanimated 3)
- ✅ Skia-powered visual effects
- ✅ Auto-lock with customizable timeout
- ✅ Haptic feedback
- ✅ Light/Dark mode support
- ✅ Dynamic Type for accessibility

### Security Features
- ✅ AES-256 encryption
- ✅ Biometric authentication
- ✅ Auto-lock on background
- ✅ Secure clipboard management
- ✅ No network access
- ✅ Local-only data storage

## Tech Stack

### Core
- **React Native** 0.75+ with New Architecture (Fabric/TurboModules)
- **TypeScript** 5.3+
- **Node** >=18

### Navigation & Gestures
- **@react-navigation/native** - Navigation
- **react-native-gesture-handler** - Gesture handling
- **react-native-screens** - Native screen optimization

### Animations & Graphics
- **react-native-reanimated** 3.6+ - Performant animations
- **@shopify/react-native-skia** - 2D graphics and effects

### State Management & Data
- **Zustand** - Lightweight state management
- **WatermelonDB** - Offline-first database
- **@react-native-async-storage/async-storage** - Key-value storage

### Security & Utilities
- **react-native-biometrics** - Biometric authentication
- **react-native-keychain** - Secure key storage
- **react-native-crypto-js** - Cryptography
- **react-native-fs** - File system access
- **react-native-share** - Sharing functionality

## Installation

### Prerequisites

```bash
# Install Node.js (>=18)
node --version

# Install Xcode (for iOS)
# Install CocoaPods
sudo gem install cocoapods
```

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/PasswordVault-Offline-Password-Manager.git
cd PasswordVault-Offline-Password-Manager

# Install dependencies
npm install

# Install iOS pods
cd ios
pod install
cd ..
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
PasswordVault-Offline-Password-Manager/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── base/           # Base component library (1.1-1.70)
│   │   └── ui/             # Production UI components
│   ├── screens/            # Screen components
│   ├── navigation/         # Navigation configuration
│   ├── store/              # Zustand stores
│   ├── database/           # WatermelonDB models & schema
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── theme/              # Theme & design tokens
│   └── types/              # TypeScript type definitions
├── ios/                    # iOS native code
├── android/                # Android native code
├── __tests__/              # Test files
├── App.tsx                 # Root component
├── index.js               # App entry point
└── package.json           # Dependencies

```

## Development

### Running Tests

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Building for Production

### iOS

```bash
# Build release
npm run build:ios

# Or manually
cd ios
xcodebuild -workspace PasswordVault.xcworkspace \
  -scheme PasswordVault \
  -configuration Release
```

### Android

```bash
# Build release APK
npm run build:android

# Or manually
cd android
./gradlew assembleRelease
```

## Architecture

### Offline-First Data Flow

```
UI Components
    ↓
Zustand Stores
    ↓
WatermelonDB (Local SQLite)
    ↓
Encrypted Storage
```

### State Management

The app uses Zustand for state management with the following stores:

- **vaultStore** - Password entries management
- **authStore** - Authentication & lock state
- **settingsStore** - App settings & preferences
- **generatorStore** - Password generation
- **iapStore** - In-app purchases

### Database Schema

```sql
CREATE TABLE password_entries (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  url TEXT,
  notes TEXT,
  category TEXT NOT NULL,
  is_favorite BOOLEAN,
  tags TEXT,
  custom_fields TEXT,
  strength TEXT,
  created_at INTEGER,
  updated_at INTEGER,
  last_accessed_at INTEGER
);
```

## Performance

The app is optimized to meet strict performance budgets:

- **60fps animations** - All animations run on UI thread
- **<100ms interactions** - Instant feedback for user actions
- **<2s cold start** - Fast app launch
- **Lazy loading** - Components load on demand
- **Optimized list rendering** - FlatList with proper key extraction

## Accessibility

Full accessibility support including:

- VoiceOver/TalkBack support with descriptive labels
- Dynamic Type for text scaling
- Minimum 44x44pt touch targets
- High contrast mode support
- Semantic HTML roles and traits

## Security

### Data Protection

- AES-256 encryption for password storage
- Secure Enclave for cryptographic keys (iOS)
- No data leaves the device
- Auto-lock on background
- Clipboard auto-clear

### Authentication

- Face ID/Touch ID biometric authentication
- PIN fallback option
- Failed attempt tracking
- Auto-lock after inactivity

## Privacy Policy

PasswordVault is 100% offline. We do not:

- Collect any personal data
- Send data to any servers
- Use analytics or tracking
- Access the internet

All data is stored locally on your device and never leaves it unless you explicitly export it.

## Testing

### Coverage Requirements

- Unit tests: >80% coverage
- Integration tests for all stores
- E2E tests for critical flows:
  - Authentication
  - Password CRUD operations
  - Password generation
  - Export functionality

### Test Commands

```bash
# Unit tests
npm test

# Integration tests
npm test -- --testPathPattern=integration

# E2E tests
npm run test:e2e

# Coverage report
npm test -- --coverage
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting
- Follow React Native best practices

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [React Native](https://reactnative.dev/)
- Animations powered by [Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- Graphics by [React Native Skia](https://shopify.github.io/react-native-skia/)
- State management by [Zustand](https://github.com/pmndrs/zustand)
- Database by [WatermelonDB](https://nozbe.github.io/WatermelonDB/)

## Support

For issues, questions, or contributions:

- 📧 Email: support@passwordvault.app
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/PasswordVault/issues)
- 📖 Docs: [Documentation](https://docs.passwordvault.app)

## Roadmap

- [ ] Apple Watch companion app
- [ ] iPad optimization
- [ ] Password breach detection (offline)
- [ ] Custom categories
- [ ] Secure notes with Markdown
- [ ] Import from other password managers
- [ ] Automatic backups to iCloud (encrypted)

---

**Made with ❤️ by the PasswordVault Team**
