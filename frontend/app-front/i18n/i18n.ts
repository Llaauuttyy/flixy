import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { enTranslation } from "./en";
import { esTranslation } from "./es";

i18n.use(initReactI18next).init({
  fallbackLng: "es",
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

export const getLanguageLabel = (language: string): string => {
  const labels: Record<string, string> = {
    en: "English",
    es: "Español",
  };

  return labels[language] || "";
};

export const getLanguageIcon = (language: string) => {
  const icons: Record<string, string> = {
    en: "/usa-flag.png",
    es: "/spain-flag.png",
  };

  return icons[language] || "";
};
