import { makeAutoObservable, runInAction, toJS } from "mobx";
import { addToast } from "@heroui/react";
import { RecipeConstructorStore } from "../modules/recipe-constructor/services/recipe-constructor-store";
import { RecipeViewerStore } from "../modules/recipe-viewer/services/recipe-viewer-store";
import { newId } from "./constants";
import { databaseStorage } from "../db/database-storage";

class AppStore {
  public recipeConstructor: RecipeConstructorStore;
  public recipeViwer: RecipeViewerStore;

  constructor() {
    this.recipeConstructor = new RecipeConstructorStore();
    this.recipeViwer = new RecipeViewerStore();
    makeAutoObservable(this);
  }

  public saveRecipe() {
    const { targetRecipe } = this.recipeConstructor;
    const { recipes } = this.recipeViwer;

    if (targetRecipe === undefined) return;

    const id = targetRecipe.id;

    // добавление
    if (targetRecipe.id === newId) {
      targetRecipe.id = crypto.randomUUID();
      recipes.push(targetRecipe);
      this.recipeConstructor.targetRecipe = undefined;

      databaseStorage.addRecipe(toJS(targetRecipe));

      return;
    }

    // редактирование

    const recipe = recipes.find((recipe) => recipe.id === id);

    if (recipe === undefined) return;

    Object.assign(recipe, targetRecipe);

    databaseStorage.updateRecipe(toJS(recipe));

    this.recipeConstructor.targetRecipe = undefined;
  }

  public async deleteRecipe(id: string) {
    const { recipes } = this.recipeViwer;

    try {
      await databaseStorage.deleteRecipe(id);

      addToast({
        title: "Рецепт удален",
        color: "success",
      });

      runInAction(() => {
        this.recipeViwer.recipes = recipes.filter((recipe) => recipe.id !== id);
      });
    } catch {
      addToast({
        title: "Произошла ошибка при дулаении",
        color: "danger",
      });
    }
  }
}

export const store = new AppStore();
