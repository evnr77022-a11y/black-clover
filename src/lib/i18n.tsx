import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "ar" | "en";
const Ctx = createContext<{ lang: Lang; toggle: () => void; t: (ar: string, en: string) => string }>({
  lang: "ar",
  toggle: () => {},
  t: (ar) => ar,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  useEffect(() => {
    const saved = localStorage.getItem("evn-lang");
    if (saved === "en" || saved === "ar") setLang(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("evn-lang", lang);
  }, [lang]);
  return (
    <Ctx.Provider
      value={{ lang, toggle: () => setLang((l) => (l === "ar" ? "en" : "ar")), t: (ar, en) => (lang === "ar" ? ar : en) }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);
