/* ═══════════════════════════════════════════════════════
   VitalMetric — Macro Calculator
   Pure function. No DOM. No side effects. Testable.

   Calculates daily calorie target (TDEE ± goal adjustment)
   then splits into macros based on diet type.
   ═══════════════════════════════════════════════════════ */

// ── BMR: Mifflin-St Jeor ──
function calcBMR(gender, weightKg, heightCm, age) {
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

const ACTIVITY = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extreme: 1.9,
};

const GOAL_ADJUSTMENTS = {
  lose: -500,
  maintain: 0,
  gain: 500,
};

// ── Diet macro splits (% of calories: protein, carbs, fat) ──
const DIETS = {
  balanced: {
    name: 'Balanced',
    protein: 0.30, carbs: 0.40, fat: 0.30,
    description: 'Even split across all macronutrients. Sustainable for most people.',
  },
  keto: {
    name: 'Ketogenic',
    protein: 0.25, carbs: 0.05, fat: 0.70,
    description: 'Very low carb, high fat. Aims for nutritional ketosis.',
  },
  paleo: {
    name: 'Paleo',
    protein: 0.30, carbs: 0.35, fat: 0.35,
    description: 'Whole foods based, moderate carb. No grains, dairy, or processed foods.',
  },
  mediterranean: {
    name: 'Mediterranean',
    protein: 0.20, carbs: 0.50, fat: 0.30,
    description: 'Plant-forward with healthy fats. Emphasis on olive oil, fish, vegetables.',
  },
  'high-protein': {
    name: 'High Protein',
    protein: 0.40, carbs: 0.35, fat: 0.25,
    description: 'Elevated protein for muscle building and satiety. Popular for cutting.',
  },
};

const KCAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9 };

function validateInputs(inputs) {
  const errors = [];
  const { age, gender, heightCm, weightKg, activityLevel, goal, diet } = inputs;

  if (age == null || isNaN(age) || age < 10 || age > 120)
    errors.push('Age must be between 10 and 120');
  if (gender !== 'male' && gender !== 'female')
    errors.push('Gender must be male or female');
  if (heightCm == null || isNaN(heightCm) || heightCm < 50 || heightCm > 300)
    errors.push('Height must be between 50 and 300 cm');
  if (weightKg == null || isNaN(weightKg) || weightKg < 20 || weightKg > 400)
    errors.push('Weight must be between 20 and 400 kg');
  if (!ACTIVITY[activityLevel])
    errors.push('Invalid activity level');
  if (!GOAL_ADJUSTMENTS.hasOwnProperty(goal))
    errors.push('Goal must be lose, maintain, or gain');
  if (!DIETS[diet])
    errors.push('Invalid diet type');

  return { valid: errors.length === 0, errors };
}

/**
 * Calculate daily calorie target and macro split
 * @param {Object} inputs
 * @param {number} inputs.age
 * @param {string} inputs.gender - 'male' | 'female'
 * @param {number} inputs.heightCm
 * @param {number} inputs.weightKg
 * @param {string} inputs.activityLevel
 * @param {string} inputs.goal - 'lose' | 'maintain' | 'gain'
 * @param {string} inputs.diet - 'balanced' | 'keto' | 'paleo' | 'mediterranean' | 'high-protein'
 * @returns {Object}
 */
export function calcMacros(inputs) {
  const validation = validateInputs(inputs);
  if (!validation.valid) {
    return { error: validation.errors.join('; ') };
  }

  const { age, gender, heightCm, weightKg, activityLevel, goal, diet } = inputs;

  const bmr = Math.round(calcBMR(gender, weightKg, heightCm, age));
  const tdee = Math.round(bmr * ACTIVITY[activityLevel]);
  const adjustment = GOAL_ADJUSTMENTS[goal];
  const targetCalories = Math.max(1200, tdee + adjustment); // floor at 1200

  const split = DIETS[diet];

  // Calculate grams from calorie targets
  const proteinG = Math.round((targetCalories * split.protein) / KCAL_PER_GRAM.protein);
  const carbsG = Math.round((targetCalories * split.carbs) / KCAL_PER_GRAM.carbs);
  const fatG = Math.round((targetCalories * split.fat) / KCAL_PER_GRAM.fat);

  // Fiber recommendation: 14g per 1000 kcal (IOM guideline)
  const fiberG = gender === 'male' ? 38 : 25;

  // Calorie breakdown for display
  const proteinCal = proteinG * KCAL_PER_GRAM.protein;
  const carbsCal = carbsG * KCAL_PER_GRAM.carbs;
  const fatCal = fatG * KCAL_PER_GRAM.fat;

  return {
    bmr,
    tdee,
    targetCalories,
    dietName: split.name,
    dietDescription: split.description,
    macros: {
      protein: { grams: proteinG, calories: proteinCal },
      carbs: { grams: carbsG, calories: carbsCal },
      fat: { grams: fatG, calories: fatCal },
      fiber: fiberG,
    },
  };
}
