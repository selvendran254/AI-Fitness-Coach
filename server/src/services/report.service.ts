import { prisma } from '../config/database';
import { subDays } from '../utils/dates';

export async function buildDoctorReport(userId: string, days = 30) {
  const since = subDays(new Date(), days);
  const [user, progress, meals, workouts, meds] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true, email: true, healthConditions: true },
    }),
    prisma.progressEntry.findMany({
      where: { userId, recordedAt: { gte: since } },
      orderBy: { recordedAt: 'asc' },
    }),
    prisma.meal.count({ where: { userId, loggedAt: { gte: since } } }),
    prisma.workoutLog.count({ where: { userId, startedAt: { gte: since } } }),
    prisma.medicationLog.findMany({
      where: { userId, takenAt: { gte: since }, skipped: false },
      orderBy: { takenAt: 'desc' },
      take: 50,
    }),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    periodDays: days,
    patient: user,
    vitals: progress.map((p) => ({
      date: p.recordedAt,
      weightKg: p.weightKg,
      glucose: p.bloodGlucoseMgDl,
      bp: p.systolicBp && p.diastolicBp ? `${p.systolicBp}/${p.diastolicBp}` : null,
    })),
    summary: {
      mealsLogged: meals,
      workoutsCompleted: workouts,
      medicationsTaken: meds.length,
    },
    medications: meds,
  };
}
