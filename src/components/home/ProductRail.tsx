"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { IconArrow } from "@/components/ui/icons";

/**
 * Carrusel horizontal con ajuste por producto. En móvil se arrastra con el
 * dedo; en escritorio aparecen las flechas, que avanzan el ancho de una ficha.
 */
export function ProductRail({
  products,
  index,
  title,
  note,
  href,
  hrefLabel = "Ver todo",
}: {
  products: Product[];
  index: string;
  title: string;
  note?: string;
  href: string;
  hrefLabel?: string;
}) {
  const track = useRef<HTMLUListElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const node = track.current;
    if (!node) return;
    const card = node.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : node.clientWidth * 0.8;
    node.scrollBy({ left: step * direction * 2, behavior: "smooth" });
  };

  return (
    <section className="border-b rule py-16 md:py-24" aria-labelledby={`rail-${index}`}>
      <div className="edge flex flex-wrap items-end justify-between gap-5 border-b rule pb-5">
        <div className="flex items-baseline gap-4">
          <span className="label text-rojo">{index}</span>
          <h2 id={`rail-${index}`} className="display text-2xl md:text-4xl">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-5">
          {note ? <span className="label hidden text-concrete md:inline">{note}</span> : null}
          <Link href={href} className="label link-draw hover:text-rojo">
            {hrefLabel}
          </Link>
          <div className="hidden gap-1 md:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Anterior"
              className="border rule p-2.5 transition-colors duration-300 hover:bg-bone hover:text-ink"
            >
              <IconArrow className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Siguiente"
              className="border rule p-2.5 transition-colors duration-300 hover:bg-bone hover:text-ink"
            >
              <IconArrow className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <ul
        ref={track}
        className="hide-scrollbar edge mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {products.map((product, i) => (
          <li
            key={product.id}
            className="w-[62vw] shrink-0 snap-start sm:w-[40vw] md:w-[30vw] lg:w-[23vw] xl:w-[19vw]"
          >
            <ProductCard product={product} index={i} />
          </li>
        ))}
        <li className="flex w-[62vw] shrink-0 snap-start items-center sm:w-[40vw] md:w-[30vw] lg:w-[23vw] xl:w-[19vw]">
          <Link
            href={href}
            className="label flex aspect-[3/4] w-full items-center justify-center border rule transition-colors duration-500 hover:bg-bone hover:text-ink"
          >
            {hrefLabel}
          </Link>
        </li>
      </ul>
    </section>
  );
}
