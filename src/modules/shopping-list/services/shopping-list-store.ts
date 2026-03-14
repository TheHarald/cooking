import { makeAutoObservable, runInAction } from "mobx";
import type { IShoppingListItem } from "../../../types/types";
import { DayOfWeek } from "../../../types/types";
import { databaseStorage } from "../../../db/database-storage";
import { getUnitLabel } from "../../../types/units";
import { mealPlanStore } from "../../meal-plan/services/meal-plan-store";
import { store } from "../../../services/store";

const DAY_ORDER: DayOfWeek[] = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
];

function makeItemKey(name: string, unit: string): string {
  return `${name.toLowerCase().trim()}|${unit}`;
}

export class ShoppingListStore {
  checkedState: Record<string, boolean> = {};

  constructor() {
    makeAutoObservable(this);
    this.loadCheckedState();
  }

  async loadCheckedState() {
    try {
      const state = await databaseStorage.getShoppingListChecked();
      runInAction(() => {
        this.checkedState = state;
      });
    } catch {
      runInAction(() => {
        this.checkedState = {};
      });
    }
  }

  get items(): IShoppingListItem[] {
    const plan = mealPlanStore.plan;
    const recipes = store.recipeViwer.recipes;
    if (!plan) return [];

    const byKey: Record<
      string,
      { name: string; amount: number; unit: import("../../../types/types").Unit; recipeTitles: Set<string> }
    > = {};

    for (const day of DAY_ORDER) {
      const recipeIds = plan.plan[day] ?? [];
      for (const recipeId of recipeIds) {
        const recipe = recipes.find((r) => r.id === recipeId);
        if (!recipe) continue;
        for (const ing of recipe.ingredients) {
          const key = makeItemKey(ing.name, ing.unit);
          if (!byKey[key]) {
            byKey[key] = { name: ing.name, amount: 0, unit: ing.unit, recipeTitles: new Set() };
          }
          byKey[key].amount += ing.amount;
          byKey[key].recipeTitles.add(recipe.title);
        }
      }
    }

    return Object.entries(byKey).map(([key, { name, amount, unit, recipeTitles }]) => ({
      key,
      name,
      amount,
      unit,
      unitLabel: getUnitLabel(unit),
      checked: this.checkedState[key] ?? false,
      recipeTitles: Array.from(recipeTitles),
    }));
  }

  async toggleChecked(key: string) {
    const next = !(this.checkedState[key] ?? false);
    this.checkedState = { ...this.checkedState, [key]: next };
    await databaseStorage.setShoppingItemChecked(key, next);
  }

  async clearChecked() {
    const keys = Object.keys(this.checkedState);
    for (const key of keys) {
      await databaseStorage.setShoppingItemChecked(key, false);
    }
    this.checkedState = {};
  }
}

export const shoppingListStore = new ShoppingListStore();
