import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, ExternalLink, Maximize, Play, Search as SearchIcon, Shield, X } from "lucide-react";
import { ARCS, EPISODES, TOTAL_EPISODES, type ArcId } from "@/lib/anime-data";
import { useLang } from "@/lib/i18n";
import { normalizeEpisode, rankFor, useProgress } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { ART } from "@/lib/artwork";

type Search = { ep: number; arc?: ArcId | "all" };
export const Route = createFileRoute("/watch")({
 validateSearch: (s: Record<string,unknown>): Search => ({ep:normalizeEpisode(s.ep),arc: typeof s.arc==="string" && ["all","other",...ARCS.map(a=>a.id)].includes(s.arc) ? s.arc as ArcId|"all" : "all"}),
 head: ({match}) => ({meta:[
  {title:`بلاك كلوفر — الحلقة ${match.search.ep} | EVN ANIME`},
  {name:"description",content:"حلقات بلاك كلوفر الـ170 بعناوينها، مع تصفية الأركات والمفضلة وسجل المشاهدة."},
  {property:"og:title",content:"Watch Black Clover — EVN ANIME"},
  {property:"og:description",content:"Browse all 170 Black Clover episodes, track your progress and save your favorites."},
  {property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"},
 ]}),component:Watch,
});
function EpisodePlayer({ep}:{ep:number}) {
 const {t}=useLang();
 const shell=useRef<HTMLDivElement>(null);
 const [loaded,setLoaded]=useState(false);
 const [fullscreenError,setFullscreenError]=useState(false);
 const episode=EPISODES.find(e=>e.number===ep);
 useEffect(()=>{setLoaded(false);setFullscreenError(false);},[ep]);
 const fullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await shell.current?.requestFullscreen();}catch{setFullscreenError(true);}};
 return <>
  <div ref={shell} className="player-shell">
   {loaded && episode?.url ? <iframe key={ep} src={episode.url} title={`${t("مشغل الحلقة", "Episode player")} ${ep}`} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"/> : <div className="player-cover"><img src={ART.hero} alt=""/><span className="font-display text-2xl">BLACK CLOVER</span><Button className="h-12 px-6" onClick={()=>setLoaded(true)} disabled={!episode?.url}><Play className="fill-current"/>{t("تشغيل الحلقة", "Play episode")} {ep}</Button></div>}
  </div>
  <div className="flex items-center justify-between gap-3 border-x border-b bg-card px-4 py-3"><span className="text-[10px] text-muted-foreground">{t("المصدر: AnimeSlayer", "SOURCE: AnimeSlayer")}</span><div className="flex items-center gap-2"><Button asChild variant="ghost" size="sm"><a href={episode?.url} target="_blank" rel="noopener noreferrer"><ExternalLink/>{t("فتح المصدر", "Open source")}</a></Button><Button variant="ghost" size="icon" onClick={fullscreen} aria-label={t("ملء الشاشة", "Fullscreen")} title={t("ملء الشاشة", "Fullscreen")}><Maximize/></Button></div></div>
  <p className="mt-3 text-[11px] leading-6 text-muted-foreground">{t("التشغيل والصوت والتقديم من أزرار المصدر داخل الفيديو؛ إذا لم يفتح هنا، جرّب «فتح المصدر».", "Playback, volume and seeking use the source's controls. If the embed doesn't load, try Open source.")}</p>
  {fullscreenError && <p role="alert" className="text-xs text-primary">{t("المتصفح لم يسمح بملء الشاشة.", "Fullscreen is unavailable in this browser.")}</p>}
 </>;
}
function Watch() {
 const {ep,arc="all"}=Route.useSearch();
 const navigate=useNavigate({from:"/watch"});
 const {t}=useLang();
 const {progress,toggleWatched,toggleFavorite,visit}=useProgress();
 const [q,setQ]=useState("");
 const [tab,setTab]=useState<"all"|"favorites"|"unwatched">("all");
 const [cinema,setCinema]=useState(false);
 useEffect(()=>{visit(ep);},[ep,visit]);
 const episode=EPISODES.find(e=>e.number===ep);
 const watched=progress.watched.includes(ep);
 const favorite=progress.favorites.includes(ep);
 const rank=rankFor(progress.watched.length);
 const list=useMemo(()=>{
  const query=q.trim().replace(/[٠-٩]/g,(n)=>String("٠١٢٣٤٥٦٧٨٩".indexOf(n))).toLowerCase();
  return EPISODES.filter(e=>(arc==="all"||e.arc===arc)&&(!query||`${e.number} ${e.title}`.toLowerCase().includes(query))&&(tab!=="favorites"||progress.favorites.includes(e.number))&&(tab!=="unwatched"||!progress.watched.includes(e.number)));
 },[arc,q,tab,progress]);
 const go=(n:number)=>void navigate({search:(p:Search)=>({...p,ep:normalizeEpisode(n)})});
 return <main className="mx-auto max-w-[1400px] px-5 pb-14 pt-28 md:px-10">
  <div className="mb-7 flex items-center justify-between"><Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground"><ArrowRight className="size-4"/>{t("عالم بلاك كلوفر", "Black Clover universe")}</Link><span className="font-display text-xs text-primary">THE GRIMOIRE / {String(ep).padStart(3,"0")}</span></div>
  <div className={`grid items-start gap-8 ${cinema?"":"xl:grid-cols-[minmax(0,1fr)_390px]"}`}>
   <section className="min-w-0">
    <EpisodePlayer ep={ep}/>
    <div className="mt-5 flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] text-primary">{t("بلاك كلوفر • الحلقة", "BLACK CLOVER • EPISODE")} {ep}</p><h1 className="mt-2 text-xl font-extrabold md:text-2xl" dir="auto">{episode?.title}</h1></div><div className="flex gap-2"><Button variant="outline" size="icon" onClick={()=>toggleFavorite(ep)} aria-label={t(favorite?"إزالة من المفضلة":"أضف للمفضلة",favorite?"Remove favorite":"Add favorite")} title={t("المفضلة", "Favorite")}><Bookmark className={favorite?"fill-primary text-primary":""}/></Button><Button variant={watched?"secondary":"outline"} onClick={()=>toggleWatched(ep)} aria-pressed={watched}><Check/>{t(watched?"تمت المشاهدة":"شاهدتها",watched?"Watched":"Mark watched")}</Button></div></div>
    <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-y py-4"><div className="flex gap-2"><Button variant="outline" disabled={ep===1} onClick={()=>go(ep-1)}><ArrowRight/>{t("السابقة", "Previous")}</Button><Button disabled={ep===TOTAL_EPISODES} onClick={()=>go(ep+1)}>{t("التالية", "Next")}<ArrowLeft/></Button></div><Button variant="ghost" size="sm" onClick={()=>setCinema(v=>!v)} aria-pressed={cinema}><Maximize/>{t(cinema?"عرض عادي":"وضع السينما",cinema?"Standard view":"Cinema mode")}</Button></div>
    <div className="mt-7 flex items-center gap-4"><Shield className="size-8 text-primary"/><div><p className="text-sm font-bold">{t(rank.ar,rank.en)}</p><p className="mt-1 text-[11px] text-muted-foreground">{progress.watched.length} / 170 {t("حلقة مكتملة • محفوظة على هذا الجهاز", "completed • saved on this device")}</p></div></div>
   </section>
   <aside className="min-w-0">
    <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">{t("سجل الحلقات", "Episode archive")}</h2><span className="font-display text-xs text-muted-foreground">{list.length} / 170</span></div>
    <div className="flex items-center gap-2 border bg-input px-3"><SearchIcon className="size-4 shrink-0 text-muted-foreground"/><input value={q} onChange={e=>setQ(e.target.value)} aria-label={t("ابحث برقم أو اسم الحلقة", "Search episode number or title")} placeholder={t("رقم الحلقة أو اسمها…", "Episode number or title…")} className="min-w-0 flex-1 bg-transparent py-3 text-xs outline-none"/>{q&&<Button variant="ghost" size="icon" onClick={()=>setQ("")} aria-label={t("مسح البحث", "Clear search")}><X/></Button>}</div>
    <select className="mt-3 w-full rounded border bg-card p-3 text-xs" value={arc} aria-label={t("اختر الآرك", "Choose story arc")} onChange={e=>void navigate({search:(p:Search)=>({...p,arc:e.target.value as ArcId|"all"})})}><option value="all">{t("كل فصول القصة", "All story arcs")}</option>{ARCS.map(a=><option key={a.id} value={a.id}>{t(a.ar,a.en)} ({a.from}–{a.to})</option>)}<option value="other">{t("بقية الأركات", "Other arcs")}</option></select>
    <div className="my-4 flex border-b" role="tablist" aria-label={t("قوائم الحلقات", "Episode lists")}>{(["all","favorites","unwatched"] as const).map(v=><Button key={v} role="tab" aria-selected={tab===v} variant="ghost" size="sm" className={`flex-1 rounded-none border-b-2 text-xs ${tab===v?"border-primary text-foreground":"border-transparent text-muted-foreground"}`} onClick={()=>setTab(v)}>{v==="all"?t("الكل", "All"):v==="favorites"?t("المفضلة", "Favorites"):t("لم أشاهدها", "Unwatched")}</Button>)}</div>
    <div className={`grid gap-2 overflow-y-auto pe-1 ${cinema?"max-h-[600px] sm:grid-cols-2 lg:grid-cols-4":"max-h-[640px] sm:grid-cols-2 xl:grid-cols-1"}`}>{list.map(e=><Link key={e.number} to="/watch" search={{ep:e.number,arc}} data-active={e.number===ep} aria-current={e.number===ep?"page":undefined} className="episode-tile"><span className="episode-number">{String(e.number).padStart(2,"0")}</span><div className="min-w-0 flex-1"><p className="text-[9px] text-muted-foreground">{t("الحلقة", "EPISODE")} {e.number}</p><p className="mt-1 text-xs font-semibold leading-5" dir="auto">{e.title}</p></div>{progress.watched.includes(e.number)&&<Check className="size-4 shrink-0 text-primary"/>}{progress.favorites.includes(e.number)&&<Bookmark className="size-3 shrink-0 fill-primary text-primary"/>}</Link>)}{list.length===0&&<p className="py-10 text-center text-xs text-muted-foreground">{t("لا توجد حلقات في هذه القائمة", "No episodes in this list")}</p>}</div>
   </aside>
  </div>
 </main>;
}
