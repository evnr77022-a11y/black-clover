import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Play, Shield, Sword, Quote, Check, Bookmark } from "lucide-react";
import { ARCS, BATTLES, CHARACTERS } from "@/lib/anime-data";
import { useLang } from "@/lib/i18n";
import { ART, PORTRAITS } from "@/lib/artwork";
import { formatTime, timeKey, rankFor, useProgress } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Grimoire } from "@/components/Grimoire";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "EVN ANIME — عالم بلاك كلوفر" },
    { name: "description", content: "عالم بلاك كلوفر: 170 حلقة، أركات القصة، شخصيات الثيران السوداء وغريموار رحلتك." },
    { property: "og:title", content: "EVN ANIME — Black Clover universe" },
    { property: "og:description", content: "Explore Black Clover episodes, characters, story arcs and your Magic Knight journey." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Index,
});

const QUOTES = [
  { ar: "عدم الاستسلام هو سحري!", en: "My magic is never giving up!", who: "أستا", whoEn: "Asta" },
  { ar: "تجاوز حدودك. هنا، الآن.", en: "Surpass your limits. Right here. Right now.", who: "يامي سوكيهيرو", whoEn: "Yami Sukehiro" },
] as const;
function Heading({ ar, en, number }: { ar: string; en: string; number: string }) {
  const { t } = useLang();
  return <h2><span className="section-index">{number} /</span>{t(ar, en)}</h2>;
}
function KingdomMap() {
  const { t } = useLang();
  const kingdoms = [
    { name: t("البستوني", "Spade"), ep:158, path:"M160 20 255 15 292 63 260 113 178 100 130 60", x:213,y:66 },
    { name: t("الماس", "Diamond"), ep:14, path:"M292 65 350 85 380 145 320 188 265 128", x:325,y:134 },
    { name: t("القلب", "Heart"), ep:158, path:"M80 105 145 85 175 130 155 205 75 224 35 172", x:106,y:158 },
    { name: t("كلوفر", "Clover"), ep:1, path:"M180 106 260 116 312 194 250 255 165 230 161 180", x:230,y:182 },
  ];
  return <div className="kingdom-map"><svg viewBox="0 0 420 280" aria-label={t("خريطة الممالك — خريطة فنية", "Kingdoms — stylized map")}>{kingdoms.map((k) => <a key={k.ep+k.name} href={`/watch?ep=${k.ep}`} aria-label={k.name}><path className="map-region" d={k.path}/><text x={k.x} y={k.y} textAnchor="middle" className="fill-foreground text-[13px]">{k.name}</text></a>)}<path className="map-lines" d="M230 180 105 158M230 180 212 65M230 180 325 134"/></svg><span className="absolute bottom-3 start-4 font-display text-[10px] text-muted-foreground">THE FOUR KINGDOMS</span></div>;
}
function Index() {
  const { t } = useLang();
  const { progress } = useProgress();
  const navigate = useNavigate();
  const [opening, setOpening] = useState(false);
  const [quote, setQuote] = useState(0);
  const rank = rankFor(progress.watched.length);
  useEffect(() => { setQuote(Math.floor(Date.now() / 86400000) % QUOTES.length); }, []);
  const enter = useCallback(() => { void navigate({ to:"/watch", search:{ ep:progress.lastEpisode, season:progress.lastSeason } }); }, [navigate,progress.lastEpisode,progress.lastSeason]);
  const q = QUOTES[quote] ?? QUOTES[0];
  return <main>
    <section className="home-hero">
      <img src={ART.hero} alt="أستا وشخصيات بلاك كلوفر — رسم الأنمي الرسمي" className="hero-art" fetchPriority="high"/>
      <div className="hero-shade"/>
      <div className="hero-content"><div className="hero-copy">
        <p className="hero-kicker">{t("غريموار من خمس أوراق. حلم بلا حدود.", "FIVE LEAVES. ONE LIMITLESS DREAM.")}</p>
        <h1 className="hero-title mt-6 font-display" dir="ltr"><span>BLACK</span><span>CLOVER<span className="inline! text-primary">.</span></span></h1>
        <div className="hero-meta"><strong className="flex items-center gap-1 text-gold"><span>★</span>8.1</strong><span>2017</span><span>170 {t("حلقة", "episodes")}</span><span>{t("أكشن • فانتازيا • شونين", "Action • Fantasy • Shōnen")}</span></div>
        <p className="max-w-[390px] text-sm leading-8 text-muted-foreground">{t("في عالم يحكمه السحر، يولد أستا بلا أي قوة سحرية. لكن حلمه أكبر من كل التعاويذ: أن يصبح إمبراطور السحر.", "In a world ruled by magic, Asta is born without it. But his dream is greater than any spell: to become the Wizard King.")}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button className="h-12 px-7 font-bold" disabled={opening} onClick={() => setOpening(true)}><Play className="fill-current"/>{opening ? t("يُفتح الغريموار…", "Opening grimoire…") : t(progress.lastEpisode > 1 ? "أكمل المشاهدة" : "ابدأ المشاهدة", progress.lastEpisode > 1 ? "Continue watching" : "Start watching")}</Button>
          <Button asChild variant="outline" className="h-12 bg-background/30 px-5"><a href="#arcs">{t("استكشف القصة", "Explore the story")}<ArrowLeft/></a></Button>
        </div>
        <div className="mt-9 flex items-center gap-3 text-[10px] text-muted-foreground"><span className="h-px w-7 bg-primary"/><span dir="ltr">EVN ANIME / THE BLACK CLOVER COLLECTION</span></div>
      </div></div>
      <span className="hero-caption" dir="ltr">STUDIO PIERROT · BLACK CLOVER</span>
      <div className="absolute bottom-16 start-[42%] z-10 hidden lg:block"><Grimoire activated={opening} onOpen={enter}/></div>
      <div className="absolute -bottom-48 pointer-events-none lg:hidden"><Grimoire activated={opening} onOpen={enter}/></div>
    </section>

    {progress.hasVisited && <section className="content-section flex flex-wrap items-center justify-between gap-4 border-b py-6!"><div><p className="text-xs text-primary">{t("آخر محطة في رحلتك", "Your last stop")}</p><p className="mt-2 text-sm font-bold">{t("الموسم", "Season")} {progress.lastSeason} · {t("الحلقة", "Episode")} {progress.lastEpisode}{(progress.timestamps[timeKey(progress.lastSeason,progress.lastEpisode)] ?? 0)>0 && <span className="ms-3 text-muted-foreground" dir="ltr">{formatTime(progress.timestamps[timeKey(progress.lastSeason,progress.lastEpisode)] ?? 0)}</span>}</p></div><Button asChild><Link to="/watch" search={{ep:progress.lastEpisode,season:progress.lastSeason}}><Play/>{t("أكمل رحلتك", "Continue your journey")}</Link></Button></section>}
    <section className="content-section flex flex-wrap items-center justify-between gap-4 border-b py-6!"><div><p className="font-display text-xs text-primary">NEW CHAPTER</p><h2 className="mt-2 text-xl font-bold">{t("الموسم الثاني", "Season two")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("٤ حلقات مضافة من روابطك", "4 episodes from your supplied links")}</p></div><Button asChild variant="outline"><Link to="/watch" search={{ep:1,season:2}}>{t("حلقات الموسم الثاني", "Season two episodes")}<ArrowUpRight/></Link></Button></section>
    <section id="arcs" className="content-section">
      <div className="section-heading"><Heading ar="فصول الحكاية" en="Story arcs" number="01"/><Button asChild variant="link" className="text-xs text-muted-foreground"><Link to="/watch" search={{ep:1}}>{t("كل الحلقات", "All episodes")}<ArrowUpRight/></Link></Button></div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{ARCS.map((arc,i) => <Link key={arc.id} className="arc-card" to="/watch" search={{ep:arc.from,arc:arc.id}}><img src={PORTRAITS[["asta","noelle","yuno","yami"][i] ?? "asta"] ?? ART.hero} alt={t(arc.ar,arc.en)} loading="lazy"/><span className="arc-number">CHAPTER 0{i+1}</span><div className="arc-text"><p className="mb-2 text-[10px] text-primary">{t("الحلقات", "EPISODES")} {arc.from} — {arc.to}</p><h3 className="text-base font-bold">{t(arc.ar,arc.en)}</h3></div></Link>)}</div>
    </section>

    <section className="quote-band"><div className="content-section grid items-center gap-8 md:grid-cols-[1fr_330px]">
      <div><p className="mb-4 flex items-center gap-2 text-xs text-primary"><Quote className="size-4"/>{t("من صفحات الغريموار", "FROM THE GRIMOIRE")}</p><blockquote className="text-2xl font-bold leading-relaxed md:text-3xl">« {t(q.ar,q.en)} »</blockquote><p className="mt-4 text-xs text-muted-foreground">— {t(q.who,q.whoEn)} <span className="ms-3 font-display">BLACK CLOVER</span></p></div>
      <div className="border-s border-border ps-6"><div className="flex items-center gap-3"><Shield className="size-8 text-primary"/><div><p className="text-[10px] text-muted-foreground">{t("رتبتك في فرسان السحر", "YOUR MAGIC KNIGHT RANK")}</p><h3 className="mt-1 text-lg font-bold">{t(rank.ar,rank.en)}</h3></div></div><div className="mt-5 h-1 bg-secondary"><div className="h-full bg-primary" style={{width:`${progress.watched.length/170*100}%`}}/></div><p className="mt-3 text-xs text-muted-foreground">{progress.watched.length} / 170 {t("حلقة مكتملة", "episodes completed")}</p></div>
    </div></section>

    <section className="content-section"><div className="section-heading"><Heading ar="معارك لا تُنسى" en="Unforgettable battles" number="02"/><Sword className="size-5 text-muted-foreground"/></div><div className="grid gap-x-8 md:grid-cols-2 lg:grid-cols-3">{BATTLES.map((b,i) => <Link key={b.ep} to="/watch" search={{ep:b.ep}} className="group flex items-center gap-4 border-b py-5"><span className="font-display text-3xl text-muted-foreground/50">0{i+1}</span><div className="min-w-0 flex-1"><h3 className="text-sm font-bold transition group-hover:text-primary">{t(b.ar,b.en)}</h3><p className="mt-1 text-[10px] text-muted-foreground">{t("الحلقة", "EPISODE")} {b.ep}</p></div><Play className="size-4 shrink-0 text-primary"/></Link>)}</div></section>

    <section id="characters" className="content-section"><div className="section-heading"><Heading ar="حاملو الغريموار" en="Grimoire bearers" number="03"/><span className="font-display text-xs text-muted-foreground">THE MAGIC KNIGHTS</span></div><div className="grid grid-cols-2 gap-5 lg:grid-cols-4">{CHARACTERS.map((c) => <article key={c.key} className="character-card"><img className="portrait" src={PORTRAITS[c.key]} alt={t(c.ar,c.en)} loading="lazy"/><div className="flex items-center justify-between py-4"><div><h3 className="text-xl font-bold">{t(c.ar,c.en)}</h3><p className="mt-2 text-[10px] text-muted-foreground">{t(c.roleAr,c.roleEn)}</p></div><span className="font-display text-sm text-primary">{c.en.toUpperCase()}</span></div></article>)}</div></section>

    <section className="content-section grid items-center gap-10 md:grid-cols-2"><div><p className="mb-4 font-display text-xs text-primary">WORLD OF BLACK CLOVER</p><h2 className="text-3xl font-extrabold">{t("أربع ممالك. مصير واحد.", "Four kingdoms. One destiny.")}</h2><p className="mt-4 max-w-sm text-sm leading-8 text-muted-foreground">{t("من مملكة كلوفر إلى حدود البستوني، لكل مملكة حكايتها وسحرها.", "From Clover to the borders of Spade, every kingdom has its own story and magic.")}</p><div className="mt-6 flex flex-wrap gap-5 text-xs text-muted-foreground"><span className="flex gap-2"><Check className="size-4 text-primary"/>{t("سجل المشاهدة", "Watch history")}</span><span className="flex gap-2"><Bookmark className="size-4 text-primary"/>{t("حلقاتك المفضلة", "Favorite episodes")}</span></div></div><KingdomMap/></section>
  </main>;
}
