import { makeAutoObservable, runInAction } from "mobx";
import type { IShoppingListItem } from "../../../types/types";
import { DayOfWeek } from "../../../types/types";
import { databaseStorage } from "../../../db/database-storage";
import { getUnitLabel } from "../../../types/units";
import { mealPlanStore } from "../../meal-plan/services/meal-plan-store";
import { store } from "../../../services/store";

const dayOrder: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday,
];

export class ShoppingListStore {
  checkedState = new Map<string, boolean>();

  constructor() {
    makeAutoObservable(this);
    this.loadCheckedState();
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

    const result: IShoppingListItem[] = [];

    for (const day of dayOrder) {
      const recipeIds = mealPlanStore.getRecipeIdsForDay(day);
      for (const recipeId of recipeIds) {
        const recipe = recipes.find((r) => r.id === recipeId);
        if (!recipe) continue;
        for (const ing of recipe.ingredients) {
          const key = `${day}-${recipeId}-${ing.id}`;
          result.push({
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
    }

    return result;
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

export const shoppingListStore = new ShoppingListStore();
