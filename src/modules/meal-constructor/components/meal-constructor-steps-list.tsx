import { Button } from "@heroui/react";
import { PlusCircle } from "lucide-react";
import { observer } from "mobx-react-lite";
import { store } from "../../../services/store";

export const MealConstructorStepsList = observer(() => {
  const { mealConstructor } = store;

  const { hasIngredients } = mealConstructor;

  return (
    <div className="flex flex-col gap-4">
      {!hasIngredients ? (
        <div className="text-center">Ингредиентов пока нет</div>
      ) : null}
      <Button
        size="lg"
        color="primary"
        isDisabled={!hasIngredients}
        startContent={<PlusCircle className="size-6" />}
      >
        Добавить шаг
      </Button>
    </div>
  );
});
