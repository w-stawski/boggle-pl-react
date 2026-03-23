import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend) // Loads files from /public/locales
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: "/locales/{{lng}}/common.json",
    },
  });

export default i18n;
