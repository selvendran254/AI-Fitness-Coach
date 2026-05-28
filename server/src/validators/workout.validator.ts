import { z } from 'zod';

export const generateWorkoutSchema = z.object({
  durationMinutes: z.number().int().min(10).max(120).default(45),
  equipment: z.array(z.string()).default([]),
  goals: z.string().optional(),
});

export const createWorkoutLogSchema = z.object({
  planId: z.string().optional(),
  title: z.string().min(1),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  durationMinutes: z.number().int().positive(),
  caloriesBurned: z.number().int().optional(),
  heartRateAvg: z.number().int().optional(),
  exercises: z.array(z.record(z.unknown())),
  notes: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
