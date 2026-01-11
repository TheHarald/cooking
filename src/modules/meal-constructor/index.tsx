import { observer } from "mobx-react-lite";
import { store } from "../../services/store";
import { AddRecipeButton } from "./components/add-recipe-button";
import { IngredientFormModal } from "./components/ingredient-form-modal";
import { RecipeCard } from "./components/recipe-card";
import { RecipeFormModal } from "./components/recipe-form-modal";

export const CookingConstructor = observer(() => {
  const { mealConstructor } = store;
  const { recipes } = mealConstructor;

  console.log(recipes);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flew-row justify-between items-center">
          <h1 className="text-2xl font-bold">Блюда</h1>
          <AddRecipeButton />
        </div>
        <div className="flex flex-col gap-2">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
      <IngredientFormModal />
      <RecipeFormModal />
    </>
  );
});
