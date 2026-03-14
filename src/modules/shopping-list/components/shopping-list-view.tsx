import { Checkbox, Card, CardBody } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { shoppingListStore } from "../services/shopping-list-store";
import { useTranslation } from "react-i18next";

export const ShoppingListView = observer(() => {
  const { items, toggleChecked } = shoppingListStore;
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <p className="text-default-500">
        {t("shopping-list-empty")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <Card key={item.key}>
          <CardBody className="flex flex-row items-center gap-3 py-2">
            <Checkbox
              isSelected={item.checked}
              onValueChange={() => toggleChecked(item.key)}
              aria-label={item.name}
            />
            <span className={item.checked ? "line-through text-default-400" : ""}>
              {item.name}
            </span>
            <span className="ml-auto font-medium">
              {item.amount} {item.unitLabel}
            </span>
          </CardBody>
        </Card>
      ))}
    </div>
  );
});
