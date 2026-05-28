import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';

/**
 * GET /admin/stats — dashboard analytics
 */
export async function getStats(_req: unknown, res: Response, next: NextFunction) {
  try {
    const [userCount, workoutCount, mealCount, activeChallenges] = await Promise.all([
      prisma.user.count(),
      prisma.workoutLog.count(),
      prisma.meal.count(),
      prisma.challenge.count({ where: { status: 'ACTIVE' } }),
    ]);

    sendSuccess(res, {
      userCount,
      workoutCount,
      mealCount,
      activeChallenges,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}
