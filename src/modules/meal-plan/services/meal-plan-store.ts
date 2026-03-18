import { makeAutoObservable, runInAction, toJS } from "mobx";
import type { IMealPlan, IMealPlanEntry } from "../../../types/types";
import { DayOfWeek } from "../../../types/types";
import { databaseStorage } from "../../../db/database-storage";
import dayjs from "../../../dayjs";

const dayOrder: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday,
];

/** Один повторяющийся рацион на неделю (не привязан к календарю) */
const weeklyPlanKey = "weekly";

function getWeekStart(date: dayjs.Dayjs): string {
  return date.startOf("isoWeek").format("YYYY-MM-DD");
}

function dateToDayOfWeek(date: dayjs.Dayjs): DayOfWeek {
  const iso = date.isoWeekday();
  return dayOrder[iso - 1];
}

export class MealPlanStore {
  plan: IMealPlan | undefined = undefined;
  /** Текущий экран: день недели (цикл пн → вс → пн) */
  selectedDay: DayOfWeek = dateToDayOfWeek(dayjs());

  constructor() {
    makeAutoObservable(this);
    this.loadPlan();
  }

  get dayOrder(): DayOfWeek[] {
    return dayOrder;
  }

  get currentDayOfWeek(): DayOfWeek {
    return this.selectedDay;
  }

  /** Блюда выбранного дня недели */
  get dishesForSelectedDay(): IMealPlanEntry[] {
    return this._getDayEntries(this.selectedDay);
  }

  getDishesForDay(day: DayOfWeek): IMealPlanEntry[] {
    return this._getDayEntries(day);
  }

  /** Все id рецептов за день — для списка покупок */
  getRecipeIdsForDay(day: DayOfWeek): string[] {
    return this.getDishesForDay(day).map((e) => e.recipeId);
  }

  goToPrevWeekday() {
    const idx = dayOrder.indexOf(this.selectedDay);
    this.selectedDay = idx === 0 ? DayOfWeek.Sunday : dayOrder[idx - 1];
  }

  goToNextWeekday() {
    const idx = dayOrder.indexOf(this.selectedDay);
    this.selectedDay =
      idx === dayOrder.length - 1 ? DayOfWeek.Monday : dayOrder[idx + 1];
  }

  async loadPlan() {
    try {
      let plan = await databaseStorage.getMealPlan(weeklyPlanKey);
      if (plan === undefined) {
        const legacy = await databaseStorage.getMealPlan(getWeekStart(dayjs()));
        if (
          legacy?.plan !== undefined &&
          Object.keys(legacy.plan).length > 0
        ) {
          plan = {
            weekStart: weeklyPlanKey,
            plan: { ...legacy.plan },
          };
          await databaseStorage.putMealPlan(toJS(plan));
        }
      }
      runInAction(() => {
        this.plan = plan ?? { weekStart: weeklyPlanKey, plan: {} };
      });
    } catch {
      runInAction(() => {
        this.plan = { weekStart: weeklyPlanKey, plan: {} };
      });
    }
  }

  private getOrCreatePlan(): IMealPlan {
    if (!this.plan || this.plan.weekStart !== weeklyPlanKey) {
      this.plan = { weekStart: weeklyPlanKey, plan: {} };
    }
    return this.plan;
  }

  private _getDayEntries(day: DayOfWeek): IMealPlanEntry[] {
    return this.plan?.plan?.[day] ?? [];
  }

  private _dayContainingEntry(entryId: string): DayOfWeek | undefined {
    const p = this.plan?.plan;
    if (p === undefined) return undefined;
    for (const d of dayOrder) {
      const entries = p[d];
      if (entries?.some((e) => e.id === entryId)) return d;
    }
    return undefined;
  }

  async addDishToDay(day: DayOfWeek, recipeId: string, label?: string) {
    if (!this.plan || this.plan.weekStart !== weeklyPlanKey) {
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

  async removeDishByEntryId(entryId: string) {
    const day = this._dayContainingEntry(entryId);
    if (day === undefined || !this.plan?.plan) return;
    const list = this._getDayEntries(day).filter((e) => e.id !== entryId);
    if (list.length === 0) {
      const { [day]: _, ...rest } = this.plan.plan;
      this.plan = { ...this.plan, plan: rest };
    } else {
      this.plan = { ...this.plan, plan: { ...this.plan.plan, [day]: list } };
    }
    await databaseStorage.putMealPlan(toJS(this.plan));
  }

  async updateDishLabelByEntryId(entryId: string, label: string) {
    const day = this._dayContainingEntry(entryId);
    if (day === undefined || !this.plan?.plan) return;
    const list = this._getDayEntries(day).map((e) =>
      e.id === entryId ? { ...e, label: label.trim() || undefined } : e
    );
    this.plan = { ...this.plan, plan: { ...this.plan.plan, [day]: list } };
    await databaseStorage.putMealPlan(toJS(this.plan));
  }
}

export const mealPlanStore = new MealPlanStore();
