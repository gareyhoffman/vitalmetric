/* ═══════════════════════════════════════════════════════
   VitalMetric — Hydration Calculator
   Based on EFSA adequate intake guidelines (2010).
   Pure function. No DOM. No side effects.
   ═══════════════════════════════════════════════════════ */

// Base: 35ml per kg for adults (EFSA)
// Adjustments for activity and climate

const CLIMATE_FACTORS = { cold: 1.0, moderate: 1.0, hot: 1.2 };
const ACTIVITY_EXTRA = { sedentary: 0, light: 300, moderate: 500, active: 700, extreme: 1000 };

function validateInputs(inputs) {
  const errors = [];
  const { weightKg, activityLevel, climate } = inputs;
  if (weightKg == null || isNaN(weightKg) || weightKg < 20 || weightKg > 400)
    errors.push('Weight must be between 20 and 400 kg');
  if (!ACTIVITY_EXTRA.hasOwnProperty(activityLevel))
    errors.push('Invalid activity level');
  if (!CLIMATE_FACTORS[climate])
    errors.push('Climate must be cold, moderate, or hot');
  return { valid: errors.length === 0, errors };
}

/**
 * @param {Object} inputs
 * @param {number} inputs.weightKg
 * @param {string} inputs.activityLevel
 * @param {string} inputs.climate - 'cold' | 'moderate' | 'hot'
 * @returns {Object}
 */
export function calcHydration(inputs) {
  const v = validateInputs(inputs);
  if (!v.valid) return { error: v.errors.join('; ') };

  const { weightKg, activityLevel, climate } = inputs;

  // Base: 35ml/kg
  const baseMl = weightKg * 35;

  // Activity adjustment: add ml for exercise
  const activityMl = ACTIVITY_EXTRA[activityLevel];

  // Climate adjustment
  const climateFactor = CLIMATE_FACTORS[climate];

  const totalMl = Math.round((baseMl + activityMl) * climateFactor);
  const liters = Math.round(totalMl / 100) / 10; // to 1 decimal
  const cups = Math.round(totalMl / 237 * 10) / 10; // 1 cup = 237ml
  const ounces = Math.round(totalMl / 29.5735);

  // Electrolyte guidance
  let electrolyteTip;
  if (activityLevel === 'extreme' || climate === 'hot') {
    electrolyteTip = 'Consider electrolyte supplementation — especially sodium and potassium. Sweat loss is significant at this activity/climate level.';
  } else if (activityLevel === 'active' || activityLevel === 'moderate') {
    electrolyteTip = 'Light electrolyte support may help. A pinch of salt in your water or a sports drink on workout days is sufficient.';
  } else {
    electrolyteTip = 'Standard diet should cover electrolyte needs. No additional supplementation required.';
  }

  return {
    totalMl,
    liters,
    cups,
    ounces,
    electrolyteTip,
  };
}
