import { describe, it, expect } from 'vitest';
import { calcMacros } from './macro.js';

describe('calcMacros', () => {
  // ── Known outputs ──
  it('calculates TDEE and macro split for balanced diet', () => {
    const result = calcMacros({
      age: 35, gender: 'male', heightCm: 175, weightKg: 78,
      activityLevel: 'light', goal: 'maintain', diet: 'balanced',
    });
    // BMR ~1704, TDEE ~2343
    expect(result.bmr).toBe(1704);
    expect(result.tdee).toBe(2343);
    expect(result.targetCalories).toBe(2343);
    expect(result.dietName).toBe('Balanced');
    expect(result.macros.protein.grams).toBeGreaterThan(100);
    expect(result.macros.carbs.grams).toBeGreaterThan(100);
    expect(result.macros.fat.grams).toBeGreaterThan(40);
    expect(result.error).toBeUndefined();
  });

  it('lose goal subtracts 500 from TDEE', () => {
    const result = calcMacros({
      age: 35, gender: 'male', heightCm: 175, weightKg: 78,
      activityLevel: 'light', goal: 'lose', diet: 'balanced',
    });
    expect(result.targetCalories).toBe(1843); // 2343 - 500
  });

  it('gain goal adds 500 to TDEE', () => {
    const result = calcMacros({
      age: 35, gender: 'male', heightCm: 175, weightKg: 78,
      activityLevel: 'light', goal: 'gain', diet: 'balanced',
    });
    expect(result.targetCalories).toBe(2843); // 2343 + 500
  });

  it('never drops below 1200 calories', () => {
    const result = calcMacros({
      age: 70, gender: 'female', heightCm: 150, weightKg: 45,
      activityLevel: 'sedentary', goal: 'lose', diet: 'balanced',
    });
    expect(result.targetCalories).toBeGreaterThanOrEqual(1200);
  });

  // ── Keto macro ratios ──
  it('keto diet has very low carbs and high fat', () => {
    const result = calcMacros({
      age: 35, gender: 'male', heightCm: 175, weightKg: 78,
      activityLevel: 'light', goal: 'maintain', diet: 'keto',
    });
    expect(result.dietName).toBe('Ketogenic');
    expect(result.macros.fat.grams).toBeGreaterThan(result.macros.protein.grams);
    expect(result.macros.carbs.grams).toBeLessThan(50); // very low carb
  });

  // ── High-protein ──
  it('high-protein diet has most grams from protein', () => {
    const result = calcMacros({
      age: 35, gender: 'male', heightCm: 175, weightKg: 78,
      activityLevel: 'light', goal: 'maintain', diet: 'high-protein',
    });
    expect(result.dietName).toBe('High Protein');
    expect(result.macros.protein.grams).toBeGreaterThan(result.macros.fat.grams);
  });

  // ── All diet types ──
  for (const diet of ['balanced', 'keto', 'paleo', 'mediterranean', 'high-protein']) {
    it(`returns valid macros for ${diet} diet`, () => {
      const result = calcMacros({
        age: 35, gender: 'female', heightCm: 165, weightKg: 65,
        activityLevel: 'moderate', goal: 'maintain', diet,
      });
      expect(result.error).toBeUndefined();
      expect(result.macros.protein.grams).toBeGreaterThan(50);
      expect(result.macros.carbs.grams).toBeGreaterThan(0);
      expect(result.macros.fat.grams).toBeGreaterThan(20);
      expect(result.macros.fiber).toBeGreaterThan(0);
    });
  }

  // ── Fiber by gender ──
  it('male gets higher fiber recommendation', () => {
    const male = calcMacros({
      age: 35, gender: 'male', heightCm: 175, weightKg: 78,
      activityLevel: 'light', goal: 'maintain', diet: 'balanced',
    });
    const female = calcMacros({
      age: 35, gender: 'female', heightCm: 165, weightKg: 65,
      activityLevel: 'light', goal: 'maintain', diet: 'balanced',
    });
    expect(male.macros.fiber).toBeGreaterThan(female.macros.fiber);
  });

  // ── Calorie math: protein_cal + carbs_cal + fat_cal ≈ target ──
  it('macro calories sum to roughly target (within rounding)', () => {
    const result = calcMacros({
      age: 35, gender: 'male', heightCm: 175, weightKg: 78,
      activityLevel: 'light', goal: 'maintain', diet: 'balanced',
    });
    const sum = result.macros.protein.calories + result.macros.carbs.calories + result.macros.fat.calories;
    expect(Math.abs(sum - result.targetCalories)).toBeLessThan(20);
  });

  // ── Invalid inputs ──
  it('returns error for invalid diet', () => {
    const result = calcMacros({
      age: 35, gender: 'male', heightCm: 175, weightKg: 78,
      activityLevel: 'light', goal: 'maintain', diet: 'carnivore',
    });
    expect(result.error).toBeDefined();
  });

  it('returns error for invalid goal', () => {
    const result = calcMacros({
      age: 35, gender: 'male', heightCm: 175, weightKg: 78,
      activityLevel: 'light', goal: 'bulk', diet: 'balanced',
    });
    expect(result.error).toBeDefined();
  });

  // ── Determinism ──
  it('is deterministic', () => {
    const input = { age: 35, gender: 'male', heightCm: 175, weightKg: 78, activityLevel: 'light', goal: 'maintain', diet: 'balanced' };
    const a = calcMacros(input);
    const b = calcMacros(input);
    expect(a).toEqual(b);
  });
});
