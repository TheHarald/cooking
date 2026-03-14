import { ScrollShadow } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { store } from "../../services/store";
import { AddRecipeButton } from "./components/add-recipe-button";
import { IngredientFormModal } from "./components/ingredient-form-modal";
import { RecipeCard } from "../recipe-viewer/components/recipe-card";
import { RecipeFormModal } from "./components/recipe-form-modal";
import { RecipeViewModal } from "../recipe-viewer/components/recipe-view-modal";
import { StepFormModal } from "./components/step-form-modal";
import { useTranslation } from "react-i18next";

export const CookingConstructor = observer(() => {
  const { recipeViwer } = store;
  const { recipes } = recipeViwer;
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col h-full min-h-0">
        <div className="flex flex-row justify-between items-center shrink-0">
          <h1 className="text-2xl font-bold">
            {t("recipe-constructor-title")}
          </h1>
          <AddRecipeButton />
        </div>
        <ScrollShadow className="flex-1 min-h-0 overflow-y-auto mt-2" hideScrollBar>
          <div className="flex flex-col gap-2 pb-2">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </ScrollShadow>
      </div>
      <IngredientFormModal />
      <StepFormModal />
      <RecipeFormModal />
      <RecipeViewModal />
    </>
  );
});
