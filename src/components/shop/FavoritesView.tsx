"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useFavorites } from "@/lib/store/favorites";
import { allProducts } from "@/lib/repositories";
import { ProductCard } from "@/components/shop/ProductCard";
import { SplitText } from "@/components/ui/motion-primitives";

export function FavoritesView() {
  const favorites = useFavorites();
  const products = useMemo(
    () => allProducts().filter((product) => favorites.ids.includes(product.slug)),
    [favorites.ids],
  );

  return (
    <>
      <header className="edge border-b rule pb-10 pt-14 md:pb-14 md:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="display text-[clamp(2.8rem,10vw,6.5rem)] leading-[0.84]">
            <SplitText text="FAVORITOS" />
          </h1>
          <p className="label pb-2 text-concrete">
            {favorites.hydrated ? `${products.length} ${products.length === 1 ? "pieza" : "piezas"}` : "—"}
          </p>
        </div>
      </header>

      <div className="edge py-12 pb-24">
        {!favorites.hydrated ? null : products.length === 0 ? (
          <div className="flex flex-col items-start py-10">
            <p className="serif-it text-3xl leading-snug">Todavía no guardas nada.</p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-concrete">
              Guarda las piezas que te interesan para no perderlas de vista. Las series son cerradas: cuando se acaban,
              desaparecen del catálogo.
            </p>
            <Link
              href="/tienda"
              className="label mt-8 bg-bone px-7 py-4 text-ink transition-colors duration-500 hover:bg-rojo hover:text-paper"
            >
              Ver la tienda
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
            {products.map((product, index) => (
              <li key={product.id}>
                <ProductCard product={product} index={index} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
