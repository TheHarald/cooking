import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { store } from "../../../services/store";
import { mealPlanStore } from "../services/meal-plan-store";
import { MealType } from "../../../types/types";
import type { DayOfWeek } from "../../../types/types";
import type { IMealPlanEntry } from "../../../types/types";
import type { IRecipe } from "../../../types/types";
import { ChevronLeft, ChevronRight, Eye, Plus, X } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useTranslation } from "react-i18next";

const mealTypeOptions: ("" | MealType)[] = [
  "",
  MealType.Breakfast,
  MealType.Lunch,
  MealType.Dinner,
  MealType.Snack,
];

type DishRowProps = {
  day: DayOfWeek;
  index: number;
  entry: IMealPlanEntry;
  recipe: IRecipe;
  onViewRecipe: (recipeId: string) => void;
  onRemove: (day: DayOfWeek, index: number) => void;
  onLabelChange: (day: DayOfWeek, index: number, value: string) => void;
};

const DishRow = observer(
  ({ day, index, entry, recipe, onViewRecipe, onRemove, onLabelChange }: DishRowProps) => {
    const { t } = useTranslation();
    const selectedKey = entry.label ?? "";

    return (
      <li className="flex flex-col gap-2 rounded-lg border border-default-200 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 sm:p-2">
        <div className="flex min-w-0 flex-1 flex-row items-center gap-2 sm:max-w-[140px] sm:flex-initial">
          <Select
            size="sm"
            selectedKeys={[selectedKey]}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0] as string | undefined;
              onLabelChange(day, index, key ?? "");
            }}
            placeholder={t("meal-plan-label-none")}
            className="min-w-0 flex-1"
            aria-label={t("meal-plan-label-none")}
          >
            {mealTypeOptions.map((type) => (
              <SelectItem
                key={type}
                textValue={type ? t(`meal-plan-meal-${type}`) : t("meal-plan-label-none")}
              >
                {type ? t(`meal-plan-meal-${type}`) : t("meal-plan-label-none")}
              </SelectItem>
            ))}
          </Select>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color="danger"
            onPress={() => onRemove(day, index)}
            aria-label={t("delete")}
            className="shrink-0"
          >
            <X className="size-4" />
          </Button>
        </div>
        <span className="min-w-0 flex-1 break-words font-medium sm:flex-auto sm:truncate">
          {recipe.title}
        </span>
        <Button
          size="sm"
          variant="flat"
          startContent={<Eye className="size-4 shrink-0" />}
          onPress={() => onViewRecipe(recipe.id)}
          className="w-full shrink-0 sm:w-auto"
        >
          {t("meal-plan-view-recipe")}
        </Button>
      </li>
    );
  }
);

export const MealPlanDay = observer(() => {
  const { recipeViwer } = store;
  const { recipes } = recipeViwer;
  const { t, i18n } = useTranslation();

  const day = mealPlanStore.currentDayOfWeek;
  const dayDate = dayjs(mealPlanStore.currentDate).locale(
    i18n.language === "ru" ? "ru" : "en"
  );
  const dishes = mealPlanStore.getDishesForDay(day);
  const availableRecipes = recipes;

  const handleViewRecipe = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) recipeViwer.setViewingRecipe(recipe);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <Button
          isIconOnly
          variant="light"
          onPress={() => mealPlanStore.goToPrevDay()}
          aria-label={t("meal-plan-prev-day")}
        >
          <ChevronLeft className="size-6" />
        </Button>
        <span className="text-lg font-medium capitalize">
          {dayDate.format("dddd, D MMMM YYYY")}
        </span>
        <Button
          isIconOnly
          variant="light"
          onPress={() => mealPlanStore.goToNextDay()}
          aria-label={t("meal-plan-next-day")}
        >
          <ChevronRight className="size-6" />
        </Button>
      </div>

      <Card>
        <CardBody className="flex flex-col gap-3 p-3">
          {dishes.length === 0 ? (
            <p className="text-default-500 text-sm">
              {t("meal-plan-add-recipe")} ниже.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {dishes.map((entry, index) => {
                const recipe = recipes.find((r) => r.id === entry.recipeId);
                if (!recipe) return undefined;
                return (
                  <DishRow
                    key={`${day}-${index}-${entry.recipeId}`}
                    day={day}
                    index={index}
                    entry={entry}
                    recipe={recipe}
                    onViewRecipe={handleViewRecipe}
                    onRemove={(d, i) => mealPlanStore.removeDishFromDay(d, i)}
                    onLabelChange={(d, i, v) =>
                      mealPlanStore.updateDishLabel(d, i, v)
                    }
                  />
                );
              })}
            </ul>
          )}

          <Dropdown>
            <DropdownTrigger>
              <Button
                size="sm"
                variant="bordered"
                startContent={<Plus className="size-4" />}
                isDisabled={availableRecipes.length === 0}
              >
                {t("meal-plan-add-recipe")}
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              {availableRecipes.map((recipe) => (
                <DropdownItem
                  key={recipe.id}
                  onPress={() => mealPlanStore.addDishToDay(day, recipe.id)}
                >
                  {recipe.title}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </CardBody>
      </Card>
    </div>
  );
});
