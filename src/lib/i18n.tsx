import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "ar" | "en";
const Ctx = createContext<{ lang: Lang; toggle: () => void; t: (ar: string, en: string) => string }>({
  lang: "ar",
  toggle: () => {},
  t: (ar) => ar,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("evn-lang");
      if (saved === "en" || saved === "ar") setLang(saved);
    } catch { /* Use Arabic if storage is unavailable. */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    if (loaded) { try { localStorage.setItem("evn-lang", lang); } catch { /* Language remains available for this session. */ } }
  }, [lang, loaded]);
  return (
    <Ctx.Provider
      value={{ lang, toggle: () => setLang((l) => (l === "ar" ? "en" : "ar")), t: (ar, en) => (lang === "ar" ? ar : en) }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);
