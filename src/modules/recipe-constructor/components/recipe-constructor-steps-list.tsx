import { Button } from "@heroui/react";
import { PlusCircle } from "lucide-react";
import { observer } from "mobx-react-lite";
import { store } from "../../../services/store";
import { defaultCookingStep } from "../services/recipe-constructor-constants";
import { StepCard } from "./step-card";
import { useTranslation } from "react-i18next";

export const RecipeConstructorStepsList = observer(() => {
  const { recipeConstructor } = store;
  const { t } = useTranslation();

  const { targetRecipe, hasIngredients, steps } = recipeConstructor;

  if (targetRecipe === undefined) return undefined;

  const { ingredients } = targetRecipe;

  return (
    <div className="flex flex-col gap-3">
      {!hasIngredients ? (
        <p className="text-default-500 text-sm text-center py-2">
          {t("steps-empty")}
        </p>
      ) : (
        <>
          {steps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              ingredients={ingredients}
            />
          ))}
          <Button
            size="lg"
            color="primary"
            variant="flat"
            startContent={<PlusCircle className="size-6" />}
            onPress={() =>
              recipeConstructor.setStep({
                ...defaultCookingStep,
                order: steps.length + 1,
              })
            }
          >
            {t("step-add")}
          </Button>
        </>
      )}
    </div>
  );
});
