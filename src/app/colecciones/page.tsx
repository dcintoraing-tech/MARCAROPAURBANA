import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { allCollections, productsByCollection, remainingPieces } from "@/lib/repositories";
import { ImageReveal, Reveal, SplitText } from "@/components/ui/motion-primitives";
import { longDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Colecciones",
  description: "DROP 01 Hora Muerta, DROP 02 Concreto y DROP 03 Crudo. Series cortas, numeradas y cerradas.",
};

export default function ColeccionesPage() {
  const collections = allCollections();

  return (
    <>
      <header className="edge border-b rule pb-10 pt-14 md:pb-14 md:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="display text-[clamp(2.8rem,10vw,6.5rem)] leading-[0.84]">
            <SplitText text="SERIES" />
          </h1>
          <p className="serif-it max-w-[34ch] pb-2 text-xl text-concrete">
            Tres series desde 2025. Ninguna se reeditó y ninguna se va a reeditar.
          </p>
        </div>
      </header>

      <div className="divide-y divide-bone/10">
        {collections.map((collection, index) => {
          const products = productsByCollection(collection.id);
          const remaining = remainingPieces(collection.id);
          const reversed = index % 2 === 1;

          return (
            <section key={collection.id} className="edge py-14 md:py-20" aria-labelledby={collection.id}>
              <div className="grid gap-8 md:grid-cols-12 md:gap-6">
                <div className={reversed ? "md:col-span-5 md:col-start-8 md:row-start-1" : "md:col-span-5"}>
                  <Link href={`/colecciones/${collection.slug}`} data-cursor="VER">
                    <ImageReveal className="aspect-[3/4]" parallax={30}>
                      <Image
                        src={collection.cover}
                        alt={collection.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="ad-photo object-cover"
                      />
                    </ImageReveal>
                  </Link>
                </div>

                <div
                  className={
                    reversed
                      ? "flex flex-col justify-center md:col-span-6 md:col-start-1 md:row-start-1"
                      : "flex flex-col justify-center md:col-span-6 md:col-start-7"
                  }
                >
                  <span className="label text-concrete">{collection.code}</span>
                  <h2 id={collection.id} className="display mt-4 text-[clamp(2.4rem,8vw,5.4rem)] leading-[0.84]">
                    <Link href={`/colecciones/${collection.slug}`} className="transition-colors hover:text-rojo">
                      {collection.name}
                    </Link>
                  </h2>

                  <Reveal delay={0.1}>
                    <p className="serif-it mt-5 max-w-[28ch] text-2xl leading-tight">{collection.tagline}</p>
                    <p className="mt-5 max-w-[48ch] text-[0.95rem] leading-relaxed text-concrete">
                      {collection.concept}
                    </p>
                  </Reveal>

                  <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t rule pt-5">
                    <div>
                      <dt className="label-sm text-concrete">Lanzamiento</dt>
                      <dd className="mt-1.5 font-mono text-sm">{longDate(collection.releasedAt)}</dd>
                    </div>
                    <div>
                      <dt className="label-sm text-concrete">Serie</dt>
                      <dd className="mt-1.5 font-mono text-sm">{collection.pieces} piezas</dd>
                    </div>
                    <div>
                      <dt className="label-sm text-concrete">Referencias</dt>
                      <dd className="mt-1.5 font-mono text-sm">{products.length}</dd>
                    </div>
                    <div>
                      <dt className="label-sm text-concrete">Estado</dt>
                      <dd className={`mt-1.5 font-mono text-sm ${remaining > 0 ? "text-rojo" : "text-ash"}`}>
                        {remaining > 0 ? "Abierta" : "Agotada"}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      href={`/colecciones/${collection.slug}`}
                      className="label border rule px-6 py-3.5 transition-colors duration-500 hover:bg-bone hover:text-ink"
                    >
                      Ver la serie
                    </Link>
                    <Link
                      href={`/tienda?serie=${collection.slug}`}
                      className="label px-2 py-3.5 link-draw text-concrete hover:text-bone"
                    >
                      Comprar {products.length} piezas
                    </Link>
                  </div>
                </div>
              </div>

              {/* Tira de paleta */}
              <div className="mt-10 flex gap-px">
                {collection.palette.map((tone) => (
                  <div key={tone.name} className="flex-1">
                    <div className="h-14" style={{ background: tone.hex }} />
                    <p className="label-sm mt-2 text-ash">{tone.name}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
