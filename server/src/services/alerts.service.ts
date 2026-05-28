import { prisma } from '../config/database';
import { createNotification } from './notification.service';

export async function evaluateHealthAlerts(userId: string, entry: {
  bloodGlucoseMgDl?: number | null;
  systolicBp?: number | null;
  diastolicBp?: number | null;
}) {
  const settings = await prisma.userSettings.findUnique({ where: { userId } });
  const prefs = (settings?.preferences ?? {}) as Record<string, number | boolean>;

  const alerts: string[] = [];

  if (entry.bloodGlucoseMgDl != null && prefs.glucoseAlertNotifications !== false) {
    const low = (prefs.hypoglycemiaThreshold as number) ?? 70;
    const high = (prefs.hyperglycemiaThreshold as number) ?? 180;
    if (entry.bloodGlucoseMgDl < low) {
      alerts.push(`Low glucose: ${entry.bloodGlucoseMgDl} mg/dL — have a snack and recheck.`);
    }
    if (entry.bloodGlucoseMgDl > high) {
      alerts.push(`High glucose: ${entry.bloodGlucoseMgDl} mg/dL — contact your doctor if persistent.`);
    }
  }

  if (entry.systolicBp != null && prefs.bpAlertNotifications !== false) {
    const sysHigh = (prefs.targetSystolicBp as number) ?? 130;
    if (entry.systolicBp > sysHigh + 10) {
      alerts.push(`High BP: ${entry.systolicBp}/${entry.diastolicBp ?? '—'} mmHg — rest and recheck.`);
    }
  }

  for (const body of alerts) {
    await createNotification(userId, 'Health alert', body, 'health_alert');
  }

  return alerts;
}
