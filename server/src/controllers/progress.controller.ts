import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { calculateBmi } from '@ai-fitness-coach/shared';
import { evaluateHealthAlerts } from '../services/alerts.service';

/**
 * POST /progress/entries
 */
export async function createEntry(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    const bmi = user?.heightCm
      ? calculateBmi(req.body.weightKg, user.heightCm)
      : req.body.bmi ?? 0;

    const entry = await prisma.progressEntry.create({
      data: {
        userId: req.user!.id,
        weightKg: req.body.weightKg,
        bodyFatPercent: req.body.bodyFatPercent,
        muscleMassKg: req.body.muscleMassKg,
        bmi,
        waistCm: req.body.waistCm,
        hipCm: req.body.hipCm,
        chestCm: req.body.chestCm,
        systolicBp: req.body.systolicBp,
        diastolicBp: req.body.diastolicBp,
        bloodGlucoseMgDl: req.body.bloodGlucoseMgDl,
        photoUrl: req.body.photoUrl,
        notes: req.body.notes,
      },
    });
    await evaluateHealthAlerts(req.user!.id, {
      bloodGlucoseMgDl: entry.bloodGlucoseMgDl,
      systolicBp: entry.systolicBp,
      diastolicBp: entry.diastolicBp,
    });
    sendSuccess(res, entry, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /progress/entries
 */
export async function listEntries(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const entries = await prisma.progressEntry.findMany({
      where: { userId: req.user!.id },
      orderBy: { recordedAt: 'desc' },
      take: 100,
    });
    sendSuccess(res, entries);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /progress/sleep
 */
export async function logSleep(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const log = await prisma.sleepLog.create({
      data: { userId: req.user!.id, ...req.body },
    });
    sendSuccess(res, log, 201);
  } catch (err) {
    next(err);
  }
}
