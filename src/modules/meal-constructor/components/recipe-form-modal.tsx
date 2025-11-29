import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { AddIngredientButton } from "./add-ingredient-button";
import type { IRecipe } from "../../../types/types";

class RecipeFormStore {
  revicpe: IRecipe;
  constructor(recipe: IRecipe) {
    this.revicpe = recipe;
    makeAutoObservable(this);
  }
}

export const RecipeFormModal = observer<{
  title: string;
  recipe: IRecipe;
  onConfirm: (recipe: IRecipe) => void;
  onCancel: VoidFunction;
}>(({ title, recipe: initRecipe, onCancel }) => {
  const store = useMemo(() => new RecipeFormStore(initRecipe), [initRecipe]);

  return (
    <Modal onClose={onCancel} size="full" isOpen>
      <ModalContent>
        <ModalHeader className="px-4">{title}</ModalHeader>
        <ModalBody className="px-4">
          Инргедиенты
          <AddIngredientButton onConfirm={(d) => console.log(d)} />
        </ModalBody>
        <ModalFooter className="px-4">
          <button>Save</button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
