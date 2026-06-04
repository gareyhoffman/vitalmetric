import { describe, it, expect } from 'vitest';
import { calcHydration } from './hydration.js';

describe('calcHydration', () => {
  it('calculates baseline for 78kg sedentary moderate climate', () => {
    const r = calcHydration({ weightKg: 78, activityLevel: 'sedentary', climate: 'moderate' });
    expect(r.totalMl).toBe(2730); // 78*35 + 0 = 2730
    expect(r.liters).toBe(2.7);
    expect(r.error).toBeUndefined();
  });

  it('adds activity extra for active person', () => {
    const r = calcHydration({ weightKg: 78, activityLevel: 'active', climate: 'moderate' });
    expect(r.totalMl).toBe(3430); // 78*35 + 700 = 3430
  });

  it('multiplies by climate factor for hot climate', () => {
    const r = calcHydration({ weightKg: 78, activityLevel: 'sedentary', climate: 'hot' });
    expect(r.totalMl).toBe(3276); // (78*35 + 0) * 1.2 = 3276
  });

  it('returns electrolyte tip for extreme activity', () => {
    const r = calcHydration({ weightKg: 78, activityLevel: 'extreme', climate: 'moderate' });
    expect(r.electrolyteTip).toContain('supplementation');
  });

  it('returns standard tip for sedentary', () => {
    const r = calcHydration({ weightKg: 78, activityLevel: 'sedentary', climate: 'moderate' });
    expect(r.electrolyteTip).toContain('Standard diet');
  });

  it('includes cups and ounces', () => {
    const r = calcHydration({ weightKg: 78, activityLevel: 'sedentary', climate: 'moderate' });
    expect(r.cups).toBeGreaterThan(8);
    expect(r.ounces).toBeGreaterThan(50);
  });

  it('rejects invalid weight', () => {
    expect(calcHydration({ weightKg: 10, activityLevel: 'sedentary', climate: 'moderate' }).error).toBeDefined();
  });

  it('rejects invalid activity', () => {
    expect(calcHydration({ weightKg: 78, activityLevel: 'insane', climate: 'moderate' }).error).toBeDefined();
  });

  it('rejects invalid climate', () => {
    expect(calcHydration({ weightKg: 78, activityLevel: 'sedentary', climate: 'tropical' }).error).toBeDefined();
  });

  it('is deterministic', () => {
    const i = { weightKg: 78, activityLevel: 'light', climate: 'hot' };
    expect(calcHydration(i)).toEqual(calcHydration(i));
  });
});
