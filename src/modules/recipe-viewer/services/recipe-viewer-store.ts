import { makeAutoObservable, runInAction } from "mobx";
import type { IRecipe } from "../../../types/types";
import { databaseStorage } from "../../../db/database-storage";
import { addToast } from "@heroui/react";

export class RecipeViewerStore {
  recipes: IRecipe[] = [];
  viewingRecipe: IRecipe | undefined = undefined;

  constructor() {
    makeAutoObservable(this);

    this.getRecipesFromStrage();
  }

  setViewingRecipe(recipe: IRecipe | undefined) {
    this.viewingRecipe = recipe;
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
