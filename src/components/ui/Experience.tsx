"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { MargenMark } from "@/components/brand/Logo";
import { BRAND } from "@/lib/data/brand";
import { EASE } from "./motion-primitives";

/* ── Scroll suave ─────────────────────────────────────────────────────── */

export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.05, wheelMultiplier: 0.9, touchMultiplier: 1.6 });
    lenisRef.current = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/* ── Cursor de marca ──────────────────────────────────────────────────── */

export function BrandCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add("has-brand-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let frame = 0;

    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;

      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(target?.dataset.cursor ?? null);
      setActive(Boolean((event.target as HTMLElement | null)?.closest("a, button, input, select, textarea, [role=button]")));
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-brand-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120] hidden md:block">
      <div ref={dot} className="absolute -left-[2px] -top-[2px] h-1 w-1 rounded-full bg-rojo" />
      <div
        ref={ring}
        className="absolute left-0 top-0 flex items-center justify-center transition-[width,height,margin] duration-300"
        style={{
          width: label ? 76 : active ? 34 : 22,
          height: label ? 76 : active ? 34 : 22,
          marginLeft: label ? -38 : active ? -17 : -11,
          marginTop: label ? -38 : active ? -17 : -11,
        }}
      >
        <div
          className="absolute inset-0 rounded-full border transition-colors duration-300"
          style={{
            borderColor: label ? "transparent" : "rgba(233,229,221,0.4)",
            background: label ? "#E9E5DD" : "transparent",
          }}
        />
        {label ? (
          <span className="label-sm relative z-10 text-ink">{label}</span>
        ) : null}
      </div>
    </div>
  );
}

/* ── Pantalla de carga, sólo la primera visita de la sesión ──────────── */

export function BootScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let seen = true;
    try {
      seen = window.sessionStorage.getItem("margen.boot") === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    const started = performance.now();
    let frame = 0;
    const tick = () => {
      const elapsed = performance.now() - started;
      const value = Math.min(100, Math.round((elapsed / 1500) * 100));
      setProgress(value);
      if (value < 100) frame = requestAnimationFrame(tick);
      else {
        try {
          window.sessionStorage.setItem("margen.boot", "1");
        } catch {
          /* sin sessionStorage: se mostrará otra vez, no pasa nada */
        }
        setTimeout(() => {
          setVisible(false);
          document.body.style.overflow = "";
        }, 420);
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink px-5 py-6 md:px-9 md:py-8"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="flex items-start justify-between">
            <MargenMark className="h-7 w-7 text-bone" accent />
            <span className="label text-concrete">{BRAND.city}</span>
          </div>

          <div className="flex items-end justify-between gap-6">
            <motion.span
              className="display text-[16vw] leading-[0.8] text-bone md:text-[11vw]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE }}
            >
              MARGEN
            </motion.span>
            <span className="label pb-2 text-rojo tabular-nums">{progress.toString().padStart(3, "0")}</span>
          </div>

          <div className="relative h-px w-full bg-bone/15">
            <motion.div
              className="absolute inset-y-0 left-0 bg-rojo"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ── Transición entre páginas ─────────────────────────────────────────── */

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  /* El movimiento reducido lo neutraliza la hoja de estilos, no una rama aquí:
     cambiar la estructura según el media query rompería la hidratación. */
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.34, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
