import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { enTranslation } from "./en";
import { esTranslation } from "./es";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  resources: {
    en: {
      translation: enTranslation,
    },
    es: {
      translation: esTranslation,
    },
  },
});

export default i18n;
