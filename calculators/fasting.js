/* ═══════════════════════════════════════════════════════
   VitalMetric — Fasting Tracker Calculator
   Supports 16:8, 18:6, 20:4, OMAD (23:1), and 5:2 protocols.
   Pure function. No DOM. No side effects.
   ═══════════════════════════════════════════════════════ */

const TIME_BASED_PROTOCOLS = {
  '16:8': { name: '16:8', fastHours: 16, eatHours: 8 },
  '18:6': { name: '18:6', fastHours: 18, eatHours: 6 },
  '20:4': { name: '20:4', fastHours: 20, eatHours: 4 },
  OMAD:    { name: 'OMAD', fastHours: 23, eatHours: 1 },
};

const SPECIAL_PROTOCOLS = {
  '5:2': { name: '5:2', isTimeBased: false },
};

const ALL_PROTOCOL_KEYS = [
  ...Object.keys(TIME_BASED_PROTOCOLS),
  ...Object.keys(SPECIAL_PROTOCOLS),
];

function isValidISODate(str) {
  if (typeof str !== 'string') return false;
  const d = new Date(str);
  return d instanceof Date && !isNaN(d) && str === d.toISOString();
}

function validateInputs(inputs) {
  const errors = [];
  const { protocol, startTime } = inputs;

  if (!protocol || !ALL_PROTOCOL_KEYS.includes(protocol))
    errors.push(`Invalid protocol. Must be one of: ${ALL_PROTOCOL_KEYS.join(', ')}`);

  if (startTime == null || !isValidISODate(startTime))
    errors.push('startTime must be a valid ISO 8601 datetime string');

  return { valid: errors.length === 0, errors };
}

/**
 * Calculate fasting tracker state for time-based protocols.
 * @param {string} protocolName - e.g. '16:8'
 * @param {number} fastHours
 * @param {number} eatHours
 * @param {Date}   startDate
 * @param {Date}   now
 * @returns {Object}
 */
function calcTimeBased(protocolName, fastHours, eatHours, startDate, now) {
  const totalCycleHours = fastHours + eatHours;
  const fastEnd = new Date(startDate.getTime() + fastHours * 3600000);
  const endDate = new Date(startDate.getTime() + totalCycleHours * 3600000);

  const totalCycleMs = totalCycleHours * 3600000;
  const elapsedMs = now.getTime() - startDate.getTime();

  let phase, isFasting, progressPct, timeRemainingMinutes;

  if (now < startDate) {
    // Fast hasn't started yet
    phase = 'fasting';
    isFasting = false;
    progressPct = 0;
    timeRemainingMinutes = Math.round((endDate.getTime() - now.getTime()) / 60000);
  } else if (now < fastEnd) {
    // Currently in the fasting window
    phase = 'fasting';
    isFasting = true;
    progressPct = Math.min(100, Math.round((elapsedMs / totalCycleMs) * 10000) / 100);
    timeRemainingMinutes = Math.round((endDate.getTime() - now.getTime()) / 60000);
  } else if (now < endDate) {
    // Currently in the eating window
    phase = 'eating';
    isFasting = false;
    progressPct = Math.min(100, Math.round((elapsedMs / totalCycleMs) * 10000) / 100);
    timeRemainingMinutes = Math.round((endDate.getTime() - now.getTime()) / 60000);
  } else {
    // Cycle complete
    phase = 'complete';
    isFasting = false;
    progressPct = 100;
    timeRemainingMinutes = 0;
  }

  return {
    protocolName,
    fastDurationHours: fastHours,
    eatDurationHours: eatHours,
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
    progressPct,
    timeRemainingMinutes,
    isFasting,
    phase,
  };
}

/**
 * Fasting Tracker Calculator
 * @param {Object} inputs
 * @param {string} inputs.protocol  - '16:8' | '18:6' | '20:4' | 'OMAD' | '5:2'
 * @param {string} inputs.startTime - ISO 8601 datetime string (when the fast started)
 * @returns {Object} Fasting state or error
 */
export function calcFasting(inputs) {
  const v = validateInputs(inputs);
  if (!v.valid) return { error: v.errors.join('; ') };

  const { protocol, startTime } = inputs;
  const now = new Date();
  const startDate = new Date(startTime);

  // 5:2 special handling — not time-based
  if (SPECIAL_PROTOCOLS[protocol]) {
    return {
      protocolName: '5:2',
      isTimeBased: false,
      schedule: 'Eat normally 5 days, restrict to 500-600 calories 2 non-consecutive days',
    };
  }

  // Time-based protocols
  const def = TIME_BASED_PROTOCOLS[protocol];
  return calcTimeBased(def.name, def.fastHours, def.eatHours, startDate, now);
}
