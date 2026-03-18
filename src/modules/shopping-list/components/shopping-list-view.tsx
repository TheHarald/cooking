import { Checkbox, Card, CardBody, Tab, Tabs } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { store } from "../../../services/store";
import dayjs from "../../../dayjs";
import { DayOfWeek } from "../../../types/types";

export const ShoppingListView = observer(() => {
  const { t, i18n } = useTranslation();
  const { items, dayOrder, selectedDay } = store.shoppingListStore;

  const locale = i18n.language === "ru" ? "ru" : "en";
  const mondayRef = dayjs("2024-01-01");
  const todayDow = dayOrder[dayjs().isoWeekday() - 1];

  const getDayTitle = (day: DayOfWeek) => {
    const idx = dayOrder.indexOf(day);
    // Короткие обозначения дней: ПН/ВТ/СР/...
    // В `dayjs` используем `dd` (2 буквы), затем приводим к верхнему регистру.
    return mondayRef.add(idx, "day").locale(locale).format("dd").toUpperCase();
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        className="self-center"
        selectedKey={selectedDay}
        onSelectionChange={(key) =>
          store.shoppingListStore.setSelectedDay(key as DayOfWeek)
        }
      >
        {dayOrder.map((day) => (
          <Tab
            key={day}
            title={
              day === todayDow ? (
                <span className="text-primary font-semibold">
                  {getDayTitle(day)}
                </span>
              ) : (
                getDayTitle(day)
              )
            }
          />
        ))}
      </Tabs>

      {items.length === 0 ? (
        <p className="text-default-500">{t("shopping-list-empty")}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <Card key={item.key}>
              <CardBody className="flex flex-row items-center gap-3 py-2">
                <Checkbox
                  isSelected={item.checked}
                  onValueChange={() =>
                    store.shoppingListStore.toggleChecked(item.key)
                  }
                  isDisabled
                  aria-label={item.name}
                />
                <span
                  className={item.checked ? "line-through text-default-400" : ""}
                >
                  {item.name}
                </span>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
});
