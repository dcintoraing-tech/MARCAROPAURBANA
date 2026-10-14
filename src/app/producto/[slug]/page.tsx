import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductCard } from "@/components/shop/ProductCard";
import { allProducts, categoryById, collectionById, pairsWith, productBySlug } from "@/lib/repositories";
import { Reveal } from "@/components/ui/motion-primitives";

export function generateStaticParams() {
  return allProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} · MARGEN`,
      description: product.subtitle,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();

  const category = categoryById(product.categoryId);
  const collection = collectionById(product.collectionId);
  if (!category || !collection) notFound();

  const related = pairsWith(product, 4);

  return (
    <>
      <ProductDetail
        product={product}
        category={{ name: category.name, slug: category.slug }}
        collection={{ code: collection.code, name: collection.name, slug: collection.slug }}
      />

      <section className="border-t rule py-16 md:py-20" aria-labelledby="combinalo">
        <div className="edge flex items-end justify-between border-b rule pb-5">
          <h2 id="combinalo" className="display text-2xl md:text-3xl">
            Combínalo con…
          </h2>
          <Link href="/tienda" className="label link-draw hover:text-rojo">
            Ver tienda
          </Link>
        </div>

        <ul className="edge mt-7 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {related.map((item, index) => (
            <li key={item.id}>
              <ProductCard product={item} index={index} />
            </li>
          ))}
        </ul>
      </section>

      <Reveal className="edge border-t rule py-14">
        <p className="serif-it max-w-[36ch] text-2xl leading-snug md:text-3xl">
          Serie {collection.code} — {collection.name}. {collection.pieces} piezas numeradas.
        </p>
        <Link href={`/colecciones/${collection.slug}`} className="label mt-6 inline-block link-draw text-rojo">
          Ver la serie completa
        </Link>
      </Reveal>
    </>
  );
}
