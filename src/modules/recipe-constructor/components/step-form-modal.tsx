import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { store } from "../../../services/store";
import { getUnitLabel } from "../../../types/units";
import { useTranslation } from "react-i18next";

export const StepFormModal = observer(() => {
  const { recipeConstructor } = store;
  const { targetRecipe, targetStep, isNewStep } = recipeConstructor;
  const { t } = useTranslation();

  if (targetStep === undefined || targetRecipe === undefined) return null;

  const { description, duration, ingredientIds = [], id: currentStepId } = targetStep;
  const ingredients = targetRecipe.ingredients;
  const allSteps = targetRecipe.cookingSteps ?? [];

  const ingredientIdsUsedInOtherSteps = new Set(
    allSteps
      .filter((s) => s.id !== currentStepId)
      .flatMap((s) => s.ingredientIds ?? []),
  );

  const onCancel = () => recipeConstructor.setStep(undefined);

  const handleIngredientIdsChange = (ids: string[]) => {
    recipeConstructor.setStepField("ingredientIds", ids);
  };

  return (
    <Modal placement="top" onClose={onCancel} isOpen size="2xl">
      <ModalContent>
        <ModalHeader className="px-4">
          {isNewStep ? t("step-add") : t("step-edit")}
        </ModalHeader>
        <ModalBody className="px-4 gap-4">
          <Textarea
            label={t("step-description-label")}
            placeholder={t("step-description-placeholder")}
            value={description}
            onChange={(e) =>
              recipeConstructor.setStepField("description", e.target.value)
            }
            minRows={3}
            isRequired
          />

          <Input
            label={t("step-duration-label")}
            type="number"
            min={0}
            step={1}
            value={duration != null ? String(duration) : ""}
            onChange={(e) => {
              const v = e.target.value;
              recipeConstructor.setStepField(
                "duration",
                v === "" ? undefined : parseInt(v, 10) || 0,
              );
            }}
            placeholder="0"
          />

          {ingredients.length > 0 && (
            <CheckboxGroup
              label={t("step-ingredients-label")}
              value={ingredientIds}
              onValueChange={handleIngredientIdsChange}
              classNames={{ base: "gap-2" }}
            >
              {ingredients.map((ing) => (
                <Checkbox
                  key={ing.id}
                  value={ing.id}
                  isDisabled={ingredientIdsUsedInOtherSteps.has(ing.id)}
                >
                  {ing.name} ({ing.amount} {getUnitLabel(ing.unit)})
                </Checkbox>
              ))}
            </CheckboxGroup>
          )}
        </ModalBody>
        <ModalFooter className="flex justify-between px-4 safe-area-bottom">
          <Button variant="flat" onPress={onCancel}>
            {t("cancel")}
          </Button>
          <Button
            color="primary"
            onPress={() => recipeConstructor.saveStep()}
            isDisabled={!description.trim()}
          >
            {isNewStep ? t("create") : t("save")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
