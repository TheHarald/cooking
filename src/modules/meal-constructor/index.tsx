import { AddRecipeButton } from "./components/add-recipe-button";
import { RecipeFormModal } from "./components/recipe-form-modal";

export const CookingConstructor = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Создание блюда</h1>
      <AddRecipeButton onConfirm={(d) => console.log(d)} />
    </div>
  );
};
