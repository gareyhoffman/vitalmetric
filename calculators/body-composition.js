/* ═══════════════════════════════════════════════════════
   VitalMetric — Body Composition Calculator
   Pure function. No DOM. No side effects. Testable.

   Formulas:
   - BMI: weight(kg) / height(m)²
   - Body Fat %: US Navy Method (1984)
   - BRI: Body Roundness Index (Thomas et al., 2013)
   - Waist-to-Height Ratio
   ═══════════════════════════════════════════════════════ */

/**
 * Calculate BMI
 * @param {number} weightKg
 * @param {number} heightCm
 * @returns {number} BMI
 */
function calcBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  if (heightM <= 0 || weightKg <= 0) return null;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * BMI category
 * @param {number} bmi
 * @returns {string}
 */
function getBMICategory(bmi) {
  if (bmi == null) return 'invalid';
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  if (bmi < 35) return 'obese-class-1';
  if (bmi < 40) return 'obese-class-2';
  return 'obese-class-3';
}

const BMI_LABELS = {
  'underweight': { label: 'Underweight', color: '#3B82F6', emoji: '⚖️' },
  'normal': { label: 'Normal Weight', color: '#2E9E6E', emoji: '✅' },
  'overweight': { label: 'Overweight', color: '#F59E0B', emoji: '⚠️' },
  'obese-class-1': { label: 'Obese Class I', color: '#EA580C', emoji: '🔴' },
  'obese-class-2': { label: 'Obese Class II', color: '#DC2626', emoji: '🔴' },
  'obese-class-3': { label: 'Obese Class III', color: '#991B1B', emoji: '🔴' },
  'invalid': { label: 'Invalid', color: '#7A8E8E', emoji: '—' },
};

/**
 * US Navy body fat percentage
 * Male:   86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76
 * Female: 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387
 *
 * All measurements in cm.
 * @param {string} gender - 'male' | 'female'
 * @param {number} heightCm
 * @param {number} neckCm
 * @param {number} waistCm
 * @param {number} [hipCm] — required for female
 * @returns {number|null} body fat percentage (0-100) or null if invalid
 */
function calcNavyBodyFat(gender, heightCm, neckCm, waistCm, hipCm) {
  if (!heightCm || !neckCm || !waistCm) return null;
  if (gender === 'female' && (!hipCm || hipCm <= 0)) return null;

  // US Navy formula uses inches — convert
  const h = heightCm / 2.54;
  const n = neckCm / 2.54;
  const w = waistCm / 2.54;

  let bf;
  if (gender === 'male') {
    if (w <= n) return null;
    bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
  } else {
    const hp = hipCm / 2.54;
    if (w + hp <= n) return null;
    bf = 163.205 * Math.log10(w + hp - n) - 97.684 * Math.log10(h) - 78.387;
  }

  return Math.round(Math.max(2, Math.min(60, bf)) * 10) / 10;
}

/**
 * Body Roundness Index (BRI)
 * BRI = 364.2 − 365.5 × √(1 − (WC/(2π))²/(0.5×H)²)
 * WC = waist in meters, H = height in meters
 * Range typically 1-20. Healthy ≈ 1-3.
 *
 * @param {number} heightCm
 * @param {number} waistCm
 * @returns {number|null}
 */
function calcBRI(heightCm, waistCm) {
  if (!heightCm || !waistCm || heightCm <= 0 || waistCm <= 0) return null;
  const H = heightCm / 100;
  const WC = waistCm / 100;
  const term = (WC / (2 * Math.PI)) ** 2 / (0.5 * H) ** 2;
  if (term >= 1) return null; // under the square root
  return Math.round((364.2 - 365.5 * Math.sqrt(1 - term)) * 10) / 10;
}

/**
 * BRI health zone
 * @param {number} bri
 * @returns {string}
 */
function getBRIZone(bri) {
  if (bri == null) return 'invalid';
  if (bri < 1.5) return 'lean';
  if (bri < 3.0) return 'healthy';
  if (bri < 5.0) return 'overweight';
  return 'obese';
}

const BRI_ZONES = {
  'lean': { label: 'Lean', color: '#3B82F6', description: 'Very low body roundness' },
  'healthy': { label: 'Healthy', color: '#2E9E6E', description: 'Normal body shape' },
  'overweight': { label: 'Overweight', color: '#F59E0B', description: 'Elevated roundness' },
  'obese': { label: 'Obese', color: '#DC2626', description: 'High body roundness' },
  'invalid': { label: 'Invalid', color: '#7A8E8E', description: '—' },
};

