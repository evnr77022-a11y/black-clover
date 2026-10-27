import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

export function CloverMark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 80 80" fill="currentColor" aria-hidden="true"><path d="M40 39C20 27 22 4 35 9c6 2 6 10 5 13 1-3 4-10 10-9 15 2 7 22-10 26ZM41 40c6-23 28-31 29-17 0 7-7 10-10 10 3 0 11 0 13 6 5 14-16 15-32 1ZM40 42c24 2 36 20 23 24-6 2-11-4-12-7 1 3 4 11-1 14-12 9-20-10-10-31ZM38 41c-2 24-20 36-24 23-2-6 4-11 7-12-3 1-11 4-14-1-9-12 10-20 31-10ZM37 39C14 33 6 11 20 10c7 0 10 7 10 10 0-3 0-11 6-13 14-5 15 16 1 32Z"/><path d="m37 39 5 2-2 36-5-1Z"/></svg>;
}

export function Grimoire({ onOpen, activated = false }: { onOpen?: () => void; activated?: boolean }) {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  useEffect(() => { if (activated) setOpen(true); }, [activated]);
  useEffect(() => {
    if (!open || !onOpen) return;
    const timer = window.setTimeout(onOpen, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 750);
    return () => window.clearTimeout(timer);
  }, [open, onOpen]);
  return <Button variant="ghost" className="grimoire-control" aria-label={t("افتح غريموار أستا", "Open Asta's grimoire")} aria-pressed={open} onClick={() => setOpen((v) => !v)}>
    <span className={`grimoire-book ${open ? "is-open" : ""}`}>
      <span className="grimoire-pages"><BookOpen className="size-12 text-primary"/><span>{t("لن أستسلم", "NEVER GIVE UP")}</span></span>
      <span className="grimoire-cover"><span className="grimoire-corner"/><CloverMark className="size-20 text-primary"/><span className="font-display text-[10px] text-muted-foreground">ANTI MAGIC</span></span>
    </span>
  </Button>;
}