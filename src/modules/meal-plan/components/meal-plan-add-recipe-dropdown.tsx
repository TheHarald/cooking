import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { store } from "../../../services/store";
import { mealPlanStore } from "../services/meal-plan-store";

export const MealPlanAddRecipeDropdown = observer(() => {
  const { t } = useTranslation();
  const { recipes } = store.recipeViwer;
  const { currentDayOfWeek } = mealPlanStore;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          fullWidth
          color="primary"
          startContent={<Plus className="size-4" />}
          isDisabled={recipes.length === 0}
        >
          {t("meal-plan-add-recipe")}
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        {recipes.map((recipe) => (
          <DropdownItem
            key={recipe.id}
            onPress={() =>
              mealPlanStore.addDishToDay(currentDayOfWeek, recipe.id)
            }
          >
            {recipe.title}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
});
