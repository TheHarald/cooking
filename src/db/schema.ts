import type { DBSchema } from "idb";
import type { IRecipe } from "../types/types";
import type { IMealPlan } from "../types/types";

export interface ICookingDB extends DBSchema {
  recipes: {
    value: IRecipe;
    key: string;
  };
  mealPlans: {
    value: IMealPlan;
    key: string;
    indexes: { "by-weekStart": string };
  };
  /** Состояние «отмечено» для элементов списка покупок: key (name|unit) → checked */
  shoppingListChecked: {
    value: { key: string; checked: boolean };
    key: string;
  };
}
