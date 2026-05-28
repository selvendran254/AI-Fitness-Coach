import type { HealthCondition, Language } from './user';

export interface MedicationReminder {
  name: string;
  dosage: string;
  times: string[];
  notes?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation?: string;
}

/** Comprehensive user preferences — 150+ configurable options */
export interface UserSettings {
  // ─── Display & locale ───
  language: Language;
  theme: 'light' | 'dark' | 'system';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  unitSystem: 'metric' | 'imperial';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  cardDensity: 'compact' | 'comfortable' | 'spacious';
  firstDayOfWeek: 'sunday' | 'monday';
  startupPage: 'dashboard' | 'workouts' | 'nutrition' | 'coach' | 'last';
  compactMode: boolean;
  showWelcomeBanner: boolean;
  animationsEnabled: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;

  // ─── Health profile ───
  healthConditions: HealthCondition[];
  allergies: string[];
  currentMedications: string[];
  insulinDependent: boolean;
  insulinType: 'none' | 'rapid' | 'long_acting' | 'mixed' | 'pump';
  insulinToCarbRatio?: number;
  correctionFactor?: number;
  bloodGlucoseUnit: 'mg/dL' | 'mmol/L';
  targetFastingGlucose?: number;
  targetPostMealGlucose?: number;
  hypoglycemiaThreshold?: number;
  hyperglycemiaThreshold?: number;
  hba1cTarget?: number;
  maxDailySodiumMg?: number;
  maxCarbsPerMealG?: number;
  maxDailyPotassiumMg?: number;
  carbCountingEnabled: boolean;
  lowGIPreference: boolean;
  avoidHighIntensityCardio: boolean;
  bpMonitoringEnabled: boolean;
  targetSystolicBp?: number;
  targetDiastolicBp?: number;
  restingHeartRate?: number;
  maxHeartRateBpm?: number;
  heartRateCapPercent: number;
  medicationReminders: boolean;
  medicationSchedule?: MedicationReminder[];
  footCareReminders: boolean;
  eyeExamReminders: boolean;
  annualCheckupReminder: boolean;
  emergencyContacts: EmergencyContact[];
  medicalIdNotes?: string;
  doctorName?: string;
  doctorPhone?: string;

  // ─── Goals & targets ───
  dailyCalorieTarget: number;
  dailyProteinTargetG: number;
  dailyCarbsTargetG: number;
  dailyFatTargetG: number;
  dailyFiberTargetG: number;
  dailyWaterGoalMl: number;
  dailyStepsTarget: number;
  weeklyWorkoutGoal: number;
  weeklyActiveMinutesGoal: number;
  targetWeightKg?: number;
  weightChangeRatePerWeek: 'slow' | 'moderate' | 'fast';
  primaryGoal: 'WEIGHT_LOSS' | 'WEIGHT_GAIN' | 'MAINTENANCE' | 'MUSCLE_GAIN' | 'HEALTH_MANAGEMENT';

  // ─── Workout ───
  fitnessLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  preferredWorkoutDays: number[];
  preferredWorkoutTime: 'morning' | 'afternoon' | 'evening' | 'flexible';
  maxWorkoutDurationMinutes: number;
  minWorkoutDurationMinutes: number;
  includeWarmupCooldown: boolean;
  warmupDurationMinutes: number;
  cooldownDurationMinutes: number;
  restBetweenSetsSeconds: number;
  restBetweenExercisesSeconds: number;
  trainingStyle: 'full_body' | 'split' | 'push_pull_legs' | 'upper_lower' | 'cardio_focus' | 'custom';
  autoProgression: boolean;
  deloadWeekEnabled: boolean;
  rpeTrackingEnabled: boolean;
  heartRateZoneTraining: boolean;
  equipmentAvailable: string[];
  excludedExercises: string[];
  preferredCardioTypes: string[];
  strengthFocusAreas: string[];
  homeWorkoutOnly: boolean;
  physiotherapyMode: boolean;
  postWorkoutStretch: boolean;
  voiceCoachingDuringWorkout: boolean;
  musicDuringWorkout: boolean;
  exerciseVideoQuality: 'low' | 'medium' | 'high';
  repCountingMode: 'manual' | 'auto' | 'both';

  // ─── Nutrition ───
  dietaryRestrictions: string[];
  mealReminders: boolean;
  breakfastReminderTime?: string;
  lunchReminderTime?: string;
  dinnerReminderTime?: string;
  snackTrackingEnabled: boolean;
  mealPrepMode: boolean;
  cheatMealDay?: number;
  foodDatabaseRegion: 'india' | 'us' | 'uk' | 'global';
  barcodeScannerEnabled: boolean;
  recipeSuggestionsEnabled: boolean;
  glycemicIndexFilter: boolean;
  lowSodiumMode: boolean;
  alcoholTracking: boolean;
  caffeineTracking: boolean;
  supplementTracking: boolean;
  intermittentFastingEnabled: boolean;
  fastingWindowStart?: string;
  fastingWindowEnd?: string;
  preMealWalkReminder: boolean;
  postMealGlucoseLogReminder: boolean;
  portionSizeGuide: 'hand' | 'scale' | 'both';

