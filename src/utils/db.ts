import { openDB, type DBSchema } from "idb";
import type { IRecipe } from "../types/types";

interface MealPlannerDB extends DBSchema {
  recipes: {
    key: string; // IRecipe['id']
    value: IRecipe;
  };
}

class MealPlannerDB {
  private db: IDBPDatabase<MealPlannerDB> | null = null;

  async init(): Promise<void> {
    this.db = await openDB<MealPlannerDB>("MealPlannerDB", 1, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Создаём хранилище для рецептов
        const recipeStore = db.createObjectStore("recipes", { keyPath: "id" });
        recipeStore.createIndex("createdAt", "createdAt");
        recipeStore.createIndex("favorite", "favorite");
        recipeStore.createIndex("category", "category");

        // Создаём хранилище для запланированных рецептов
        const scheduledStore = db.createObjectStore("scheduledRecipes", {
          keyPath: "id",
        });
        scheduledStore.createIndex("date", "date");
        scheduledStore.createIndex("dayOfWeek", "dayOfWeek");

        // Создаём хранилище для списков покупок
        const shoppingStore = db.createObjectStore("shoppingLists", {
          keyPath: "id",
        });
        shoppingStore.createIndex("createdAt", "createdAt");
        shoppingStore.createIndex("completed", "completed");

        // Создаём хранилище для кулинарных сессий
        const cookingStore = db.createObjectStore("cookingSessions", {
          keyPath: "id",
        });
        cookingStore.createIndex("isActive", "isActive");
        cookingStore.createIndex("recipeId", "recipeId");
      },
    });
  }

  // ==================== РЕЦЕПТЫ ====================
  async createRecipe(recipe: IRecipe): Promise<string> {
    if (!this.db) await this.init();
    return this.db!.add("recipes", recipe);
  }

  async getRecipe(id: string): Promise<IRecipe | undefined> {
    if (!this.db) await this.init();
    return this.db!.get("recipes", id);
  }

  async updateRecipe(id: string, updates: Partial<IRecipe>): Promise<void> {
    if (!this.db) await this.init();
    const recipe = await this.getRecipe(id);
    if (!recipe) throw new Error("Recipe not found");

    await this.db!.put("recipes", {
      ...recipe,
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteRecipe(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete("recipes", id);
  }

  async getAllRecipes(): Promise<IRecipe[]> {
    if (!this.db) await this.init();
    return this.db!.getAll("recipes");
  }

  async getRecipesByCategory(category: string): Promise<IRecipe[]> {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex("recipes", "category", category);
  }

  async getFavoriteRecipes(): Promise<IRecipe[]> {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex("recipes", "favorite", "true");
  }

  // ==================== ЗАПЛАНИРОВАННЫЕ РЕЦЕПТЫ ====================
  async scheduleRecipe(scheduled: IScheduledRecipe): Promise<string> {
    if (!this.db) await this.init();
    return this.db!.add("scheduledRecipes", scheduled);
  }

  async getScheduledRecipesByDate(date: Date): Promise<IScheduledRecipe[]> {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex("scheduledRecipes", "date", date);
  }

  // ==================== СПИСКИ ПОКУПОК ====================
  async createShoppingList(list: IShoppingList): Promise<string> {
    if (!this.db) await this.init();
    return this.db!.add("shoppingLists", list);
  }

  async getActiveShoppingLists(): Promise<IShoppingList[]> {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex("shoppingLists", "completed", "false");
  }

  // ==================== КУЛИНАРНЫЕ СЕССИИ ====================
  async startCookingSession(session: ICookingSession): Promise<string> {
    if (!this.db) await this.init();
    return this.db!.add("cookingSessions", session);
  }

  async getActiveCookingSession(): Promise<ICookingSession | undefined> {
    if (!this.db) await this.init();
    const sessions = await this.db!.getAllFromIndex(
      "cookingSessions",
      "isActive",
      "true"
    );
    return sessions.length > 0 ? sessions[0] : undefined;
  }
}

export const db = new MealPlannerDB();
