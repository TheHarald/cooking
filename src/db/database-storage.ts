import type { IRecipe, IMealPlan } from "../types/types";
import { initDB } from "./index-db";

class DatabaseStorage {
  public async getDB() {
    return await initDB();
  }

  public async addRecipe(recipe: IRecipe): Promise<string> {
    const db = await this.getDB();
    return await db.add("recipes", recipe);
  }

  public async getAllRecipes(): Promise<IRecipe[]> {
    const db = await this.getDB();
    return await db.getAll("recipes");
  }

  public async updateRecipe(recipe: IRecipe): Promise<void> {
    const db = await this.getDB();
    await db.put("recipes", recipe);
  }

  public async deleteRecipe(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete("recipes", id);
  }

  public async getMealPlan(weekStart: string): Promise<IMealPlan | undefined> {
    const db = await this.getDB();
    return await db.get("mealPlans", weekStart);
  }

  public async putMealPlan(plan: IMealPlan): Promise<void> {
    const db = await this.getDB();
    await db.put("mealPlans", plan);
  }

  public async getShoppingListChecked(): Promise<Record<string, boolean>> {
    const db = await this.getDB();
    const all = await db.getAll("shoppingListChecked");
    return Object.fromEntries(all.map(({ key, checked }) => [key, checked]));
  }

  public async setShoppingItemChecked(key: string, checked: boolean): Promise<void> {
    const db = await this.getDB();
    await db.put("shoppingListChecked", { key, checked });
  }
}

export const databaseStorage = new DatabaseStorage();
