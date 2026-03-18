// ================================
// ENUM ДЛЯ КЛАССИФИКАЦИИ
// ================================

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export enum RcipeType {
  Breakfast = "breakfast",
  Lunch = "lunch",
  Dinner = "dinner",
  Snack = "snack",
  Dessert = "dessert",
}

export enum Category {
  Breakfast = "breakfast",
  Lunch = "lunch",
  Dinner = "dinner",
  Dessert = "dessert",
  Appetizer = "appetizer",
  Salad = "salad",
  MainCourse = "main_course",
  Soup = "soup",
  Baking = "baking",
  Drink = "drink",
  Sauce = "sauce",
  SideDish = "side_dish",
}

export enum DayOfWeek {
  Monday = "monday",
  Tuesday = "tuesday",
  Wednesday = "wednesday",
  Thursday = "thursday",
  Friday = "friday",
  Saturday = "saturday",
  Sunday = "sunday",
}

/** Приём пищи для распределения блюд в рационе */
export enum MealType {
  Unknown = "unknown",
  Breakfast = "breakfast",
  Lunch = "lunch",
  Dinner = "dinner",
  Snack = "snack",
}

export enum Unit {
  // Weight
  Grams = "g",
  Kilograms = "kg",
  Milligrams = "mg",

  // Volume
  Milliliters = "ml",
  Liters = "l",
  Teaspoon = "tsp",
  Tablespoon = "tbsp",
  Cup = "cup",

  // Count
  Pieces = "pcs",
  Bunch = "bunch",
  Clove = "clove",
  Stalk = "stalk",

  // Other
  Pinch = "pinch",
  ToTaste = "to_taste",
  Serving = "serving",
  Package = "package",
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
  /** id ингредиентов, которые используются в этом шаге */
  ingredientIds?: string[];
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
  cookingSteps?: ICookingStep[];
  isFavorite: boolean;
  image?: File;
}

/** Одно блюдо в рационе дня: рецепт и необязательный лейбл (завтрак, ужин и т.д.) */
export interface IMealPlanEntry {
  id: string;
  recipeId: string;
  label?: string;
}

// Рацион: день недели → массив блюд (рецепт + опциональный лейбл)
export interface IMealPlan {
  /** Ключ в БД: `"weekly"` — один циклический рацион; либо YYYY-MM-DD понедельника (старые данные) */
  weekStart: string;
  plan: Partial<Record<DayOfWeek, IMealPlanEntry[]>>;
}

// Элемент списка покупок (агрегация ингредиентов из рецептов недели)
export interface IShoppingListItem {
  key: string;
  name: string;
  amount: number;
  unit: Unit;
  unitLabel?: string;
  checked: boolean;
  recipeTitles: string[];
}
