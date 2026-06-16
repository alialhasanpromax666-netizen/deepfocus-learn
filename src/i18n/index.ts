import { create } from "zustand";
import type { Lang } from "@/types";
import { STRINGS, type StringKey } from "./strings";

interface I18nState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

function applyDir(lang: Lang) {
  const dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lang);
}

export const useI18n = create<I18nState>((set, get) => ({
  lang: "ar",
  setLang: (lang) => {
    applyDir(lang);
    set({ lang });
  },
  toggle: () => get().setLang(get().lang === "ar" ? "en" : "ar"),
}));

/** Hook returning a bound translator for the current language. */
export function useT() {
  const lang = useI18n((s) => s.lang);
  return (key: StringKey) => STRINGS[key][lang];
}

export { STRINGS };
export type { StringKey };
