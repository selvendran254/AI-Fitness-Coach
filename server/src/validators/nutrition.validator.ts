import { z } from 'zod';

export const createMealSchema = z.object({
  name: z.string().min(1),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  items: z.array(z.record(z.unknown())),
  totalMacros: z.record(z.unknown()),
  photoUrl: z.string().url().optional(),
  loggedAt: z.string().datetime().optional(),
});

export const analyzeFoodSchema = z.object({
  description: z.string().optional(),
  imageBase64: z.string().optional(),
}).refine((d) => d.description || d.imageBase64, {
  message: 'Either description or imageBase64 is required',
});

export const generateMealPlanSchema = z.object({
  days: z.number().int().min(1).max(14).default(7),
  calorieTarget: z.number().int().positive().optional(),
});

export const waterLogSchema = z.object({
  amountMl: z.number().int().positive().max(5000),
  loggedAt: z.string().datetime().optional(),
});
