"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

/**
 * Vocabulario de movimiento de la marca.
 *
 * Tres gestos y nada más: aparecer desde abajo, descubrir por máscara y
 * desplazar muy poco en paralaje. Repetirlos es lo que hace que el sitio se
 * sienta de una sola mano.
 */

export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * `useReducedMotion` de motion lee el media query en el primer render, y en el
 * servidor siempre vale false: si se usa para decidir qué nodos pintar, el HTML
 * del servidor y el del cliente dejan de coincidir. Este hook arranca siempre
 * en false y sólo cambia tras montar, así que la hidratación nunca falla.
 */
export function useReducedMotionSafe() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/* ── Aparición al entrar en pantalla ─────────────────────────────────── */

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Distancia del desplazamiento inicial, en píxeles. */
  distance?: number;
  once?: boolean;
  as?: "div" | "section" | "li" | "article" | "span";
}

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 26,
  once = true,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotionSafe();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

/* ── Titulares que entran palabra por palabra ────────────────────────── */

interface SplitTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.055,
  once = true,
}: SplitTextProps) {
  const reduced = useReducedMotionSafe();
  const words = text.split(" ");

  if (reduced) return <span className={className}>{text}</span>;

  return (
    <span className={className} aria-label={text}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom" aria-hidden>
          <motion.span
            className={clsx("inline-block", wordClassName)}
            initial={{ y: "108%" }}
            whileInView={{ y: 0 }}
            viewport={{ once, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, delay: delay + index * stagger, ease: EASE }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ── Fotografía que se descubre y respira ────────────────────────────── */

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Recorrido del paralaje en píxeles; 0 lo desactiva. */
  parallax?: number;
  delay?: number;
}

export function ImageReveal({ children, className, parallax = 40, delay = 0 }: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);

  return (
    <div ref={ref} className={clsx("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        whileInView={{ clipPath: "inset(0 0 0% 0)" }}
        viewport={{ once: true, margin: "0px 0px -6% 0px" }}
        transition={{ duration: 1.25, delay, ease: EASE }}
      >
        <motion.div
          className="absolute inset-[-8%]"
          style={reduced || parallax === 0 ? undefined : { y }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── Marquesina ──────────────────────────────────────────────────────── */

export function Marquee({
  items,
  className,
  duration = 38,
  separator = "—",
}: {
  items: readonly string[];
  className?: string;
  duration?: number;
  separator?: string;
}) {
  const sequence = [...items, ...items];
  return (
    <div className={clsx("relative flex overflow-hidden", className)}>
      <div
        className="marquee-track flex shrink-0 items-center whitespace-nowrap"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {sequence.map((item, index) => (
          <span key={index} className="flex items-center">
            <span className="px-5">{item}</span>
            <span aria-hidden className="text-rojo">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
