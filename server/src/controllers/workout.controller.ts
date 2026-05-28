import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import * as aiService from '../services/ai.service';

/**
 * POST /workouts/generate — AI workout plan
 */
export async function generatePlan(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { settings: true },
    });

    const planData = await aiService.generateWorkoutPlan({
      fitnessLevel: user!.fitnessLevel,
      healthConditions: user!.healthConditions,
      durationMinutes: req.body.durationMinutes,
      equipment: req.body.equipment ?? [],
      goals: req.body.goals ?? 'health management',
      language: user!.preferredLanguage,
      settings: user!.settings?.preferences as never,
    });

    const plan = await prisma.workoutPlan.create({
      data: {
        userId: req.user!.id,
        title: (planData as { title: string }).title,
        description: (planData as { description?: string }).description,
        durationMinutes: (planData as { durationMinutes: number }).durationMinutes,
        intensity: ((planData as { intensity?: string }).intensity ?? 'MODERATE') as 'LOW' | 'MODERATE' | 'HIGH',
        exercises: (planData as { exercises: object }).exercises,
        aiGenerated: true,
        suitableForDiabetes: (planData as { suitableForDiabetes?: boolean }).suitableForDiabetes ?? true,
        suitableForHypertension: (planData as { suitableForHypertension?: boolean }).suitableForHypertension ?? true,
      },
    });

    sendSuccess(res, plan, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /workouts/plans
 */
export async function listPlans(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
    const [items, total] = await Promise.all([
      prisma.workoutPlan.findMany({
        where: { userId: req.user!.id, isActive: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.workoutPlan.count({ where: { userId: req.user!.id, isActive: true } }),
    ]);
    sendSuccess(res, { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /workouts/logs
 */
export async function createLog(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const log = await prisma.workoutLog.create({
      data: { userId: req.user!.id, ...req.body },
    });
    sendSuccess(res, log, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /workouts/logs
 */
export async function listLogs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
    const [items, total] = await Promise.all([
      prisma.workoutLog.findMany({
        where: { userId: req.user!.id },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { startedAt: 'desc' },
      }),
      prisma.workoutLog.count({ where: { userId: req.user!.id } }),
    ]);
    sendSuccess(res, { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    next(err);
  }
}
