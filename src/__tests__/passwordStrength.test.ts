/**
 * Unit tests for password strength analysis
 */

import {analyzePasswordStrength, getStrengthColor} from '../utils/passwordStrength';
import {PasswordStrength} from '../types';

describe('Password Strength Analysis', () => {
  test('should identify very weak password', () => {
    const result = analyzePasswordStrength('123');
    expect(result.strength).toBe(PasswordStrength.VeryWeak);
    expect(result.score).toBeLessThan(20);
  });

  test('should identify weak password', () => {
    const result = analyzePasswordStrength('password');
    expect(result.strength).toBe(PasswordStrength.Weak);
    expect(result.score).toBeGreaterThanOrEqual(20);
    expect(result.score).toBeLessThan(40);
  });

  test('should identify medium password', () => {
    const result = analyzePasswordStrength('Password123');
    expect(result.strength).toBe(PasswordStrength.Medium);
    expect(result.score).toBeGreaterThanOrEqual(40);
    expect(result.score).toBeLessThan(60);
  });

  test('should identify strong password', () => {
    const result = analyzePasswordStrength('P@ssw0rd123!');
    expect(result.strength).toBe(PasswordStrength.Strong);
    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(result.score).toBeLessThan(80);
  });

  test('should identify very strong password', () => {
    const result = analyzePasswordStrength('P@ssw0rd123!XyZ$%^&*');
    expect(result.strength).toBe(PasswordStrength.VeryStrong);
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  test('should detect character types', () => {
    const result = analyzePasswordStrength('P@ssw0rd123!');
    expect(result.hasUppercase).toBe(true);
    expect(result.hasLowercase).toBe(true);
    expect(result.hasNumbers).toBe(true);
    expect(result.hasSymbols).toBe(true);
  });

  test('should provide helpful feedback', () => {
    const result = analyzePasswordStrength('password');
    expect(result.feedback.length).toBeGreaterThan(0);
    expect(result.feedback.some((f) => f.includes('uppercase'))).toBe(true);
    expect(result.feedback.some((f) => f.includes('numbers'))).toBe(true);
  });

  test('should penalize repeated characters', () => {
    const normal = analyzePasswordStrength('P@ssw0rd123!');
    const repeated = analyzePasswordStrength('P@ssssss123!');
    expect(repeated.score).toBeLessThan(normal.score);
  });

  test('should return correct color for strength', () => {
    const lightColor = getStrengthColor(PasswordStrength.Strong, false);
    const darkColor = getStrengthColor(PasswordStrength.Strong, true);
    expect(lightColor).toBeTruthy();
    expect(darkColor).toBeTruthy();
    expect(lightColor).not.toBe(darkColor);
  });
});
