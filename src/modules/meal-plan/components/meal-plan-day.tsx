import {
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { store } from "../../../services/store";
import {
  mealPlanStore,
  mealTypeOrder,
} from "../services/meal-plan-store";
import { MealType } from "../../../types/types";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useTranslation } from "react-i18next";

export const MealPlanDay = observer(() => {
  const { recipeViwer } = store;
  const { recipes } = recipeViwer;
  const {
    currentDate,
    currentDayOfWeek,
    getRecipeIdsForDayAndMeal,
    addRecipeToDay,
    removeRecipeFromDay,
    goToPrevDay,
    goToNextDay,
  } = mealPlanStore;
  const { t, i18n } = useTranslation();

  const dayDate = dayjs(currentDate).locale(i18n.language === "ru" ? "ru" : "en");
  const day = currentDayOfWeek;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <Button
          isIconOnly
          variant="light"
          onPress={goToPrevDay}
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
          onPress={goToNextDay}
          aria-label={t("meal-plan-next-day")}
        >
          <ChevronRight className="size-6" />
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {mealTypeOrder.map((mealType) => {
          const recipeIds = getRecipeIdsForDayAndMeal(day, mealType);
          const availableRecipes = recipes.filter((r) => !recipeIds.includes(r.id));
          return (
            <Card key={mealType}>
              <CardBody className="flex flex-col gap-2 p-3">
                <div className="shrink-0 font-semibold text-default-700">
                  {t(`meal-plan-meal-${mealType}`)}
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {recipeIds.map((id) => {
                    const recipe = recipes.find((r) => r.id === id);
                    if (!recipe) return undefined;
                    return (
                      <Chip
                        key={`${day}-${mealType}-${id}`}
                        onClose={() =>
                          removeRecipeFromDay(day, id, mealType)
                        }
                        variant="flat"
                        color="primary"
                        size="sm"
                        classNames={{ base: "justify-start" }}
                      >
                        {recipe.title}
                      </Chip>
                    );
                  })}
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
                          onPress={() =>
                            addRecipeToDay(day, recipe.id, mealType)
                          }
                        >
                          {recipe.title}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
});
