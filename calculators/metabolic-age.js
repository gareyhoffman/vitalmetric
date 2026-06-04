/* ═══════════════════════════════════════════════════════
   VitalMetric — Metabolic Age Calculator
   Pure function. No DOM. No side effects. Testable.
   ═══════════════════════════════════════════════════════ */

/**
 * Calculate BMR using Mifflin-St Jeor equation (1990)
 * @param {string} gender - 'male' | 'female'
 * @param {number} weightKg
 * @param {number} heightCm
 * @param {number} age
 * @returns {number} BMR in kcal/day
 */
function calcBMR(gender, weightKg, heightCm, age) {
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

/**
 * Activity level multipliers
 */
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extreme: 1.9,
};

/**
 * Population average BMR by age group (from NHANES data approximations)
 * Format: { male: { ageRange: bmr }, female: { ageRange: bmr } }
 */
const POPULATION_BMR = {
  male: [
    { max: 18, bmr: 1750 },
    { max: 30, bmr: 1700 },
    { max: 40, bmr: 1650 },
    { max: 50, bmr: 1580 },
    { max: 60, bmr: 1520 },
    { max: 70, bmr: 1460 },
    { max: 80, bmr: 1400 },
    { max: Infinity, bmr: 1350 },
  ],
  female: [
    { max: 18, bmr: 1400 },
    { max: 30, bmr: 1350 },
    { max: 40, bmr: 1300 },
    { max: 50, bmr: 1260 },
    { max: 60, bmr: 1200 },
    { max: 70, bmr: 1150 },
    { max: 80, bmr: 1100 },
    { max: Infinity, bmr: 1050 },
  ],
};

function getPopulationBmr(gender, age) {
  const table = POPULATION_BMR[gender] || POPULATION_BMR.male;
  for (const row of table) {
    if (age <= row.max) return row.bmr;
  }
  return table[table.length - 1].bmr;
}

/**
 * Calculate health score (0-100) based on metabolic age difference
 * Higher metabolic age than actual = lower score
 */
function calcHealthScore(metabolicAge, actualAge) {
  if (actualAge <= 0) return 50;
  const ratio = metabolicAge / actualAge;
  // ratio < 1 means younger metabolism = good
  // ratio > 1 means older metabolism = bad
  const raw = (1 - (ratio - 1)) * 100;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

/**
 * Validate calculator inputs
 * @param {Object} inputs
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateInputs(inputs) {
  const errors = [];
  const { age, gender, heightCm, weightKg, activityLevel } = inputs;

  if (age == null || isNaN(age) || age < 10 || age > 120) {
    errors.push('Age must be between 10 and 120');
  }
  if (gender !== 'male' && gender !== 'female') {
    errors.push('Gender must be male or female');
  }
  if (heightCm == null || isNaN(heightCm) || heightCm < 50 || heightCm > 300) {
    errors.push('Height must be between 50 and 300 cm');
  }
  if (weightKg == null || isNaN(weightKg) || weightKg < 20 || weightKg > 400) {
    errors.push('Weight must be between 20 and 400 kg');
  }
  if (!ACTIVITY_MULTIPLIERS[activityLevel]) {
    errors.push('Invalid activity level');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Calculate metabolic age from user inputs
 * @param {Object} inputs
 * @param {number} inputs.age
 * @param {string} inputs.gender - 'male' | 'female'
 * @param {number} inputs.heightCm
 * @param {number} inputs.weightKg
 * @param {string} inputs.activityLevel - sedentary|light|moderate|active|extreme
 * @returns {Object} { bmr, tdee, metabolicAge, actualAge, difference, healthScore, error? }
 */
export function calcMetabolicAge(inputs) {
  // Validate
  const validation = validateInputs(inputs);
  if (!validation.valid) {
    return { error: validation.errors.join('; ') };
  }

  const { age, gender, heightCm, weightKg, activityLevel } = inputs;

  // Calculate BMR
  const bmr = Math.round(calcBMR(gender, weightKg, heightCm, age));

  // Calculate TDEE
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  const tdee = Math.round(bmr * multiplier);

  // Find population BMR for user's age and gender
  const popBmr = getPopulationBmr(gender, age);

  // Metabolic age = the age at which the population BMR matches the user's BMR
  // Walk through age groups to find where user's BMR intersects
  const table = POPULATION_BMR[gender];
  let metabolicAge = age;
  for (const row of table) {
    if (bmr >= row.bmr) {
      metabolicAge = Math.min(row.max, age);
      break;
    }
  }
  // If BMR is lower than all age groups, extrapolate
  if (bmr < table[table.length - 1].bmr) {
    metabolicAge = age + 15;
  }
  // If BMR is higher than all age groups, extrapolate younger
  if (bmr > table[0].bmr) {
    metabolicAge = Math.max(15, age - Math.round((bmr - table[0].bmr) / 10));
  }

  const difference = age - metabolicAge;
  const healthScore = calcHealthScore(metabolicAge, age);

  return {
    bmr,
    tdee,
    metabolicAge,
    actualAge: age,
    difference,
    healthScore,
  };
}
