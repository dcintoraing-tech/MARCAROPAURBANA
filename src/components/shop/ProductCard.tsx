"use client";

import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import { motion } from "motion/react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { price } from "@/lib/format";
import { isSoldOut, totalStock } from "@/lib/repositories";
import { useFavorites } from "@/lib/store/favorites";
import { IconHeart } from "@/components/ui/icons";
import { EASE } from "@/components/ui/motion-primitives";

interface ProductCardProps {
  product: Product;
  /** Índice dentro de la cuadrícula: escalona la entrada. */
  index?: number;
  priority?: boolean;
  /** La ficha compacta se usa en carruseles y en "combínalo con". */
  compact?: boolean;
  className?: string;
}

export function ProductCard({ product, index = 0, priority, compact, className }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const favorites = useFavorites();

  const color = product.colors[colorIndex];
  const images = color.images?.length ? color.images : product.images;
  const primary = images[0];
  const secondary = images[1] ?? product.images[1] ?? primary;
  const soldOut = isSoldOut(product);
  const stock = totalStock(product);
  const isFavorite = favorites.has(product.slug);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, delay: Math.min(index, 7) * 0.06, ease: EASE }}
      className={clsx("group relative flex flex-col", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/producto/${product.slug}`}
        className="relative block overflow-hidden bg-carbon"
        data-cursor="VER"
        aria-label={product.name}
      >
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={primary}
            alt={`${product.name} en ${color.name}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className={clsx(
              "ad-photo object-cover transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              hovered ? "scale-[1.04] opacity-0" : "scale-100 opacity-100",
            )}
          />
          <Image
            src={secondary}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={clsx(
              "ad-photo object-cover transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              hovered ? "scale-[1.04] opacity-100" : "scale-100 opacity-0",
            )}
          />

          {soldOut ? <div className="absolute inset-0 bg-ink/55" /> : null}
        </div>

        {/* Etiquetas sobre la fotografía */}
        <div className="pointer-events-none absolute left-0 top-0 flex flex-col items-start gap-px p-3">
          {soldOut ? (
            <span className="label-sm bg-ink/85 px-2 py-1.5 text-concrete">Agotado</span>
          ) : product.badge ? (
            <span
              className={clsx(
                "label-sm px-2 py-1.5",
                product.badge === "nuevo" ? "bg-rojo text-paper" : "bg-bone text-ink",
              )}
            >
              {product.badge}
            </span>
          ) : null}
          {!soldOut && stock <= 12 ? (
            <span className="label-sm bg-ink/85 px-2 py-1.5 text-bone">Quedan {stock}</span>
          ) : null}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => favorites.toggle(product.slug)}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
        className={clsx(
          "absolute right-2 top-2 p-2 transition-colors duration-300",
          isFavorite ? "text-rojo" : "text-bone/55 hover:text-bone",
        )}
      >
        <IconHeart className="h-4 w-4" filled={isFavorite} />
      </button>

      <div className={clsx("flex flex-1 flex-col gap-1 pt-3", compact ? "pb-1" : "pb-2")}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[0.95rem] font-medium leading-tight tracking-tight">
            <Link href={`/producto/${product.slug}`} className="link-draw">
              {product.name}
            </Link>
          </h3>
          <span className="font-mono text-[0.78rem] tabular-nums text-bone">{price(product.price)}</span>
        </div>

        {!compact ? (
          <p className="text-[0.78rem] leading-snug text-concrete">{product.subtitle}</p>
        ) : null}

        {!compact && product.colors.length > 1 ? (
          <div className="mt-2 flex items-center gap-1.5">
            {product.colors.map((option, i) => (
              <button
                key={option.id}
                type="button"
                onMouseEnter={() => setColorIndex(i)}
                onFocus={() => setColorIndex(i)}
                onClick={() => setColorIndex(i)}
                aria-label={`Ver en ${option.name}`}
                className={clsx(
                  "h-2.5 w-2.5 rounded-full border transition-all duration-300",
                  i === colorIndex ? "border-bone scale-110" : "border-bone/25",
                )}
                style={{ background: option.hex }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
