import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { seasonSize, type Season } from "@/lib/anime-data";

export type BrowserPreferences = { query: string; arc: string; tab: "all" | "favorites" | "unwatched"; cinema: boolean; hideSpoilers: boolean };
export const DEFAULT_PREFERENCES: BrowserPreferences = { query: "", arc: "all", tab: "all", cinema: false, hideSpoilers: false };
export type Progress = { watched: number[]; favorites: number[]; lastEpisode: number; lastSeason: Season; seasonTwo: { watched: number[]; favorites: number[] }; preferences: BrowserPreferences; hasVisited: boolean };
export const EMPTY_PROGRESS: Progress = { watched: [], favorites: [], lastEpisode: 1, lastSeason: 1, seasonTwo: { watched: [], favorites: [] }, preferences: DEFAULT_PREFERENCES, hasVisited: false };
export function normalizeEpisode(value: unknown, season: Season = 1) {
 const n = Number(value);
 return Number.isFinite(n) ? Math.max(1, Math.min(seasonSize(season), Math.floor(n))) : 1;
}
export function rankFor(count: number) {
 if (count >= 170) return { ar: "إمبراطور السحر", en: "Wizard King", next: 170 };
 if (count >= 120) return { ar: "قائد فرسان السحر", en: "Magic Knight Captain", next: 170 };
 if (count >= 60) return { ar: "فارس سحر متقدم", en: "Senior Magic Knight", next: 120 };
 if (count >= 20) return { ar: "فارس سحر", en: "Magic Knight", next: 60 };
 return { ar: "مبتدئ السحر", en: "Magic Novice", next: 20 };
}
export function toggleEpisode(list: number[], ep: number, season: Season = 1) {
 const n = normalizeEpisode(ep, season);
 return list.includes(n) ? list.filter(v => v !== n) : [...list, n].sort((a,b)=>a-b);
}
export function watchedThrough(list: number[], ep: number, season: Season = 1) {
 return [...new Set([...list, ...Array.from({length:normalizeEpisode(ep,season)},(_,i)=>i+1)])].sort((a,b)=>a-b);
}
export function readProgress(raw: string | null): Progress {
 try {
  const data = JSON.parse(raw ?? "null");
  if (!data || typeof data !== "object") return EMPTY_PROGRESS;
  const clean = (v: unknown, size: number) => Array.isArray(v) ? [...new Set(v.filter((n): n is number => Number.isInteger(n) && n >= 1 && n <= size))] : [];
  const season = data.lastSeason === 2 ? 2 : 1;
  const prefs = data.preferences ?? {};
  return { watched:clean(data.watched,170), favorites:clean(data.favorites,170), lastEpisode:normalizeEpisode(data.lastEpisode,season), lastSeason:season,
   seasonTwo:{ watched:clean(data.seasonTwo?.watched,4), favorites:clean(data.seasonTwo?.favorites,4) },
   hasVisited: data.hasVisited === true || Number(data.lastEpisode) > 1,
   preferences:{ query:typeof prefs.query === "string" ? prefs.query.slice(0,200) : "", arc: typeof prefs.arc === "string" ? prefs.arc : "all", tab:["all","favorites","unwatched"].includes(prefs.tab) ? prefs.tab : "all", cinema:prefs.cinema === true, hideSpoilers:prefs.hideSpoilers === true },
  };
 } catch { return EMPTY_PROGRESS; }
}
export const seasonProgress = (p: Progress, season: Season) => season === 2 ? p.seasonTwo : p;
const ProgressContext = createContext({ progress: EMPTY_PROGRESS, ready:false,
 toggleWatched: (_ep: number, _season: Season = 1) => {}, toggleFavorite: (_ep: number, _season: Season = 1) => {},
 visit: (_ep: number, _season: Season = 1) => {}, markThrough: (_ep: number, _season: Season = 1) => {},
 undoMark: () => {}, canUndo:false, setPreferences: (_prefs: Partial<BrowserPreferences>) => {},
});
export function ProgressProvider({children}:{children:ReactNode}) {
 const [progress,setProgress] = useState<Progress>(EMPTY_PROGRESS);
 const [ready,setReady] = useState(false);
 const [undo,setUndo] = useState<{season:Season;watched:number[]}|null>(null);
 useEffect(()=>{try{setProgress(readProgress(localStorage.getItem("evn-progress")));}catch{} setReady(true);},[]);
 useEffect(()=>{if(ready){try{localStorage.setItem("evn-progress",JSON.stringify(progress));}catch{}}},[progress,ready]);
 const visit = useCallback((ep:number,season:Season=1)=>{setProgress(p=>p.lastEpisode===ep && p.lastSeason===season && p.hasVisited ? p : {...p,lastEpisode:normalizeEpisode(ep,season),lastSeason:season,hasVisited:true});},[]);
 const toggleWatched = useCallback((ep:number,season:Season=1)=>{setUndo(null);setProgress(p=>season===1 ? {...p,watched:toggleEpisode(p.watched,ep)} : {...p,seasonTwo:{...p.seasonTwo,watched:toggleEpisode(p.seasonTwo.watched,ep,2)}});},[]);
 const toggleFavorite = useCallback((ep:number,season:Season=1)=>setProgress(p=>season===1 ? {...p,favorites:toggleEpisode(p.favorites,ep)} : {...p,seasonTwo:{...p.seasonTwo,favorites:toggleEpisode(p.seasonTwo.favorites,ep,2)}}),[]);
 const markThrough = useCallback((ep:number,season:Season=1)=>{setUndo({season,watched:[...seasonProgress(progress,season).watched]});setProgress(p=>season===1 ? {...p,watched:watchedThrough(p.watched,ep)} : {...p,seasonTwo:{...p.seasonTwo,watched:watchedThrough(p.seasonTwo.watched,ep,2)}});},[progress]);
 const undoMark = useCallback(()=>{if(!undo)return;setProgress(p=>undo.season===1?{...p,watched:undo.watched}:{...p,seasonTwo:{...p.seasonTwo,watched:undo.watched}});setUndo(null);},[undo]);
 const setPreferences = useCallback((prefs:Partial<BrowserPreferences>)=>setProgress(p=>({...p,preferences:{...p.preferences,...prefs}})),[]);
 const value=useMemo(()=>({progress,ready,visit,toggleWatched,toggleFavorite,markThrough,undoMark,canUndo:undo!==null,setPreferences}),[progress,ready,visit,toggleWatched,toggleFavorite,markThrough,undoMark,undo,setPreferences]);
 return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
export const useProgress=()=>useContext(ProgressContext);
