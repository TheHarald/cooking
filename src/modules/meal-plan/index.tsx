import { observer } from "mobx-react-lite";
import { MealPlanWeek } from "./components/meal-plan-week";
import { useTranslation } from "react-i18next";

export const MealPlanModule = observer(() => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t("meal-plan-title")}</h1>
      <MealPlanWeek />
    </div>
  );
});
