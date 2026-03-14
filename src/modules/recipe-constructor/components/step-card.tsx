import { Button, Card, CardBody } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import type { ICookingStep, IRecipe } from "../../../types/types";
import { store } from "../../../services/store";
import { EditIcon, Trash } from "lucide-react";

export const StepCard = observer<{
  step: ICookingStep;
  ingredients: IRecipe["ingredients"];
}>(({ step, ingredients }) => {
  const { recipeConstructor } = store;
  const { t } = useTranslation();
  const { order, description, ingredientIds = [], duration } = step;

  const ingredientNames = ingredientIds
    .map((id) => ingredients.find((i) => i.id === id)?.name)
    .filter(Boolean) as string[];

  return (
    <Card shadow="sm">
      <CardBody className="flex flex-row gap-3 items-start py-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
          {order}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-foreground line-clamp-2">{description}</p>
          {ingredientNames.length > 0 && (
            <p className="text-default-500 text-xs mt-1">
              {ingredientNames.join(", ")}
            </p>
          )}
          {duration != null && duration > 0 && (
            <p className="text-default-400 text-xs mt-0.5">
              {t("recipe-duration-min", { count: duration })}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onPress={() => recipeConstructor.setStep(step)}
            aria-label="Редактировать"
          >
            <EditIcon className="size-4" />
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="light"
            isIconOnly
            onPress={() => recipeConstructor.deleteStep(step.id)}
            aria-label="Удалить"
          >
            <Trash className="size-4" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
});
