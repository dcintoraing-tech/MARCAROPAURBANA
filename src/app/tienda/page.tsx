import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "@/components/shop/ShopView";
import { allCategories, allCollections, priceBounds } from "@/lib/repositories";
import { SplitText } from "@/components/ui/motion-primitives";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Playeras, hoodies, sudaderas, pantalones, chamarras y accesorios. Series cortas producidas en la Ciudad de México.",
};

export default function TiendaPage() {
  const categories = allCategories();
  const collections = allCollections();
  const bounds = priceBounds();

  return (
    <>
      <header className="edge border-b rule pb-10 pt-14 md:pb-14 md:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="display text-[clamp(2.8rem,10vw,6.5rem)] leading-[0.84]">
            <SplitText text="TIENDA" />
          </h1>
          <p className="serif-it max-w-[30ch] pb-2 text-xl text-concrete">
            Todo lo que está aquí existe físicamente. Nada se produce bajo pedido.
          </p>
        </div>
      </header>

      <Suspense fallback={<div className="edge py-20 label text-concrete">Cargando catálogo…</div>}>
        <ShopView categories={categories} collections={collections} bounds={bounds} />
      </Suspense>
    </>
  );
}
