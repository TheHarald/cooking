import { observer } from "mobx-react-lite";
import { ShoppingListView } from "./components/shopping-list-view";
import { useTranslation } from "react-i18next";

export const ShoppingListModule = observer(() => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t("shopping-list-title")}</h1>
      <ShoppingListView />
    </div>
  );
});
