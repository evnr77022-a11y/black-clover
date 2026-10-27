import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Progress = { watched: number[]; favorites: number[]; lastEpisode: number };
export const EMPTY_PROGRESS: Progress = { watched: [], favorites: [], lastEpisode: 1 };
export function normalizeEpisode(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(1, Math.min(170, Math.floor(n))) : 1;
}
export function rankFor(count: number) {
  if (count >= 170) return { ar: "إمبراطور السحر", en: "Wizard King", next: 170 };
  if (count >= 120) return { ar: "قائد فرسان السحر", en: "Magic Knight Captain", next: 170 };
  if (count >= 60) return { ar: "فارس سحر متقدم", en: "Senior Magic Knight", next: 120 };
  if (count >= 20) return { ar: "فارس سحر", en: "Magic Knight", next: 60 };
  return { ar: "مبتدئ السحر", en: "Magic Novice", next: 20 };
}
export function toggleEpisode(list: number[], ep: number) {
  const n = normalizeEpisode(ep);
  return list.includes(n) ? list.filter((v) => v !== n) : [...list, n].sort((a, b) => a - b);
}
export function readProgress(raw: string | null): Progress {
  try {
    const data = JSON.parse(raw ?? "null");
    if (!data || typeof data !== "object") return EMPTY_PROGRESS;
    const clean = (v: unknown) => Array.isArray(v) ? [...new Set(v.filter((n): n is number => Number.isInteger(n) && n >= 1 && n <= 170))] : [];
    return { watched: clean(data.watched), favorites: clean(data.favorites), lastEpisode: normalizeEpisode(data.lastEpisode) };
  } catch { return EMPTY_PROGRESS; }
}
const ProgressContext = createContext({
  progress: EMPTY_PROGRESS,
  toggleWatched: (_ep: number) => {},
  toggleFavorite: (_ep: number) => {},
  visit: (_ep: number) => {},
});
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try { setProgress(readProgress(localStorage.getItem("evn-progress"))); } catch { /* Storage may be unavailable. */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) { try { localStorage.setItem("evn-progress", JSON.stringify(progress)); } catch { /* Keep session state. */ } }
  }, [progress, loaded]);
  return <ProgressContext.Provider value={{ progress,
    toggleWatched: (ep) => setProgress((p) => ({ ...p, watched: toggleEpisode(p.watched, ep) })),
    toggleFavorite: (ep) => setProgress((p) => ({ ...p, favorites: toggleEpisode(p.favorites, ep) })),
    visit: (ep) => setProgress((p) => p.lastEpisode === ep ? p : ({ ...p, lastEpisode: normalizeEpisode(ep) })),
  }}>{children}</ProgressContext.Provider>;
}
export const useProgress = () => useContext(ProgressContext);