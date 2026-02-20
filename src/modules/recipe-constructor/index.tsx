import { observer } from "mobx-react-lite";
import { store } from "../../services/store";
import { AddRecipeButton } from "./components/add-recipe-button";
import { IngredientFormModal } from "./components/ingredient-form-modal";
import { RecipeCard2 } from "../recipe-viewer/components/recipe-card";
import { RecipeFormModal } from "./components/recipe-form-modal";
import { useTranslation } from "react-i18next";

export const CookingConstructor = observer(() => {
  const { recipeViwer } = store;
  const { recipes } = recipeViwer;
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flew-row justify-between items-center">
          <h1 className="text-2xl font-bold">
            {t("recipe-constructor-title")}
          </h1>
          <AddRecipeButton />
        </div>
        <div className="flex flex-col gap-2">
          {recipes.map((recipe) => (
            <RecipeCard2 key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
      <IngredientFormModal />
      <RecipeFormModal />
    </>
  );
});
