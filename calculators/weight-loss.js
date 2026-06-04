/* ═══════════════════════════════════════════════════════
   VitalMetric — Weight Loss Planner Calculator
   Pure function. No DOM. No side effects. Testable.

   Formula:
   - 1 lb fat ≈ 3500 kcal
   - Weekly loss (lbs) = (dailyDeficit × 7) / 3500
   - weeklyWeightLossKg = weeklyLossLbs × 0.45359237
   - weeksToGoal = totalKgToLose / weeklyWeightLossKg
   ═══════════════════════════════════════════════════════ */

const LBS_PER_KG = 2.20462262185;
const KCAL_PER_LB_FAT = 3500;

/**
 * Validate weight loss planner inputs
 * @param {Object} inputs
 * @param {number} inputs.currentWeightKg
 * @param {number} inputs.goalWeightKg
 * @param {number} inputs.dailyDeficit
 * @param {string} inputs.gender
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateInputs(inputs) {
  const errors = [];
  const { currentWeightKg, goalWeightKg, dailyDeficit, gender } = inputs;

  if (currentWeightKg == null || isNaN(currentWeightKg) || currentWeightKg < 20 || currentWeightKg > 400) {
    errors.push('Current weight must be between 20 and 400 kg');
  }
  if (goalWeightKg == null || isNaN(goalWeightKg) || goalWeightKg < 20 || goalWeightKg > 400) {
    errors.push('Goal weight must be between 20 and 400 kg');
  }
  if (currentWeightKg != null && goalWeightKg != null && goalWeightKg >= currentWeightKg) {
    errors.push('Goal weight must be less than current weight');
  }
  if (dailyDeficit == null || isNaN(dailyDeficit) || dailyDeficit < 100 || dailyDeficit > 2000) {
    errors.push('Daily deficit must be between 100 and 2000 kcal');
  }
  if (gender !== 'male' && gender !== 'female') {
    errors.push('Gender must be male or female');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Calculate weight loss plan
 * @param {Object} inputs
 * @param {number} inputs.currentWeightKg — current weight in kg (20-400)
 * @param {number} inputs.goalWeightKg — target weight in kg (20-400, must be < current)
 * @param {number} inputs.dailyDeficit — daily calorie deficit in kcal (100-2000)
 * @param {string} inputs.gender — 'male' | 'female'
 * @returns {Object} { weeksToGoal, completionDate, weeklyWeightLossKg, totalDeficitKcal, milestones, error? }
 */
export function calcWeightLoss(inputs) {
  const validation = validateInputs(inputs);
  if (!validation.valid) {
    return { error: validation.errors.join('; ') };
  }

  const { currentWeightKg, goalWeightKg, dailyDeficit, gender } = inputs;

  // Weekly loss in lbs = (dailyDeficit × 7) / 3500
  const weeklyLossLbs = (dailyDeficit * 7) / KCAL_PER_LB_FAT;

  // Convert to kg
  const weeklyWeightLossKg = Math.round((weeklyLossLbs / LBS_PER_KG) * 100) / 100;

  // Total weight to lose
  const totalKgToLose = currentWeightKg - goalWeightKg;
  const totalLbsToLose = totalKgToLose * LBS_PER_KG;

  // Total deficit needed
  const totalDeficitKcal = Math.round(totalLbsToLose * KCAL_PER_LB_FAT);

  // Weeks to goal
  const weeksToGoal = Math.round((totalKgToLose / weeklyWeightLossKg) * 10) / 10;

  // Completion date: today + weeksToGoal (rounded to nearest day)
  const completionDateObj = new Date();
  completionDateObj.setDate(completionDateObj.getDate() + Math.round(weeksToGoal * 7));
  const completionDate = completionDateObj.toISOString();

  // Weekly milestones
  const totalWeeks = Math.ceil(weeksToGoal);
  const milestones = [];
  for (let week = 1; week <= totalWeeks; week++) {
    const projectedWeight = Math.round((currentWeightKg - week * weeklyWeightLossKg) * 10) / 10;
    // Clamp at goal weight for final week
    const clampedWeight = projectedWeight < goalWeightKg ? goalWeightKg : projectedWeight;
    milestones.push({ week, projectedWeight: clampedWeight });
  }

  return {
    weeksToGoal,
    completionDate,
    weeklyWeightLossKg,
    totalDeficitKcal,
    milestones,
  };
}
