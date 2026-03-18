import { observer } from "mobx-react-lite";
import { mealPlanStore } from "../services/meal-plan-store";
import { MealPlanAddRecipeDropdown } from "./meal-plan-add-recipe-dropdown";
import { MealPlanDishCard } from "./meal-plan-dish-card";
import { useTranslation } from "react-i18next";

export const MealPlanDay = observer(() => {
  const { t } = useTranslation();
  const { dishesForSelectedDay } = mealPlanStore;

  return (
    <div className="flex flex-col gap-4">

      <div className="flex flex-col gap-3">
        {(() => {
          if (dishesForSelectedDay.length === 0) {
            return (
              <p className="text-default-500 text-center text-sm">
                {t("meal-plan-empty-day")}
              </p>
            );
          }
          return dishesForSelectedDay.map((entry) => (
            <MealPlanDishCard key={entry.id} entry={entry} />
          ));
        })()}

        <MealPlanAddRecipeDropdown />
      </div>
    </div>
  );
});
