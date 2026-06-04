/* ═══════════════════════════════════════════════════════
   VitalMetric — Weight Loss Planner Calculator Tests
   Vitest. Tests pure functions, not the DOM.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from 'vitest';
import { calcWeightLoss } from './weight-loss.js';

describe('calcWeightLoss', () => {
  // ── Known correct outputs ──

  it('calculates correct plan: 100kg→90kg at 500cal deficit', () => {
    const result = calcWeightLoss({
      currentWeightKg: 100,
      goalWeightKg: 90,
      dailyDeficit: 500,
      gender: 'male',
    });

    expect(result.error).toBeUndefined();
    // 1 lb/wk → 0.45 kg/wk → 10 kg / 0.45 = 22.2 weeks
    expect(result.weeksToGoal).toBeCloseTo(22.2, 1);
    expect(result.weeklyWeightLossKg).toBeCloseTo(0.45, 2);
    expect(result.totalDeficitKcal).toBeGreaterThan(70000);
    expect(result.totalDeficitKcal).toBeLessThan(80000);
    expect(result.milestones.length).toBeGreaterThan(0);
    expect(result.completionDate).toBeDefined();
  });

  it('1000cal deficit takes roughly half the time of 500cal', () => {
    const plan500 = calcWeightLoss({
      currentWeightKg: 100,
      goalWeightKg: 90,
      dailyDeficit: 500,
      gender: 'male',
    });

    const plan1000 = calcWeightLoss({
      currentWeightKg: 100,
      goalWeightKg: 90,
      dailyDeficit: 1000,
      gender: 'male',
    });

    expect(plan500.error).toBeUndefined();
    expect(plan1000.error).toBeUndefined();
    // 1000 cal deficit should double weekly loss → half the weeks
    expect(plan1000.weeksToGoal).toBeCloseTo(plan500.weeksToGoal / 2, 0);
    expect(plan1000.weeklyWeightLossKg).toBeCloseTo(plan500.weeklyWeightLossKg * 2, 1);
  });

  // ── Validation: goal must be less than current ──

  it('returns error when goal weight is not less than current weight', () => {
    const result = calcWeightLoss({
      currentWeightKg: 80,
      goalWeightKg: 80,
      dailyDeficit: 500,
      gender: 'male',
    });

    expect(result.error).toBeDefined();
    expect(result.weeksToGoal).toBeUndefined();
  });

  it('returns error when goal weight exceeds current weight', () => {
    const result = calcWeightLoss({
      currentWeightKg: 80,
      goalWeightKg: 90,
      dailyDeficit: 500,
      gender: 'female',
    });

    expect(result.error).toBeDefined();
    expect(result.weeksToGoal).toBeUndefined();
  });

  // ── Invalid deficit range ──

  it('returns error for daily deficit below 100 kcal', () => {
    const result = calcWeightLoss({
      currentWeightKg: 80,
      goalWeightKg: 70,
      dailyDeficit: 50,
      gender: 'male',
    });

    expect(result.error).toBeDefined();
    expect(result.error).toContain('100');
  });

  it('returns error for daily deficit above 2000 kcal', () => {
    const result = calcWeightLoss({
      currentWeightKg: 80,
      goalWeightKg: 70,
      dailyDeficit: 2500,
      gender: 'female',
    });

    expect(result.error).toBeDefined();
    expect(result.error).toContain('2000');
  });

  // ── Invalid weight ranges ──

  it('returns error for current weight below 20kg', () => {
    const result = calcWeightLoss({
      currentWeightKg: 15,
      goalWeightKg: 14,
      dailyDeficit: 500,
      gender: 'male',
    });

    expect(result.error).toBeDefined();
  });

  it('returns error for current weight above 400kg', () => {
    const result = calcWeightLoss({
      currentWeightKg: 450,
      goalWeightKg: 200,
      dailyDeficit: 500,
      gender: 'female',
    });

    expect(result.error).toBeDefined();
  });

  it('returns error for invalid gender', () => {
    const result = calcWeightLoss({
      currentWeightKg: 100,
      goalWeightKg: 90,
      dailyDeficit: 500,
      gender: 'other',
    });

    expect(result.error).toBeDefined();
    expect(result.weeksToGoal).toBeUndefined();
  });

  // ── Determinism ──

  it('is deterministic — same inputs always produce same outputs', () => {
    const input = {
      currentWeightKg: 95,
      goalWeightKg: 75,
      dailyDeficit: 600,
      gender: 'female',
    };
    const a = calcWeightLoss(input);
    const b = calcWeightLoss(input);
    expect(a).toEqual(b);
  });

  // ── Output structure ──

  it('includes all expected output fields on success', () => {
    const result = calcWeightLoss({
      currentWeightKg: 90,
      goalWeightKg: 80,
      dailyDeficit: 400,
      gender: 'male',
    });

    expect(result).toHaveProperty('weeksToGoal');
    expect(result).toHaveProperty('completionDate');
    expect(result).toHaveProperty('weeklyWeightLossKg');
    expect(result).toHaveProperty('totalDeficitKcal');
    expect(result).toHaveProperty('milestones');
    expect(result.error).toBeUndefined();
  });

  // ── Milestones structure ──

  it('milestones contain week and projectedWeight for each week', () => {
    const result = calcWeightLoss({
      currentWeightKg: 80,
      goalWeightKg: 75,
      dailyDeficit: 500,
      gender: 'female',
    });

    expect(result.error).toBeUndefined();
    expect(Array.isArray(result.milestones)).toBe(true);
    expect(result.milestones.length).toBeGreaterThan(0);

    result.milestones.forEach((m) => {
      expect(m).toHaveProperty('week');
      expect(m).toHaveProperty('projectedWeight');
      expect(typeof m.week).toBe('number');
      expect(typeof m.projectedWeight).toBe('number');
    });

    // Final milestone should not drop below goal weight
    const lastMilestone = result.milestones[result.milestones.length - 1];
    expect(lastMilestone.projectedWeight).toBeGreaterThanOrEqual(75);
  });

  // ── Edge cases ──

  it('handles minimum valid deficit (100 kcal)', () => {
    const result = calcWeightLoss({
      currentWeightKg: 80,
      goalWeightKg: 79,
      dailyDeficit: 100,
      gender: 'male',
    });

    expect(result.error).toBeUndefined();
    expect(result.weeksToGoal).toBeGreaterThan(0);
  });

  it('handles maximum valid deficit (2000 kcal)', () => {
    const result = calcWeightLoss({
      currentWeightKg: 150,
      goalWeightKg: 100,
      dailyDeficit: 2000,
      gender: 'female',
    });

    expect(result.error).toBeUndefined();
    expect(result.weeksToGoal).toBeGreaterThan(0);
  });

  // ── Completion date is a valid future ISO string ──

  it('completionDate is a valid ISO string in the future', () => {
    const result = calcWeightLoss({
      currentWeightKg: 100,
      goalWeightKg: 90,
      dailyDeficit: 500,
      gender: 'male',
    });

    expect(result.error).toBeUndefined();
    const date = new Date(result.completionDate);
    expect(date.toString()).not.toContain('Invalid');
    const now = new Date();
    expect(date.getTime()).toBeGreaterThan(now.getTime() - 1000); // allow 1s tolerance
  });

  // ── totalDeficitKcal consistency ──

  it('totalDeficitKcal equals dailyDeficit × 7 × weeksToGoal (approximately)', () => {
    const result = calcWeightLoss({
      currentWeightKg: 100,
      goalWeightKg: 85,
      dailyDeficit: 500,
      gender: 'female',
    });

    expect(result.error).toBeUndefined();
    const expectedTotal = 500 * 7 * result.weeksToGoal;
    expect(result.totalDeficitKcal).toBeCloseTo(expectedTotal, -4); // within 5000 kcal
  });
});
