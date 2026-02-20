// ================================
// ENUM ДЛЯ КЛАССИФИКАЦИИ
// ================================

export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum RcipeType {
  BREAKFAST = "breakfast",
  LUNCH = "lunch",
  DINNER = "dinner",
  SNACK = "snack",
  DESSERT = "dessert",
}

export enum Category {
  BREAKFAST = "breakfast",
  LUNCH = "lunch",
  DINNER = "dinner",
  DESSERT = "dessert",
  APPETIZER = "appetizer",
  SALAD = "salad",
  MAIN_COURSE = "main_course",
  SOUP = "soup",
  BAKING = "baking",
  DRINK = "drink",
  SAUCE = "sauce",
  SIDE_DISH = "side_dish",
}

export enum DayOfWeek {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

export enum Unit {
  // Weight
  GRAMS = "g",
  KILOGRAMS = "kg",
  MILLIGRAMS = "mg",

  // Volume
  MILLILITERS = "ml",
  LITERS = "l",
  TEASPOON = "tsp",
  TABLESPOON = "tbsp",
  CUP = "cup",

  // Count
  PIECES = "pcs",
  BUNCH = "bunch",
  CLOVE = "clove",
  STALK = "stalk",

  // Other
  PINCH = "pinch",
  TO_TASTE = "to_taste",
  SERVING = "serving",
  PACKAGE = "package",
}

// ================================
// ОСНОВНЫЕ ИНТЕРФЕЙСЫ ДАННЫХ
// ================================
export interface IIngredient {
  id: string;
  name: string;
  amount: number;
  unit: Unit;
  note?: string;
}

export interface ICookingStep {
  id: string;
  order: number;
  description: string;
  duration?: number;
  imageUrl?: string;
  timerEnabled?: boolean;
}

export interface IRecipe {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  ingredients: IIngredient[];
  isFavorite: boolean;
  image?: File;
}
