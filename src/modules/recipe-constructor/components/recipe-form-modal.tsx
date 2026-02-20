import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Tab,
  Tabs,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { store } from "../../../services/store";
import { RecipeConstructorTabs } from "../services/recipe-constructor-constants";
import { RecipeConstructorIngredientsList } from "./recipe-consructor-ingredients-list";
import { RecipeConstructorStepsList } from "./recipe-constructor-steps-list";
import { newId } from "../../../services/constants";
import { ImageInput } from "../../../components/image-input";

export const RecipeFormModal = observer(() => {
  const { recipeConstructor } = store;

  const { targetRecipe, recipeTab } = recipeConstructor;

  const { t } = useTranslation();

  if (targetRecipe === undefined) return null;

  const { title, id, image } = targetRecipe;

  const onCancel = () => {
    recipeConstructor.setRecipe(undefined);
  };

  return (
    <Modal onClose={onCancel} size="full" isOpen>
      <ModalContent className="flex flex-col">
        <ModalHeader className="px-4 flex-shrink-0">
          {id === newId ? t("creation") : t("editing")}
        </ModalHeader>
        <ModalBody className="px-4 py-0 overflow-hidden">
          <ScrollShadow hideScrollBar>
            <div className="flex flex-col gap-4">
              <Input
                placeholder={t("meal-name")}
                value={title}
                onChange={(e) =>
                  recipeConstructor.setRecipeField("title", e.target.value)
                }
              />
              <ImageInput
                value={image}
                onFileUpload={(file) =>
                  recipeConstructor.setRecipeField("image", file)
                }
              />
              <Tabs
                className="self-center"
                onSelectionChange={(key) =>
                  recipeConstructor.setRecipeTab(key as RecipeConstructorTabs)
                }
                selectedKey={recipeTab}
              >
                <Tab
                  key={RecipeConstructorTabs.Ingredients}
                  title={t("ingredients")}
                >
                  <RecipeConstructorIngredientsList />
                </Tab>
                <Tab key={RecipeConstructorTabs.Steps} title={t("steps")}>
                  <RecipeConstructorStepsList />
                </Tab>
              </Tabs>
            </div>
          </ScrollShadow>
        </ModalBody>
        <ModalFooter className="px-4 flex flex-row justify-between">
          <Button onPress={onCancel}>{t("cancel")}</Button>
          <Button color="primary" onPress={() => store.saveRecipe()}>
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
