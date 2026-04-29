"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "@/locales/ar.json";
import de from "@/locales/de.json";
import enUS from "@/locales/en-US.json";
import esES from "@/locales/es-ES.json";
import fr from "@/locales/fr.json";
import it from "@/locales/it.json";
import ptBR from "@/locales/pt-BR.json";
import ru from "@/locales/ru.json";
import sv from "@/locales/sv.json";

export const SUPPORTED_LANGUAGES = [
  "pt-BR",
  "en-US",
  "es-ES",
  "de",
  "fr",
  "it",
  "ar",
  "ru",
  "sv",
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const RTL_LANGUAGES: SupportedLanguage[] = ["ar"];

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      "pt-BR": { translation: ptBR },
      "en-US": { translation: enUS },
      "es-ES": { translation: esES },
      de: { translation: de },
      fr: { translation: fr },
      it: { translation: it },
      ar: { translation: ar },
      ru: { translation: ru },
      sv: { translation: sv },
    },
    lng: "pt-BR",
    fallbackLng: "pt-BR",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
