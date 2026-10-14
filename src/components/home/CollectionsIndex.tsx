import Image from "next/image";
import Link from "next/link";
import { allCollections } from "@/lib/repositories";
import { Reveal } from "@/components/ui/motion-primitives";
import { shortDate } from "@/lib/format";

/**
 * Índice de series. Cada fila es una línea de texto que, al pasar el cursor,
 * descubre la fotografía de la colección sin mover el resto de la lista.
 */
export function CollectionsIndex({ index = "04" }: { index?: string }) {
  const collections = allCollections();

  return (
    <section className="border-b rule py-16 md:py-24" aria-labelledby="series">
      <div className="edge flex items-end justify-between border-b rule pb-5">
        <div className="flex items-baseline gap-4">
          <span className="label text-rojo">{index}</span>
          <h2 id="series" className="display text-2xl md:text-4xl">
            Series
          </h2>
        </div>
        <Link href="/colecciones" className="label link-draw hover:text-rojo">
          Todas
        </Link>
      </div>

      <ul className="edge">
        {collections.map((collection, i) => (
          <Reveal as="li" key={collection.id} delay={i * 0.06}>
            <Link
              href={`/colecciones/${collection.slug}`}
              className="group relative flex flex-col gap-4 border-b rule py-7 md:flex-row md:items-center md:gap-8 md:py-9"
              data-cursor="VER"
            >
              {/* Fotografía: fija en móvil, revelada al hover en escritorio */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-carbon md:absolute md:right-[22%] md:top-1/2 md:aspect-[4/5] md:h-[150%] md:w-[13rem] md:-translate-y-1/2 md:opacity-0 md:transition-opacity md:duration-700 md:group-hover:opacity-100">
                <Image
                  src={collection.cover}
                  alt={collection.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 220px"
                  className="ad-photo object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                />
              </div>

              <span className="label w-20 shrink-0 text-concrete">{collection.code}</span>

              <h3 className="display relative z-10 flex-1 text-[clamp(2rem,7vw,4.6rem)] leading-none transition-colors duration-500 group-hover:text-rojo">
                {collection.name}
              </h3>

              <div className="relative z-10 flex items-center gap-6 md:flex-col md:items-end md:gap-1.5">
                <span className="label-sm text-concrete">{collection.pieces} piezas</span>
                <span className="label-sm text-ash">{shortDate(collection.releasedAt)}</span>
                <span
                  className={`label-sm ${collection.status === "activa" ? "text-rojo" : "text-ash"}`}
                >
                  {collection.status === "activa" ? "Abierta" : "Cerrada"}
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
