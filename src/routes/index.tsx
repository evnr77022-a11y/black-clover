import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { ARCS, BATTLES, CHARACTERS } from "@/lib/anime-data";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EVN ANIME — شاهد بلاك كلوفر" },
      { name: "description", content: "شاهد جميع حلقات بلاك كلوفر الـ170، الأركات وأقوى القتالات والشخصيات." },
      { property: "og:title", content: "EVN ANIME — Black Clover" },
      { property: "og:description", content: "All 170 Black Clover episodes, arcs, top battles and characters." },
    ],
  }),
  component: Index,
});

function SectionTitle({ ar, en }: { ar: string; en: string }) {
  const { t } = useLang();
  return (
    <div className="mb-8 flex items-end gap-3">
      <span className="text-2xl text-primary">☘</span>
      <h2 className="text-2xl font-black md:text-3xl">{t(ar, en)}</h2>
      <span className="font-display text-xs tracking-widest text-muted-foreground">{en}</span>
    </div>
  );
}

function Index() {
  const { t } = useLang();
  return (
    <main>
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <img src={hero} alt="Asta & Yuno" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover animate-in fade-in duration-1000" />
        <div className="hero-fade absolute inset-0" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 animate-in slide-in-from-bottom-8 fade-in duration-700">
          <p className="font-display text-sm tracking-[0.4em] text-gold">BLACK CLOVER</p>
          <h1 className="mt-2 font-display text-5xl font-extrabold md:text-7xl">EVN ANIME</h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            {t("طفل بلا سحر يحلم بأن يصبح إمبراطور السحر. ١٧٠ حلقة بانتظارك.", "A boy without magic dreams of becoming the Wizard King. 170 episodes await.")}
          </p>
          <Link to="/watch" search={{ ep: 1 }} className="btn-hero mt-8">
            ▶ {t("ابدأ المشاهدة", "Start Watching")}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionTitle ar="الأركات" en="Story Arcs" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ARCS.map((a, i) => (
            <Link key={a.id} to="/watch" search={{ ep: a.from, arc: a.id }} className="glass-card group p-6">
              <span className="font-display text-4xl text-primary/30 transition group-hover:text-primary">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-bold">{t(a.ar, a.en)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("الحلقات", "Episodes")} {a.from}–{a.to}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionTitle ar="أقوى القتالات" en="Top Battles" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BATTLES.map((b) => (
            <Link key={b.ep} to="/watch" search={{ ep: b.ep }} className="glass-card flex items-center gap-4 p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent font-bold text-accent-foreground">{b.ep}</span>
              <div>
                <p className="font-bold">{t(b.ar, b.en)}</p>
                <p className="text-xs text-muted-foreground">{t("الحلقة", "Episode")} {b.ep}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionTitle ar="الموسوعة" en="Grimoire" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CHARACTERS.map((c) => (
            <div key={c.key} className="glass-card p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 text-4xl text-gold">{c.glyph}</div>
              <h3 className="mt-4 text-xl font-black">{t(c.ar, c.en)}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t(c.roleAr, c.roleEn)}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
