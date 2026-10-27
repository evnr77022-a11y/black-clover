import { useEffect, useRef } from "react";

export function MagicAtmosphere() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const colors = getComputedStyle(document.documentElement);
    const red = colors.getPropertyValue("--primary").trim();
    const purple = colors.getPropertyValue("--void").trim();
    let frame = 0;
    let width = 0; let height = 0;
    let pointer = { x: 0, y: 0 };
    const particles = Array.from({ length: 36 }, (_, i) => ({ x: (i * 137.5 % 1000) / 1000, y: (i * 71.7 % 1000) / 1000, size: 0.6 + i % 3 * 0.4, speed: 0.005 + (i % 5) * 0.002 }));
    const resize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
    const move = (e: PointerEvent) => { pointer = { x: (e.clientX / width - 0.5) * 14, y: (e.clientY / height - 0.5) * 14 }; };
    resize();
    let last = 0;
    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, .05); last = now;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        if (!reduced.matches) p.y = (p.y - p.speed * dt + 1) % 1;
        ctx.fillStyle = i % 5 === 0 ? purple : red;
        ctx.globalAlpha = .18 + (i % 4) * .1;
        ctx.fillRect(p.x * width + pointer.x, p.y * height + pointer.y, p.size, p.size * 2.8);
      });
      if (!reduced.matches) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); };
  }, []);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-20 h-full w-full" aria-hidden="true" />;
}