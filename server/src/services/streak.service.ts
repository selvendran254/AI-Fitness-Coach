import { prisma } from '../config/database';
import { startOfDay, subDays } from '../utils/dates';

export async function computeStreaks(userId: string) {
  const today = startOfDay(new Date());
  let waterStreak = 0;
  let workoutStreak = 0;

  for (let i = 0; i < 30; i++) {
    const day = subDays(today, i);
    const next = subDays(today, i - 1);
    const water = await prisma.waterLog.count({
      where: { userId, loggedAt: { gte: day, lt: next } },
    });
    if (water > 0 && (i === 0 || waterStreak === i)) waterStreak++;
    else if (i > 0) break;
  }

  for (let i = 0; i < 30; i++) {
    const day = subDays(today, i);
    const next = subDays(today, i - 1);
    const w = await prisma.workoutLog.count({
      where: { userId, startedAt: { gte: day, lt: next } },
    });
    if (w > 0 && (i === 0 || workoutStreak === i)) workoutStreak++;
    else if (i > 0) break;
  }

  const badges: string[] = [];
  if (waterStreak >= 7) badges.push('water_7');
  if (workoutStreak >= 3) badges.push('workout_3');
  if (waterStreak >= 14) badges.push('water_14');

  return { waterStreak, workoutStreak, badges };
}
