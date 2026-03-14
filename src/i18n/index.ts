import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../locales/en.json";
import ruTranslation from "../locales/ru.json";

export enum Languages {
  En = "en",
  Ru = "ru",
}

const resources = {
  [Languages.En]: {
    translation: enTranslation,
  },
  [Languages.Ru]: {
    translation: ruTranslation,
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: Languages.Ru,
  fallbackLng: Languages.Ru,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
