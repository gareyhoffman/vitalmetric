import { describe, it, expect } from 'vitest';
import { calcFasting } from './fasting.js';

describe('calcFasting', () => {
  // Helper: create an ISO string offset from now
  const isoOffsetHours = (hours) =>
    new Date(Date.now() + hours * 3600000).toISOString();

  it('16:8 protocol gives correct fast/eat durations', () => {
    const start = isoOffsetHours(-2); // started 2 hours ago
    const r = calcFasting({ protocol: '16:8', startTime: start });

    expect(r.error).toBeUndefined();
    expect(r.protocolName).toBe('16:8');
    expect(r.fastDurationHours).toBe(16);
    expect(r.eatDurationHours).toBe(8);
    expect(r.phase).toBe('fasting'); // 2h into a 16h fast
    expect(r.isFasting).toBe(true);
    expect(r.startTime).toBe(start);
  });

  it('18:6 protocol gives correct durations', () => {
    const start = isoOffsetHours(-1);
    const r = calcFasting({ protocol: '18:6', startTime: start });

    expect(r.error).toBeUndefined();
    expect(r.protocolName).toBe('18:6');
    expect(r.fastDurationHours).toBe(18);
    expect(r.eatDurationHours).toBe(6);
    expect(r.isFasting).toBe(true);
  });

  it('20:4 protocol gives correct durations', () => {
    const start = isoOffsetHours(-21); // 21h ago → 1h into eating window
    const r = calcFasting({ protocol: '20:4', startTime: start });

    expect(r.error).toBeUndefined();
    expect(r.protocolName).toBe('20:4');
    expect(r.fastDurationHours).toBe(20);
    expect(r.eatDurationHours).toBe(4);
    expect(r.phase).toBe('eating');
    expect(r.isFasting).toBe(false);
  });

  it('OMAD protocol gives correct durations (23:1)', () => {
    const start = isoOffsetHours(-1);
    const r = calcFasting({ protocol: 'OMAD', startTime: start });

    expect(r.error).toBeUndefined();
    expect(r.protocolName).toBe('OMAD');
    expect(r.fastDurationHours).toBe(23);
    expect(r.eatDurationHours).toBe(1);
  });

  it('progress percentage is between 0 and 100 for active fast', () => {
    const start = isoOffsetHours(-4); // 4h into a 16h fast
    const r = calcFasting({ protocol: '16:8', startTime: start });

    expect(r.progressPct).toBeGreaterThanOrEqual(0);
    expect(r.progressPct).toBeLessThanOrEqual(100);
    // 4h / 24h total cycle ≈ 16.67%
    expect(r.progressPct).toBeCloseTo(16.67, -1); // within ~10
  });

  it('future startTime returns 0% progress', () => {
    const start = isoOffsetHours(3); // starts 3 hours in the future
    const r = calcFasting({ protocol: '16:8', startTime: start });

    expect(r.error).toBeUndefined();
    expect(r.progressPct).toBe(0);
    expect(r.phase).toBe('fasting');
    expect(r.isFasting).toBe(false);
    expect(r.timeRemainingMinutes).toBeGreaterThan(0);
  });

  it('past endTime returns 100% and phase=complete', () => {
    const start = isoOffsetHours(-30); // 30h ago → full 24h cycle complete
    const r = calcFasting({ protocol: '16:8', startTime: start });

    expect(r.error).toBeUndefined();
    expect(r.progressPct).toBe(100);
    expect(r.phase).toBe('complete');
    expect(r.isFasting).toBe(false);
    expect(r.timeRemainingMinutes).toBe(0);
  });

  it('invalid protocol returns error', () => {
    const start = isoOffsetHours(-2);
    const r = calcFasting({ protocol: '10:14', startTime: start });

    expect(r.error).toBeDefined();
    expect(r.error).toContain('Invalid protocol');
  });

  it('missing protocol returns error', () => {
    const r = calcFasting({ protocol: '', startTime: isoOffsetHours(-2) });

    expect(r.error).toBeDefined();
    expect(r.error).toContain('Invalid protocol');
  });

  it('invalid startTime returns error', () => {
    const r = calcFasting({ protocol: '16:8', startTime: 'not-a-date' });

    expect(r.error).toBeDefined();
    expect(r.error).toContain('valid ISO');
  });

  it('null startTime returns error', () => {
    const r = calcFasting({ protocol: '16:8', startTime: null });

    expect(r.error).toBeDefined();
    expect(r.error).toContain('valid ISO');
  });

  it('5:2 protocol returns isTimeBased: false', () => {
    const r = calcFasting({ protocol: '5:2', startTime: isoOffsetHours(-2) });

    expect(r.error).toBeUndefined();
    expect(r.protocolName).toBe('5:2');
    expect(r.isTimeBased).toBe(false);
    expect(r.schedule).toContain('500-600');
    expect(r.schedule).toContain('non-consecutive');
    // Should NOT have time-based fields
    expect(r.fastDurationHours).toBeUndefined();
    expect(r.phase).toBeUndefined();
  });

  it('is deterministic — consecutive calls produce identical results', () => {
    const start = isoOffsetHours(-5);
    const r1 = calcFasting({ protocol: '18:6', startTime: start });
    const r2 = calcFasting({ protocol: '18:6', startTime: start });

    // Non-time-dependent fields must match exactly
    expect(r1.protocolName).toBe(r2.protocolName);
    expect(r1.fastDurationHours).toBe(r2.fastDurationHours);
    expect(r1.eatDurationHours).toBe(r2.eatDurationHours);
    expect(r1.startTime).toBe(r2.startTime);
    expect(r1.phase).toBe(r2.phase);
    expect(r1.isFasting).toBe(r2.isFasting);

    // Time-dependent fields must be very close
    expect(Math.abs(r1.progressPct - r2.progressPct)).toBeLessThan(0.5);
    expect(Math.abs(r1.timeRemainingMinutes - r2.timeRemainingMinutes)).toBeLessThan(1);
  });

  it('eating phase detected correctly for mid-cycle', () => {
    const start = isoOffsetHours(-18); // 18h ago for 16:8 → 2h into eating
    const r = calcFasting({ protocol: '16:8', startTime: start });

    expect(r.error).toBeUndefined();
    expect(r.phase).toBe('eating');
    expect(r.isFasting).toBe(false);
    expect(r.progressPct).toBeGreaterThan(50);
    expect(r.progressPct).toBeLessThan(100);
  });
});
