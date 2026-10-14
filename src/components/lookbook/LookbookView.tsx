"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { clsx } from "clsx";
import type { Look, LookbookChapter } from "@/lib/data/lookbook";
import { price } from "@/lib/format";
import { IconArrow, IconClose } from "@/components/ui/icons";
import { ImageReveal, Reveal, SplitText } from "@/components/ui/motion-primitives";
import { EASE } from "@/components/ui/motion-primitives";

/** Datos mínimos del producto para las marcas sobre la fotografía. */
export interface LookProduct {
  slug: string;
  name: string;
  price: number;
  image: string;
}

interface LookbookViewProps {
  chapters: LookbookChapter[];
  products: Record<string, LookProduct>;
}

const SPAN: Record<Look["span"], string> = {
  full: "md:col-span-12",
  tall: "md:col-span-6 md:row-span-2",
  half: "md:col-span-6",
  wide: "md:col-span-12",
};

const ASPECT: Record<Look["span"], string> = {
  full: "aspect-[4/5] md:aspect-[16/9]",
  tall: "aspect-[4/5] md:aspect-[3/4]",
  half: "aspect-[4/5]",
  wide: "aspect-[4/5] md:aspect-[16/8]",
};

export function LookbookView({ chapters, products }: LookbookViewProps) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);

  const chapter = chapters[chapterIndex];
  const looks = chapter.looks;

  const step = useCallback(
    (direction: 1 | -1) => {
      setViewer((current) => {
        if (current === null) return current;
        return (current + direction + looks.length) % looks.length;
      });
    },
    [looks.length],
  );

  useEffect(() => {
    if (viewer === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewer(null);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [viewer, step]);

  return (
    <>
      {/* Selector de capítulo */}
      <div className="sticky top-[62px] z-40 border-b rule bg-ink/92 backdrop-blur-md md:top-[70px]">
        <ul className="hide-scrollbar edge flex gap-7 overflow-x-auto py-3.5">
          {chapters.map((item, index) => (
            <li key={item.collectionSlug}>
              <button
                type="button"
                onClick={() => setChapterIndex(index)}
                aria-pressed={index === chapterIndex}
                className={clsx(
                  "label whitespace-nowrap transition-colors duration-300",
                  index === chapterIndex ? "text-bone" : "text-ash hover:text-concrete",
                )}
              >
                {item.code} — {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={chapter.collectionSlug}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <header className="edge grid gap-6 border-b rule py-12 md:grid-cols-12 md:py-16">
            <h2 className="display text-[clamp(2.6rem,10vw,7rem)] leading-[0.82] md:col-span-7">
              <SplitText text={chapter.name} />
            </h2>
            <Reveal className="flex items-end md:col-span-4 md:col-start-9" delay={0.12}>
              <p className="serif-it text-xl leading-snug text-concrete">{chapter.epigraph}</p>
            </Reveal>
          </header>

          <div className="edge grid gap-y-14 py-14 md:grid-cols-12 md:gap-x-6 md:gap-y-20">
            {looks.map((look, index) => (
              <figure key={look.id} className={clsx(SPAN[look.span], index % 3 === 1 && "md:mt-16")}>
                <div className="group relative">
                  <button
                    type="button"
                    onClick={() => setViewer(index)}
                    className="block w-full"
                    aria-label={`Ampliar ${look.title}`}
                    data-cursor="AMPLIAR"
                  >
                    <ImageReveal className={ASPECT[look.span]} parallax={index % 2 === 0 ? 26 : 14}>
                      <Image
                        src={look.image}
                        alt={look.caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 55vw"
                        className="ad-photo object-cover"
                      />
                    </ImageReveal>
                  </button>

                  {look.hotspots.map((hotspot) => {
                    const product = products[hotspot.productSlug];
                    if (!product) return null;
                    return <Hotspot key={hotspot.productSlug} hotspot={hotspot} product={product} />;
                  })}
                </div>

                <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t rule pt-3">
                  <div className="flex items-baseline gap-4">
                    <span className="label text-rojo">{look.index}</span>
                    <span className="label">{look.title}</span>
                  </div>
                  <span className="label-sm text-ash">
                    {look.location} · {look.time}
                  </span>
                  <p className="w-full max-w-[60ch] text-sm leading-relaxed text-concrete">{look.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Visor */}
      <AnimatePresence>
        {viewer !== null ? (
          <motion.div
            className="fixed inset-0 z-[130] flex flex-col bg-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label={looks[viewer].title}
          >
            <header className="flex items-center justify-between border-b rule px-5 py-4 md:px-9">
              <span className="label text-concrete">
                {chapter.code} · {looks[viewer].index} / {String(looks.length).padStart(2, "0")}
              </span>
              <button type="button" onClick={() => setViewer(null)} aria-label="Cerrar" className="p-1 hover:text-rojo">
                <IconClose className="h-5 w-5" />
              </button>
            </header>

            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={looks[viewer].id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <Image
                    src={looks[viewer].image}
                    alt={looks[viewer].caption}
                    fill
                    sizes="100vw"
                    className="ad-photo object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Anterior"
                className="absolute left-0 top-0 flex h-full w-1/4 items-center justify-start px-5 text-bone/60 transition-colors hover:text-bone"
              >
                <IconArrow className="h-6 w-6 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Siguiente"
                className="absolute right-0 top-0 flex h-full w-1/4 items-center justify-end px-5 text-bone/60 transition-colors hover:text-bone"
              >
                <IconArrow className="h-6 w-6" />
              </button>
            </div>

            <footer className="border-t rule px-5 py-4 md:px-9">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="label">{looks[viewer].title}</p>
                  <p className="label-sm mt-1.5 text-ash">
                    {looks[viewer].location} · {looks[viewer].time}
                  </p>
                </div>

                <ul className="flex flex-wrap gap-2">
                  {looks[viewer].hotspots.map((hotspot) => {
                    const product = products[hotspot.productSlug];
                    if (!product) return null;
                    return (
                      <li key={hotspot.productSlug}>
                        <Link
                          href={`/producto/${product.slug}`}
                          className="flex items-center gap-3 border rule p-2 pr-4 transition-colors duration-300 hover:border-bone"
                        >
                          <span className="relative h-12 w-10 shrink-0 bg-carbon">
                            <Image src={product.image} alt="" fill sizes="40px" className="ad-photo object-cover" />
                          </span>
                          <span>
                            <span className="block text-sm leading-tight">{product.name}</span>
                            <span className="font-mono text-xs text-concrete">{price(product.price)}</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </footer>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/** Marca sobre la fotografía: punto discreto que al tocarlo muestra la prenda. */
function Hotspot({
  hotspot,
  product,
}: {
  hotspot: { x: number; y: number; label: string; productSlug: string };
  product: LookProduct;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="absolute z-10"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Ver ${hotspot.label}`}
        aria-expanded={open}
        className="relative -ml-3 -mt-3 flex h-6 w-6 items-center justify-center"
      >
        <span className="absolute h-6 w-6 animate-ping rounded-full bg-bone/25" />
        <span
          className={clsx(
            "relative h-2 w-2 rounded-full transition-colors duration-300",
            open ? "bg-rojo" : "bg-bone",
          )}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="absolute left-1/2 top-6 z-20 w-48 -translate-x-1/2"
          >
            <Link
              href={`/producto/${product.slug}`}
              className="flex items-center gap-3 border rule bg-ink/95 p-2 backdrop-blur-sm transition-colors hover:border-bone"
            >
              <span className="relative h-14 w-11 shrink-0 bg-carbon">
                <Image src={product.image} alt="" fill sizes="44px" className="ad-photo object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs leading-tight">{product.name}</span>
                <span className="font-mono text-[0.7rem] text-concrete">{price(product.price)}</span>
              </span>
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
