# Software Design Document (SDD)
# PasswordVault — Offline Password Manager

> **Version:** 1.0
> **Date:** October 26, 2025
> **Status:** Production-Ready Implementation Complete

---

## Executive Summary

PasswordVault is a **fully offline, iOS-first password manager** built with **React Native 0.75+**, emphasizing security, gesture-driven UX, and physics-based animations. This application provides military-grade encryption (AES-256), biometric authentication, and a rich set of features—all without any network connectivity.

**Core Principle:** Privacy-first architecture with zero data collection and complete offline operation.

---

## 1. Product Overview

### 1.1 Purpose

PasswordVault provides users with a secure, offline-first solution for managing passwords, credit cards, secure notes, and other sensitive information. The app prioritizes:

- **Security**: AES-256 encryption with biometric authentication
- **Privacy**: 100% offline, no cloud sync, no telemetry
- **UX Excellence**: Gesture-first interactions with physics-based animations
- **Accessibility**: Full VoiceOver support with Dynamic Type

### 1.2 Value Propositions

- **Deterministic Offline Behavior**: Works identically with or without internet connectivity
- **Gesture-Oriented UX**: Swipe, long-press, pan gestures with spring physics
- **Privacy-First Architecture**: User data never leaves device unless explicitly exported
- **Production-Ready**: Shippable to App Store with complete documentation

### 1.3 Non-Goals

- ❌ Cloud synchronization or backup
- ❌ Social features or sharing
- ❌ Server-side compute or API integration
- ❌ Multi-device sync
- ❌ Network-dependent features
- ❌ Time estimations in UI/documentation

---

## 2. Platform & Technology Stack

### 2.1 Core Technologies

**Framework & Runtime:**
- React Native 0.75.4 with TypeScript 5.3+
- New Architecture (Fabric + TurboModules)
- Hermes JavaScript Engine
- JSI (JavaScript Interface) for native bindings

**Navigation & Gestures:**
- @react-navigation/native ^6.1.9
- @react-navigation/native-stack ^6.9.17
- react-native-gesture-handler ^2.14.1
- react-native-screens ^3.29.0

**Animation & Graphics:**
- react-native-reanimated ^3.6.1
- @shopify/react-native-skia ^1.0.0

**State Management & Data:**
- Zustand ^4.4.7
- @nozbe/watermelondb ^0.27.1
- @react-native-async-storage/async-storage ^1.21.0

**Security & Storage:**
- react-native-biometrics ^3.0.1
- react-native-keychain ^8.1.2
- react-native-crypto-js ^1.0.0
- react-native-fs ^2.20.0

**Utilities:**
- uuid ^9.0.1
- date-fns ^3.0.6
- react-native-haptic-feedback ^2.2.0
- react-native-share ^10.0.2

**Monetization:**
- react-native-iap ^12.13.0

### 2.2 Platform Requirements

**iOS:**
- Minimum: iOS 13.0+
- Target: iOS 17.0+
- Devices: iPhone 12-15, iPad Pro 11"/12.9"

**Android (Future):**
- Minimum: Android 6.0 (API 23)
- Target: Android 14 (API 34)

---

## 3. Information Architecture

### 3.1 Primary Sections

```
PasswordVault App
│
├── Lock Screen (Authentication Gate)
│   ├── Biometric Authentication
│   └── PIN Fallback
│
├── Main Tabs
│   ├── Vault (Password List)
│   ├── Favorites
│   ├── Generator
│   └── Settings
│
├── Entry Management
│   ├── Entry Detail View
│   ├── Entry Editor (Create/Edit)
│   └── Category Filters
│
├── Tools
│   ├── Password Generator
│   ├── Export Manager
│   └── Security Audit
│
└── Settings
    ├── Security Settings
    ├── Appearance
    ├── Notifications
    └── About
```

### 3.2 Navigation Flow

```
Launch → Lock Screen → [Auth] → Main Tabs
                                    ↓
                          Vault List Screen
                                    ↓
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
            Entry Detail    New Entry Form    Category Filter
                    ↓               ↓
            Edit Entry      Password Generator
                    ↓
            Delete Entry
```

---

## 4. UI/UX Design — Screen-by-Screen

### 4.1 Lock Screen

**Purpose:** Secure authentication gate for app access

**Layout:**
- Centered animated logo (Skia particle effects)
- App title and tagline
- Biometric authentication prompt
- PIN input fallback
- Failed attempts counter

**Interactions:**
- Auto-trigger biometric on mount
- Tap "Use PIN" for fallback
- Visual feedback on failed attempts
- Spring animation on logo

**Animations:**
- Logo scale: 0 → 1 (spring, stiffness: 150)
- Opacity fade-in: 260ms
- Shake animation on failed auth

