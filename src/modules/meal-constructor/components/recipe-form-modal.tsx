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
import { MealConstructorTabs } from "../services/meal-constructor-constants";
import { MealConstructorIngredientsList } from "./meal-consructor-ingredients-list";
import { MealConstructorStepsList } from "./meal-constructor-steps-list";

export const RecipeFormModal = observer(() => {
  const { mealConstructor } = store;

  const { targetRecipe, recipeTab } = mealConstructor;

  if (targetRecipe === undefined) return null;

  const { title } = targetRecipe;

  const onCancel = () => {
    mealConstructor.setRecipe(undefined);
  };

  return (
    <Modal onClose={onCancel} size="full" isOpen>
      <ModalContent>
        <ModalHeader className="px-4">Блюдо</ModalHeader>
        <ModalBody className="px-4 py-0">
          <Input
            placeholder="Название блюда"
            value={title}
            onChange={(e) =>
              mealConstructor.setRecipeField("title", e.target.value)
            }
          />
          <Tabs
            className="self-center"
            onSelectionChange={(key) =>
              mealConstructor.setRecipeTab(key as MealConstructorTabs)
            }
            selectedKey={recipeTab}
          >
            <Tab key={MealConstructorTabs.Ingredients} title="Ингредиенты">
              <MealConstructorIngredientsList />
            </Tab>
            <Tab key={MealConstructorTabs.Steps} title="Шаги">
              <MealConstructorStepsList />
            </Tab>
          </Tabs>
        </ModalBody>
        <ModalFooter className="px-4 flex flex-row justify-between">
          <Button onPress={onCancel}>Отмена</Button>
          <Button color="primary" onPress={() => mealConstructor.saveRecipe()}>
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
