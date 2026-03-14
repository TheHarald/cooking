import { makeAutoObservable, toJS } from "mobx";
import type { IIngredient, ICookingStep, IRecipe } from "../../../types/types";
import { newId } from "../../../services/constants";
import { RecipeConstructorTabs } from "./recipe-constructor-constants";

export class RecipeConstructorStore {
  targetRecipe: IRecipe | undefined = undefined;
  targetIngredient: IIngredient | undefined = undefined;
  targetStep: ICookingStep | undefined = undefined;
  recipeTab: RecipeConstructorTabs = RecipeConstructorTabs.Ingredients;

  constructor() {
    makeAutoObservable(this);
  }

  get isNewIngredient() {
    return this.targetIngredient?.id === newId;
  }

  get isNewStep() {
    return this.targetStep?.id === newId;
  }

  get hasIngredients() {
    return Boolean(this.targetRecipe?.ingredients.length);
  }

  get steps(): ICookingStep[] {
    const steps = this.targetRecipe?.cookingSteps ?? [];
    return [...steps].sort((a, b) => a.order - b.order);
  }

  public setRecipeTab(tab: RecipeConstructorTabs) {
    this.recipeTab = tab;
  }

  public setRecipe(recipe: IRecipe | undefined) {
    this.targetRecipe = toJS(recipe);
    if (this.targetRecipe && !this.targetRecipe.cookingSteps) {
      this.targetRecipe.cookingSteps = [];
    }
  }

  public setStep(step: ICookingStep | undefined) {
    this.targetStep = step ? toJS(step) : undefined;
  }

  public setStepField<K extends keyof ICookingStep>(
    field: K,
    value: ICookingStep[K],
  ) {
    if (this.targetStep === undefined) return;
    this.targetStep[field] = value;
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

  public saveStep() {
    if (this.targetRecipe === undefined) return;
    if (this.targetStep === undefined) return;

    const steps = this.targetRecipe.cookingSteps ?? [];
    const id = this.targetStep.id;

    if (this.targetStep.id === newId) {
      this.targetStep.id = crypto.randomUUID();
      this.targetStep.order = steps.length + 1;
      this.targetRecipe.cookingSteps = [...steps, this.targetStep];
      this.targetStep = undefined;
      return;
    }

    const existing = steps.find((s) => s.id === id);
    if (existing === undefined) return;
    Object.assign(existing, this.targetStep);
    this.targetStep = undefined;
  }

  public deleteStep(id: string) {
    if (this.targetRecipe === undefined) return;

    const steps = (this.targetRecipe.cookingSteps ?? []).filter(
      (s) => s.id !== id,
    );
    steps.forEach((s, i) => {
      s.order = i + 1;
    });
    this.targetRecipe.cookingSteps = steps;
    if (this.targetStep?.id === id) this.targetStep = undefined;
  }
}
