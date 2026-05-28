import { prisma } from '../config/database';
import { startOfDay, subDays } from '../utils/dates';

export async function getDashboardSummary(userId: string) {
  const today = startOfDay(new Date());
  const weekAgo = subDays(today, 7);

  const [meals, waterToday, workoutsWeek, progress, devices, sleepLast, settings] = await Promise.all([
    prisma.meal.findMany({
      where: { userId, loggedAt: { gte: today } },
    }),
    prisma.waterLog.aggregate({
      where: { userId, loggedAt: { gte: today } },
      _sum: { amountMl: true },
    }),
    prisma.workoutLog.count({
      where: { userId, startedAt: { gte: weekAgo } },
    }),
    prisma.progressEntry.findMany({
      where: { userId },
      orderBy: { recordedAt: 'desc' },
      take: 14,
    }),
    prisma.deviceConnection.findMany({
      where: { userId, status: 'CONNECTED' },
    }),
    prisma.sleepLog.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.userSettings.findUnique({ where: { userId } }),
  ]);

  const prefs = (settings?.preferences ?? {}) as Record<string, unknown>;
  const calorieTarget = (prefs.dailyCalorieTarget as number) ?? 2000;
  const waterGoalMl = (prefs.dailyWaterGoalMl as number) ?? 2500;
  const stepsTarget = (prefs.dailyStepsTarget as number) ?? 8000;
  const weeklyWorkoutGoal = (prefs.weeklyWorkoutGoal as number) ?? 4;
  const glassMl = (prefs.glassSizeMl as number) ?? 250;

  let caloriesToday = 0;
  for (const m of meals) {
    const macros = m.totalMacros as { calories?: number };
    caloriesToday += macros?.calories ?? 0;
  }

  let stepsToday = 0;
  let heartRate: number | undefined;
  for (const d of devices) {
    const sync = d.lastSyncData as { steps?: number; heartRateAvg?: number } | null;
    if (sync?.steps) stepsToday += sync.steps;
    if (sync?.heartRateAvg) heartRate = sync.heartRateAvg;
  }

  const latest = progress[0];
  const chart = progress
    .slice()
    .reverse()
    .map((p) => ({
      date: p.recordedAt.toLocaleDateString('en', { weekday: 'short' }),
      weight: p.weightKg,
      glucose: p.bloodGlucoseMgDl ?? undefined,
    }));

  return {
    stats: {
      caloriesToday,
      calorieTarget,
      waterMlToday: waterToday._sum.amountMl ?? 0,
      waterGoalMl,
      glassMl,
      stepsToday,
      stepsTarget,
      workoutsThisWeek: workoutsWeek,
      weeklyWorkoutGoal,
    },
    vitals: latest
      ? {
          glucose: latest.bloodGlucoseMgDl,
          systolicBp: latest.systolicBp,
          diastolicBp: latest.diastolicBp,
          sleepHours: sleepLast?.durationHours,
          heartRate,
        }
      : { heartRate },
    chart,
    connectedDevices: devices.length,
  };
}
