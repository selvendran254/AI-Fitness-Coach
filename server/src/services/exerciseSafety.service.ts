import { prisma } from '../config/database';

export async function checkWorkoutSafety(userId: string, input?: {
  glucoseMgDl?: number;
  systolicBp?: number;
}) {
  const settings = await prisma.userSettings.findUnique({ where: { userId } });
  const prefs = (settings?.preferences ?? {}) as Record<string, number | boolean>;
  const warnings: string[] = [];
  let allowed = true;

  const glucose = input?.glucoseMgDl;
  if (glucose != null) {
    const low = (prefs.hypoglycemiaThreshold as number) ?? 70;
    const high = (prefs.hyperglycemiaThreshold as number) ?? 250;
    if (glucose < low) {
      warnings.push('Glucose too low for exercise — eat 15g carbs and recheck in 15 min.');
      allowed = false;
    }
    if (glucose > high) {
      warnings.push('Glucose very high — prefer gentle walk only; avoid intense cardio.');
    }
  }

  const sys = input?.systolicBp;
  if (sys != null && sys > ((prefs.targetSystolicBp as number) ?? 130) + 20) {
    warnings.push('Blood pressure elevated — choose low-intensity exercise only.');
  }

  if (prefs.avoidHighIntensityCardio) {
    warnings.push('High-intensity cardio disabled in your settings — moderate activity recommended.');
  }

  return { allowed, warnings };
}