  // ─── Sleep ───
  sleepTrackingEnabled: boolean;
  dailySleepGoalHours: number;
  bedtimeReminder?: string;
  wakeReminder?: string;
  trackSleepStages: boolean;
  napTracking: boolean;
  screenFreeBeforeBedMinutes: number;
  smartAlarmEnabled: boolean;

  // ─── Trackers ───
  waterRemindersEnabled: boolean;
  waterReminderIntervalMinutes: number;
  glassSizeMl: number;
  stepTrackingEnabled: boolean;
  syncWithWearable: boolean;
  wearableProvider: 'fitbit' | 'google_fit' | 'apple_health' | 'samsung' | 'garmin' | 'none';
  syncFrequencyMinutes: number;
  moodTrackingEnabled: boolean;
  energyLevelTracking: boolean;
  stressLevelTracking: boolean;
  periodTrackingEnabled: boolean;

  // ─── Notifications ───
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  workoutReminders: boolean;
  workoutReminderLeadMinutes: number;
  challengeUpdates: boolean;
  aiCoachTips: boolean;
  weeklyReportEmail: boolean;
  monthlyReportEmail: boolean;
  streakNotifications: boolean;
  achievementBadges: boolean;
  friendRequestNotifications: boolean;
  glucoseAlertNotifications: boolean;
  bpAlertNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  priorityAlertsOnly: boolean;

  // ─── Privacy & security ───
  profileVisibility: 'public' | 'friends' | 'private';
  showOnLeaderboard: boolean;
  shareProgressWithFriends: boolean;
  shareWorkoutHistory: boolean;
  shareNutritionLogs: boolean;
  analyticsEnabled: boolean;
  researchDataOptIn: boolean;
  locationTrackingEnabled: boolean;
  dataRetentionDays: number;
  twoFactorEnabled: boolean;
  biometricLoginEnabled: boolean;
  sessionTimeoutMinutes: number;
  exportIncludePhotos: boolean;
  anonymizeExports: boolean;

  // ─── AI coach ───
  aiCoachTone: 'motivational' | 'clinical' | 'friendly' | 'strict' | 'empathetic';
  aiCoachLanguage: Language;
  includeHealthContextInAi: boolean;
  aiSuggestionFrequency: 'minimal' | 'normal' | 'frequent';
  aiConversationMemory: boolean;
  aiWorkoutAutoAdjust: boolean;
  aiMealSwapSuggestions: boolean;
  aiVoiceInput: boolean;
  aiReadAloud: boolean;
  aiInjuryReporting: boolean;
  culturalDietPreference: 'south_indian' | 'north_indian' | 'tamil_traditional' | 'general' | 'western';
  regionalFoodDatabase: boolean;

  // ─── Accessibility ───
  reducedMotion: boolean;
  largeText: boolean;
  highContrast: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  dyslexiaFriendlyFont: boolean;
  screenReaderOptimized: boolean;
  minimumTouchTarget: boolean;
  captionsOnVideos: boolean;

