import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import * as aiService from '../services/ai.service';

/**
 * POST /nutrition/meals/analyze — AI food scan
 */
export async function analyzeFood(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    const result = await aiService.analyzeFood({
      ...req.body,
      language: user?.preferredLanguage,
    });
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /nutrition/meals
 */
export async function createMeal(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const meal = await prisma.meal.create({
      data: {
        userId: req.user!.id,
        ...req.body,
        loggedAt: req.body.loggedAt ? new Date(req.body.loggedAt) : new Date(),
      },
    });
    sendSuccess(res, meal, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /nutrition/meals
 */
export async function listMeals(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
    const [items, total] = await Promise.all([
      prisma.meal.findMany({
        where: { userId: req.user!.id },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { loggedAt: 'desc' },
      }),
      prisma.meal.count({ where: { userId: req.user!.id } }),
    ]);
    sendSuccess(res, { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /nutrition/meal-plans/generate
 */
export async function generateMealPlan(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { settings: true },
    });
    const prefs = user?.settings?.preferences as { dietaryRestrictions?: string[] } | undefined;

    const planData = await aiService.generateMealPlan({
      calorieTarget: req.body.calorieTarget ?? user?.dailyCalorieGoal ?? 2000,
      healthConditions: user!.healthConditions,
      dietaryRestrictions: prefs?.dietaryRestrictions ?? [],
      days: req.body.days,
      language: user!.preferredLanguage,
    });

    const plan = await prisma.mealPlan.create({
      data: {
        userId: req.user!.id,
        title: (planData as { title?: string }).title ?? 'AI Meal Plan',
        days: (planData as { days: object }).days ?? planData,
        aiGenerated: true,
      },
    });
    sendSuccess(res, plan, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /nutrition/water
 */
export async function logWater(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const log = await prisma.waterLog.create({
      data: {
        userId: req.user!.id,
        amountMl: req.body.amountMl,
        loggedAt: req.body.loggedAt ? new Date(req.body.loggedAt) : new Date(),
      },
    });
    sendSuccess(res, log, 201);
  } catch (err) {
    next(err);
  }
}
