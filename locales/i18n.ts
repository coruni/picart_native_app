import en from "@/locales/en/common.json";
import zh from "@/locales/zh/common.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
i18n
  .use(initReactI18next) // 绑定 react
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    lng: "zh",
    fallbackLng: "en",
  });
