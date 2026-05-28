export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';

export type FitnessLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type HealthCondition = 'DIABETES_TYPE1' | 'DIABETES_TYPE2' | 'HYPERTENSION' | 'PREDIABETES' | 'NONE';

export type ActivityLevel =
  | 'SEDENTARY'
  | 'LIGHTLY_ACTIVE'
  | 'MODERATELY_ACTIVE'
  | 'VERY_ACTIVE'
  | 'EXTRA_ACTIVE';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export type Language = 'en' | 'ta';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  heightCm?: number | null;
  weightKg?: number | null;
  fitnessLevel: FitnessLevel;
  activityLevel: ActivityLevel;
  healthConditions: HealthCondition[];
  dailyCalorieGoal?: number | null;
  dailyWaterGoalMl?: number | null;
  dailySleepGoalHours?: number | null;
  preferredLanguage: Language;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserGoals {
  targetWeightKg?: number | null;
  weeklyWorkoutDays: number;
  primaryGoal: 'WEIGHT_LOSS' | 'WEIGHT_GAIN' | 'MAINTENANCE' | 'MUSCLE_GAIN' | 'HEALTH_MANAGEMENT';
  maxHeartRateBpm?: number | null;
  targetStepsPerDay?: number | null;
}
