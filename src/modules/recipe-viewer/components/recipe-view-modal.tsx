import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { store } from "../../../services/store";
import { RecipeView } from "./recipe-view";

export const RecipeViewModal = observer(() => {
  const { recipeViwer } = store;
  const { viewingRecipe } = recipeViwer;

  if (viewingRecipe == null) return null;

  const onClose = () => recipeViwer.setViewingRecipe(undefined);

  return (
    <Modal isOpen size="full" onClose={onClose}>
      <ModalContent className="flex flex-col max-h-[100dvh]">
        <ModalHeader className="flex flex-row items-center justify-between gap-2 shrink-0 border-b border-default-200">
          <span className="truncate">{viewingRecipe.title}</span>
        </ModalHeader>
        <ModalBody className="p-4 overflow-hidden flex-1 min-h-0">
          <RecipeView recipe={viewingRecipe} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
