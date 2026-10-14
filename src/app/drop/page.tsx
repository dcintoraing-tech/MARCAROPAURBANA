import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS, currentDropCloseISO } from "@/lib/data/catalog";
import { productsByCollection, remainingPieces, totalStock } from "@/lib/repositories";
import { Countdown, PiecesBar } from "@/components/drop/Countdown";
import { ProductCard } from "@/components/shop/ProductCard";
import { ImageReveal, Marquee, Reveal, SplitText } from "@/components/ui/motion-primitives";
import { longDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Drop 03 — Crudo",
  description:
    "Serie abierta de 120 piezas numeradas. Denim crudo de 14 oz, algodón sin mercerizar y teñido en pieza.",
};

export default function DropPage() {
  const drop = COLLECTIONS[2];
  const products = productsByCollection(drop.id);
  const remaining = remainingPieces(drop.id);

  return (
    <>
      {/* Portada del drop */}
      <section className="relative overflow-hidden border-b rule">
        <div className="absolute inset-0">
          <Image
            src={drop.cover}
            alt=""
            fill
            priority
            sizes="100vw"
            className="ad-photo-soft object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
        </div>

        <div className="edge relative grid gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rojo opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rojo" />
              </span>
              <span className="label text-rojo">Serie abierta · {drop.pieces} piezas</span>
            </div>

            <h1 className="display-tight mt-7 text-[clamp(3rem,13vw,9rem)]">
              <SplitText text={drop.code} className="block text-concrete" />
              <SplitText text={drop.name} className="block" delay={0.08} />
            </h1>

            <Reveal delay={0.18}>
              <p className="serif-it mt-7 max-w-[26ch] text-3xl leading-tight md:text-4xl">{drop.tagline}</p>
            </Reveal>
          </div>

          <Reveal className="flex flex-col justify-end lg:col-span-4 lg:col-start-9" delay={0.24}>
            <p className="text-[0.95rem] leading-relaxed text-concrete">{drop.concept}</p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t rule pt-6">
              <div>
                <dt className="label-sm text-concrete">Lanzamiento</dt>
                <dd className="mt-1.5 font-mono text-sm">{longDate(drop.releasedAt)}</dd>
              </div>
              <div>
                <dt className="label-sm text-concrete">Serie</dt>
                <dd className="mt-1.5 font-mono text-sm">{drop.pieces} piezas</dd>
              </div>
              <div>
                <dt className="label-sm text-concrete">Referencias</dt>
                <dd className="mt-1.5 font-mono text-sm">{products.length} modelos</dd>
              </div>
              <div>
                <dt className="label-sm text-concrete">Reposición</dt>
                <dd className="mt-1.5 font-mono text-sm text-rojo">Ninguna</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Contador */}
      <section className="border-b rule bg-carbon" aria-label="Cierre de la serie">
        <div className="edge grid gap-10 py-14 md:grid-cols-2 md:gap-16">
          <Countdown target={currentDropCloseISO()} label="La serie cierra en" />
          <div className="flex flex-col justify-center">
            <PiecesBar remaining={remaining} total={drop.pieces} />
            <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-concrete">
              Cuando el contador llega a cero dejamos de vender {drop.name} aunque queden piezas: las restantes se
              reparten entre quien trabajó en la serie. No hay reposición ni segunda tanda.
            </p>
          </div>
        </div>
      </section>

      <div className="label border-b rule py-3 text-rojo">
        <Marquee items={["No seguimos tendencias", `${drop.pieces} piezas`, "Sin reposición", "Hecho en CDMX"]} duration={34} />
      </div>

      {/* Piezas de la serie */}
      <section className="py-16 md:py-20" aria-labelledby="piezas">
        <div className="edge flex items-end justify-between border-b rule pb-5">
          <h2 id="piezas" className="display text-2xl md:text-4xl">
            Las piezas
          </h2>
          <span className="label text-concrete">{products.length} referencias</span>
        </div>

        <ul className="edge mt-8 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
          {products.map((product, index) => (
            <li key={product.id}>
              <ProductCard product={product} index={index} priority={index < 4} />
              <p className="label-sm mt-2 text-ash">
                {totalStock(product)} disponibles · {product.sku}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Paleta y relato */}
      <section className="border-t rule py-16 md:py-24">
        <div className="edge grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="label text-rojo">Paleta</span>
            <ul className="mt-6 space-y-px">
              {drop.palette.map((tone) => (
                <li key={tone.name} className="flex items-center gap-5 border-b rule py-4">
                  <span className="h-9 w-9 shrink-0 border rule" style={{ background: tone.hex }} />
                  <span className="flex-1 text-sm">{tone.name}</span>
                  <span className="font-mono text-xs uppercase text-concrete">{tone.hex}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <span className="label text-rojo">La serie</span>
            <div className="mt-6 space-y-5">
              {drop.story.map((paragraph) => (
                <Reveal key={paragraph}>
                  <p className="text-[0.95rem] leading-relaxed text-concrete">{paragraph}</p>
                </Reveal>
              ))}
            </div>
            <Link href={`/colecciones/${drop.slug}`} className="label link-draw mt-8 inline-block text-bone">
              Ver la serie completa
            </Link>
          </div>
        </div>

        <div className="edge mt-14 grid gap-4 md:grid-cols-3 md:gap-6">
          {drop.gallery.slice(0, 3).map((image, index) => (
            <ImageReveal
              key={image}
              className={index === 1 ? "aspect-[3/4] md:mt-12" : "aspect-[3/4]"}
              parallax={24}
              delay={index * 0.08}
            >
              <Image
                src={image}
                alt={`${drop.name} — toma ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="ad-photo object-cover"
              />
            </ImageReveal>
          ))}
        </div>
      </section>
    </>
  );
}
