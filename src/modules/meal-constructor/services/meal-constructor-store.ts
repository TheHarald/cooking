import { makeAutoObservable, toJS } from "mobx";
import type { IIngredient, IRecipe } from "../../../types/types";
import { newId } from "../../../services/constants";
import { MealConstructorTabs } from "./meal-constructor-constants";

export class MealConstructorStore {
  recipes: IRecipe[] = [];
  targetRecipe: IRecipe | undefined = undefined;
  targetIngredient: IIngredient | undefined = undefined;
  recipeTab: MealConstructorTabs = MealConstructorTabs.Ingredients;

  constructor() {
    makeAutoObservable(this);
  }

  get isNewIngredient() {
    return this.targetIngredient?.id === newId;
  }

  public setRecipeTab(tab: MealConstructorTabs) {
    this.recipeTab = tab;
  }

  public setRecipe(recipe: IRecipe | undefined) {
    this.targetRecipe = toJS(recipe);
  }

  public setIngredient(ingredient: IIngredient | undefined) {
    this.targetIngredient = toJS(ingredient);
  }

  public setRecipeField<K extends keyof IRecipe>(field: K, value: IRecipe[K]) {
    if (this.targetRecipe === undefined) return;

    this.targetRecipe[field] = value;
  }

  public setIngredientField<K extends keyof IIngredient>(
    field: K,
    value: IIngredient[K]
  ) {
    if (this.targetIngredient === undefined) return;

    this.targetIngredient[field] = value;
  }

  public saveIngredient() {
    if (this.targetRecipe === undefined) return;
    if (this.targetIngredient === undefined) return;

    const id = this.targetIngredient.id;

    // добавление
    if (this.targetIngredient.id === newId) {
      this.targetIngredient.id = crypto.randomUUID();
      this.targetRecipe.ingredients.push(this.targetIngredient);
      this.targetIngredient = undefined;

      return;
    }

    // редактирование

    const ingredient = this.targetRecipe.ingredients.find(
      (ingredient) => ingredient.id === id
    );

    if (ingredient === undefined) return;

    Object.assign(ingredient, this.targetIngredient);
    this.targetIngredient = undefined;
  }

  public deleteIngredient(id: string) {
    if (this.targetRecipe === undefined) return;

    this.targetRecipe.ingredients = this.targetRecipe.ingredients.filter(
      (ingredient) => ingredient.id !== id
    );
  }

  public deleteRecipe(id: string) {
    this.recipes = this.recipes.filter((recipe) => recipe.id !== id);
  }

  public saveRecipe() {
    if (this.targetRecipe === undefined) return;

    const id = this.targetRecipe.id;

    // добавление
    if (this.targetRecipe.id === newId) {
      this.targetRecipe.id = crypto.randomUUID();
      this.recipes.push(this.targetRecipe);
      this.targetRecipe = undefined;

      return;
    }

    // редактирование

    const recipe = this.recipes.find((recipe) => recipe.id === id);

    if (recipe === undefined) return;

    Object.assign(recipe, this.targetRecipe);
    this.targetRecipe = undefined;
  }
}
