export interface UserProfile {
  fullName: string;
  age: number;
  gender: 'Nam' | 'Nữ';
  height: number;
  weight: number;
  goal: 'Giảm cân' | 'Tăng cơ' | 'Duy trì';
  activityLevel: 'Ít' | 'Vừa' | 'Nhiều';
  workoutDaysPerWeek: number;
  workoutDuration: number;
  favoriteFoods: string;
  dislikedFoods: string;
  allergies: string;
}

export interface ProfileMetrics {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: {
    protein: number;
    carb: number;
    fat: number;
  };
  waterLiters: number;
}

export interface AIAdvice {
  nutritionDirection: string;
  workoutDirection: string;
  keyTakeaways: string[];
}

export interface MealItem {
  name: string;
  items: string[];
  calories: number;
  protein?: string;
  carb?: string;
  fat?: string;
}

export interface DayMealPlan {
  dayNumber: number;
  dayName: string;
  breakfast: MealItem;
  lunch: MealItem;
  snack: MealItem;
  dinner: MealItem;
  totalCalories: number;
  distribution: {
    carbsGrams: number;
    proteinGrams: number;
    veggiesGrams: number;
    fruitsGrams: number;
    waterLiters: number;
  };
  notes?: string;
  customAdjusted?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  targetMuscle: string;
  tips: string;
  completed?: boolean;
}

export interface WorkoutSession {
  dayLabel: string;
  sessionTitle: string;
  durationMinutes: number;
  location: 'Tại nhà' | 'Phòng gym' | 'Ngoài trời';
  intensity: 'Nhẹ' | 'Vừa' | 'Cao';
  focusArea: string;
  exercises: Exercise[];
  completed?: boolean;
}

export interface WeekWorkoutPlan {
  weekNumber: number;
  weekTitle: string;
  weekDescription: string;
  sessions: WorkoutSession[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
