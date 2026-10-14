import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allCollections, collectionBySlug, productsByCollection, remainingPieces } from "@/lib/repositories";
import { ProductCard } from "@/components/shop/ProductCard";
import { ImageReveal, Reveal, SplitText } from "@/components/ui/motion-primitives";
import { longDate } from "@/lib/format";

export function generateStaticParams() {
  return allCollections().map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = collectionBySlug(slug);
  if (!collection) return { title: "Serie no encontrada" };

  return {
    title: `${collection.code} — ${collection.name}`,
    description: collection.tagline,
    openGraph: { images: [{ url: collection.cover }] },
  };
}

export default async function ColeccionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = collectionBySlug(slug);
  if (!collection) notFound();

  const products = productsByCollection(collection.id);
  const remaining = remainingPieces(collection.id);
  const others = allCollections().filter((c) => c.id !== collection.id);

  return (
    <>
      {/* Portada a sangre */}
      <section className="relative h-[70svh] min-h-[480px] overflow-hidden border-b rule">
        <Image
          src={collection.cover}
          alt={collection.name}
          fill
          priority
          sizes="100vw"
          className="ad-photo object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />

        <div className="edge absolute inset-x-0 bottom-0 pb-10 md:pb-14">
          <span className="label text-rojo">{collection.code}</span>
          <h1 className="display-tight mt-4 text-[clamp(3rem,14vw,10rem)]">
            <SplitText text={collection.name} />
          </h1>
        </div>
      </section>

      {/* Datos y concepto */}
      <section className="edge grid gap-10 border-b rule py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <p className="serif-it text-3xl leading-tight md:text-4xl">{collection.tagline}</p>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <p className="text-[0.95rem] leading-relaxed text-concrete">{collection.concept}</p>
          <div className="mt-8 space-y-5 border-t rule pt-6">
            {collection.story.map((paragraph) => (
              <Reveal key={paragraph}>
                <p className="text-[0.95rem] leading-relaxed text-concrete">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t rule pt-6 sm:grid-cols-4">
            <div>
              <dt className="label-sm text-concrete">Lanzamiento</dt>
              <dd className="mt-1.5 font-mono text-sm">{longDate(collection.releasedAt)}</dd>
            </div>
            <div>
              <dt className="label-sm text-concrete">Piezas</dt>
              <dd className="mt-1.5 font-mono text-sm">{collection.pieces}</dd>
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
        </div>
      </section>

      {/* Paleta */}
      <section className="edge border-b rule py-10" aria-label="Paleta de la serie">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
          <span className="label text-concrete md:w-32">Paleta</span>
          <div className="flex flex-1 gap-px">
            {collection.palette.map((tone) => (
              <div key={tone.name} className="flex-1">
                <div className="h-16 md:h-20" style={{ background: tone.hex }} />
                <p className="label-sm mt-2.5 leading-relaxed text-ash">
                  <span className="block text-concrete">{tone.name}</span>
                  <span className="block">{tone.hex}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería editorial */}
      <section className="edge grid gap-4 py-14 md:grid-cols-12 md:gap-6" aria-label="Fotografía de la serie">
        {collection.gallery.map((image, index) => {
          const layout = [
            "md:col-span-7",
            "md:col-span-5 md:mt-16",
            "md:col-span-4",
            "md:col-span-8 md:mt-10",
            "md:col-span-5",
            "md:col-span-7 md:mt-16",
          ][index % 6];

          return (
            <ImageReveal
              key={image}
              className={`${layout} aspect-[4/5] md:aspect-[3/4]`}
              parallax={index % 2 === 0 ? 28 : 16}
            >
              <Image
                src={image}
                alt={`${collection.name} — toma ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="ad-photo object-cover"
              />
            </ImageReveal>
          );
        })}
      </section>

      {/* Piezas */}
      <section className="border-t rule py-14 md:py-20" aria-labelledby="piezas-serie">
        <div className="edge flex items-end justify-between border-b rule pb-5">
          <h2 id="piezas-serie" className="display text-2xl md:text-4xl">
            Piezas de la serie
          </h2>
          <Link href={`/tienda?serie=${collection.slug}`} className="label link-draw hover:text-rojo">
            Filtrar en tienda
          </Link>
        </div>

        <ul className="edge mt-8 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
          {products.map((product, index) => (
            <li key={product.id}>
              <ProductCard product={product} index={index} />
            </li>
          ))}
        </ul>
      </section>

      {/* Otras series */}
      <section className="edge border-t rule py-12" aria-labelledby="otras">
        <h2 id="otras" className="label mb-6 text-concrete">
          Otras series
        </h2>
        <ul>
          {others.map((other) => (
            <li key={other.id}>
              <Link
                href={`/colecciones/${other.slug}`}
                className="group flex items-baseline justify-between gap-6 border-b rule py-6"
              >
                <span className="label w-20 shrink-0 text-concrete">{other.code}</span>
                <span className="display flex-1 text-[clamp(1.8rem,5vw,3rem)] leading-none transition-colors group-hover:text-rojo">
                  {other.name}
                </span>
                <span className="label-sm text-ash">{other.pieces} piezas</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
