import { makeAutoObservable, runInAction } from "mobx";
import type { IRecipe } from "../../../types/types";
import { databaseStorage } from "../../../db/database-storage";
import { addToast } from "@heroui/react";

export class RecipeViewerStore {
  recipes: IRecipe[] = [];

  constructor() {
    makeAutoObservable(this);

    this.getRecipesFromStrage();
  }

  public async getRecipesFromStrage() {
    try {
      const recipes = await databaseStorage.getAllRecipes();

      console.log("getRecipesFromStrage", recipes);

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
