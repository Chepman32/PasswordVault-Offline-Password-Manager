/**
 * Core type definitions for PasswordVault
 */

export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  category: PasswordCategory;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
  lastAccessedAt?: number;
  tags: string[];
  customFields: CustomField[];
  strength?: PasswordStrength;
}

export enum PasswordCategory {
  Login = 'login',
  CreditCard = 'credit_card',
  SecureNote = 'secure_note',
  BankAccount = 'bank_account',
  Identity = 'identity',
  Software = 'software',
  WiFi = 'wifi',
  Custom = 'custom',
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'password' | 'email' | 'url' | 'date';
  isHidden: boolean;
}

export enum PasswordStrength {
  VeryWeak = 'very_weak',
  Weak = 'weak',
  Medium = 'medium',
  Strong = 'strong',
  VeryStrong = 'very_strong',
}

export interface GeneratorSettings {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  customSymbols?: string;
}

export interface AppSettings {
  biometricEnabled: boolean;
  autoLockTimeout: number; // in seconds
  lockOnBackground: boolean;
  hidePasswordByDefault: boolean;
  clearClipboardTimeout: number; // in seconds
  theme: 'light' | 'dark' | 'auto';
  hapticFeedback: boolean;
  showPasswordStrength: boolean;
  requireMasterPassword: boolean;
  exportFormat: ExportFormat;
  notificationsEnabled: boolean;
  dynamicTypeSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
}

export type ExportFormat = 'json' | 'csv' | 'pdf' | 'markdown';

export interface SecurityAudit {
  id: string;
  entryId: string;
  type: AuditType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  detectedAt: number;
  resolved: boolean;
}

export enum AuditType {
  WeakPassword = 'weak_password',
  ReusedPassword = 'reused_password',
  OldPassword = 'old_password',
  CompromisedPassword = 'compromised_password',
  MissingTwoFactor = 'missing_2fa',
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  scheduledAt: number;
  type: 'reminder' | 'security_alert' | 'backup_reminder';
  entryId?: string;
  isRead: boolean;
}

export interface IAPProduct {
  productId: string;
  type: 'consumable' | 'non_consumable' | 'subscription';
  title: string;
  description: string;
  price: string;
  localizedPrice: string;
}

export interface PurchaseState {
  isPro: boolean;
  purchasedProducts: string[];
  subscriptionExpiryDate?: number;
}

// Navigation types
export type RootStackParamList = {
  Lock: undefined;
  MainTabs: undefined;
  VaultDetail: {entryId: string};
  VaultEditor: {entryId?: string};
  Generator: undefined;
  Settings: undefined;
  Export: undefined;
  SecurityAudit: undefined;
  CategoryFilter: {category: PasswordCategory};
  Biometric: undefined;
  Upgrade: undefined;
};

export type MainTabParamList = {
  Vault: undefined;
  Favorites: undefined;
  Generator: undefined;
  Settings: undefined;
};
