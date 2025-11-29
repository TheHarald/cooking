import { makeAutoObservable } from "mobx";
import { MealConstructorStore } from "../modules/meal-constructor/services/meal-constructor-store";

class AppStore {
  public mealConstructor: MealConstructorStore;
  constructor() {
    this.mealConstructor = new MealConstructorStore();
    makeAutoObservable(this);
  }
}

export const store = new AppStore();
