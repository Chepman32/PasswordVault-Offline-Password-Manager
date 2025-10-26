# Deployment Guide - PasswordVault

This guide covers deploying PasswordVault to the Apple App Store and Google Play Store.

## Prerequisites

### iOS Requirements
- Mac with macOS 13+ (Ventura or later)
- Xcode 15+
- Apple Developer Account ($99/year)
- CocoaPods installed
- Valid provisioning profiles and certificates

### Android Requirements
- Android Studio
- JDK 17+
- Android SDK
- Google Play Developer Account ($25 one-time)
- Signing keystore

## iOS Deployment

### 1. Configure App Identifier

1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Navigate to Certificates, Identifiers & Profiles
3. Create an App ID: `com.passwordvault.app`
4. Enable capabilities:
   - App Groups (for data sharing)
   - Keychain Sharing (for secure storage)
   - No network capabilities (offline app)

### 2. Create Provisioning Profiles

```bash
# Development Profile
1. Go to Profiles > Development
2. Create new iOS App Development profile
3. Select your App ID
4. Select development certificates
5. Select test devices
6. Download and install

# Distribution Profile
1. Go to Profiles > Distribution
2. Create new App Store Distribution profile
3. Select your App ID
4. Select distribution certificate
5. Download and install
```

### 3. Update Xcode Project

```bash
# Open project
cd ios
open PasswordVault.xcworkspace

# In Xcode:
# 1. Select PasswordVault target
# 2. Signing & Capabilities
# 3. Team: Select your team
# 4. Bundle Identifier: com.passwordvault.app
# 5. Provisioning Profile: Select created profile
```

### 4. Update Info.plist

Add required privacy descriptions:

```xml
<key>NSFaceIDUsageDescription</key>
<string>We use Face ID to securely unlock your password vault</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Allow access to save exported password files</string>
```

### 5. Build and Archive

```bash
# Clean build folder
cd ios
xcodebuild clean -workspace PasswordVault.xcworkspace -scheme PasswordVault

# Archive for release
xcodebuild archive \
  -workspace PasswordVault.xcworkspace \
  -scheme PasswordVault \
  -configuration Release \
  -archivePath PasswordVault.xcarchive

# Or use Xcode:
# Product > Archive
```

### 6. Upload to App Store Connect

```bash
# Export IPA
xcodebuild -exportArchive \
  -archivePath PasswordVault.xcarchive \
  -exportPath . \
  -exportOptionsPlist ExportOptions.plist

# Upload using Transporter
# Or: Xcode > Window > Organizer > Upload to App Store
```

### 7. App Store Connect Configuration

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app
3. Fill in metadata:
   - App Name: PasswordVault
   - Subtitle: Secure Offline Password Manager
   - Category: Utilities
   - Keywords: password, manager, security, offline, vault
