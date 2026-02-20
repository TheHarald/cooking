import { makeAutoObservable, toJS } from "mobx";
import type { IIngredient, IRecipe } from "../../../types/types";
import { newId } from "../../../services/constants";
import { RecipeConstructorTabs } from "./recipe-constructor-constants";

export class RecipeConstructorStore {
  targetRecipe: IRecipe | undefined = undefined;
  targetIngredient: IIngredient | undefined = undefined;
  recipeTab: RecipeConstructorTabs = RecipeConstructorTabs.Ingredients;

  constructor() {
    makeAutoObservable(this);
  }

  get isNewIngredient() {
    return this.targetIngredient?.id === newId;
  }

  get hasIngredients() {
    return Boolean(this.targetRecipe?.ingredients.length);
  }

  public setRecipeTab(tab: RecipeConstructorTabs) {
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
    value: IIngredient[K],
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
      (ingredient) => ingredient.id === id,
    );

    if (ingredient === undefined) return;

    Object.assign(ingredient, this.targetIngredient);
    this.targetIngredient = undefined;
  }

  public deleteIngredient(id: string) {
    if (this.targetRecipe === undefined) return;

    this.targetRecipe.ingredients = this.targetRecipe.ingredients.filter(
      (ingredient) => ingredient.id !== id,
    );
  }
}
