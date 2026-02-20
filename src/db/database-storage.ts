import type { IRecipe } from "../types/types";
import { initDB } from "./index-db";

class DatabaseStorage {
  private async getDB() {
    return await initDB();
  }

  // Добавление рецепта
  public async addRecipe(recipe: IRecipe): Promise<string> {
    const db = await this.getDB();
    // Используем шорткат db.add()
    return await db.add("recipes", recipe);
  }

  // Получение всех рецептов
  public async getAllRecipes(): Promise<IRecipe[]> {
    const db = await this.getDB();
    return await db.getAll("recipes");
  }

  // Обновление рецепта
  public async updateRecipe(recipe: IRecipe): Promise<void> {
    const db = await this.getDB();
    await db.put("recipes", recipe);
  }

  // Удаление рецепта
  public async deleteRecipe(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete("recipes", id);
  }
}

export const databaseStorage = new DatabaseStorage();
