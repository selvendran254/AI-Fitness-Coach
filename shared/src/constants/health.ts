export const DIABETIC_SAFE_EXERCISE_TIPS = [
  'Monitor blood glucose before and after exercise',
  'Keep fast-acting carbs available during workouts',
  'Avoid exercise during peak insulin action unless advised',
  'Stay hydrated — dehydration affects blood sugar',
] as const;

export const HYPERTENSION_SAFE_EXERCISE_TIPS = [
  'Warm up gradually for at least 5 minutes',
  'Avoid holding breath during resistance exercises',
  'Limit heavy lifting and Valsalva maneuvers',
  'Cool down slowly; do not stop abruptly',
] as const;

export const GLUCOSE_RANGES_MG_DL = {
  fasting: { low: 70, targetMin: 80, targetMax: 130, high: 180 },
  postMeal: { targetMax: 180, high: 200 },
} as const;

export const SODIUM_LIMITS_MG = {
  dailyMaxRecommended: 2300,
  dailyMaxStrict: 1500,
} as const;
