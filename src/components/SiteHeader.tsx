import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { CloverMark } from "@/components/Grimoire";
import { ArrowUpRight, Languages, Shield } from "lucide-react";
import { rankFor, useProgress } from "@/lib/progress";

export function SiteHeader() {
  const { t, toggle, lang } = useLang();
  const { progress } = useProgress();
  const rank = rankFor(progress.watched.length);
  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between gap-3 px-5 md:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="EVN ANIME">
          <CloverMark className="size-9 text-primary" />
          <span className="font-display text-lg font-extrabold" dir="ltr">EVN<span className="text-primary">.</span> <span className="font-normal">ANIME</span></span>
        </Link>
        <nav className="flex items-center gap-1 text-sm md:gap-5" aria-label={t("التنقل الرئيسي", "Main navigation")}>
          <Link to="/" className="nav-link" activeOptions={{ exact: true }} activeProps={{ className: "nav-link-active" }}>
            {t("الرئيسية", "Home")}
          </Link>
          <Link to="/watch" search={{ ep: 1 }} className="nav-link" activeProps={{ className: "nav-link-active" }}>
            {t("الحلقات", "Episodes")}
          </Link>
          <a href="/#arcs" className="nav-link hidden md:inline-flex">{t("الأركات", "Story arcs")}</a>
          <a href="/#characters" className="nav-link hidden md:inline-flex">{t("الشخصيات", "Characters")}</a>
        </nav>
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 text-xs text-muted-foreground xl:flex"><Shield className="size-4 text-primary"/>{t(rank.ar, rank.en)}</span>
          <Button onClick={toggle} variant="ghost" size="sm" className="gap-1" aria-label={t("English language", "اللغة العربية")}><Languages className="size-4"/><span>{lang === "ar" ? "EN" : "عربي"}</span></Button>
          <Button asChild className="hidden md:inline-flex" size="sm"><Link to="/watch" search={{ ep: progress.lastEpisode }}>{t("شاهد الآن", "Watch now")}<ArrowUpRight/></Link></Button>
        </div>
      </div>
    </header>
  );
}
