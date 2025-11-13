import {
  ChartBarIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { Button, ButtonGroup } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { navigationStore } from "../services/navigation-store";
import { AppRoutes } from "../services/types";
import classNames from "classnames";

const appRoutes = [
  {
    title: "Тренировки",
    key: AppRoutes.Training,
    icon: TrophyIcon,
  },
  {
    title: "Конструктор",
    key: AppRoutes.Constructor,
    icon: PencilSquareIcon,
  },
  {
    title: "Статистика",
    key: AppRoutes.Statistics,
    icon: ChartBarIcon,
  },
  {
    title: "Настройки",
    key: AppRoutes.Settings,
    icon: Cog6ToothIcon,
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
