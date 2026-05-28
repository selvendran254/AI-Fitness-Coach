import { z } from 'zod';

export const updateSettingsSchema = z.object({
  preferences: z.record(z.unknown()).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  pushNotificationsEnabled: z.boolean().optional(),
  offlineModeEnabled: z.boolean().optional(),
  analyticsEnabled: z.boolean().optional(),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  heightCm: z.number().positive().max(300).optional(),
  weightKg: z.number().positive().max(500).optional(),
  fitnessLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  activityLevel: z
    .enum(['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTRA_ACTIVE'])
    .optional(),
  healthConditions: z
    .array(z.enum(['DIABETES_TYPE1', 'DIABETES_TYPE2', 'HYPERTENSION', 'PREDIABETES', 'NONE']))
    .optional(),
  dailyCalorieGoal: z.number().int().positive().optional(),
  dailyWaterGoalMl: z.number().int().positive().optional(),
  dailySleepGoalHours: z.number().positive().max(24).optional(),
  preferredLanguage: z.enum(['en', 'ta']).optional(),
  timezone: z.string().optional(),
});
