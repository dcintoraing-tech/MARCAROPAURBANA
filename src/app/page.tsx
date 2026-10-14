import { Hero } from "@/components/home/Hero";
import { DropTeaser } from "@/components/home/DropTeaser";
import { Manifesto } from "@/components/home/Manifesto";
import { ProductRail } from "@/components/home/ProductRail";
import { CollectionsIndex } from "@/components/home/CollectionsIndex";
import { LookbookTeaser } from "@/components/home/LookbookTeaser";
import { Newsletter, SocialFeed } from "@/components/home/Social";
import { Marquee } from "@/components/ui/motion-primitives";
import { queryProducts } from "@/lib/repositories";
import { BRAND } from "@/lib/data/brand";

export default function HomePage() {
  const recientes = queryProducts({ sort: "recientes" }).slice(0, 8);
  const vendidos = queryProducts({ sort: "vendidos" }).slice(0, 8);

  return (
    <>
      <Hero />

      <div className="label border-b rule py-3.5 text-concrete">
        <Marquee items={BRAND.tickers} duration={46} />
      </div>

      <DropTeaser />

      <ProductRail
        products={recientes}
        index="03"
        title="Lo último"
        note="Series abiertas"
        href="/tienda"
        hrefLabel="Ver tienda"
      />

      <Manifesto />

      <CollectionsIndex index="04" />

      <LookbookTeaser index="05" />

      <ProductRail
        products={vendidos}
        index="06"
        title="Lo que más sale"
        note="Actualizado cada semana"
        href="/tienda?orden=vendidos"
        hrefLabel="Ver todo"
      />

      <SocialFeed index="07" />

      <Newsletter />
    </>
  );
}