  // ─── Offline & advanced ───
  offlineModeEnabled: boolean;
  autoSyncOnReconnect: boolean;
  cacheWorkoutPlans: boolean;
  cacheMealPlans: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  defaultExportFormat: 'csv' | 'pdf' | 'json';
  betaFeaturesEnabled: boolean;
  debugMode: boolean;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  language: 'en',
  theme: 'system',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  unitSystem: 'metric',
  fontSize: 'medium',
  cardDensity: 'comfortable',
  firstDayOfWeek: 'monday',
  startupPage: 'dashboard',
  compactMode: false,
  showWelcomeBanner: true,
  animationsEnabled: true,
  soundEffects: true,
  hapticFeedback: true,
  healthConditions: [],
  allergies: [],
  currentMedications: [],
  insulinDependent: false,
  insulinType: 'none',
  bloodGlucoseUnit: 'mg/dL',
  targetFastingGlucose: 100,
  targetPostMealGlucose: 140,
  hypoglycemiaThreshold: 70,
  hyperglycemiaThreshold: 250,
  hba1cTarget: 7,
  maxDailySodiumMg: 2300,
  maxCarbsPerMealG: 60,
  maxDailyPotassiumMg: 3500,
  carbCountingEnabled: false,
  lowGIPreference: true,
  avoidHighIntensityCardio: false,
  bpMonitoringEnabled: true,
  targetSystolicBp: 120,
  targetDiastolicBp: 80,
  restingHeartRate: 72,
  maxHeartRateBpm: 170,
  heartRateCapPercent: 75,
  medicationReminders: false,
  footCareReminders: true,
  eyeExamReminders: true,
  annualCheckupReminder: true,
  emergencyContacts: [],
  dailyCalorieTarget: 2000,
  dailyProteinTargetG: 80,
  dailyCarbsTargetG: 200,
  dailyFatTargetG: 65,
  dailyFiberTargetG: 25,
  dailyWaterGoalMl: 2500,
  dailyStepsTarget: 8000,
  weeklyWorkoutGoal: 4,
  weeklyActiveMinutesGoal: 150,
  weightChangeRatePerWeek: 'moderate',
  primaryGoal: 'HEALTH_MANAGEMENT',
  fitnessLevel: 'BEGINNER',
  preferredWorkoutDays: [1, 3, 5],
  preferredWorkoutTime: 'morning',
  maxWorkoutDurationMinutes: 45,
  minWorkoutDurationMinutes: 15,
  includeWarmupCooldown: true,
  warmupDurationMinutes: 8,
  cooldownDurationMinutes: 5,
  restBetweenSetsSeconds: 60,
  restBetweenExercisesSeconds: 90,
  trainingStyle: 'full_body',
  autoProgression: true,
  deloadWeekEnabled: true,
  rpeTrackingEnabled: false,
  heartRateZoneTraining: false,
  equipmentAvailable: [],
  excludedExercises: [],
  preferredCardioTypes: ['walking', 'cycling'],
  strengthFocusAreas: ['full_body'],
  homeWorkoutOnly: false,
  physiotherapyMode: false,
  postWorkoutStretch: true,
  voiceCoachingDuringWorkout: true,
  musicDuringWorkout: true,
  exerciseVideoQuality: 'medium',
  repCountingMode: 'manual',
  dietaryRestrictions: [],
  mealReminders: true,
  breakfastReminderTime: '08:00',
  lunchReminderTime: '13:00',
  dinnerReminderTime: '20:00',
  snackTrackingEnabled: true,
  mealPrepMode: false,
  foodDatabaseRegion: 'india',
  barcodeScannerEnabled: true,
  recipeSuggestionsEnabled: true,
  glycemicIndexFilter: true,
  lowSodiumMode: true,
  alcoholTracking: false,
  caffeineTracking: true,
  supplementTracking: false,
  intermittentFastingEnabled: false,
  preMealWalkReminder: true,
  postMealGlucoseLogReminder: true,
  portionSizeGuide: 'hand',
  sleepTrackingEnabled: true,
  dailySleepGoalHours: 8,
  bedtimeReminder: '22:30',
  wakeReminder: '06:30',
  trackSleepStages: false,
  napTracking: true,
  screenFreeBeforeBedMinutes: 30,
  smartAlarmEnabled: true,
  waterRemindersEnabled: true,
  waterReminderIntervalMinutes: 90,
  glassSizeMl: 250,
  stepTrackingEnabled: true,
  syncWithWearable: false,
  wearableProvider: 'none',
  syncFrequencyMinutes: 15,
  moodTrackingEnabled: true,
  energyLevelTracking: true,
  stressLevelTracking: false,
  periodTrackingEnabled: false,
  pushNotificationsEnabled: true,
  emailNotificationsEnabled: true,
  smsNotificationsEnabled: false,
  workoutReminders: true,
  workoutReminderLeadMinutes: 30,
  challengeUpdates: true,
  aiCoachTips: true,
  weeklyReportEmail: false,
  monthlyReportEmail: true,
  streakNotifications: true,
  achievementBadges: true,
  friendRequestNotifications: true,
  glucoseAlertNotifications: true,
  bpAlertNotifications: true,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  priorityAlertsOnly: false,
  profileVisibility: 'friends',
  showOnLeaderboard: true,
  shareProgressWithFriends: true,
  shareWorkoutHistory: true,
  shareNutritionLogs: false,
  analyticsEnabled: true,
  researchDataOptIn: false,
  locationTrackingEnabled: false,
  dataRetentionDays: 365,
  twoFactorEnabled: false,
  biometricLoginEnabled: false,
  sessionTimeoutMinutes: 60,
  exportIncludePhotos: true,
  anonymizeExports: false,
  aiCoachTone: 'friendly',
  aiCoachLanguage: 'en',
  includeHealthContextInAi: true,
  aiSuggestionFrequency: 'normal',
  aiConversationMemory: true,
  aiWorkoutAutoAdjust: true,
  aiMealSwapSuggestions: true,
  aiVoiceInput: false,
  aiReadAloud: false,
  aiInjuryReporting: true,
  culturalDietPreference: 'tamil_traditional',
  regionalFoodDatabase: true,
  reducedMotion: false,
  largeText: false,
  highContrast: false,
  colorBlindMode: 'none',
  dyslexiaFriendlyFont: false,
  screenReaderOptimized: false,
  minimumTouchTarget: false,
  captionsOnVideos: true,
  offlineModeEnabled: true,
  autoSyncOnReconnect: true,
  cacheWorkoutPlans: true,
  cacheMealPlans: true,
  backupFrequency: 'weekly',
  defaultExportFormat: 'csv',
  betaFeaturesEnabled: false,
  debugMode: false,
};
