import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, CheckCheck, EyeOff, ListFilter, Maximize, Play, Search as SearchIcon, Shield, Undo2, X } from "lucide-react";
import { ARCS, episodesFor, seasonSize, type Season, type ArcId } from "@/lib/anime-data";
import { useLang } from "@/lib/i18n";
import { formatTime, timeKey, normalizeEpisode, rankFor, seasonProgress, useProgress } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { EpisodePlayer } from "@/components/EpisodePlayer";

type Search = { ep?: number; season?: Season; arc?: ArcId | "all" };
export const Route = createFileRoute("/watch")({
 validateSearch: (s:Record<string,unknown>):Search => {
  const season=s["season"]===undefined ? undefined : Number(s["season"])===2 ? 2 : 1;
  return { season, ep:s["ep"]===undefined ? undefined : normalizeEpisode(s["ep"],season ?? 1), arc:typeof s["arc"]==="string" && ["all","other",...ARCS.map(a=>a.id)].includes(s["arc"]) ? s["arc"] as ArcId|"all" : undefined };
 },
 head:({match})=>({meta:[
  {title:`بلاك كلوفر — ${match.search.season===2?"الموسم الثاني":"المشاهدة"}${match.search.ep?` · الحلقة ${match.search.ep}`:""} | EVN ANIME`},
  {name:"description",content:"حلقات بلاك كلوفر والموسم الثاني، حفظ آخر مشاهدة والمفضلة وتحديد الحلقات المكتملة."},
  {property:"og:title",content:"Black Clover watch archive — EVN ANIME"},
  {property:"og:description",content:"Continue your Black Clover journey across seasons with saved progress and favorites."},
  {property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"},
 ]}),component:Watch,
});
function Watch() {
 const search=Route.useSearch();
 const navigate=useNavigate({from:"/watch"});
 const {t}=useLang();
 const {progress,ready,toggleWatched,toggleFavorite,visit,markThrough,undoMark,canUndo,setPreferences}=useProgress();
 const season=search.season ?? (search.ep===undefined ? progress.lastSeason : 1);
 const ep=normalizeEpisode(search.ep ?? (search.season===undefined || search.season===progress.lastSeason ? progress.lastEpisode : 1),season);
 const arc=season===2 ? "all" : search.arc ?? progress.preferences.arc;
 const q=progress.preferences.query;
 const tab=progress.preferences.tab;
 const cinema=progress.preferences.cinema;
 const hideSpoilers=progress.preferences.hideSpoilers;
 const [bulk,setBulk]=useState(false);
 const currentLink=useRef<HTMLAnchorElement>(null);
 const seasonData=seasonProgress(progress,season);
 const episodes=episodesFor(season);
 const total=seasonSize(season);
 useEffect(()=>{
  if(!ready)return;
  if(search.ep===undefined || search.season===undefined){void navigate({search:{...search,ep,season},replace:true});return;}
  visit(ep,season);
 },[ready,ep,season,search.ep,search.season,navigate,visit]);
 useEffect(()=>{if(ready)currentLink.current?.scrollIntoView({block:"nearest"});setBulk(false);},[ready,ep,season]);
 const episode=episodes.find(e=>e.number===ep);
 const watched=seasonData.watched.includes(ep);
 const favorite=seasonData.favorites.includes(ep);
 const rank=rankFor(progress.watched.length);
 const firstUnwatched=episodes.find(e=>!seasonData.watched.includes(e.number));
 const bulkCount=Array.from({length:ep},(_,i)=>i+1).filter(n=>!seasonData.watched.includes(n)).length;
 const list=useMemo(()=>{
  const query=q.trim().replace(/[٠-٩]/g,n=>String("٠١٢٣٤٥٦٧٨٩".indexOf(n))).toLowerCase();
  return episodes.filter(e=>(arc==="all"||e.arc===arc)&&(!query||String(e.number).includes(query)||(!hideSpoilers||seasonData.watched.includes(e.number))&&e.title.toLowerCase().includes(query))&&(tab!=="favorites"||seasonData.favorites.includes(e.number))&&(tab!=="unwatched"||!seasonData.watched.includes(e.number)));
 },[arc,q,tab,episodes,seasonData,hideSpoilers]);
 const go=(n:number)=>void navigate({search:{ep:normalizeEpisode(n,season),season,arc:arc as ArcId|"all"}});
 const changeSeason=(s:Season)=>{setPreferences({query:"",arc:"all",tab:"all"});void navigate({search:{ep:s===progress.lastSeason?normalizeEpisode(progress.lastEpisode,s):1,season:s,arc:"all"}});};
 if(!ready)return <main className="mx-auto max-w-[1400px] px-5 pt-32 text-muted-foreground" aria-busy="true">{t("استعادة رحلتك…", "Restoring your journey…")}</main>;
 return <main className="mx-auto max-w-[1400px] px-5 pb-14 pt-28 md:px-10">
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground"><ArrowRight className="size-4"/>{t("عالم بلاك كلوفر", "Black Clover universe")}</Link><div className="flex gap-1 border bg-card p-1" role="tablist" aria-label={t("المواسم", "Seasons")}>{([1,2] as const).map(s=><Button key={s} role="tab" aria-selected={season===s} variant={season===s?"default":"ghost"} size="sm" onClick={()=>changeSeason(s)}>{t("الموسم", "Season")} {s}<span className="ms-1 text-[10px] opacity-70">{seasonSize(s)}</span></Button>)}</div></div>
  <div className={`grid items-start gap-7 ${cinema?"":"lg:grid-cols-[minmax(0,1fr)_340px]"}`}>
   <section className="min-w-0">
    <EpisodePlayer key={`${season}:${ep}`} ep={ep} season={season}/>
    <div className="mt-5 flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] text-primary">{t("الموسم", "SEASON")} {season} · {t("الحلقة", "EPISODE")} {ep} / {total}</p><h1 className="mt-2 text-xl font-extrabold md:text-2xl" dir="auto">{hideSpoilers&&!watched?t(`الحلقة ${ep}`,`Episode ${ep}`):season===2?t(`الحلقة ${ep}`,`Episode ${ep}`):episode?.title}</h1></div><div className="flex gap-2"><Button variant="outline" size="icon" onClick={()=>toggleFavorite(ep,season)} aria-label={t(favorite?"إزالة من المفضلة":"أضف للمفضلة",favorite?"Remove favorite":"Add favorite")} title={t("المفضلة", "Favorite")}><Bookmark className={favorite?"fill-primary text-primary":""}/></Button><Button variant={watched?"secondary":"outline"} onClick={()=>toggleWatched(ep,season)} aria-pressed={watched}><Check/>{t(watched?"تمت المشاهدة":"شاهدتها",watched?"Watched":"Mark watched")}</Button></div></div>
    <div className="mt-4 flex flex-wrap items-center gap-2"><Button variant="outline" size="sm" onClick={()=>setBulk(v=>!v)} disabled={bulkCount===0}><CheckCheck/>{t("شاهدت الين هنا", "Watched up to here")}</Button>{canUndo&&<Button variant="ghost" size="sm" onClick={undoMark}><Undo2/>{t("تراجع عن التحديد", "Undo bulk mark")}</Button>}</div>
    {bulk&&<div className="mt-3 border border-primary/40 bg-card p-4" role="region" aria-label={t("تأكيد الحلقات المكتملة", "Confirm completed episodes")}><p className="text-sm">{t(`تحديد الحلقات ١ إلى ${ep} من الموسم ${season} كمشاهَدة؟`, `Mark episodes 1–${ep} in season ${season} as watched?`)}</p><p className="mt-2 text-xs text-muted-foreground">{t(`ستُضاف ${bulkCount} حلقات لسجلك.`,`${bulkCount} episodes will be added to your history.`)}</p><div className="mt-3 flex gap-2"><Button size="sm" onClick={()=>{markThrough(ep,season);setBulk(false);}}><CheckCheck/>{t("تأكيد شاهدت الين هنا", "Confirm watched up to here")}</Button><Button size="sm" variant="ghost" onClick={()=>setBulk(false)}>{t("إلغاء", "Cancel")}</Button></div></div>}
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y py-4"><div className="flex gap-2"><Button variant="outline" disabled={ep===1} onClick={()=>go(ep-1)}><ArrowRight/>{t("السابقة", "Previous")}</Button><Button disabled={ep===total} onClick={()=>go(ep+1)}>{t("التالية", "Next")}<ArrowLeft/></Button></div><Button variant="ghost" size="sm" onClick={()=>setPreferences({cinema:!cinema})} aria-pressed={cinema}><Maximize/>{t(cinema?"عرض عادي":"وضع السينما",cinema?"Standard view":"Cinema mode")}</Button></div>
    <div className="mt-6 flex items-center gap-4"><Shield className="size-8 text-primary"/><div className="min-w-0 flex-1"><p className="text-sm font-bold">{t(rank.ar,rank.en)}</p><p className="mt-1 text-[11px] text-muted-foreground">{seasonData.watched.length} / {total} {t("حلقة مكتملة في هذا الموسم", "episodes completed in this season")}</p><progress value={seasonData.watched.length} max={total} className="mt-3 h-1 w-full accent-primary"/></div></div>
   </section>
   <aside className="min-w-0 lg:sticky lg:top-24">
    <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">{t("سجل الحلقات", "Episode archive")}</h2><span className="font-display text-xs text-muted-foreground">{list.length} / {total}</span></div>
    {firstUnwatched&&<Button variant="secondary" className="mb-3 h-auto w-full justify-between py-3 text-xs" onClick={()=>{setPreferences({query:"",tab:"all",arc:"all"});void navigate({search:{ep:firstUnwatched.number,season,arc:"all"}});}}><span>{t("أول حلقة لم تشاهدها", "First unwatched episode")} · {firstUnwatched.number}</span><Play/></Button>}
    <div className="flex items-center gap-2 border bg-input px-3"><SearchIcon className="size-4 shrink-0 text-muted-foreground"/><input value={q} onChange={e=>setPreferences({query:e.target.value})} aria-label={t("ابحث برقم أو اسم الحلقة", "Search episode number or title")} placeholder={t("رقم الحلقة أو اسمها…", "Episode number or title…")} className="min-w-0 flex-1 bg-transparent py-3 text-xs outline-none"/>{q&&<Button variant="ghost" size="icon" onClick={()=>setPreferences({query:""})} aria-label={t("مسح البحث", "Clear search")}><X/></Button>}</div>
    {season===1&&<select className="mt-3 w-full rounded border bg-card p-3 text-xs" value={arc} aria-label={t("اختر الآرك", "Choose story arc")} onChange={e=>{setPreferences({arc:e.target.value});void navigate({search:{ep,season,arc:e.target.value as ArcId|"all"}});}}><option value="all">{t("كل فصول القصة", "All story arcs")}</option>{ARCS.map(a=><option key={a.id} value={a.id}>{t(a.ar,a.en)} ({a.from}–{a.to})</option>)}<option value="other">{t("بقية الأركات", "Other arcs")}</option></select>}
    <div className="mt-3 flex items-center justify-between gap-1"><Button variant="ghost" size="sm" className="text-xs" onClick={()=>setPreferences({hideSpoilers:!hideSpoilers})} aria-pressed={hideSpoilers}><EyeOff/>{t("إخفاء الحرق", "Hide spoilers")}</Button><Button variant="ghost" size="icon" aria-label={t("إعادة ضبط الفلاتر", "Reset filters")} title={t("إعادة ضبط الفلاتر", "Reset filters")} onClick={()=>{setPreferences({query:"",arc:"all",tab:"all"});void navigate({search:{ep,season,arc:"all"}});}}><ListFilter/></Button></div>
    <div className="my-3 flex border-b" role="tablist" aria-label={t("قوائم الحلقات", "Episode lists")}>{(["all","favorites","unwatched"] as const).map(v=><Button key={v} role="tab" aria-selected={tab===v} variant="ghost" size="sm" className={`flex-1 rounded-none border-b-2 text-xs ${tab===v?"border-primary text-foreground":"border-transparent text-muted-foreground"}`} onClick={()=>setPreferences({tab:v})}>{v==="all"?t("الكل", "All"):v==="favorites"?t("المفضلة", "Favorites"):t("لم أشاهدها", "Unwatched")}</Button>)}</div>
    <div className={`grid gap-2 overflow-y-auto pe-1 ${cinema?"max-h-[620px] sm:grid-cols-2 xl:grid-cols-4":"max-h-[560px] sm:grid-cols-2 lg:grid-cols-1"}`}>{list.map(e=><Link ref={e.number===ep?currentLink:undefined} key={e.number} to="/watch" search={{ep:e.number,season,arc:arc as ArcId|"all"}} data-active={e.number===ep} aria-current={e.number===ep?"page":undefined} className="episode-tile"><span className="episode-number">{String(e.number).padStart(2,"0")}</span><div className="min-w-0 flex-1"><p className="text-[9px] text-muted-foreground">{t("الحلقة", "EPISODE")} {e.number}</p><p className="mt-1 text-xs font-semibold leading-5" dir="auto">{season===2||hideSpoilers&&!seasonData.watched.includes(e.number)?t(`الحلقة ${e.number}`,`Episode ${e.number}`):e.title}</p>{(progress.timestamps[timeKey(season,e.number)] ?? 0)>0&&<p className="mt-1 text-[10px] text-primary" dir="ltr">{formatTime(progress.timestamps[timeKey(season,e.number)] ?? 0)}</p>}</div>{seasonData.watched.includes(e.number)&&<Check className="size-4 shrink-0 text-primary"/>}{seasonData.favorites.includes(e.number)&&<Bookmark className="size-3 shrink-0 fill-primary text-primary"/>}</Link>)}{list.length===0&&<p className="py-10 text-center text-xs text-muted-foreground">{t("لا توجد حلقات في هذه القائمة", "No episodes in this list")}</p>}</div>
   </aside>
  </div>
 </main>;
}
