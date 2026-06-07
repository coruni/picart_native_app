import en from "@/locales/en/common.json";
import zh from "@/locales/zh/common.json";
import i18n from "i18next";
import { getLocales } from "expo-localization";
import { initReactI18next } from "react-i18next";

const systemLang = getLocales()[0]?.languageCode ?? "en";
const lng = systemLang.startsWith("zh") ? "zh" : "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    lng,
    fallbackLng: "en",
  });
