import { Button, Chip } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import dayjs from "../../../dayjs";
import { mealPlanStore } from "../services/meal-plan-store";

const mondayRef = dayjs("2024-01-01");

export const MealPlanWeekdayHeader = observer(() => {
  const { t, i18n } = useTranslation();
  const { currentDayOfWeek, dayOrder } = mealPlanStore;
  const locale = i18n.language === "ru" ? "ru" : "en";
  const dayIdx = dayOrder.indexOf(currentDayOfWeek);
  const weekdayTitle = mondayRef.add(dayIdx, "day").locale(locale).format("dddd");

  const todayDow = dayOrder[dayjs().isoWeekday() - 1];
  const todayIdx = dayOrder.indexOf(todayDow);
  const tomorrowDow = dayOrder[(todayIdx + 1) % 7];
  const yesterdayDow = dayOrder[(todayIdx + 6) % 7];
  const relativeDayLabel =
    currentDayOfWeek === todayDow
      ? t("meal-plan-today")
      : currentDayOfWeek === tomorrowDow
        ? t("meal-plan-tomorrow")
        : currentDayOfWeek === yesterdayDow
          ? t("meal-plan-yesterday")
          : undefined;

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <Button
        isIconOnly
        variant="light"
        onPress={() => mealPlanStore.goToPrevWeekday()}
        aria-label={t("meal-plan-prev-weekday")}
      >
        <ChevronLeft className="size-6" />
      </Button>
      <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
        {relativeDayLabel !== undefined ? (
          <Chip size="sm" color="primary" variant="flat">
            {relativeDayLabel}
          </Chip>
        ) : undefined}
        <span className="text-xl font-semibold capitalize">{weekdayTitle}</span>
      </div>
      <Button
        isIconOnly
        variant="light"
        onPress={() => mealPlanStore.goToNextWeekday()}
        aria-label={t("meal-plan-next-weekday")}
      >
        <ChevronRight className="size-6" />
      </Button>
    </div>
  );
});
