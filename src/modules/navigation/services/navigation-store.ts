import { makeAutoObservable } from "mobx";
import { AppRoutes } from "./types";

class NavigationStore {
  tab: AppRoutes = AppRoutes.Training;
  navigationDisabled: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  public setTab(tab: AppRoutes) {
    this.tab = tab;
  }

  public setIsDisabledNavigation(state: boolean) {
    this.navigationDisabled = state;
  }
}

export const navigationStore = new NavigationStore();
