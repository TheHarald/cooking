import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { navigationStore } from "../services/navigation-store";
import { AppRoutes } from "../services/types";
import classNames from "classnames";
import { CalendarDays, Hamburger, ScrollText, Settings } from "lucide-react";

const appRoutes = [
  { labelKey: "nav-meals", key: AppRoutes.Cooking, icon: Hamburger },
  { labelKey: "nav-shopping", key: AppRoutes.Constructor, icon: ScrollText },
  { labelKey: "nav-plan", key: AppRoutes.Statistics, icon: CalendarDays },
  { labelKey: "nav-settings", key: AppRoutes.Settings, icon: Settings },
] as const;

export const NavigationMenu = observer(() => {
  const { tab, navigationDisabled } = navigationStore;
  const { t } = useTranslation();

  return (
    <nav
      className="w-full bg-default border-t border-default-200 safe-bottom"
      role="tablist"
      aria-label="Основная навигация"
    >
      <div className="flex w-full items-stretch">
        {appRoutes.map((route) => {
          const isActive = tab === route.key;
          const Icon = route.icon;
          return (
            <button
              key={route.key}
              type="button"
              disabled={navigationDisabled}
              role="tab"
              aria-selected={isActive}
              aria-label={t(route.labelKey)}
              className={classNames(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 min-h-0 touch-manipulation",
                "text-default-500 transition-colors active:bg-default-100",
                isActive && "text-primary font-medium"
              )}
              onClick={() => navigationStore.setTab(route.key)}
            >
              <Icon
                className={classNames("size-6 shrink-0", isActive && "text-primary")}
                aria-hidden
              />
              <span className="text-xs leading-tight max-w-full truncate px-1">
                {t(route.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});