**Accessibility:**
- "Unlock with Face ID" button label
- Haptic feedback on auth result
- VoiceOver announcements

---

### 4.2 Vault List Screen

**Purpose:** Browse and search password entries

**Components:**
- Large title header
- Search bar (debounced)
- Category filter chips
- Password cards (FlatList)
- Floating "+ New" button

**Password Card:**
- Category color indicator (4pt strip)
- Title + username preview
- Favorite star (if favorited)
- Strength badge
- Swipe actions:
  - Swipe left: Delete (red)
  - Swipe right: Favorite (yellow)

**Interactions:**
- Pull-to-refresh for data reload
- Tap card → Navigate to detail
- Long-press card → Quick actions menu
- Tap "+" → Navigate to editor
- Search input → Filter list in real-time
- Category chip tap → Filter by category

**Animations:**
- Card press: Scale 0.96, translateY -4px
- Swipe: Follow finger, snap back/dismiss
- List updates: Fade + slide transitions

**Performance:**
- FlatList with proper key extraction
- Memoized card components
- Virtualized rendering (windowSize: 10)

---

### 4.3 Entry Detail Screen

**Purpose:** View and manage a single password entry

**Layout:**
```
┌─────────────────────────────────┐
│  ← Back                    ⭐   │
├─────────────────────────────────┤
│  Gmail Account                  │
│  login                          │
├─────────────────────────────────┤
│  Username                       │
│  user@gmail.com           📋    │
├─────────────────────────────────┤
│  Password                       │
│  •••••••••            👁️  📋   │
│  ━━━━━━━━━━━━━━ 85% Strong     │
├─────────────────────────────────┤
│  URL                            │
│  https://gmail.com              │
├─────────────────────────────────┤
│  Notes                          │
│  Personal email account         │
├─────────────────────────────────┤
│  [Edit] [Delete]                │
└─────────────────────────────────┘
```

**Interactions:**
- Tap 📋 → Copy to clipboard (haptic + toast)
- Tap 👁️ → Toggle password visibility
- Tap ⭐ → Toggle favorite
- Tap [Edit] → Navigate to editor
- Tap [Delete] → Confirm → Delete + navigate back

**Clipboard Management:**
- Auto-clear after 60 seconds (configurable)
- Show countdown toast

**Animations:**
- Strength bar fill: Animated width based on score
- Password toggle: Cross-fade between • and plain text
- Copy feedback: Scale + opacity pulse

---

### 4.4 Entry Editor Screen

**Purpose:** Create or edit password entries

**Form Fields:**
1. Title* (TextInput)
2. Category (Horizontal ScrollView chips)
3. Username* (TextInput, email keyboard)
4. Password* (SecureTextInput)
   - Generator button (🔑) on right
5. URL (TextInput, URL keyboard)
6. Notes (TextInput, multiline, 4 lines)

**Validation:**
- Required fields marked with *
- Real-time validation feedback
- Save button disabled until valid

**Interactions:**
- Tap category chip → Select category
- Tap 🔑 → Open generator modal
- Tap Cancel → Discard changes (confirm if modified)
- Tap Save → Validate → Save to DB → Navigate back

**Animations:**
- Keyboard-aware scroll
- Focus highlight on active field
- Error shake on validation failure

---

### 4.5 Password Generator Screen

**Purpose:** Generate strong, customizable passwords

**Layout:**
```
┌─────────────────────────────────┐
│  Password Generator             │
├─────────────────────────────────┤
│  ┌───────────────────────────┐ │
│  │  aB3$xK9#mP2@wQ7!vL5&     │ │
│  └───────────────────────────┘ │
│  [Generate New] [Copy]          │
├─────────────────────────────────┤
│  Settings                       │
│  Length: 16  ━━━━●─────        │
│  □ Uppercase (A-Z)             │
│  ☑ Lowercase (a-z)             │
│  ☑ Numbers (0-9)               │
│  ☑ Symbols (!@#$%)             │
│  □ Exclude Similar (i,l,1,O,0) │
│  □ Exclude Ambiguous ({}[]"')  │
└─────────────────────────────────┘
```

**Algorithm:**
- Cryptographically secure random (crypto.getRandomValues)
- Guaranteed character type inclusion
- Configurable length: 8-64 characters

**Interactions:**
- Slider change → Regenerate password
- Toggle switch → Regenerate password
- Tap [Generate New] → New password
- Tap [Copy] → Copy + add to history

**Password History:**
- Store last 50 generated passwords
- Accessible via swipe-up drawer

---

### 4.6 Settings Screen

**Purpose:** Configure app behavior and preferences

