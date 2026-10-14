import type { Metadata } from "next";
import Image from "next/image";
import { LOOKBOOK } from "@/lib/data/lookbook";
import { LookbookView, type LookProduct } from "@/components/lookbook/LookbookView";
import { allProducts } from "@/lib/repositories";
import { LOOKBOOK_COVER } from "@/lib/data/catalog";
import { SplitText } from "@/components/ui/motion-primitives";
import { BRAND } from "@/lib/data/brand";

export const metadata: Metadata = {
  title: "Lookbook",
  description:
    "Las tres sesiones de MARGEN fotografiadas en la Ciudad de México. Toca cualquier prenda para abrir su ficha.",
};

export default function LookbookPage() {
  // Sólo viaja al cliente lo que las marcas necesitan pintar.
  const products: Record<string, LookProduct> = Object.fromEntries(
    allProducts().map((product) => [
      product.slug,
      { slug: product.slug, name: product.name, price: product.price, image: product.images[0] },
    ]),
  );

  return (
    <>
      <section className="relative h-[72svh] min-h-[460px] overflow-hidden border-b rule">
        <Image
          src={LOOKBOOK_COVER}
          alt="Sesión de campaña de MARGEN fotografiada de noche"
          fill
          priority
          sizes="100vw"
          className="ad-photo object-cover object-[50%_28%]"
        />
        <div className="grain absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/40" />

        <div className="edge absolute inset-x-0 bottom-0 pb-10 md:pb-14">
          <span className="label text-rojo">Campaña · 2025—2026</span>
          <h1 className="display-tight mt-4 text-[clamp(3rem,15vw,11rem)]">
            <SplitText text="LOOKBOOK" />
          </h1>
          <p className="serif-it mt-4 max-w-[34ch] text-xl text-bone/80">
            {BRAND.city}. Tres series, tres horarios, la misma cámara.
          </p>
        </div>
      </section>

      <LookbookView chapters={LOOKBOOK} products={products} />
    </>
  );
}
