export interface MacroBreakdown {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  sugarG?: number;
  sodiumMg?: number;
}

export interface MealItem {
  name: string;
  quantity: string;
  macros: MacroBreakdown;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  items: MealItem[];
  totalMacros: MacroBreakdown;
  photoUrl?: string | null;
  aiAnalyzed: boolean;
  loggedAt: string;
}

export interface MealPlan {
  id: string;
  userId: string;
  title: string;
  days: MealPlanDay[];
  aiGenerated: boolean;
  diabeticFriendly: boolean;
  lowSodium: boolean;
  createdAt: string;
}

export interface MealPlanDay {
  dayNumber: number;
  meals: {
    mealType: Meal['mealType'];
    items: MealItem[];
    totalMacros: MacroBreakdown;
  }[];
}

export interface WaterLog {
  id: string;
  userId: string;
  amountMl: number;
  loggedAt: string;
}
