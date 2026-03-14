import { makeAutoObservable, runInAction } from "mobx";
import type { IMealPlan } from "../../../types/types";
import { DayOfWeek, MealType } from "../../../types/types";
import { databaseStorage } from "../../../db/database-storage";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

const dayOrder: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday,
];

export const mealTypeOrder: MealType[] = [
  MealType.Breakfast,
  MealType.Lunch,
  MealType.Dinner,
  MealType.Snack,
];

function getWeekStart(date: dayjs.Dayjs): string {
  return date.startOf("isoWeek").format("YYYY-MM-DD");
}

function dateToDayOfWeek(date: dayjs.Dayjs): DayOfWeek {
  const iso = date.isoWeekday(); // 1 = Monday, 7 = Sunday
  return dayOrder[iso - 1];
}

export class MealPlanStore {
  plan: IMealPlan | undefined = undefined;
  /** Текущая выбранная дата (отображаемый день) */
  currentDate: string = dayjs().format("YYYY-MM-DD");

  constructor() {
    makeAutoObservable(this);
    this.loadPlan();
  }

  get dayOrder(): DayOfWeek[] {
    return dayOrder;
  }

  get currentWeekStart(): string {
    return getWeekStart(dayjs(this.currentDate));
  }

  get currentDayOfWeek(): DayOfWeek {
    return dateToDayOfWeek(dayjs(this.currentDate));
  }

  getRecipeIdsForDayAndMeal = (day: DayOfWeek, mealType: MealType): string[] => {
    if (!this.plan?.plan) return [];
    return this.plan.plan[day]?.[mealType] ?? [];
  };

  /** Все id рецептов за день (все приёмы пищи) — для списка покупок */
  getRecipeIdsForDay = (day: DayOfWeek): string[] => {
    if (!this.plan?.plan) return [];
    const byDay = this.plan.plan[day];
    if (!byDay) return [];
    const ids: string[] = [];
    for (const mealType of mealTypeOrder) {
      const list = byDay[mealType];
      if (Array.isArray(list)) ids.push(...list);
    }
    return ids;
  };

  setCurrentDate = (date: string) => {
    this.currentDate = date;
    const weekStart = getWeekStart(dayjs(date));
    if (weekStart !== this.plan?.weekStart) {
      this.loadPlan();
    }
  };

  goToPrevDay = () => {
    const d = dayjs(this.currentDate).subtract(1, "day");
    this.setCurrentDate(d.format("YYYY-MM-DD"));
  };

  goToNextDay = () => {
    const d = dayjs(this.currentDate).add(1, "day");
    this.setCurrentDate(d.format("YYYY-MM-DD"));
  };

  loadPlan = async () => {
    const weekStart = getWeekStart(dayjs(this.currentDate));
    try {
      const plan = await databaseStorage.getMealPlan(weekStart);
      runInAction(() => {
        this.plan = plan ?? { weekStart, plan: {} };
      });
    } catch {
      runInAction(() => {
        this.plan = { weekStart, plan: {} };
      });
    }
  };

  private getOrCreatePlan(): IMealPlan {
    const weekStart = getWeekStart(dayjs(this.currentDate));
    if (!this.plan || this.plan.weekStart !== weekStart) {
      this.plan = { weekStart, plan: {} };
    }
    return this.plan;
  }

  addRecipeToDay = async (day: DayOfWeek, recipeId: string, mealType: MealType) => {
    const weekStart = getWeekStart(dayjs(this.currentDate));
    if (!this.plan || this.plan.weekStart !== weekStart) {
      await this.loadPlan();
    }
    const plan = this.getOrCreatePlan();
    const byDay = plan.plan[day] ?? {};
    const list = byDay[mealType] ?? [];
    if (list.includes(recipeId)) return;
    plan.plan[day] = { ...byDay, [mealType]: [...list, recipeId] };
    this.plan = { ...plan };
    await databaseStorage.putMealPlan(this.plan);
  };

  removeRecipeFromDay = async (day: DayOfWeek, recipeId: string, mealType: MealType) => {
    if (!this.plan) return;
    const byDay = this.plan.plan[day];
    if (!byDay) return;
    const list = (byDay[mealType] ?? []).filter((id) => id !== recipeId);
    const newByDay = { ...byDay };
    if (list.length === 0) {
      delete newByDay[mealType];
    } else {
      newByDay[mealType] = list;
    }
    if (Object.keys(newByDay).length === 0) {
      const { [day]: _, ...rest } = this.plan.plan;
      this.plan = { ...this.plan, plan: rest };
    } else {
      this.plan = { ...this.plan, plan: { ...this.plan.plan, [day]: newByDay } };
    }
    await databaseStorage.putMealPlan(this.plan);
  };
}

export const mealPlanStore = new MealPlanStore();
