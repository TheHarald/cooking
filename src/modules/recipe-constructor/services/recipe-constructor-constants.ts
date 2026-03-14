import { newId } from "../../../services/constants";
import { Unit, type IIngredient, type ICookingStep, type IRecipe } from "../../../types/types";

export const defaultRecipe: IRecipe = {
  id: newId,
  tags: [],
  title: "Новое блюдо",
  ingredients: [],
  cookingSteps: [],
  isFavorite: false,
};

export const defaultIngredient: IIngredient = {
  id: newId,
  name: "",
  unit: Unit.Grams,
  amount: 100,
  note: "",
};

export const defaultCookingStep: ICookingStep = {
  id: newId,
  order: 1,
  description: "",
  ingredientIds: [],
};

export enum RecipeConstructorTabs {
  Ingredients = "ingredients",
  Steps = "steps",
}
