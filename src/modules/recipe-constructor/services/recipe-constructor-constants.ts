import { newId } from "../../../services/constants";
import { Unit, type IIngredient, type IRecipe } from "../../../types/types";

export const defaultRecipe: IRecipe = {
  id: newId,
  tags: [],
  title: "Новое блюдо",
  ingredients: [],
  isFavorite: false,
};

export const defaultIngredient: IIngredient = {
  id: newId,
  name: "",
  unit: Unit.GRAMS,
  amount: 100,
  note: "",
};

export enum RecipeConstructorTabs {
  Ingredients = "ingredients",
  Steps = "steps",
}
