import { Button } from "@heroui/react";
import { store } from "../../../services/store";
import { PlusCircle } from "lucide-react";
import { defaultIngredient } from "../services/recipe-constructor-constants";
import { observer } from "mobx-react-lite";
import { IngredientCard } from "./ingredient-card";

export const RecipeConstructorIngredientsList = observer(() => {
  const { recipeConstructor } = store;

  const { targetRecipe } = recipeConstructor;

  if (targetRecipe === undefined) return null;

  const { ingredients } = targetRecipe;

  return (
    <div className="flex flex-col gap-2">
      {ingredients.map((ingredient) => {
        return <IngredientCard key={ingredient.id} ingredient={ingredient} />;
      })}
      <Button
        size="lg"
        color="primary"
        startContent={<PlusCircle className="size-6" />}
        onPress={() => recipeConstructor.setIngredient(defaultIngredient)}
      >
        Добавить ингредиент
      </Button>
    </div>
  );
});