/**
 * Waist-to-height ratio
 * Healthy range: < 0.5 (the "keep your waist to less than half your height" rule)
 * @param {number} heightCm
 * @param {number} waistCm
 * @returns {number|null}
 */
function calcWaistHeightRatio(heightCm, waistCm) {
  if (!heightCm || !waistCm || heightCm <= 0) return null;
  return Math.round((waistCm / heightCm) * 1000) / 1000;
}

function getWHtRCategory(ratio) {
  if (ratio == null) return 'invalid';
  if (ratio < 0.4) return 'low';
  if (ratio < 0.5) return 'healthy';
  if (ratio < 0.6) return 'elevated';
  return 'high';
}

const WHTR_LABELS = {
  'low': { label: 'Low', color: '#3B82F6', advice: 'Consider increasing muscle mass' },
  'healthy': { label: 'Healthy', color: '#2E9E6E', advice: 'Keep it up' },
  'elevated': { label: 'Elevated', color: '#F59E0B', advice: 'Consider reducing waist size' },
  'high': { label: 'High Risk', color: '#DC2626', advice: 'Significant health risk. Consult a doctor.' },
  'invalid': { label: 'Invalid', color: '#7A8E8E', advice: '—' },
};

/**
 * Validate body composition inputs
 * @param {Object} inputs
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateInputs(inputs) {
  const errors = [];
  const { gender, heightCm, weightKg, neckCm, waistCm, hipCm } = inputs;

  if (gender !== 'male' && gender !== 'female') {
    errors.push('Gender must be male or female');
  }
  if (heightCm == null || isNaN(heightCm) || heightCm < 50 || heightCm > 300) {
    errors.push('Height must be between 50 and 300 cm');
  }
  if (weightKg == null || isNaN(weightKg) || weightKg < 20 || weightKg > 400) {
    errors.push('Weight must be between 20 and 400 kg');
  }
  if (neckCm == null || isNaN(neckCm) || neckCm < 20 || neckCm > 70) {
    errors.push('Neck must be between 20 and 70 cm');
  }
  if (waistCm == null || isNaN(waistCm) || waistCm < 40 || waistCm > 200) {
    errors.push('Waist must be between 40 and 200 cm');
  }
  if (gender === 'female' && (hipCm == null || isNaN(hipCm) || hipCm < 50 || hipCm > 200)) {
    errors.push('Hip must be between 50 and 200 cm');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Calculate full body composition
 * @param {Object} inputs
 * @param {string} inputs.gender - 'male' | 'female'
 * @param {number} inputs.heightCm
 * @param {number} inputs.weightKg
 * @param {number} inputs.neckCm
 * @param {number} inputs.waistCm
 * @param {number} [inputs.hipCm] — required for female
 * @returns {Object} composition results or { error }
 */
export function calcBodyComposition(inputs) {
  const validation = validateInputs(inputs);
  if (!validation.valid) {
    return { error: validation.errors.join('; ') };
  }

  const { gender, heightCm, weightKg, neckCm, waistCm, hipCm } = inputs;

  // BMI
  const bmi = calcBMI(weightKg, heightCm);
  const bmiCategory = getBMICategory(bmi);
  const bmiLabel = BMI_LABELS[bmiCategory];

  // Navy body fat
  const bodyFatPct = calcNavyBodyFat(gender, heightCm, neckCm, waistCm, hipCm);
  const fatMass = bodyFatPct != null ? Math.round(weightKg * bodyFatPct / 100 * 10) / 10 : null;
  const leanMass = fatMass != null ? Math.round((weightKg - fatMass) * 10) / 10 : null;

  // BRI
  const bri = calcBRI(heightCm, waistCm);
  const briZone = getBRIZone(bri);
  const briInfo = BRI_ZONES[briZone];

  // Waist-to-height
  const whtr = calcWaistHeightRatio(heightCm, waistCm);
  const whtrCategory = getWHtRCategory(whtr);
  const whtrInfo = WHTR_LABELS[whtrCategory];

  // Ideal weight range (BMI 18.5-25)
  const heightM = heightCm / 100;
  const minIdealWeight = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxIdealWeight = Math.round(25 * heightM * heightM * 10) / 10;

  return {
    bmi,
    bmiCategory,
    bmiLabel,
    bodyFatPct,
    fatMass,
    leanMass,
    bri,
    briZone,
    briInfo,
    whtr,
    whtrCategory,
    whtrInfo,
    minIdealWeight,
    maxIdealWeight,
  };
}
