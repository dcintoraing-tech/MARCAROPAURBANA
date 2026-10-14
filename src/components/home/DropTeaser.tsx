import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS, currentDropCloseISO } from "@/lib/data/catalog";
import { productsByCollection, remainingPieces } from "@/lib/repositories";
import { Countdown, PiecesBar } from "@/components/drop/Countdown";
import { Action } from "@/components/ui/primitives";
import { ImageReveal, Reveal, SplitText } from "@/components/ui/motion-primitives";
import { price, longDate } from "@/lib/format";

/** El drop vigente en portada: fecha de cierre, piezas y las primeras prendas. */
export function DropTeaser() {
  const drop = COLLECTIONS[2];
  const products = productsByCollection(drop.id).slice(0, 3);
  const remaining = remainingPieces(drop.id);

  return (
    <section className="relative border-b rule bg-carbon" aria-labelledby="drop-title">
      <div className="edge grid gap-10 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rojo opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rojo" />
            </span>
            <span className="label text-rojo">Serie abierta</span>
          </div>

          <h2 id="drop-title" className="display mt-6 text-[clamp(2.6rem,9vw,5.4rem)] leading-[0.82]">
            <SplitText text={drop.code} className="block text-concrete" />
            <SplitText text={drop.name} className="block" delay={0.08} />
          </h2>

          <Reveal delay={0.15}>
            <p className="serif-it mt-6 max-w-[30ch] text-2xl leading-tight text-bone md:text-3xl">
              {drop.tagline}
            </p>
            <p className="mt-6 max-w-[48ch] text-[0.95rem] leading-relaxed text-concrete">{drop.concept}</p>
          </Reveal>

          <Reveal delay={0.2} className="mt-10">
            <Countdown target={currentDropCloseISO()} label="La serie cierra en" />
          </Reveal>

          <Reveal delay={0.25} className="mt-9 max-w-md">
            <PiecesBar remaining={remaining} total={drop.pieces} />
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t rule pt-5">
              <div>
                <dt className="label-sm text-concrete">Lanzamiento</dt>
                <dd className="mt-1.5 font-mono text-sm">{longDate(drop.releasedAt)}</dd>
              </div>
              <div>
                <dt className="label-sm text-concrete">Serie</dt>
                <dd className="mt-1.5 font-mono text-sm">{drop.pieces} piezas numeradas</dd>
              </div>
            </dl>
          </Reveal>

          <div className="mt-9 flex flex-wrap gap-3">
            <Action href="/drop" cursor="IR">
              Entrar al drop
            </Action>
            <Action href={`/colecciones/${drop.slug}`} variant="outline">
              Ver la serie completa
            </Action>
          </div>
        </div>

        {/* Las tres piezas de apertura, escalonadas */}
        <ul className="grid grid-cols-2 gap-3 self-start lg:gap-4">
          {products.map((product, index) => (
            <li
              key={product.id}
              className={index === 0 ? "col-span-2" : undefined}
            >
              <Link href={`/producto/${product.slug}`} className="group block" data-cursor="VER">
                <ImageReveal
                  className={index === 0 ? "aspect-[16/11]" : "aspect-[3/4]"}
                  delay={index * 0.08}
                  parallax={index === 0 ? 18 : 10}
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="ad-photo object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                </ImageReveal>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <span className="text-sm leading-tight">{product.name}</span>
                  <span className="font-mono text-xs tabular-nums text-concrete">{price(product.price)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
