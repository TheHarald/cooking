import { observer } from "mobx-react-lite";
import { Button } from "@heroui/react";
import { PlusCircle } from "lucide-react";
import { defaultRecipe } from "../services/meal-constructor-constants";
import { store } from "../../../services/store";

export const AddRecipeButton = observer(() => {
  const { mealConstructor } = store;

  return (
    <Button
      variant="light"
      color="primary"
      isIconOnly
      onPress={() => mealConstructor.setRecipe(defaultRecipe)}
    >
      <PlusCircle className="size-6" />
    </Button>
  );
});
