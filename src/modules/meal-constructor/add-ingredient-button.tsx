import { Button } from "@heroui/react";
import { PlusCircle } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { IngredientFormModal } from "./ingredient-form-modal";
import { Unit, type IIngredient } from "../../types/types";

const defaultIngredient: IIngredient = {
  id: "new-id",
  name: "",
  unit: Unit.GRAMS,
  amount: 1,
  note: "",
};

export const AddIngredientButton = observer<{
  onConfirm: (ingredient: IIngredient) => void;
}>(({ onConfirm }) => {
  const [open, setOpen] = useState(false);

  const closeHandler = () => {
    setOpen(false);
  };

  const openHandler = () => {
    setOpen(true);
  };

  const confirmHandler = (ingredient: IIngredient) => {
    onConfirm({
      ...ingredient,
      id: crypto.randomUUID(),
    });
    closeHandler();
  };

  return (
    <>
      <Button color="primary" isIconOnly onPress={openHandler}>
        <PlusCircle className="size-6" />
      </Button>
      {open ? (
        <IngredientFormModal
          title="Создать"
          onCancel={closeHandler}
          ingredient={defaultIngredient}
          onConfirm={confirmHandler}
        />
      ) : null}
    </>
  );
});
