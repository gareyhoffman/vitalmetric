/* ═══════════════════════════════════════════════════════
   VitalMetric — Body Composition Calculator Tests
   Vitest. Tests pure functions, not the DOM.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from 'vitest';
import { calcBodyComposition } from './body-composition.js';

describe('calcBodyComposition', () => {
  // ── Known correct outputs ──

  it('calculates correct BMI for 75kg, 175cm male', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 175, weightKg: 75,
      neckCm: 40, waistCm: 85,
    });
    // BMI = 75 / 1.75² = 24.49
    expect(result.bmi).toBeCloseTo(24.5, 1);
    expect(result.bmiCategory).toBe('normal');
    expect(result.error).toBeUndefined();
  });

  it('calculates correct BMI for 90kg, 160cm female', () => {
    const result = calcBodyComposition({
      gender: 'female', heightCm: 160, weightKg: 90,
      neckCm: 33, waistCm: 85, hipCm: 105,
    });
    // BMI = 90 / 1.6² = 35.16
    expect(result.bmi).toBeCloseTo(35.2, 1);
    expect(result.bmiCategory).toBe('obese-class-2');
    expect(result.error).toBeUndefined();
  });

  it('calculates Navy body fat for male within expected range', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 175, weightKg: 78,
      neckCm: 40, waistCm: 85,
    });
    // ~15.4% with inch conversion
    expect(result.bodyFatPct).toBeCloseTo(15.4, 1);
    expect(result.bodyFatPct).toBeGreaterThan(8);
    expect(result.bodyFatPct).toBeLessThan(30);
  });

  it('calculates Navy body fat for female within expected range', () => {
    const result = calcBodyComposition({
      gender: 'female', heightCm: 165, weightKg: 65,
      neckCm: 33, waistCm: 75, hipCm: 95,
    });
    // ~27.2% with inch conversion
    expect(result.bodyFatPct).toBeCloseTo(27.2, 1);
    expect(result.bodyFatPct).toBeGreaterThan(18);
    expect(result.bodyFatPct).toBeLessThan(40);
  });

  it('calculates fat mass + lean mass = total weight', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 180, weightKg: 85,
      neckCm: 42, waistCm: 90,
    });
    expect(result.fatMass).toBeGreaterThan(0);
    expect(result.leanMass).toBeGreaterThan(0);
    expect(Math.round((result.fatMass + result.leanMass) * 10) / 10).toBeCloseTo(85, 1);
  });

  it('calculates BRI within expected range (1-10)', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 175, weightKg: 78,
      neckCm: 40, waistCm: 85,
    });
    // ~3.1
    expect(result.bri).toBeCloseTo(3.1, 1);
    expect(result.bri).toBeGreaterThan(0);
    expect(result.bri).toBeLessThan(15);
  });

  it('calculates WHtR correctly', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 180, weightKg: 80,
      neckCm: 40, waistCm: 90,
    });
    // WHtR = 90/180 = 0.5
    expect(result.whtr).toBeCloseTo(0.5, 2);
    expect(result.whtrCategory).toBe('elevated'); // ≥ 0.5 is elevated, actually... let me check: 0.5 exactly is 'elevated' since the condition is < 0.5
  });

  it('WHtR < 0.5 returns healthy category', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 180, weightKg: 72,
      neckCm: 38, waistCm: 80,
    });
    // WHtR = 80/180 = 0.444
    expect(result.whtr).toBeCloseTo(0.444, 2);
    expect(result.whtrCategory).toBe('healthy');
  });

  it('provides ideal weight range based on BMI 18.5-25', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 175, weightKg: 78,
      neckCm: 40, waistCm: 85,
    });
    // min = 18.5 * 1.75² = 56.7, max = 25 * 1.75² = 76.6
    expect(result.minIdealWeight).toBeCloseTo(56.7, 0);
    expect(result.maxIdealWeight).toBeCloseTo(76.6, 0);
  });

  // ── BMI category edge cases ──

  it('classifies underweight BMI correctly', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 180, weightKg: 50,
      neckCm: 35, waistCm: 70,
    });
    expect(result.bmiCategory).toBe('underweight');
    expect(result.bmi).toBeLessThan(18.5);
  });

  it('classifies obese class 3 correctly', () => {
    const result = calcBodyComposition({
      gender: 'female', heightCm: 160, weightKg: 120,
      neckCm: 36, waistCm: 105, hipCm: 120,
    });
    expect(result.bmiCategory).toBe('obese-class-3');
    expect(result.bmi).toBeGreaterThanOrEqual(40);
  });

  // ── Edge cases ──

  it('handles minimum valid inputs (edge values)', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 50, weightKg: 20,
      neckCm: 20, waistCm: 40,
    });
    expect(result.error).toBeUndefined();
    expect(result.bmi).toBeGreaterThan(0);
  });

  it('handles maximum valid inputs', () => {
    const result = calcBodyComposition({
      gender: 'female', heightCm: 300, weightKg: 400,
      neckCm: 70, waistCm: 200, hipCm: 200,
    });
    expect(result.error).toBeUndefined();
    expect(result.bmi).toBeGreaterThan(0);
  });

  // ── Invalid inputs ──

  it('returns error for invalid gender', () => {
    const result = calcBodyComposition({
      gender: 'other', heightCm: 175, weightKg: 78,
      neckCm: 40, waistCm: 85,
    });
    expect(result.error).toBeDefined();
    expect(result.bmi).toBeUndefined();
  });

  it('returns error for height below 50cm', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 30, weightKg: 60,
      neckCm: 40, waistCm: 85,
    });
    expect(result.error).toBeDefined();
  });

  it('returns error for height above 300cm', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 350, weightKg: 80,
      neckCm: 40, waistCm: 85,
    });
    expect(result.error).toBeDefined();
  });

  it('returns error for weight below 20kg', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 175, weightKg: 10,
      neckCm: 35, waistCm: 70,
    });
    expect(result.error).toBeDefined();
  });

  it('returns error for neck below 20cm', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 175, weightKg: 78,
      neckCm: 10, waistCm: 85,
    });
    expect(result.error).toBeDefined();
  });

  it('returns error for waist below 40cm', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 175, weightKg: 78,
      neckCm: 40, waistCm: 20,
    });
    expect(result.error).toBeDefined();
  });

  it('returns error for missing hip measurement on female', () => {
    const result = calcBodyComposition({
      gender: 'female', heightCm: 165, weightKg: 65,
      neckCm: 33, waistCm: 75,
    });
    expect(result.error).toBeDefined();
  });

  it('returns null body fat when waist <= neck (male)', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 175, weightKg: 78,
      neckCm: 50, waistCm: 45,
    });
    expect(result.error).toBeUndefined();
    expect(result.bodyFatPct).toBeNull();
  });

  // ── Determinism ──

  it('is deterministic — same inputs always same outputs', () => {
    const input = {
      gender: 'female', heightCm: 165, weightKg: 65,
      neckCm: 33, waistCm: 75, hipCm: 95,
    };
    const a = calcBodyComposition(input);
    const b = calcBodyComposition(input);
    expect(a).toEqual(b);
  });

  // ── Output structure ──

  it('includes all expected output fields', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 175, weightKg: 78,
      neckCm: 40, waistCm: 85,
    });
    expect(result).toHaveProperty('bmi');
    expect(result).toHaveProperty('bmiCategory');
    expect(result).toHaveProperty('bmiLabel');
    expect(result).toHaveProperty('bodyFatPct');
    expect(result).toHaveProperty('fatMass');
    expect(result).toHaveProperty('leanMass');
    expect(result).toHaveProperty('bri');
    expect(result).toHaveProperty('briZone');
    expect(result).toHaveProperty('briInfo');
    expect(result).toHaveProperty('whtr');
    expect(result).toHaveProperty('whtrCategory');
    expect(result).toHaveProperty('whtrInfo');
    expect(result).toHaveProperty('minIdealWeight');
    expect(result).toHaveProperty('maxIdealWeight');
  });

  // ── BRI zone classification ──

  it('classifies BRI zone correctly for lean build', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 180, weightKg: 65,
      neckCm: 36, waistCm: 68,
    });
    // Very low waist → low BRI → lean
    expect(result.briZone).toBe('lean');
    expect(result.briInfo.label).toBe('Lean');
  });

  // ── BMI label structure ──

  it('bmiLabel has label, color, and emoji', () => {
    const result = calcBodyComposition({
      gender: 'male', heightCm: 175, weightKg: 78,
      neckCm: 40, waistCm: 85,
    });
    expect(result.bmiLabel).toHaveProperty('label');
    expect(result.bmiLabel).toHaveProperty('color');
    expect(result.bmiLabel).toHaveProperty('emoji');
  });
});