**Sections:**

**Security:**
- Biometric Authentication (toggle)
- Auto-Lock Timeout (picker: 30s, 1m, 5m, 15m, never)
- Lock on Background (toggle)
- Require Master Password (toggle, future)
- Hide Passwords by Default (toggle)
- Clear Clipboard (picker: 30s, 60s, 2m, 5m, never)

**Appearance:**
- Theme (segment: Light, Dark, Auto)
- Haptic Feedback (toggle)
- Dynamic Type Size (slider: xs, sm, md, lg, xl, xxl, xxxl)

**Data:**
- Export Data (navigate to ExportScreen)
- Clear All Data (confirm dialog)

**About:**
- Version number
- Privacy Policy (link)
- Open Source Licenses (link)

**Interactions:**
- Toggle switches → Immediate save
- Picker selections → Save + apply
- Dangerous actions → Confirmation dialog

---

### 4.7 Export Screen

**Purpose:** Export vault data in various formats

**Layout:**
```
┌─────────────────────────────────┐
│  Export Data                    │
├─────────────────────────────────┤
│  ⚠️ Warning                     │
│  Exported files contain          │
│  sensitive data. Handle with    │
│  care and delete after use.     │
├─────────────────────────────────┤
│  Select a format:               │
│                                 │
│  [Export as JSON]               │
│  [Export as CSV]                │
│  [Export as Markdown]           │
│  [Export as PDF] (Coming Soon)  │
├─────────────────────────────────┤
│  Total entries: 42              │
└─────────────────────────────────┘
```

**Export Formats:**

**JSON:**
```json
{
  "version": "1.0.0",
  "exportDate": "2025-10-26T12:00:00Z",
  "entries": [
    {
      "id": "entry_123",
      "title": "Gmail",
      "username": "user@gmail.com",
      "password": "P@ssw0rd",
      "url": "https://gmail.com",
      "category": "login",
      "tags": ["email", "personal"],
      "createdAt": 1729944000000,
      "updatedAt": 1729944000000
    }
  ]
}
```

**CSV:**
```csv
Title,Username,Password,URL,Category,Notes
Gmail,user@gmail.com,P@ssw0rd,https://gmail.com,login,"Personal email"
```

**Markdown:**
```markdown
# PasswordVault Export
Exported: 2025-10-26

## Gmail
- **Username:** user@gmail.com
- **Password:** P@ssw0rd
- **URL:** https://gmail.com
- **Category:** login
```

**Interactions:**
- Tap format button → Generate file → Open share sheet
- Share sheet allows: Save to Files, AirDrop, etc.

---

### 4.8 Favorites Screen

**Purpose:** Quick access to favorited passwords

**Layout:**
- Same as Vault List Screen
- Pre-filtered to show only favorites
- Empty state if no favorites

---

## 5. Visual Design System

### 5.1 Color Tokens

**Light Mode:**
```typescript
primary: '#007AFF'          // iOS Blue
primaryDark: '#0051D5'
primaryLight: '#4DA3FF'

background: '#FFFFFF'
backgroundSecondary: '#F2F2F7'
backgroundTertiary: '#E5E5EA'

text: '#000000'
textSecondary: '#3C3C43'
textTertiary: '#8E8E93'

success: '#34C759'
warning: '#FF9500'
error: '#FF3B30'
info: '#5AC8FA'

// Category colors (8)
category1: '#FF3B30'  // Red
category2: '#FF9500'  // Orange
category3: '#FFCC00'  // Yellow
category4: '#34C759'  // Green
category5: '#5AC8FA'  // Blue
category6: '#007AFF'  // Indigo
category7: '#5856D6'  // Purple
category8: '#AF52DE'  // Pink
```

**Dark Mode:**
```typescript
primary: '#0A84FF'
background: '#000000'
backgroundSecondary: '#1C1C1E'
text: '#FFFFFF'
// ... (inverse of light mode)
```

### 5.2 Typography

**Font Family:**
- iOS: SF Pro Text / SF Pro Display
- Android: Roboto / Roboto Medium

**Type Scale:**
```typescript
largeTitle: 34pt / 41pt line / 700 weight
title1: 28pt / 34pt / 700
title2: 22pt / 28pt / 700
title3: 20pt / 25pt / 600
headline: 17pt / 22pt / 600
body: 17pt / 22pt / 400
callout: 16pt / 21pt / 400
subhead: 15pt / 20pt / 400
footnote: 13pt / 18pt / 400
caption1: 12pt / 16pt / 400
caption2: 11pt / 13pt / 400
```

**Dynamic Type Support:**
- All text scales with system accessibility settings
- Multipliers: 0.85x (xs) to 1.75x (xxxl)

