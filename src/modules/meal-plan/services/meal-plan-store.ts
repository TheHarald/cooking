import { makeAutoObservable, runInAction } from "mobx";
import type { IMealPlan } from "../../../types/types";
import { DayOfWeek } from "../../../types/types";
import { databaseStorage } from "../../../db/database-storage";
import dayjs from "dayjs";

const DAY_ORDER: DayOfWeek[] = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
];

function getWeekStart(date: dayjs.Dayjs): string {
  return date.startOf("isoWeek").format("YYYY-MM-DD");
}

export class MealPlanStore {
  plan: IMealPlan | null = null;
  currentWeekStart: string = getWeekStart(dayjs());

  constructor() {
    makeAutoObservable(this);
    this.loadPlan();
  }

  get dayOrder(): DayOfWeek[] {
    return DAY_ORDER;
  }

  getRecipeIdsForDay = (day: DayOfWeek): string[] => {
    return this.plan?.plan?.[day] ?? [];
  };

  setCurrentWeekStart(weekStart: string) {
    this.currentWeekStart = weekStart;
    this.loadPlan();
  }

  goToPrevWeek() {
    const d = dayjs(this.currentWeekStart).subtract(1, "week");
    this.setCurrentWeekStart(d.format("YYYY-MM-DD"));
  }

  goToNextWeek() {
    const d = dayjs(this.currentWeekStart).add(1, "week");
    this.setCurrentWeekStart(d.format("YYYY-MM-DD"));
  }

  async loadPlan() {
    try {
      const plan = await databaseStorage.getMealPlan(this.currentWeekStart);
      runInAction(() => {
        this.plan = plan ?? {
          weekStart: this.currentWeekStart,
          plan: {},
        };
      });
    } catch {
      runInAction(() => {
        this.plan = {
          weekStart: this.currentWeekStart,
          plan: {},
        };
      });
    }
  }

  async addRecipeToDay(day: DayOfWeek, recipeId: string) {
    const plan = this.plan ?? {
      weekStart: this.currentWeekStart,
      plan: {},
    };
    const dayRecipes = plan.plan[day] ?? [];
    if (dayRecipes.includes(recipeId)) return;
    plan.plan[day] = [...dayRecipes, recipeId];
    this.plan = { ...plan };
    await databaseStorage.putMealPlan(this.plan);
  }

  async removeRecipeFromDay(day: DayOfWeek, recipeId: string) {
    if (!this.plan) return;
    const dayRecipes = (this.plan.plan[day] ?? []).filter((id) => id !== recipeId);
    if (dayRecipes.length === 0) {
      const { [day]: _, ...rest } = this.plan.plan;
      this.plan = { ...this.plan, plan: rest };
    } else {
      this.plan = { ...this.plan, plan: { ...this.plan.plan, [day]: dayRecipes } };
    }
    await databaseStorage.putMealPlan(this.plan);
  }
}

export const mealPlanStore = new MealPlanStore();
