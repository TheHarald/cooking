import { Select, SelectItem } from "@heroui/react";
import { Languages } from "../../../i18n";
import { useTranslation } from "react-i18next";

const languages = [
  { value: Languages.RU, title: "Русский" },
  { value: Languages.EN, title: "English" },
];

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: Languages) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Select
      onChange={(e) => {
        const value = e.target.value as Languages;
        changeLanguage(value);
      }}
      selectedKeys={[i18n.language]}
      label="Язык"
    >
      {languages.map((language) => (
        <SelectItem key={language.value}>{language.title}</SelectItem>
      ))}
    </Select>
  );
};