### 5.3 Spacing System

**8pt Grid:**
```typescript
none: 0
xxs: 2pt
xs: 4pt
sm: 8pt
md: 16pt
lg: 24pt
xl: 32pt
xxl: 40pt
xxxl: 48pt
huge: 64pt
massive: 96pt
```

### 5.4 Border Radius

```typescript
none: 0
xs: 4pt
sm: 8pt
md: 12pt    // Default for cards
lg: 16pt
xl: 20pt
xxl: 24pt
round: 9999pt  // Pills
```

### 5.5 Shadows

**iOS-Style Elevations:**
```typescript
sm: {y: 1, blur: 1.0, opacity: 0.18}
md: {y: 2, blur: 3.84, opacity: 0.20}
lg: {y: 4, blur: 5.46, opacity: 0.22}
xl: {y: 8, blur: 8.30, opacity: 0.23}
xxl: {y: 12, blur: 16.00, opacity: 0.25}
```

### 5.6 Iconography

**Style:** SF Symbols-inspired vector icons

**Rendering:** React Native Skia for custom icons

**Common Icons:**
- 🔒 Lock (security, vault)
- ⭐ Star (favorites)
- 🔑 Key (generator, password)
- ⚙️ Gear (settings)
- 📋 Clipboard (copy)
- 👁️ Eye (show/hide)
- ➕ Plus (add new)
- ✏️ Pencil (edit)
- 🗑️ Trash (delete)

**No Emoji in Production:** Use vector icons instead

---

## 6. Motion & Interaction Design

### 6.1 Animation Philosophy

**Principles:**
1. **Physics-Based**: Spring animations feel natural
2. **Purposeful**: Animations guide attention
3. **Performant**: 60fps minimum (Reanimated UI thread)
4. **Subtle**: Never distracting

### 6.2 Gesture Vocabulary

**Tap:**
- Primary action (open, select, toggle)
- Target size: 44x44pt minimum
- Feedback: Scale 0.96, 120ms spring

**Long Press:**
- Contextual actions (500ms threshold)
- Feedback: Scale 1.02, subtle haptic

**Swipe:**
- Navigation (back, dismiss)
- Actions (delete, favorite)
- Threshold: 100pt

**Pan:**
- Drag interactions
- Follow finger with momentum

**Edge Swipe:**
- Back navigation (iOS standard)
- Left edge only

### 6.3 Motion Specifications

**Press Spring (Motion 1-1 through 1-10):**
```typescript
const t = useSharedValue(0);

// On press
t.value = withSpring(1, {
  stiffness: 240,
  damping: 18
});

// On release
t.value = withTiming(0, {
  duration: 260,
  easing: Easing.out(Easing.cubic)
});

// Animated style
transform: [
  {scale: 1 + 0.06 * t.value},
  {translateY: -8 * t.value}
],
opacity: 0.75 + 0.25 * t.value
```

**Card Morph:**
```typescript
// Expand card
height: withSpring(targetHeight, {
  stiffness: 220,
  damping: 20
})
borderRadius: withSpring(20, {
  stiffness: 220,
  damping: 20
})
```

**Dismiss Swipe:**
```typescript
// Follow gesture
translateX: gestureX

// On end
if (abs(velocity) > threshold) {
  translateX: withTiming(screenWidth, {
    duration: 300,
    easing: Easing.out(Easing.cubic)
  })
  opacity: withTiming(0, {duration: 300})
}
```

**Parallax Scroll:**
```typescript
// Header image
translateY: scrollY * 0.5

// Content
translateY: scrollY * 1.0
```

### 6.4 Splash Screen Animation

**Physics-Based Logo:**
```typescript
1. Logo starts as particles (100 small circles)
2. Particles animate to form logo (spring physics)
3. Logo scales up (overshoot spring)
4. Fade to main app
```

**Implementation:**
- Skia canvas rendering
- 60fps target
- Duration: 1.5-2 seconds

---

## 7. Data Model

### 7.1 Core Entities

**PasswordEntry:**
```typescript
interface PasswordEntry {
  id: string;                    // UUID
  title: string;                 // "Gmail Account"
  username: string;              // "user@gmail.com"
  password: string;              // Encrypted
  url?: string;                  // "https://gmail.com"
  notes?: string;                // Markdown-supported
  category: PasswordCategory;    // Enum
  isFavorite: boolean;
  tags: string[];                // ["personal", "email"]
  customFields: CustomField[];
  strength?: PasswordStrength;   // Calculated
  createdAt: number;             // Unix timestamp
  updatedAt: number;
  lastAccessedAt?: number;
}
```

