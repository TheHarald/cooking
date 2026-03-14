import { makeAutoObservable, runInAction, toJS } from "mobx";
import type { IMealPlan, IMealPlanEntry } from "../../../types/types";
import { DayOfWeek } from "../../../types/types";
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

function getWeekStart(date: dayjs.Dayjs): string {
  return date.startOf("isoWeek").format("YYYY-MM-DD");
}

function dateToDayOfWeek(date: dayjs.Dayjs): DayOfWeek {
  const iso = date.isoWeekday();
  return dayOrder[iso - 1];
}

export class MealPlanStore {
  plan: IMealPlan | undefined = undefined;
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

  getDishesForDay(day: DayOfWeek): IMealPlanEntry[] {
    return this._getDayEntries(day);
  }

  /** Все id рецептов за день — для списка покупок */
  getRecipeIdsForDay(day: DayOfWeek): string[] {
    return this.getDishesForDay(day).map((e) => e.recipeId);
  }

  setCurrentDate(date: string) {
    this.currentDate = date;
    const weekStart = getWeekStart(dayjs(date));
    if (weekStart !== this.plan?.weekStart) {
      this.loadPlan();
    }
  }

  goToPrevDay() {
    const d = dayjs(this.currentDate).subtract(1, "day");
    this.setCurrentDate(d.format("YYYY-MM-DD"));
  }

  goToNextDay() {
    const d = dayjs(this.currentDate).add(1, "day");
    this.setCurrentDate(d.format("YYYY-MM-DD"));
  }

  async loadPlan() {
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
  }

  private getOrCreatePlan(): IMealPlan {
    const weekStart = getWeekStart(dayjs(this.currentDate));
    if (!this.plan || this.plan.weekStart !== weekStart) {
      this.plan = { weekStart, plan: {} };
    }
    return this.plan;
  }

  private _getDayEntries(day: DayOfWeek): IMealPlanEntry[] {
    return this.plan?.plan?.[day] ?? [];
  }

  async addDishToDay(day: DayOfWeek, recipeId: string, label?: string) {
    const weekStart = getWeekStart(dayjs(this.currentDate));
    if (!this.plan || this.plan.weekStart !== weekStart) {
      await this.loadPlan();
    }
    const plan = this.getOrCreatePlan();
    const list = this._getDayEntries(day);
    plan.plan[day] = [
      ...list,
      { id: crypto.randomUUID(), recipeId, label: label?.trim() || undefined },
    ];
    this.plan = { ...plan };
    await databaseStorage.putMealPlan(toJS(this.plan));
  }

  async removeDishFromDay(day: DayOfWeek, entryId: string) {
    if (!this.plan?.plan) return;
    const list = this._getDayEntries(day).filter((e) => e.id !== entryId);
    if (list.length === 0) {
      const { [day]: _, ...rest } = this.plan.plan;
      this.plan = { ...this.plan, plan: rest };
    } else {
      this.plan = { ...this.plan, plan: { ...this.plan.plan, [day]: list } };
    }
    await databaseStorage.putMealPlan(toJS(this.plan));
  }

  async updateDishLabel(day: DayOfWeek, entryId: string, label: string) {
    if (!this.plan?.plan) return;
    const list = this._getDayEntries(day).map((e) =>
      e.id === entryId ? { ...e, label: label.trim() || undefined } : e
    );
    this.plan = { ...this.plan, plan: { ...this.plan.plan, [day]: list } };
    await databaseStorage.putMealPlan(toJS(this.plan));
  }

}

export const mealPlanStore = new MealPlanStore();