4. Upload screenshots (5.5", 6.5", 12.9" iPad Pro)
5. Write app description
6. Set pricing (Free or Paid)
7. Add In-App Purchases if applicable
8. Submit for review

### 8. App Review Information

Provide:
- Demo account (not needed for offline app)
- Notes: "This app is 100% offline and does not access the internet"
- Contact information

## Android Deployment

### 1. Generate Signing Key

```bash
# Generate keystore
keytool -genkeypair \
  -v \
  -storetype PKCS12 \
  -keystore passwordvault-release.keystore \
  -alias passwordvault \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Store securely - you cannot recover this!
```

### 2. Configure Gradle Signing

Create `android/gradle.properties`:

```properties
MYAPP_UPLOAD_STORE_FILE=passwordvault-release.keystore
MYAPP_UPLOAD_KEY_ALIAS=passwordvault
MYAPP_UPLOAD_STORE_PASSWORD=your_store_password
MYAPP_UPLOAD_KEY_PASSWORD=your_key_password
```

⚠️ **Never commit this file!** Add to `.gitignore`

### 3. Update App Configuration

Edit `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        applicationId "com.passwordvault"
        versionCode 1
        versionName "1.0.0"
    }
}
```

### 4. Build Release APK/AAB

```bash
cd android

# Build APK
./gradlew assembleRelease

# Build AAB (recommended for Play Store)
./gradlew bundleRelease

# Output locations:
# APK: android/app/build/outputs/apk/release/app-release.apk
# AAB: android/app/build/outputs/bundle/release/app-release.aab
```

### 5. Test Release Build

```bash
# Install release APK on device
adb install android/app/build/outputs/apk/release/app-release.apk

# Test thoroughly:
# - Biometric authentication
# - Password CRUD operations
# - Export functionality
# - App performance
```

### 6. Google Play Console Setup

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Fill in store listing:
   - App name: PasswordVault
   - Short description: Secure offline password manager
   - Full description: (detailed features)
   - Screenshots: Phone (16:9), Tablet (16:9, 10")
   - Feature graphic: 1024x500
   - App icon: 512x512

### 7. App Content & Privacy

1. Privacy Policy: Upload PRIVACY_POLICY.md
2. Data safety:
   - No data collected
   - No data shared
   - Data encrypted
3. Content rating: Fill questionnaire (likely "Everyone")
4. Target audience: All ages
5. Permissions declaration: Explain biometric permission

### 8. Release Configuration

```bash
# Create production release
1. Upload AAB file
2. Set release name: "1.0.0"
3. Add release notes:
   "Initial release
   - Secure password storage
   - Biometric authentication
   - Password generator
   - Export functionality"

4. Roll out:
   - Start with 10% rollout
   - Monitor crashes/ANRs
   - Gradually increase to 100%
```

### 9. Submit for Review

1. Review all sections (green checkmarks)
2. Click "Send for review"
3. Review typically takes 1-7 days

## Post-Deployment

### Monitoring

#### iOS
```bash
# Monitor crashes
# Xcode > Window > Organizer > Crashes

# Or use App Store Connect
# Analytics > Crashes
```

#### Android
```bash
# Monitor in Play Console
# Quality > Android vitals
# - Crashes
# - ANRs
# - Battery usage
```

### Analytics (Optional)

Since the app is offline, traditional analytics won't work. Consider:

- In-app opt-in telemetry (offline, user-initiated export)
- App Store reviews monitoring
- Support email feedback

### Updates

#### Version Bumping

```bash
# iOS: Update in Xcode
# Version: 1.0.1
# Build: 2

# Android: Update build.gradle
versionCode 2
versionName "1.0.1"
```

#### Release Process

1. Create release branch
2. Update version numbers
3. Test thoroughly
4. Create git tag: `v1.0.1`
5. Build and upload
6. Submit for review
7. Merge to main

## Automation with Fastlane

### iOS Fastlane Setup

```ruby
# ios/Fastfile
platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    increment_build_number
    build_app(workspace: "PasswordVault.xcworkspace",
              scheme: "PasswordVault")
    upload_to_testflight
  end

  desc "Build and upload to App Store"
  lane :release do
    increment_build_number
    build_app(workspace: "PasswordVault.xcworkspace",
              scheme: "PasswordVault")
    upload_to_app_store
  end
end
```

### Android Fastlane Setup

```ruby
# android/Fastfile
platform :android do
  desc "Build and upload to Play Store Beta"
  lane :beta do
    gradle(task: "bundleRelease")
    upload_to_play_store(track: "beta")
  end

  desc "Build and upload to Play Store"
  lane :release do
    gradle(task: "bundleRelease")
    upload_to_play_store(track: "production")
  end
end
```

## Troubleshooting

### iOS Issues

**Provisioning Profile Errors**
```bash
# Clean derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Re-download profiles
# Xcode > Preferences > Accounts > Download Manual Profiles
```

**Code Signing Errors**
```bash
# Verify certificate
security find-identity -v -p codesigning

# Fix keychain access
security unlock-keychain ~/Library/Keychains/login.keychain
```

### Android Issues

**Signing Errors**
```bash
# Verify keystore
keytool -list -v -keystore passwordvault-release.keystore

# Check permissions
chmod 600 passwordvault-release.keystore
```

**Build Failures**
```bash
# Clean build
cd android
./gradlew clean

# Clear gradle cache
rm -rf ~/.gradle/caches
```

## Security Checklist

- [ ] Keystore backed up securely
- [ ] Passwords stored in secure location (1Password, etc.)
- [ ] No secrets in source code
- [ ] No hardcoded URLs or keys
- [ ] ProGuard/R8 enabled for Android
- [ ] Bitcode enabled for iOS
- [ ] App Transport Security configured
- [ ] Network security config (Android)

## Performance Checklist

- [ ] Hermes enabled
- [ ] Flipper removed from release
- [ ] Images optimized
- [ ] Bundle size < 50MB
- [ ] Cold start < 2s
- [ ] Animations at 60fps
- [ ] Memory usage < 100MB

## Compliance Checklist

- [ ] Privacy Policy uploaded
- [ ] Terms of Service created
- [ ] GDPR compliance verified
- [ ] CCPA compliance verified
- [ ] COPPA compliance verified
- [ ] Data encryption documented
- [ ] Permission usage justified

---

**Ready to ship!** 🚀

For questions or issues, contact: deploy@passwordvault.app
