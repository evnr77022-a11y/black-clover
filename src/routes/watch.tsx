import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ARCS, EPISODES, SAMPLE_VIDEO, TOTAL_EPISODES, type ArcId } from "@/lib/anime-data";
import { useLang } from "@/lib/i18n";

type Search = { ep: number; arc?: ArcId | "all" | undefined };

export const Route = createFileRoute("/watch")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const ep = Math.min(TOTAL_EPISODES, Math.max(1, Number(s["ep"]) || 1));
    const arc = typeof s["arc"] === "string" ? (s["arc"] as ArcId) : undefined;
    return { ep, arc };
  },
  head: () => ({
    meta: [
      { title: "مشاهدة الحلقات — EVN ANIME" },
      { name: "description", content: "مشغل حلقات بلاك كلوفر مع قائمة الحلقات 1–170 وبحث وتصفية حسب الآرك." },
      { property: "og:title", content: "Watch Black Clover — EVN ANIME" },
      { property: "og:description", content: "Episode player with all 170 episodes, search and arc filter." },
    ],
  }),
  component: Watch,
});

const fmt = (s: number) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

function Player({ ep, onNext }: { ep: number; onNext: () => void }) {
  const { t } = useLang();
  const v = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(1);

  useEffect(() => { setPlaying(false); setTime(0); }, [ep]);

  const toggle = () => { const el = v.current; if (!el) return; el.paused ? el.play() : el.pause(); };

  return (
    <div ref={box} className="group relative overflow-hidden rounded-2xl border bg-background shadow-[var(--shadow-glow)]" dir="ltr">
      <video
        key={ep}
        ref={v}
        src={SAMPLE_VIDEO}
        className="aspect-video w-full cursor-pointer bg-background"
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onEnded={onNext}
      />
      {!playing && (
        <button onClick={toggle} className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl text-primary-foreground transition hover:scale-110">▶</button>
      )}
      <div className="glass absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
        <input type="range" min={0} max={dur || 0} step={0.1} value={time}
          onChange={(e) => { if (v.current) v.current.currentTime = +e.target.value; }}
          className="w-full accent-primary" aria-label="seek" />
        <div className="flex items-center gap-3 text-sm">
          <button onClick={toggle} aria-label="play">{playing ? "❚❚" : "▶"}</button>
          <button onClick={() => v.current && (v.current.currentTime -= 10)} aria-label="back 10">↺10</button>
          <button onClick={() => v.current && (v.current.currentTime += 10)} aria-label="forward 10">10↻</button>
          <span className="text-muted-foreground">{fmt(time)} / {fmt(dur)}</span>
          <input type="range" min={0} max={1} step={0.05} value={vol}
            onChange={(e) => { setVol(+e.target.value); if (v.current) v.current.volume = +e.target.value; }}
            className="w-20 accent-primary" aria-label="volume" />
          <button onClick={onNext} className="ms-auto text-primary">{t("التالية", "Next")} ⏭</button>
          <button onClick={() => (document.fullscreenElement ? document.exitFullscreen() : box.current?.requestFullscreen())} aria-label="fullscreen">⛶</button>
        </div>
      </div>
    </div>
  );
}

function Watch() {
  const { ep, arc = "all" } = Route.useSearch();
  const navigate = useNavigate({ from: "/watch" });
  const { t } = useLang();
  const [q, setQ] = useState("");
  const current = ARCS.find((a) => ep >= a.from && ep <= a.to);

  const list = useMemo(
    () => EPISODES.filter((e) => (arc === "all" || e.arc === arc) && (!q || String(e.number).includes(q.trim()))),
    [arc, q],
  );

  const go = (n: number) => navigate({ search: (p: Search) => ({ ...p, ep: Math.min(TOTAL_EPISODES, n) }) });

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 pt-24 lg:grid-cols-[1fr_360px]">
      <section className="animate-in fade-in duration-500">
        <Player ep={ep} onNext={() => go(ep + 1)} />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">{t("الحلقة", "Episode")} {ep}</h1>
            <p className="text-sm text-muted-foreground">{current ? t(current.ar, current.en) : t("بلاك كلوفر", "Black Clover")}</p>
          </div>
          <div className="flex gap-2">
            <button disabled={ep <= 1} onClick={() => go(ep - 1)} className="chip disabled:opacity-40">{t("السابقة", "Prev")}</button>
            <button disabled={ep >= TOTAL_EPISODES} onClick={() => go(ep + 1)} className="chip" data-active="true">{t("التالية", "Next")}</button>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{t("ملاحظة: الفيديو الحالي تجريبي — اربط مصادر الحلقات المرخّصة.", "Note: sample video — connect licensed episode sources.")}</p>
      </section>

      <aside className="glass-card flex max-h-[80vh] flex-col p-4 hover:translate-y-0">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("ابحث برقم الحلقة…", "Search episode number…")}
          className="w-full rounded-lg border bg-input px-3 py-2 text-sm outline-none focus:border-primary" />
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          <button className="chip" data-active={arc === "all"} onClick={() => navigate({ search: (p: Search) => ({ ...p, arc: "all" }) })}>{t("الكل", "All")}</button>
          {ARCS.map((a) => (
            <button key={a.id} className="chip" data-active={arc === a.id} onClick={() => navigate({ search: { ep: a.from, arc: a.id } })}>{t(a.ar, a.en)}</button>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-5 gap-2 overflow-y-auto pe-1">
          {list.map((e) => (
            <Link key={e.number} to="/watch" search={{ ep: e.number, arc }} data-active={e.number === ep}
              className="chip flex aspect-square items-center justify-center px-0 text-sm font-bold">
              {e.number}
            </Link>
          ))}
          {list.length === 0 && <p className="col-span-5 py-6 text-center text-sm text-muted-foreground">{t("لا نتائج", "No results")}</p>}
        </div>
      </aside>
    </main>
  );
}
