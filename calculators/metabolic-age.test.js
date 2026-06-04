/* ═══════════════════════════════════════════════════════
   VitalMetric — Metabolic Age Calculator Tests
   Vitest. Tests pure functions, not the DOM.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from 'vitest';
import { calcMetabolicAge } from './metabolic-age.js';

describe('calcMetabolicAge', () => {
  // ── Known correct outputs ──

  it('calculates correct BMR for 35yo male (Mifflin-St Jeor)', () => {
    const result = calcMetabolicAge({
      age: 35,
      gender: 'male',
      heightCm: 175,
      weightKg: 78,
      activityLevel: 'light',
    });
    // BMR = 10*78 + 6.25*175 - 5*35 + 5 = 780 + 1093.75 - 175 + 5 = 1703.75
    expect(result.bmr).toBeCloseTo(1704, -1);
    expect(result.error).toBeUndefined();
  });

  it('calculates correct BMR for 45yo female (Mifflin-St Jeor)', () => {
    const result = calcMetabolicAge({
      age: 45,
      gender: 'female',
      heightCm: 165,
      weightKg: 70,
      activityLevel: 'moderate',
    });
    // BMR = 10*70 + 6.25*165 - 5*45 - 161 = 700 + 1031.25 - 225 - 161 = 1345.25
    expect(result.bmr).toBeCloseTo(1345, -1);
    expect(result.error).toBeUndefined();
  });

  // ── Edge cases ──

  it('handles minimum age (10)', () => {
    const result = calcMetabolicAge({
      age: 10, gender: 'male', heightCm: 140, weightKg: 35, activityLevel: 'sedentary',
    });
    expect(result.error).toBeUndefined();
    expect(result.bmr).toBeGreaterThan(0);
    expect(result.metabolicAge).toBeGreaterThan(0);
  });

  it('handles maximum age (120)', () => {
    const result = calcMetabolicAge({
      age: 120, gender: 'female', heightCm: 160, weightKg: 60, activityLevel: 'sedentary',
    });
    expect(result.error).toBeUndefined();
    expect(result.bmr).toBeGreaterThan(0);
  });

  it('handles minimum weight (20kg)', () => {
    const result = calcMetabolicAge({
      age: 30, gender: 'male', heightCm: 160, weightKg: 20, activityLevel: 'light',
    });
    expect(result.error).toBeUndefined();
    expect(result.bmr).toBeGreaterThan(0);
  });

  it('handles maximum weight (400kg)', () => {
    const result = calcMetabolicAge({
      age: 40, gender: 'female', heightCm: 170, weightKg: 400, activityLevel: 'sedentary',
    });
    expect(result.error).toBeUndefined();
    expect(result.bmr).toBeGreaterThan(0);
  });

  // ── Invalid inputs ──

  it('returns error for age below 10', () => {
    const result = calcMetabolicAge({
      age: 5, gender: 'male', heightCm: 140, weightKg: 40, activityLevel: 'sedentary',
    });
    expect(result.error).toBeDefined();
    expect(result.bmr).toBeUndefined();
  });

  it('returns error for age above 120', () => {
    const result = calcMetabolicAge({
      age: 150, gender: 'male', heightCm: 175, weightKg: 80, activityLevel: 'sedentary',
    });
    expect(result.error).toBeDefined();
  });

  it('returns error for negative age', () => {
    const result = calcMetabolicAge({
      age: -5, gender: 'male', heightCm: 175, weightKg: 80, activityLevel: 'sedentary',
    });
    expect(result.error).toBeDefined();
  });

  it('returns error for height below 50cm', () => {
    const result = calcMetabolicAge({
      age: 30, gender: 'male', heightCm: 30, weightKg: 60, activityLevel: 'sedentary',
    });
    expect(result.error).toBeDefined();
  });

  it('returns error for height above 300cm', () => {
    const result = calcMetabolicAge({
      age: 30, gender: 'male', heightCm: 350, weightKg: 80, activityLevel: 'sedentary',
    });
    expect(result.error).toBeDefined();
  });

  it('returns error for weight below 20kg', () => {
    const result = calcMetabolicAge({
      age: 30, gender: 'female', heightCm: 165, weightKg: 10, activityLevel: 'sedentary',
    });
    expect(result.error).toBeDefined();
  });

  it('returns error for invalid gender', () => {
    const result = calcMetabolicAge({
      age: 30, gender: 'other', heightCm: 175, weightKg: 80, activityLevel: 'sedentary',
    });
    expect(result.error).toBeDefined();
  });

  it('returns error for invalid activity level', () => {
    const result = calcMetabolicAge({
      age: 30, gender: 'male', heightCm: 175, weightKg: 80, activityLevel: 'superactive',
    });
    expect(result.error).toBeDefined();
  });

  // ── Determinism ──

  it('is deterministic — same inputs always same outputs', () => {
    const input = {
      age: 45, gender: 'female', heightCm: 165, weightKg: 70, activityLevel: 'moderate',
    };
    const a = calcMetabolicAge(input);
    const b = calcMetabolicAge(input);
    expect(a).toEqual(b);
  });

  // ── Health score ──

  it('returns health score between 0 and 100', () => {
    const inputs = [
      { age: 25, gender: 'male', heightCm: 180, weightKg: 75, activityLevel: 'active' },
      { age: 55, gender: 'female', heightCm: 165, weightKg: 80, activityLevel: 'sedentary' },
      { age: 40, gender: 'male', heightCm: 175, weightKg: 90, activityLevel: 'moderate' },
    ];
    for (const input of inputs) {
      const result = calcMetabolicAge(input);
      expect(result.healthScore).toBeGreaterThanOrEqual(0);
      expect(result.healthScore).toBeLessThanOrEqual(100);
    }
  });

  // ── TDEE calculation ──

  it('TDEE is always greater than BMR', () => {
    const result = calcMetabolicAge({
      age: 35, gender: 'male', heightCm: 175, weightKg: 78, activityLevel: 'light',
    });
    expect(result.tdee).toBeGreaterThan(result.bmr);
  });

  it('higher activity produces higher TDEE', () => {
    const base = { age: 35, gender: 'male', heightCm: 175, weightKg: 78 };
    const sedentary = calcMetabolicAge({ ...base, activityLevel: 'sedentary' });
    const extreme = calcMetabolicAge({ ...base, activityLevel: 'extreme' });
    expect(extreme.tdee).toBeGreaterThan(sedentary.tdee);
  });

  // ── Metabolic age relationships ──

  it('metabolic age is defined for all valid inputs', () => {
    const result = calcMetabolicAge({
      age: 52, gender: 'male', heightCm: 175, weightKg: 82, activityLevel: 'light',
    });
    expect(result.metabolicAge).toBeGreaterThan(0);
    expect(result.difference).toBe(result.actualAge - result.metabolicAge);
  });
});
