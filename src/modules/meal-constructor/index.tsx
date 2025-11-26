import { Unit, type IIngredient } from "../../types/types";
import { AddIngredientButton } from "./add-ingredient-button";

const defaultIngredient: IIngredient = {
  id: crypto.randomUUID(),
  name: "",
  unit: Unit.GRAMS,
  amount: 0,
  note: "",
  category: "",
};

export const CookingConstructor = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Создание блюда</h1>
      <AddIngredientButton
        ingredient={defaultIngredient}
        onCancel={() => undefined}
        onConfirm={(ingredient) => console.log(ingredient)}
        title="Создать"
      />
    </div>
  );
};
