import { observer } from "mobx-react-lite";
import type { IRecipe, IIngredient, ICookingStep } from "../../../types/types";
import { getUnitLabel } from "../../../types/units";
import { MealImage } from "./meal-image";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

function IngredientRow({ name, amount, unit, note }: IIngredient) {
  const unitLabel = getUnitLabel(unit);
  return (
    <li className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 py-1.5 border-b border-default-100 last:border-0">
      <span className="font-medium text-foreground">{name}</span>
      <span className="text-default-500 text-sm">
        {amount} {unitLabel}
        {note ? ` · ${note}` : ""}
      </span>
    </li>
  );
}

function formatStepIngredient(ing: IIngredient): string {
  const unitLabel = getUnitLabel(ing.unit);
  const amount = `${ing.amount} ${unitLabel}`;
  return ing.note?.trim()
    ? `${ing.name} — ${amount} (${ing.note})`
    : `${ing.name} — ${amount}`;
}

function StepRow({
  step,
  ingredients,
}: {
  step: ICookingStep;
  ingredients: IRecipe["ingredients"];
}) {
  const { t } = useTranslation();
  const { order, description, duration, ingredientIds = [] } = step;
  const stepIngredients = ingredientIds
    .map((id) => ingredients.find((i) => i.id === id))
    .filter((ing): ing is IIngredient => ing != null);

  return (
    <li className="flex gap-3 py-3 border-b border-default-100 last:border-0">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
        {order}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-foreground">{description}</p>
        {stepIngredients.length > 0 && (
          <ul className="text-sm text-default-500 mt-1 list-none space-y-0.5">
            {stepIngredients.map((ing) => (
              <li key={ing.id}>{formatStepIngredient(ing)}</li>
            ))}
          </ul>
        )}
        {duration != null && duration > 0 && (
          <p className="text-sm text-default-500 mt-0.5">
            {t("recipe-duration-min", { count: duration })}
          </p>
        )}
      </div>
    </li>
  );
}

export const RecipeView = observer<{ recipe: IRecipe }>(({ recipe }) => {
  const { t } = useTranslation();
  const {
    title,
    description,
    ingredients,
    cookingSteps = [],
    image,
  } = recipe;

  const sortedSteps = useMemo(
    () => [...cookingSteps].sort((a, b) => a.order - b.order),
    [cookingSteps]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>

        <MealImage image={image} alt="" variant="large" />

        {description?.trim() && (
          <p className="text-default-600 text-sm">{description}</p>
        )}
      </div>

      <div className="gap-0 px-0 py-3">
        <h2 className="text-sm font-semibold text-default-500 uppercase tracking-wide mb-2">
          {t("ingredients")}
        </h2>
        <ul className="list-none">
          {ingredients.map((ing) => (
            <IngredientRow key={ing.id} {...ing} />
          ))}
        </ul>
      </div>

      {sortedSteps.length > 0 && (
        <div className="gap-0 px-0 py-3">
          <h2 className="text-sm font-semibold text-default-500 uppercase tracking-wide mb-2">
            {t("steps")}
          </h2>
          <ol className="list-none">
            {sortedSteps.map((step) => (
              <StepRow
                key={step.id}
                step={step}
                ingredients={ingredients}
              />
            ))}
          </ol>
        </div>
      )}
    </div>
  );
});