**PasswordCategory:**
```typescript
enum PasswordCategory {
  Login = 'login',
  CreditCard = 'credit_card',
  SecureNote = 'secure_note',
  BankAccount = 'bank_account',
  Identity = 'identity',
  Software = 'software',
  WiFi = 'wifi',
  Custom = 'custom'
}
```

**CustomField:**
```typescript
interface CustomField {
  id: string;
  label: string;              // "Security Question"
  value: string;              // Encrypted if isHidden
  type: 'text' | 'password' | 'email' | 'url' | 'date';
  isHidden: boolean;
}
```

**PasswordStrength:**
```typescript
enum PasswordStrength {
  VeryWeak = 'very_weak',    // Score: 0-19
  Weak = 'weak',             // Score: 20-39
  Medium = 'medium',         // Score: 40-59
  Strong = 'strong',         // Score: 60-79
  VeryStrong = 'very_strong' // Score: 80-100
}
```

**GeneratorSettings:**
```typescript
interface GeneratorSettings {
  length: number;            // 8-64
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  excludeSimilar: boolean;   // i, l, 1, O, 0
  excludeAmbiguous: boolean; // {}, [], (), quotes
  customSymbols?: string;
}
```

**AppSettings:**
```typescript
interface AppSettings {
  // Security
  biometricEnabled: boolean;
  autoLockTimeout: number;         // seconds
  lockOnBackground: boolean;
  requireMasterPassword: boolean;

  // Display
  theme: 'light' | 'dark' | 'auto';
  dynamicTypeSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
  hidePasswordByDefault: boolean;
  showPasswordStrength: boolean;

  // Behavior
  clearClipboardTimeout: number;   // seconds
  hapticFeedback: boolean;
  notificationsEnabled: boolean;
  exportFormat: 'json' | 'csv' | 'pdf' | 'markdown';
}
```

### 7.2 Database Schema (WatermelonDB)

**password_entries:**
```sql
CREATE TABLE password_entries (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  url TEXT,
  notes TEXT,
  category TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT 0,
  tags TEXT,              -- JSON array
  custom_fields TEXT,     -- JSON array
  strength TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_accessed_at INTEGER
);

CREATE INDEX idx_category ON password_entries(category);
CREATE INDEX idx_favorite ON password_entries(is_favorite);
CREATE INDEX idx_updated ON password_entries(updated_at DESC);
```

**security_audits:**
```sql
CREATE TABLE security_audits (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL,
  audit_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  detected_at INTEGER NOT NULL,
  resolved BOOLEAN DEFAULT 0,
  FOREIGN KEY (entry_id) REFERENCES password_entries(id)
);
```

**notifications:**
```sql
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  scheduled_at INTEGER NOT NULL,
  notification_type TEXT NOT NULL,
  entry_id TEXT,
  is_read BOOLEAN DEFAULT 0
);
```

---

## 8. State Management Architecture

### 8.1 Zustand Stores

**vaultStore:**
```typescript
interface VaultState {
  // Data
  entries: PasswordEntry[];
  filteredEntries: PasswordEntry[];
  searchQuery: string;
  selectedCategory: PasswordCategory | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  addEntry: (entry) => void;
  updateEntry: (id, updates) => void;
  deleteEntry: (id) => void;
  getEntry: (id) => PasswordEntry | undefined;
  toggleFavorite: (id) => void;
  updateLastAccessed: (id) => void;
  searchEntries: (query) => void;
  filterByCategory: (category) => void;
  loadEntries: () => Promise<void>;
}
```

**authStore:**
```typescript
interface AuthState {
  isLocked: boolean;
  isAuthenticated: boolean;
  lastActiveTime: number;
  failedAttempts: number;
  isSetupComplete: boolean;

  unlock: () => void;
  lock: () => void;
  authenticate: (success: boolean) => void;
  updateLastActiveTime: () => void;
  checkAutoLock: (timeout: number) => void;
}
```

**settingsStore:**
```typescript
interface SettingsState extends AppSettings {
  updateSettings: (updates) => void;
  resetSettings: () => void;
  toggleBiometric: () => void;
  setTheme: (theme) => void;
}
```

**generatorStore:**
```typescript
interface GeneratorState extends GeneratorSettings {
  generatedPassword: string;
  history: string[];

  updateSettings: (updates) => void;
  generatePassword: () => void;
  copyToHistory: (password) => void;
  clearHistory: () => void;
}
```

**iapStore:**
```typescript
interface IAPState {
  isPro: boolean;
  purchasedProducts: string[];
  products: IAPProduct[];
  isLoading: boolean;
  error: string | null;

  loadProducts: () => Promise<void>;
  purchaseProduct: (productId) => Promise<void>;
  restorePurchases: () => Promise<void>;
}
```

