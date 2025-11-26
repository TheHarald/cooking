import { Button, ButtonGroup } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { navigationStore } from "../services/navigation-store";
import { AppRoutes } from "../services/types";
import classNames from "classnames";
import { CalendarDays, Hamburger, ScrollText, Settings } from "lucide-react";

const appRoutes = [
  {
    title: "Блюда",
    key: AppRoutes.Cooking,
    icon: Hamburger,
  },
  {
    title: "Список покупок",
    key: AppRoutes.Constructor,
    icon: ScrollText,
  },
  {
    title: "Рацион",
    key: AppRoutes.Statistics,
    icon: CalendarDays,
  },
  {
    title: "Настройки",
    key: AppRoutes.Settings,
    icon: Settings,
  },
];

export const NavigationMenu = observer(() => {
  const { tab, navigationDisabled } = navigationStore;

  return (
    <div className="w-full bg-default safe-bottom">
      <ButtonGroup className="w-full">
        {appRoutes.map((route) => (
          <Button
            isDisabled={navigationDisabled}
            key={route.key}
            variant="light"
            fullWidth
            radius="none"
            onPress={() => navigationStore.setTab(route.key)}
          >
            {
              <route.icon
                className={classNames("size-6", {
                  "text-primary": tab === route.key,
                })}
              />
            }
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
});
