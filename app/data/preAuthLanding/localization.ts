import { Locale, LocalizedText } from "./types";

export function normalizeLocale(locale: string | string[] | null | undefined): Locale {
  const value = Array.isArray(locale) ? locale[0] : locale;
  return value === "tr" ? "tr" : "en";
}

export function getLocalizedText(copy: LocalizedText, locale: Locale) {
  return copy[locale];
}
