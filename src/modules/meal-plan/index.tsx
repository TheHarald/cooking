import { ScrollShadow } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { MealPlanDay } from "./components/meal-plan-day";
import { useTranslation } from "react-i18next";

export const MealPlanModule = observer(() => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <h1 className="text-2xl font-bold shrink-0">{t("meal-plan-title")}</h1>
      <ScrollShadow className="flex-1 min-h-0 overflow-y-auto" hideScrollBar>
        <div className="pb-4">
          <MealPlanDay />
        </div>
      </ScrollShadow>
    </div>
  );
});
