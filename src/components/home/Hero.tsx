"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Action } from "@/components/ui/primitives";
import { SplitText, EASE } from "@/components/ui/motion-primitives";
import { BRAND } from "@/lib/data/brand";
import { HORA_MUERTA } from "@/lib/data/media";

/**
 * Portada. La regla roja del margen recorre el borde izquierdo del encuadre y
 * la fotografía ocupa el lado derecho sin llegar a cerrar la retícula: el texto
 * queda, literalmente, al margen de la imagen.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[92svh] overflow-hidden border-b rule md:min-h-[90svh]"
      aria-label="Campaña"
    >
      {/* Fotografía principal */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 md:left-auto md:right-0 md:w-[58%]"
      >
        <motion.div
          className="grain relative h-full w-full"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.5, ease: EASE, delay: 0.15 }}
        >
          <Image
            src={HORA_MUERTA.hero}
            alt="Figura con hoodie y gorro en la calle, fotografiada de noche con flash directo"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 58vw"
            className="ad-photo object-cover object-[52%_32%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/45 md:bg-gradient-to-r md:from-ink md:via-ink/10 md:to-transparent" />
        </motion.div>
      </motion.div>

      {/* Regla del margen */}
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-5 top-0 w-px origin-top bg-rojo md:left-9 xl:left-14"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
      />

      {/* Columna de texto */}
      <motion.div
        style={{ y: textY, opacity: fade }}
        className="edge relative z-10 flex min-h-[92svh] flex-col justify-end pb-10 pt-28 md:min-h-[90svh] md:w-[54%] md:justify-center md:py-16"
      >
        <motion.p
          className="label mb-6 flex items-center gap-3 text-rojo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Drop 03
          <span aria-hidden className="h-px w-8 bg-rojo" />
          <span className="text-concrete">Crudo · 120 piezas</span>
        </motion.p>

        <h1 className="display-tight text-[clamp(2.9rem,12.5vw,4.6rem)] md:text-[clamp(3.4rem,7.4vw,6.6rem)]">
          <SplitText text="NADA" delay={0.42} className="block" />
          <SplitText text="IMPORTANTE" delay={0.5} className="block" />
          <span className="block">
            <SplitText text="SE ESCRIBIÓ" delay={0.58} />
          </span>
          <span className="flex flex-wrap items-baseline gap-x-4">
            <SplitText text="EN EL" delay={0.66} />
            <motion.span
              className="serif-it text-rojo"
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.92, ease: EASE }}
            >
              centro.
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mt-6 max-w-[34ch] text-[0.95rem] leading-relaxed text-concrete"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
        >
          Ropa hecha en la Ciudad de México en series cortas, numeradas y cerradas. Lo que se acaba, no vuelve.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
        >
          <Action href="/tienda" cursor="IR">
            Ver colección
          </Action>
          <Action href="/la-marca" variant="outline" cursor="IR">
            Descubrir la marca
          </Action>
        </motion.div>
      </motion.div>

      {/* Datos técnicos, esquina inferior derecha */}
      <motion.div
        className="pointer-events-none absolute bottom-6 right-5 z-10 hidden text-right md:block md:right-9 xl:right-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
      >
        <p className="label-sm text-bone/70">19°25′N 99°08′O</p>
        <p className="label-sm mt-1.5 text-bone/70">{BRAND.city} · 03:47</p>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.div
        className="absolute bottom-6 left-5 z-10 hidden items-center gap-3 md:left-9 md:flex xl:left-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        style={{ opacity: fade }}
      >
        <span className="label-sm text-concrete">Desliza</span>
        <motion.span
          aria-hidden
          className="h-px w-10 bg-concrete"
          animate={{ scaleX: [0.3, 1, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
    </section>
  );
}