### 8.2 Data Flow

```
UI Event
  ↓
Store Action
  ↓
State Update (Zustand)
  ↓
Database Write (WatermelonDB) [async]
  ↓
UI Re-render (React)
```

**Optimistic Updates:**
```typescript
// Update UI immediately
updateEntry(id, {title: 'New Title'});

// Persist to database asynchronously
database.write(async () => {
  await entry.update(e => {
    e.title = 'New Title';
  });
});
```

---

## 9. Security Architecture

### 9.1 Encryption

**Password Storage:**
```typescript
// Encrypt on save
const encrypted = CryptoJS.AES.encrypt(
  password,
  encryptionKey
).toString();

// Decrypt on read
const decrypted = CryptoJS.AES.decrypt(
  encrypted,
  encryptionKey
).toString(CryptoJS.enc.Utf8);
```

**Encryption Key Management:**
- **iOS**: Store in Keychain (Secure Enclave)
- **Android**: Store in Android Keystore
- Never stored in code or database

**Key Generation:**
```typescript
// Generate on first launch
const key = crypto.getRandomValues(new Uint8Array(32));
await Keychain.setGenericPassword('encryption', key);
```

### 9.2 Biometric Authentication

**Flow:**
```typescript
1. User launches app
2. Check if biometric available
3. Prompt for Face ID/Touch ID
4. On success: unlock app
5. On failure: show PIN fallback
```

**Implementation:**
```typescript
const rnBiometrics = new ReactNativeBiometrics();

// Check availability
const {available, biometryType} = await rnBiometrics.isSensorAvailable();

// Authenticate
const {success} = await rnBiometrics.simplePrompt({
  promptMessage: 'Unlock PasswordVault',
  cancelButtonText: 'Use PIN'
});
```

### 9.3 Auto-Lock

**Mechanism:**
```typescript
// Track last activity
useEffect(() => {
  const interval = setInterval(() => {
    const now = Date.now();
    const timeSinceActive = (now - lastActiveTime) / 1000;

    if (timeSinceActive >= autoLockTimeout) {
      lock();
    }
  }, 10000); // Check every 10s

  return () => clearInterval(interval);
}, [lastActiveTime, autoLockTimeout]);
```

**Triggers:**
- App background
- Inactivity timeout
- Manual lock

### 9.4 Clipboard Security

**Auto-Clear:**
```typescript
// Copy to clipboard
Clipboard.setString(password);

// Set clear timer
setTimeout(() => {
  Clipboard.setString('');
}, clearClipboardTimeout * 1000);
```

---

## 10. Performance Optimization

### 10.1 Performance Budgets

**Targets:**
- Cold start: <2 seconds
- Hot start: <500ms
- Interactions: <100ms response
- Animations: 60fps constant
- List scroll: Smooth, no jank
- Memory: <100MB typical usage
- Bundle size: <50MB

### 10.2 Optimization Techniques

**JavaScript Engine:**
- Hermes for faster startup
- Bytecode precompilation

**Animations:**
- Reanimated 3 worklets (UI thread)
- No bridge overhead
- Hardware acceleration

**List Rendering:**
```typescript
<FlatList
  data={entries}
  keyExtractor={item => item.id}
  renderItem={({item}) => <PasswordCard entry={item} />}
  windowSize={10}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: 88,
    offset: 88 * index,
    index
  })}
/>
```

**Memory Management:**
- Lazy loading of screens
- Image caching
- Database query optimization
- Proper cleanup in useEffect

**Bundle Optimization:**
- Code splitting (future)
- Tree shaking
- Minification (Hermes)
- Asset optimization

### 10.3 Profiling

**Tools:**
- Flipper (React DevTools)
- Xcode Instruments
- Android Studio Profiler
- Chrome DevTools

**Metrics:**
- Frame rate (target: 60fps)
- Memory allocation
- CPU usage
- Network (should be 0)

---

## 11. Accessibility

### 11.1 Screen Reader Support

**VoiceOver (iOS):**
```typescript
<View
  accessible={true}
  accessibilityLabel="Gmail password entry"
  accessibilityHint="Double tap to view details"
  accessibilityRole="button"
  accessibilityState={{selected: isFavorite}}
>
```

**Semantic Elements:**
- Buttons: `accessibilityRole="button"`
- Headers: `accessibilityRole="header"`
- Links: `accessibilityRole="link"`
- Images: `accessibilityRole="image"`

### 11.2 Dynamic Type

