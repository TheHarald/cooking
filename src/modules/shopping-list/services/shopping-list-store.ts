import { makeAutoObservable, runInAction } from "mobx";
import type { IShoppingListItem } from "../../../types/types";
import { DayOfWeek } from "../../../types/types";
import { databaseStorage } from "../../../db/database-storage";
import { getUnitLabel } from "../../../types/units";
import { mealPlanStore } from "../../meal-plan/services/meal-plan-store";
import { store } from "../../../services/store";
import dayjs from "../../../dayjs";

const dayOrder: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday,
];

function normalizeIngredientName(name: string): string {
  return name.trim().toLowerCase();
}

function getTodayDayOfWeek(): DayOfWeek {
  const isoIdx = dayjs().isoWeekday() - 1;
  return dayOrder[isoIdx];
}

export class ShoppingListStore {
  checkedState = new Map<string, boolean>();

  selectedDay: DayOfWeek = getTodayDayOfWeek();

  constructor() {
    makeAutoObservable(this);
    this.loadCheckedState();
  }

  get dayOrder(): DayOfWeek[] {
    return dayOrder;
  }

  setSelectedDay(day: DayOfWeek) {
    this.selectedDay = day;
  }

  async loadCheckedState() {
    try {
      const state = await databaseStorage.getShoppingListChecked();
      runInAction(() => {
        this.checkedState = new Map(Object.entries(state ?? {}));
      });
    } catch {
      runInAction(() => {
        this.checkedState = new Map();
      });
    }
  }

  get items(): IShoppingListItem[] {
    const recipes = store.recipeViwer.recipes;
    if (!mealPlanStore.plan) return [];

    const normalizedToItem = new Map<string, IShoppingListItem>();
    const recipeIds = mealPlanStore.getRecipeIdsForDay(this.selectedDay);

    for (const recipeId of recipeIds) {
      const recipe = recipes.find((r) => r.id === recipeId);
      if (!recipe) continue;

      for (const ing of recipe.ingredients) {
        const normalizedName = normalizeIngredientName(ing.name);
        const key = `${this.selectedDay}-${normalizedName}`;

        const existing = normalizedToItem.get(key);
        if (existing) {
          // Группируем по имени (без количества). Только расширяем список рецептов.
          if (!existing.recipeTitles.includes(recipe.title)) {
            existing.recipeTitles.push(recipe.title);
          }
          continue;
        }

        normalizedToItem.set(key, {
          key,
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          unitLabel: getUnitLabel(ing.unit),
          checked: this.checkedState.get(key) ?? false,
          recipeTitles: [recipe.title],
        });
      }
    }

    return Array.from(normalizedToItem.values());
  }

  async toggleChecked(_key: string) {
    // Пока заблокировано: чекбокс не меняет состояние
  }

  async clearChecked() {
    for (const key of this.checkedState.keys()) {
      await databaseStorage.setShoppingItemChecked(key, false);
    }
    this.checkedState = new Map();
  }
}
