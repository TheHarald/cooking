import { observer } from "mobx-react-lite";
import type { IRecipe } from "../../../types/types";
import { useState } from "react";
import { Button } from "@heroui/react";
import { PlusCircle } from "lucide-react";
import { RecipeFormModal } from "./recipe-form-modal";

const defaultRecipe: IRecipe = {
  id: "new-id",
  ingredients: [],
  title: "",
  description: "",
  tags: [],
  favorite: false,
};

export const AddRecipeButton = observer<{
  onConfirm: (recide: IRecipe) => void;
}>(({ onConfirm }) => {
  const [open, setOpen] = useState(false);

  const closeHandler = () => {
    setOpen(false);
  };

  const openHandler = () => {
    setOpen(true);
  };

  const confirmHandler = (recide: IRecipe) => {
    onConfirm({
      ...recide,
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
        <RecipeFormModal
          recipe={defaultRecipe}
          title="Создавть"
          onCancel={closeHandler}
          onConfirm={confirmHandler}
        />
      ) : null}
    </>
  );
});
