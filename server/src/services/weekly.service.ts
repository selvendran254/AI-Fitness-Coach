import { prisma } from '../config/database';
import * as aiService from './ai.service';
import { subDays } from '../utils/dates';

export async function generateWeeklySummary(userId: string, language: 'en' | 'ta' = 'en') {
  const since = subDays(new Date(), 7);
  const [workouts, water, progress, meals] = await Promise.all([
    prisma.workoutLog.count({ where: { userId, startedAt: { gte: since } } }),
    prisma.waterLog.aggregate({
      where: { userId, loggedAt: { gte: since } },
      _sum: { amountMl: true },
    }),
    prisma.progressEntry.findMany({
      where: { userId, recordedAt: { gte: since } },
      orderBy: { recordedAt: 'desc' },
      take: 5,
    }),
    prisma.meal.count({ where: { userId, loggedAt: { gte: since } } }),
  ]);

  const latestGlucose = progress.find((p) => p.bloodGlucoseMgDl)?.bloodGlucoseMgDl;
  const prompt =
    language === 'ta'
      ? `இந்த வாரம்: workouts ${workouts}, meals ${meals}, water ${water._sum.amountMl ?? 0}ml, glucose ${latestGlucose ?? 'N/A'}. சுருக்கமான Tamil health summary (3 வாக்கியங்கள்).`
      : `This week: ${workouts} workouts, ${meals} meals logged, ${water._sum.amountMl ?? 0}ml water, latest glucose ${latestGlucose ?? 'N/A'}. Write a brief encouraging health summary for a diabetic/BP patient (3 sentences).`;

  const summary = await aiService.chatWithCoach(
    [{ role: 'user', content: prompt }],
    undefined,
    language
  );

  await prisma.notification.create({
    data: {
      userId,
      title: language === 'ta' ? 'வாராந்திர அறிக்கை' : 'Weekly summary',
      body: summary.slice(0, 500),
      type: 'weekly_summary',
    },
  });

  return { summary, stats: { workouts, meals, waterMl: water._sum.amountMl ?? 0 } };
}
