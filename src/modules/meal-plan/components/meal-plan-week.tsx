import { Button, Card, CardBody, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { store } from "../../../services/store";
import { mealPlanStore } from "../services/meal-plan-store";
import { DayOfWeek } from "../../../types/types";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const dayLabels: Record<DayOfWeek, string> = {
  [DayOfWeek.MONDAY]: "Пн",
  [DayOfWeek.TUESDAY]: "Вт",
  [DayOfWeek.WEDNESDAY]: "Ср",
  [DayOfWeek.THURSDAY]: "Чт",
  [DayOfWeek.FRIDAY]: "Пт",
  [DayOfWeek.SATURDAY]: "Сб",
  [DayOfWeek.SUNDAY]: "Вс",
};

export const MealPlanWeek = observer(() => {
  const { recipeViwer } = store;
  const { recipes } = recipeViwer;
  const { currentWeekStart, dayOrder, getRecipeIdsForDay, addRecipeToDay, removeRecipeFromDay, goToPrevWeek, goToNextWeek } = mealPlanStore;
  const { t } = useTranslation();

  const weekStart = dayjs(currentWeekStart);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <Button isIconOnly variant="light" onPress={goToPrevWeek} aria-label={t("meal-plan-prev-week")}>
          <ChevronLeft className="size-6" />
        </Button>
        <span className="text-lg font-medium">
          {weekStart.format("D MMM")} – {weekStart.add(6, "day").format("D MMM YYYY")}
        </span>
        <Button isIconOnly variant="light" onPress={goToNextWeek} aria-label={t("meal-plan-next-week")}>
          <ChevronRight className="size-6" />
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {dayOrder.map((day) => {
          const recipeIds = getRecipeIdsForDay(day);
          const dayDate = weekStart.add(dayOrder.indexOf(day), "day");
          return (
            <Card key={day}>
              <CardBody className="flex flex-row flex-wrap items-center gap-2">
                <span className="w-12 shrink-0 font-medium">
                  {dayLabels[day]} {dayDate.format("D.MM")}
                </span>
                <div className="flex flex-1 flex-wrap gap-2">
                  {recipeIds.map((id) => {
                    const recipe = recipes.find((r) => r.id === id);
                    if (!recipe) return null;
                    return (
                      <Chip
                        key={id}
                        onClose={() => removeRecipeFromDay(day, id)}
                        variant="flat"
                        color="primary"
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
                        isDisabled={recipes.filter((r) => !recipeIds.includes(r.id)).length === 0}
                      >
                        {t("meal-plan-add-recipe")}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      {recipes
                        .filter((r) => !recipeIds.includes(r.id))
                        .map((recipe) => (
                          <DropdownItem
                            key={recipe.id}
                            onPress={() => addRecipeToDay(day, recipe.id)}
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
