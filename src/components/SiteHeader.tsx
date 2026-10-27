import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export function SiteHeader() {
  const { t, toggle, lang } = useLang();
  return (
    <header className="glass fixed inset-x-0 top-0 z-50 border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl text-primary">☘</span>
          <span className="font-display text-xl tracking-widest">EVN ANIME</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/" className="nav-link" activeOptions={{ exact: true }} activeProps={{ className: "nav-link-active" }}>
            {t("الرئيسية", "Home")}
          </Link>
          <Link to="/watch" search={{ ep: 1 }} className="nav-link" activeProps={{ className: "nav-link-active" }}>
            {t("الحلقات", "Episodes")}
          </Link>
          <button onClick={toggle} className="rounded-md border px-3 py-1.5 text-xs transition hover:border-primary">
            {lang === "ar" ? "EN" : "عربي"}
          </button>
        </nav>
      </div>
    </header>
  );
}
