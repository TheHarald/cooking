import { AddIngredientButton } from "./add-ingredient-button";

export const CookingConstructor = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Создание блюда</h1>
      <AddIngredientButton
        onConfirm={(ingredient) => console.log(ingredient)}
      />
    </div>
  );
};
