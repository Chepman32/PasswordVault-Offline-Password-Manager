/**
 * Password strength calculation utilities
 */

import {PasswordStrength} from '@/types';

export interface PasswordAnalysis {
  strength: PasswordStrength;
  score: number; // 0-100
  feedback: string[];
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  length: number;
}

export function analyzePasswordStrength(password: string): PasswordAnalysis {
  const analysis: PasswordAnalysis = {
    strength: PasswordStrength.VeryWeak,
    score: 0,
    feedback: [],
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSymbols: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password),
    length: password.length,
  };

  // Calculate base score
  let score = 0;

  // Length score (up to 40 points)
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (password.length >= 20) score += 10;

  // Character variety (up to 40 points)
  if (analysis.hasUppercase) score += 10;
  if (analysis.hasLowercase) score += 10;
  if (analysis.hasNumbers) score += 10;
  if (analysis.hasSymbols) score += 10;

  // Additional complexity (up to 20 points)
  const uniqueChars = new Set(password).size;
  score += Math.min(uniqueChars, 20);

  analysis.score = Math.min(score, 100);

  // Determine strength level
  if (analysis.score < 20) {
    analysis.strength = PasswordStrength.VeryWeak;
    analysis.feedback.push('Password is too weak');
  } else if (analysis.score < 40) {
    analysis.strength = PasswordStrength.Weak;
    analysis.feedback.push('Password could be stronger');
  } else if (analysis.score < 60) {
    analysis.strength = PasswordStrength.Medium;
    analysis.feedback.push('Password is moderately strong');
  } else if (analysis.score < 80) {
    analysis.strength = PasswordStrength.Strong;
    analysis.feedback.push('Password is strong');
  } else {
    analysis.strength = PasswordStrength.VeryStrong;
    analysis.feedback.push('Password is very strong');
  }

  // Add specific feedback
  if (password.length < 12) {
    analysis.feedback.push('Use at least 12 characters');
  }
  if (!analysis.hasUppercase) {
    analysis.feedback.push('Add uppercase letters');
  }
  if (!analysis.hasLowercase) {
    analysis.feedback.push('Add lowercase letters');
  }
  if (!analysis.hasNumbers) {
    analysis.feedback.push('Add numbers');
  }
  if (!analysis.hasSymbols) {
    analysis.feedback.push('Add symbols');
  }

  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    analysis.feedback.push('Avoid repeated characters');
    analysis.score = Math.max(0, analysis.score - 10);
  }

  if (/^[0-9]+$/.test(password)) {
    analysis.feedback.push('Avoid using only numbers');
    analysis.score = Math.max(0, analysis.score - 20);
  }

  if (/^[a-zA-Z]+$/.test(password)) {
    analysis.feedback.push('Add numbers and symbols');
    analysis.score = Math.max(0, analysis.score - 10);
  }

  return analysis;
}

export function getStrengthColor(strength: PasswordStrength, isDark: boolean): string {
  const colors = {
    light: {
      [PasswordStrength.VeryWeak]: '#FF3B30',
      [PasswordStrength.Weak]: '#FF9500',
      [PasswordStrength.Medium]: '#FFCC00',
      [PasswordStrength.Strong]: '#34C759',
      [PasswordStrength.VeryStrong]: '#00C7BE',
    },
    dark: {
      [PasswordStrength.VeryWeak]: '#FF453A',
      [PasswordStrength.Weak]: '#FF9F0A',
      [PasswordStrength.Medium]: '#FFD60A',
      [PasswordStrength.Strong]: '#32D74B',
      [PasswordStrength.VeryStrong]: '#30D158',
    },
  };

  return isDark ? colors.dark[strength] : colors.light[strength];
}