**Implementation:**
```typescript
const multiplier = {
  xs: 0.85,
  sm: 0.92,
  md: 1.0,
  lg: 1.15,
  xl: 1.3,
  xxl: 1.5,
  xxxl: 1.75
}[dynamicTypeSize];

const scaledStyle = {
  ...typography.body,
  fontSize: typography.body.fontSize * multiplier,
  lineHeight: typography.body.lineHeight * multiplier
};
```

### 11.3 Touch Targets

**Minimum Size:** 44x44pt

**Spacing:** 8pt between targets

**Example:**
```typescript
<TouchableOpacity
  style={{minWidth: 44, minHeight: 44}}
  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
>
```

### 11.4 Color Contrast

**WCAG AA Compliance:**
- Text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

---

## 12. Testing Strategy

### 12.1 Unit Tests

**Coverage Target:** >80%

**Test Files:**
```typescript
// Password strength
describe('analyzePasswordStrength', () => {
  test('identifies very weak password', () => {
    expect(analyzePasswordStrength('123').strength)
      .toBe(PasswordStrength.VeryWeak);
  });
});

// Store logic
describe('vaultStore', () => {
  test('adds entry correctly', () => {
    addEntry({title: 'Test', ...});
    expect(entries.length).toBe(1);
  });
});
```

### 12.2 Integration Tests

**Focus:**
- Store + database interaction
- Navigation flows
- Component integration

```typescript
describe('Entry CRUD', () => {
  test('creates, reads, updates, deletes entry', async () => {
    const entry = await createEntry({...});
    expect(entry.id).toBeDefined();

    const fetched = await getEntry(entry.id);
    expect(fetched).toEqual(entry);

    await updateEntry(entry.id, {title: 'Updated'});
    const updated = await getEntry(entry.id);
    expect(updated.title).toBe('Updated');

    await deleteEntry(entry.id);
    const deleted = await getEntry(entry.id);
    expect(deleted).toBeUndefined();
  });
});
```

### 12.3 E2E Tests

**Tool:** Detox

**Critical Flows:**
1. Authentication
2. Create password
3. Search password
4. Copy password
5. Delete password
6. Export data

```typescript
describe('Password Creation', () => {
  it('should create a new password entry', async () => {
    await element(by.id('add-button')).tap();
    await element(by.id('title-input')).typeText('Gmail');
    await element(by.id('username-input')).typeText('user@gmail.com');
    await element(by.id('password-input')).typeText('P@ssw0rd123');
    await element(by.id('save-button')).tap();

    await expect(element(by.text('Gmail'))).toBeVisible();
  });
});
```

---

## 13. Monetization (In-App Purchases)

### 13.1 Products

**Pro Unlock (Non-Consumable):**
- Product ID: `com.passwordvault.pro`
- Price: $9.99
- Features:
  - Unlimited passwords (free: 50 max)
  - Advanced export (PDF)
  - Custom categories
  - Priority support

**Monthly Subscription:**
- Product ID: `com.passwordvault.pro.monthly`
- Price: $2.99/month
- Same features as Pro

**Yearly Subscription:**
- Product ID: `com.passwordvault.pro.yearly`
- Price: $19.99/year (Save 44%)
- Same features as Pro

### 13.2 Implementation

```typescript
// Load products
const products = await RNIap.getProducts([
  'com.passwordvault.pro',
  'com.passwordvault.pro.monthly',
  'com.passwordvault.pro.yearly'
]);

// Purchase flow
const purchase = await RNIap.requestPurchase('com.passwordvault.pro');

// Verify receipt
const validated = await validateReceipt(purchase.transactionReceipt);

// Unlock features
if (validated) {
  setIsPro(true);
}
```

### 13.3 Restore Purchases

```typescript
const purchases = await RNIap.getAvailablePurchases();

purchases.forEach(purchase => {
  if (purchase.productId === 'com.passwordvault.pro') {
    setIsPro(true);
  }
});
```

---

## 14. Deployment

### 14.1 iOS App Store

**Requirements:**
- Apple Developer Account ($99/year)
- App Store Connect access
- Code signing certificates
- Provisioning profiles

**Metadata:**
- App Name: PasswordVault
- Subtitle: Secure Offline Password Manager
- Category: Utilities
- Keywords: password, manager, security, offline, vault
- Age Rating: 4+ (No Objectionable Content)

**Screenshots:**
- 6.5" iPhone (1284x2778)
- 5.5" iPhone (1242x2208)
- 12.9" iPad Pro (2048x2732)

**Privacy Policy:** Required (PRIVACY_POLICY.md)

**App Review Notes:**
- "This app is 100% offline and does not access the internet"
- "All data is stored locally on the device"

### 14.2 Android Play Store (Future)

**Requirements:**
- Google Play Developer Account ($25 one-time)
- Signing keystore
- Play Console access

