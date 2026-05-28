import { ChallengeType } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export async function createChallenge(
  userId: string,
  data: {
    title: string;
    description?: string;
    type: ChallengeType;
    targetValue: number;
    unit: string;
    startDate: Date;
    endDate: Date;
  }
) {
  return prisma.challenge.create({
    data: { ...data, createdById: userId, status: 'ACTIVE' },
  });
}

export async function joinChallenge(userId: string, challengeId: string) {
  const c = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!c) throw new NotFoundError('Challenge');
  return prisma.challengeParticipant.upsert({
    where: { challengeId_userId: { challengeId, userId } },
    create: { challengeId, userId },
    update: {},
  });
}

export async function updateChallengeProgress(
  userId: string,
  challengeId: string,
  currentValue: number
) {
  return prisma.challengeParticipant.update({
    where: { challengeId_userId: { challengeId, userId } },
    data: { currentValue },
  });
}
