import {
  Button,
  Card,
  CardBody,
  Select,
  SelectItem,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Eye, TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { store } from "../../../services/store";
import { MealImage } from "../../recipe-viewer/components/meal-image";
import { mealPlanStore } from "../services/meal-plan-store";
import { MealType, type IMealPlanEntry } from "../../../types/types";

const mealTypeOptions: MealType[] = [
  MealType.Unknown,
  MealType.Breakfast,
  MealType.Lunch,
  MealType.Dinner,
  MealType.Snack,
];

const concreteMealTypes: MealType[] = [
  MealType.Breakfast,
  MealType.Lunch,
  MealType.Dinner,
  MealType.Snack,
];

function entryLabelToMealType(label: string | undefined): MealType {
  if (label === undefined || label === "") return MealType.Unknown;
  if (label === MealType.Unknown) return MealType.Unknown;
  return concreteMealTypes.includes(label as MealType)
    ? (label as MealType)
    : MealType.Unknown;
}

type MealPlanDishCardProps = { entry: IMealPlanEntry };

export const MealPlanDishCard = observer<MealPlanDishCardProps>(({ entry }) => {
  const { t } = useTranslation();
  const { recipeViwer } = store;
  const recipe = recipeViwer.recipes.find((r) => r.id === entry.recipeId);
  if (recipe === undefined) return undefined;

  const selectedKey = entryLabelToMealType(entry.label);

  return (
    <Card className="w-full overflow-hidden">
      <CardBody className="flex flex-row gap-0 p-0">
        <div className="relative w-1/4 min-w-0 shrink-0 self-stretch min-h-28 overflow-hidden rounded-l-xl bg-default-100">
          <MealImage
            image={recipe.image}
            alt={recipe.title}
            variant="fillParent"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-3">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <span className="min-w-0 flex-1 break-words font-medium">
              {recipe.title}
            </span>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={() => mealPlanStore.removeDishByEntryId(entry.id)}
              aria-label={t("delete")}
              className="shrink-0"
            >
              <TrashIcon className="size-5" />
            </Button>
          </div>
          <div className="flex flex-row items-center gap-2">

            <Select
              classNames={{
                base: "w-full min-w-0",
              }}
              size="sm"
              selectedKeys={[selectedKey]}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0] as string | undefined;
                const next =
                  key === undefined || key === MealType.Unknown ? "" : key;
                void mealPlanStore.updateDishLabelByEntryId(entry.id, next);
              }}
              placeholder={t("meal-plan-label-none")}
              aria-label={t("meal-plan-label-none")}
            >
              {mealTypeOptions.map((type) => (
                <SelectItem key={type} textValue={t(`meal-plan-meal-${type}`)}>
                  {t(`meal-plan-meal-${type}`)}
                </SelectItem>
              ))}
            </Select>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="primary"
              onPress={() => recipeViwer.setViewingRecipe(recipe)}
              aria-label={t("meal-plan-view-recipe")}
            >
              <Eye className="size-5" />
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
});