**Metadata:**
- Similar to iOS
- Feature graphic: 1024x500
- App icon: 512x512

---

## 15. Analytics & Monitoring

### 15.1 No Traditional Analytics

**Why:**
- 100% offline app
- Privacy-first principle
- No network access

**Alternative Metrics:**
- App Store ratings
- Review feedback
- Support email volume
- Crash reports (opt-in only)

### 15.2 Error Tracking

**Sentry (Optional, Opt-In):**
```typescript
// Only if user opts in
if (userConsent) {
  Sentry.init({
    dsn: 'your-dsn',
    enableNative: true
  });
}
```

---

## 16. Maintenance & Updates

### 16.1 Version Management

**Semantic Versioning:**
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

**Example:** 1.2.3
- 1 = Major version
- 2 = Minor version
- 3 = Patch version

### 16.2 Release Process

```
1. Create release branch
2. Update version numbers
3. Run full test suite
4. Build release candidates
5. Test on devices
6. Create git tag
7. Submit to App Store
8. Monitor for issues
9. Merge to main
```

### 16.3 Hotfix Process

```
1. Create hotfix branch from main
2. Fix critical issue
3. Fast-track testing
4. Build and submit
5. Emergency review request
6. Deploy ASAP
```

---

## 17. Future Enhancements

### 17.1 Phase 2 Features

**Import:**
- From 1Password (JSON)
- From LastPass (CSV)
- From Chrome (CSV)
- From generic CSV

**Security Audit:**
- Weak password detection
- Reused password detection
- Old password detection (>90 days)
- Compromised password check (offline database)

**Apple Watch:**
- Quick access to favorite passwords
- Biometric unlock
- Password generator
- Synced via iCloud (encrypted)

**iPad Optimization:**
- Split view support
- Multi-column layout
- Keyboard shortcuts
- Pointer support

### 17.2 Phase 3 Features

**Advanced Features:**
- Secure file attachments (encrypted)
- Two-factor authentication storage
- Password sharing (via AirDrop, encrypted)
- Browser extension integration
- Auto-fill credential provider

**Enterprise:**
- Team vaults (local network sync)
- Audit logs
- Policy enforcement
- Central management

---

## 18. Appendix

### 18.1 Component Library (Full Catalog)

**Components 1.1 - 1.70** are documented in detail in:
- `src/components/ComponentLibrary.tsx`
- `src/components/base/Component1_1.tsx`

Each component includes:
- TypeScript props interface
- Gesture handlers (tap, long press, swipe, pan, etc.)
- Reanimated worklets (press spring, focus transition, etc.)
- Skia rendering (shadows, gradients, paths)
- Accessibility support
- Offline behavior

### 18.2 Motion Specifications (1-1 through 1-10)

All motion specs follow the pattern:
```typescript
Duration: 220-360ms (eased)
Spring: stiffness 180-320, damping 14-22
Scale: 1.0 ± 0.06
TranslateY: ±8pt
Opacity: 0.75-1.0
```

Detailed implementations in:
- `src/hooks/useAnimations.ts`

### 18.3 Sample Data

Sample password entries for testing:
```typescript
{
  id: '1-1',
  title: 'Gmail Account',
  username: 'user@gmail.com',
  password: 'P@ssw0rd123!',
  url: 'https://gmail.com',
  category: PasswordCategory.Login,
  isFavorite: true,
  tags: ['email', 'personal'],
  customFields: [],
  strength: PasswordStrength.Strong,
  createdAt: Date.now(),
  updatedAt: Date.now()
}
```

---

## 19. Glossary

**AES-256:** Advanced Encryption Standard with 256-bit key (military-grade)

**Biometric Auth:** Face ID (facial recognition) or Touch ID (fingerprint)

**Fabric:** React Native's new rendering system (part of New Architecture)

**Haptic Feedback:** Vibration feedback on touch interactions

**Hermes:** Optimized JavaScript engine for React Native

**JSI:** JavaScript Interface (direct JS ↔ Native communication)

**Keychain:** iOS secure storage for sensitive data

**Reanimated:** Library for high-performance animations

**Skia:** 2D graphics library for custom rendering

**TurboModules:** New Native Modules system (part of New Architecture)

**VoiceOver:** iOS screen reader for accessibility

**Zustand:** Lightweight state management library

---

## 20. Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-26 | Initial production-ready SDD | Claude Code |

---

## 21. Approval

**Product Owner:** [Your Name]
**Technical Lead:** [Your Name]
**Status:** ✅ Approved for Production

---

**End of Software Design Document**

*This SDD represents a complete, production-ready specification for PasswordVault, a secure offline password manager built with React Native.*
