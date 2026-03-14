import { makeAutoObservable, runInAction } from "mobx";
import type { IRecipe } from "../../../types/types";
import { databaseStorage } from "../../../db/database-storage";
import { addToast } from "@heroui/react";

export class RecipeViewerStore {
  recipes: IRecipe[] = [];
  viewingRecipe: IRecipe | undefined = undefined;
  searchQuery = "";

  constructor() {
    makeAutoObservable(this);

    this.getRecipesFromStrage();
  }

  get filteredRecipes(): IRecipe[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.recipes;
    return this.recipes.filter((recipe) => {
      if (recipe.title.toLowerCase().includes(q)) return true;
      if (recipe.tags?.some((tag) => tag.toLowerCase().includes(q))) return true;
      if (recipe.ingredients?.some((ing) => ing.name.toLowerCase().includes(q))) return true;
      return false;
    });
  }

  /** Уникальные названия ингредиентов из всех рецептов — для автокомплита */
  get ingredientNames(): string[] {
    const set = new Set<string>();
    for (const recipe of this.recipes) {
      for (const ing of recipe.ingredients ?? []) {
        const n = ing.name?.trim();
        if (n) set.add(n);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ru"));
  }

  setViewingRecipe(recipe: IRecipe | undefined) {
    this.viewingRecipe = recipe;
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  public async getRecipesFromStrage() {
    try {
      const recipes = await databaseStorage.getAllRecipes();

      runInAction(() => {
        this.recipes = recipes;
      });
    } catch {
      addToast({
        title: "Error",
        description: "Something went wrong",
        color: "danger",
      });
    }
  }
}
