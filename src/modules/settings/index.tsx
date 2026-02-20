import { Button } from "@heroui/react";
import { BuildInfo } from "./components/build-info";
import { LanguageSelector } from "./components/language-selector";
import { ConfirmationWrapper } from "../../components/confirmation-wrapper";
import { dropDB } from "../../db/index-db";
import { useTranslation } from "react-i18next";

export const SettingsModule = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">{t("settings")}</h1>
      <BuildInfo />
      <LanguageSelector />
      <ConfirmationWrapper
        color="danger"
        onConfirm={() => dropDB()}
        title={t("clear-database")}
        message={t("clear-database-message")}
        confirmText={t("confirm-clear-database-text")}
        cancelText={t("cancel")}
      >
        <Button color="danger">{t("clear-database")}</Button>
      </ConfirmationWrapper>
    </div>
  );
};
