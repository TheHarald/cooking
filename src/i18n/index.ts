import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../locales/en.json";
import ruTranslation from "../locales/ru.json";

export enum Languages {
  EN = "en",
  RU = "ru",
}

const resources = {
  [Languages.EN]: {
    translation: enTranslation,
  },
  [Languages.RU]: {
    translation: ruTranslation,
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: Languages.RU,
  fallbackLng: Languages.RU,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
