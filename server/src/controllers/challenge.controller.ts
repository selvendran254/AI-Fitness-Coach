import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

/**
 * GET /challenges/leaderboard
 */
export async function leaderboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const participants = await prisma.challengeParticipant.findMany({
      where: { challenge: { status: 'ACTIVE' } },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
      orderBy: { currentValue: 'desc' },
      take: 50,
    });

    const entries = participants.map((p: typeof participants[number], i: number) => ({
      userId: p.user.id,
      displayName: `${p.user.firstName} ${p.user.lastName}`,
      avatarUrl: p.user.avatarUrl,
      score: p.currentValue,
      rank: i + 1,
    }));

    sendSuccess(res, entries);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /challenges
 */
export async function listChallenges(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const challenges = await prisma.challenge.findMany({
      where: { status: 'ACTIVE' },
      include: { _count: { select: { participants: true } } },
      orderBy: { startDate: 'desc' },
    });
    sendSuccess(res, challenges);
  } catch (err) {
    next(err);
  }
}
