export interface BodyMetrics {
  weightKg: number;
  bodyFatPercent?: number;
  muscleMassKg?: number;
  bmi: number;
  waistCm?: number;
  hipCm?: number;
  chestCm?: number;
  systolicBp?: number;
  diastolicBp?: number;
  bloodGlucoseMgDl?: number;
  recordedAt: string;
}

export interface ProgressEntry {
  id: string;
  userId: string;
  metrics: BodyMetrics;
  photoUrl?: string | null;
  notes?: string;
}

export interface SleepLog {
  id: string;
  userId: string;
  bedTime: string;
  wakeTime: string;
  durationHours: number;
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}
