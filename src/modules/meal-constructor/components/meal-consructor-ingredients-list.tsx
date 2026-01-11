import { Button } from "@heroui/react";
import { store } from "../../../services/store";
import { PlusCircle } from "lucide-react";
import { defaultIngredient } from "../services/meal-constructor-constants";
import { observer } from "mobx-react-lite";
import { IngredientCard } from "./ingredient-card";

export const MealConstructorIngredientsList = observer(() => {
  const { mealConstructor } = store;

  const { targetRecipe } = mealConstructor;

  if (targetRecipe === undefined) return null;

  const { ingredients } = targetRecipe;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between flex-row items-center">
        <Button
          variant="light"
          color="primary"
          isIconOnly
          onPress={() => mealConstructor.setIngredient(defaultIngredient)}
        >
          <PlusCircle className="size-6" />
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {ingredients.map((ingredient) => {
          return <IngredientCard key={ingredient.id} ingredient={ingredient} />;
        })}
      </div>
    </div>
  );
});
