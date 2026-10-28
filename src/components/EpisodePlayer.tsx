import { useEffect, useRef, useState } from "react";
import { Clock, ExternalLink, Maximize, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ART } from "@/lib/artwork";
import { episodesFor, type Season } from "@/lib/anime-data";
import { useLang } from "@/lib/i18n";
import { formatTime, timeKey, useProgress } from "@/lib/progress";
import { playbackTimeFromMessage } from "@/lib/player-events";

export function EpisodePlayer({ep,season}:{ep:number;season:Season}) {
 const {t}=useLang();
 const {progress,saveTime}=useProgress();
 const shell=useRef<HTMLDivElement>(null);
 const frame=useRef<HTMLIFrameElement>(null);
 const latest=useRef<number|null>(null);
 const initialTime=useRef(progress.timestamps[timeKey(season,ep)] ?? 0);
 const [loaded,setLoaded]=useState(false);
 const [fullscreenError,setFullscreenError]=useState(false);
 const [copyState,setCopyState]=useState(false);
 const episode=episodesFor(season).find(e=>e.number===ep);
 const currentTime=progress.timestamps[timeKey(season,ep)] ?? 0;
 useEffect(()=>{
  if(!loaded || !episode?.url) return;
  const expectedOrigin=new URL(episode.url).origin;
  let lastSaved=0;
  const persist=()=>{if(latest.current!==null && latest.current>0)saveTime(ep,season,latest.current);};
  const listener=(event:MessageEvent)=>{
   const seconds=playbackTimeFromMessage(event.data,event.origin,expectedOrigin,event.source===frame.current?.contentWindow);
   if(seconds===null || seconds===0)return;
   latest.current=seconds;
   if(Date.now()-lastSaved>=5000){lastSaved=Date.now();persist();}
  };
  const hide=()=>{if(document.visibilityState==="hidden")persist();};
  window.addEventListener("message",listener);window.addEventListener("pagehide",persist);document.addEventListener("visibilitychange",hide);
  return ()=>{persist();window.removeEventListener("message",listener);window.removeEventListener("pagehide",persist);document.removeEventListener("visibilitychange",hide);};
 },[loaded,episode?.url,ep,season,saveTime]);
 const fullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await shell.current?.requestFullscreen();}catch{setFullscreenError(true);}};
 const copyTime=async()=>{try{await navigator.clipboard.writeText(formatTime(initialTime.current));setCopyState(true);}catch{setCopyState(false);}};
 return <>
  <div ref={shell} className="player-shell">
   {loaded && episode?.url ? <iframe ref={frame} src={episode.url} title={`${t("مشغل الحلقة", "Episode player")} ${season}-${ep}`} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"/> : <div className="player-cover"><img src={ART.hero} alt=""/><span className="font-display text-2xl">BLACK CLOVER</span><Button className="h-12 px-6" onClick={()=>setLoaded(true)} disabled={!episode?.url}><Play className="fill-current"/>{t("تشغيل الحلقة", "Play episode")} {ep}</Button></div>}
  </div>
  <div className="flex flex-wrap items-center justify-between gap-2 border-x border-b bg-card px-3 py-2"><span className="text-[10px] text-muted-foreground">AnimeSlayer</span><div className="flex items-center gap-2"><span className="flex items-center gap-1 text-xs text-muted-foreground" aria-label={t("وقت المشاهدة المحفوظ", "Saved playback time")}><Clock className="size-3"/><span dir="ltr">{formatTime(currentTime)}</span></span><Button asChild variant="ghost" size="sm"><a href={episode?.url} target="_blank" rel="noopener noreferrer"><ExternalLink/>{t("فتح المصدر", "Open source")}</a></Button><Button variant="ghost" size="icon" onClick={fullscreen} aria-label={t("ملء الشاشة", "Fullscreen")} title={t("ملء الشاشة", "Fullscreen")}><Maximize/></Button></div></div>
  {initialTime.current>0 && <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-s-2 border-primary bg-card px-4 py-3"><p className="text-xs">{t("وقفت عند", "You stopped at")} <strong dir="ltr">{formatTime(initialTime.current)}</strong><span className="ms-2 text-muted-foreground">{t("الإرجاع لهذا الوقت من شريط الفيديو داخل المصدر.", "Seek to this time using the source's timeline.")}</span></p><Button variant="ghost" size="sm" onClick={copyTime}>{t(copyState?"تم النسخ":"نسخ الوقت",copyState?"Copied":"Copy time")}</Button></div>}
  <p className="mt-3 text-[11px] leading-6 text-muted-foreground">{t("المصدر الخارجي لا يدعم الإرجاع التلقائي، تخطي المقدمة والملخص، أو استخراج صورة ٤:٥٠ من الموقع.", "This external player does not support automatic time resume, intro/recap skipping or 4:50 thumbnail capture from this site.")}</p>
  {fullscreenError && <p role="alert" className="text-xs text-primary">{t("المتصفح لم يسمح بملء الشاشة.", "Fullscreen is unavailable in this browser.")}</p>}
 </>;
}