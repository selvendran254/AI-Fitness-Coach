import { prisma } from '../config/database';
import { createNotification, sendPushToUser } from './notification.service';

export async function logMedication(
  userId: string,
  data: { medicationName: string; dosage?: string; scheduledFor?: Date; skipped?: boolean }
) {
  return prisma.medicationLog.create({ data: { userId, ...data } });
}

export async function listMedicationLogs(userId: string, days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return prisma.medicationLog.findMany({
    where: { userId, takenAt: { gte: since } },
    orderBy: { takenAt: 'desc' },
  });
}

/** Check settings reminders and fire notifications (call from cron or interval) */
export async function processMedicationReminders(userId: string) {
  const settings = await prisma.userSettings.findUnique({ where: { userId } });
  const prefs = (settings?.preferences ?? {}) as {
    medicationReminders?: boolean;
    medicationSchedule?: Array<{ name: string; time: string; dosage?: string }>;
  };
  if (!prefs.medicationReminders || !prefs.medicationSchedule?.length) return [];

  const now = new Date();
  const hhmm = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const due = prefs.medicationSchedule.filter((m) => m.time === hhmm);

  for (const med of due) {
    await createNotification(
      userId,
      'Medicine reminder',
      `Time to take ${med.name}${med.dosage ? ` (${med.dosage})` : ''}`,
      'medication'
    );
    await sendPushToUser(userId, 'Medicine reminder', `Take ${med.name}`);
  }
  return due;
}
