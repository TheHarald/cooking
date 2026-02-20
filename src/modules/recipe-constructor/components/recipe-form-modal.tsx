import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { store } from "../../../services/store";
import { RecipeConstructorTabs } from "../services/recipe-constructor-constants";
import { RecipeConstructorIngredientsList } from "./recipe-consructor-ingredients-list";
import { RecipeConstructorStepsList } from "./recipe-constructor-steps-list";
import { newId } from "../../../services/constants";

export const RecipeFormModal = observer(() => {
  const { recipeConstructor } = store;

  const { targetRecipe, recipeTab } = recipeConstructor;

  if (targetRecipe === undefined) return null;

  const { title, id } = targetRecipe;

  const onCancel = () => {
    recipeConstructor.setRecipe(undefined);
  };

  return (
    <Modal onClose={onCancel} size="full" isOpen>
      <ModalContent>
        <ModalHeader className="px-4">
          {id === newId ? "Создание" : "Редактирование"}
        </ModalHeader>
        <ModalBody className="px-4 py-0">
          <Input
            placeholder="Название блюда"
            value={title}
            onChange={(e) =>
              recipeConstructor.setRecipeField("title", e.target.value)
            }
          />
          <Tabs
            className="self-center"
            onSelectionChange={(key) =>
              recipeConstructor.setRecipeTab(key as RecipeConstructorTabs)
            }
            selectedKey={recipeTab}
          >
            <Tab key={RecipeConstructorTabs.Ingredients} title="Ингредиенты">
              <RecipeConstructorIngredientsList />
            </Tab>
            <Tab key={RecipeConstructorTabs.Steps} title="Шаги">
              <RecipeConstructorStepsList />
            </Tab>
          </Tabs>
        </ModalBody>
        <ModalFooter className="px-4 flex flex-row justify-between">
          <Button onPress={onCancel}>Отмена</Button>
          <Button color="primary" onPress={() => store.saveRecipe()}>
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
