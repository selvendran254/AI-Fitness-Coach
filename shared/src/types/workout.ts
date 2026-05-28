export type WorkoutIntensity = 'LOW' | 'MODERATE' | 'HIGH';

export type ExerciseCategory =
  | 'CARDIO'
  | 'STRENGTH'
  | 'FLEXIBILITY'
  | 'BALANCE'
  | 'RECOVERY';

export interface ExerciseSet {
  reps?: number;
  weightKg?: number;
  durationSeconds?: number;
  distanceMeters?: number;
  restSeconds?: number;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  sets: ExerciseSet[];
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  title: string;
  description?: string;
  durationMinutes: number;
  intensity: WorkoutIntensity;
  exercises: WorkoutExercise[];
  aiGenerated: boolean;
  suitableForDiabetes: boolean;
  suitableForHypertension: boolean;
  createdAt: string;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  planId?: string | null;
  title: string;
  startedAt: string;
  completedAt?: string | null;
  durationMinutes: number;
  caloriesBurned?: number | null;
  heartRateAvg?: number | null;
  exercises: WorkoutExercise[];
  notes?: string;
  rating?: number | null;
}
