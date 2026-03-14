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
