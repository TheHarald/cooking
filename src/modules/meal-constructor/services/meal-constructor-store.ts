import { makeAutoObservable } from "mobx";
import type { IRecipe } from "../../../types/types";

export class MealConstructorStore {
  recipes: IRecipe[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public addRecipe(recipe: IRecipe) {
    this.recipes.push(recipe);
  }
}
