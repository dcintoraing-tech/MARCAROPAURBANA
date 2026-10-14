"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { clsx } from "clsx";
import type { Product, SizeCode } from "@/lib/types";
import { price } from "@/lib/format";
import { stockOf } from "@/lib/repositories";
import { useCart } from "@/lib/store/cart";
import { useFavorites } from "@/lib/store/favorites";
import { useUI } from "@/lib/store/ui";
import { Accordion } from "@/components/ui/primitives";
import { IconHeart } from "@/components/ui/icons";
import { SizeGuide } from "./SizeGuide";
import { EASE } from "@/components/ui/motion-primitives";

interface ProductDetailProps {
  product: Product;
  category: { name: string; slug: string };
  collection: { code: string; name: string; slug: string };
}

export function ProductDetail({ product, category, collection }: ProductDetailProps) {
  const router = useRouter();
  const cart = useCart();
  const favorites = useFavorites();
  const { open } = useUI();

  const [colorId, setColorId] = useState(product.colors[0].id);
  const [size, setSize] = useState<SizeCode | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [guide, setGuide] = useState<null | "tabla" | "calculadora">(null);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
  const images = useMemo(
    () => (color.images?.length ? color.images : product.images),
    [color, product.images],
  );

  const stock = size ? stockOf(product, size, color.id) : 0;
  const chartId = product.categoryId === "cat-pantalones" ? "inferior" : "superior";
  const isFavorite = favorites.has(product.slug);
  const unitaria = product.sizes.length === 1 && product.sizes[0] === "UNI";

  const addToCart = () => {
    if (!size) {
      setSizeError(true);
      return;
    }
    cart.add({ product, size, colorId: color.id, quantity });
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 2200);
    open("cart");
  };

  const buyNow = () => {
    if (!size) {
      setSizeError(true);
      return;
    }
    cart.add({ product, size, colorId: color.id, quantity });
    router.push("/checkout");
  };

  return (
    <>
      <div className="edge grid gap-10 pb-20 pt-8 lg:grid-cols-[1.25fr_1fr] lg:gap-14 lg:pt-12 xl:gap-20">
        <Gallery images={images} name={product.name} />

        {/* Columna de compra */}
        <div className="lg:sticky lg:top-[100px] lg:self-start lg:pb-10">
          <nav aria-label="Ruta" className="label-sm mb-6 flex flex-wrap items-center gap-2 text-ash">
            <Link href="/tienda" className="hover:text-bone">
              Tienda
            </Link>
            <span aria-hidden>/</span>
            <Link href={`/tienda?categoria=${category.slug}`} className="hover:text-bone">
              {category.name}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-concrete">{product.name}</span>
          </nav>

          <div className="flex items-start justify-between gap-6">
            <div>
              <Link href={`/colecciones/${collection.slug}`} className="label text-rojo hover:underline">
                {collection.code} — {collection.name}
              </Link>
              <h1 className="display mt-3 text-[clamp(2rem,5.5vw,3.2rem)] leading-[0.9]">{product.name}</h1>
              <p className="serif-it mt-2.5 text-xl text-concrete">{product.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => favorites.toggle(product.slug)}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
              className={clsx("shrink-0 p-2 transition-colors", isFavorite ? "text-rojo" : "text-concrete hover:text-bone")}
            >
              <IconHeart className="h-5 w-5" filled={isFavorite} />
            </button>
          </div>

          <div className="mt-6 flex items-baseline gap-4">
            <span className="font-mono text-2xl tabular-nums">{price(product.price)}</span>
            {product.compareAtPrice ? (
              <span className="font-mono text-sm tabular-nums text-ash line-through">
                {price(product.compareAtPrice)}
              </span>
            ) : null}
            <span className="label-sm text-ash">MXN · impuestos incluidos</span>
          </div>

          <p className="mt-7 max-w-[52ch] text-[0.95rem] leading-relaxed text-concrete">{product.description}</p>

          {/* Color */}
          <div className="mt-9">
            <div className="mb-3.5 flex items-baseline justify-between">
              <span className="label text-concrete">Color</span>
              <span className="label text-bone">{color.name}</span>
            </div>
            <div className="flex gap-2.5">
              {product.colors.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setColorId(option.id)}
                  aria-pressed={option.id === colorId}
                  aria-label={option.name}
                  className={clsx(
                    "h-8 w-8 rounded-full border transition-all duration-300",
                    option.id === colorId
                      ? "border-bone ring-1 ring-bone ring-offset-4 ring-offset-ink"
                      : "border-bone/25 hover:border-bone/60",
                  )}
                  style={{ background: option.hex }}
                />
              ))}
            </div>
          </div>

          {/* Talla */}
          <div className="mt-8">
            <div className="mb-3.5 flex items-baseline justify-between">
              <span className="label text-concrete">{unitaria ? "Talla única" : "Talla"}</span>
              <button
                type="button"
                onClick={() => setGuide("tabla")}
                className="label text-bone underline decoration-bone/30 underline-offset-4 hover:text-rojo"
              >
                Guía de tallas
              </button>
            </div>

            <div className={clsx("grid gap-1.5", unitaria ? "grid-cols-3" : "grid-cols-6")}>
              {product.sizes.map((option) => {
                const available = stockOf(product, option, color.id) > 0;
                const selected = size === option;
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={!available}
                    onClick={() => {
                      setSize(option);
                      setSizeError(false);
                    }}
                    aria-pressed={selected}
                    className={clsx(
                      "label relative border py-3.5 transition-colors duration-300",
                      selected
                        ? "border-bone bg-bone text-ink"
                        : available
                          ? "rule hover:border-bone"
                          : "cursor-not-allowed border-bone/8 text-ash",
                    )}
                  >
                    {option}
                    {!available ? (
                      <span aria-hidden className="absolute inset-0 flex items-center justify-center">
                        <span className="h-px w-full rotate-[-24deg] bg-bone/20" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex min-h-5 items-center justify-between">
              {sizeError ? (
                <span className="label-sm text-rojo">Elige una talla para continuar</span>
              ) : size && stock > 0 && stock <= 5 ? (
                <span className="label-sm text-rojo">Quedan {stock} en {color.name.toLowerCase()}</span>
              ) : size ? (
                <span className="label-sm text-concrete">Disponible · envío en 24 h</span>
              ) : (
                <span className="label-sm text-ash">Selecciona tu talla</span>
              )}
              <button
                type="button"
                onClick={() => setGuide("calculadora")}
                className="label-sm text-concrete underline underline-offset-4 hover:text-bone"
              >
                ¿Cuál es mi talla?
              </button>
            </div>
          </div>

          {/* Cantidad y compra */}
          <div className="mt-8 flex items-stretch gap-3">
            <div className="flex items-center border rule">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-4 transition-colors hover:text-rojo"
                aria-label="Quitar una unidad"
              >
                −
              </button>
              <span className="min-w-8 text-center font-mono text-sm tabular-nums">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(Math.max(stock, 1), q + 1))}
                disabled={size ? quantity >= stock : false}
                className="px-4 py-4 transition-colors hover:text-rojo disabled:opacity-30"
                aria-label="Agregar una unidad"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={addToCart}
              className="label relative flex-1 overflow-hidden bg-bone py-4 text-ink transition-colors duration-500 hover:bg-rojo hover:text-paper"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={added ? "added" : "add"}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="block"
                >
                  {added ? "Agregado" : "Agregar al carrito"}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          <button
            type="button"
            onClick={buyNow}
            className="label mt-2.5 w-full border rule py-4 transition-colors duration-500 hover:border-bone hover:bg-bone hover:text-ink"
          >
            Comprar ahora
          </button>

          {/* Ficha técnica */}
          <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-4 border-t rule pt-6">
            <div>
              <dt className="label-sm text-concrete">SKU</dt>
              <dd className="mt-1.5 font-mono text-sm">{product.sku}</dd>
            </div>
            <div>
              <dt className="label-sm text-concrete">Corte</dt>
              <dd className="mt-1.5 text-sm capitalize">{product.fit}</dd>
            </div>
            <div>
              <dt className="label-sm text-concrete">Material</dt>
              <dd className="mt-1.5 text-sm">{product.material}</dd>
            </div>
            <div>
              <dt className="label-sm text-concrete">Origen</dt>
              <dd className="mt-1.5 text-sm">{product.origin}</dd>
            </div>
          </dl>

          <Accordion
            className="mt-8"
            items={[
              {
                title: "Material y construcción",
                content: (
                  <ul className="space-y-2">
                    {product.details.map((detail) => (
                      <li key={detail} className="flex gap-3">
                        <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-rojo" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                title: "Envíos",
                content: (
                  <p>
                    Envío estándar sin costo en pedidos desde $1,500. CDMX y zona metropolitana en 2 a 4 días hábiles;
                    resto del país en 3 a 6. El express sale el mismo día si compras antes de las 13:00 h.
                  </p>
                ),
              },
              {
                title: "Cambios y devoluciones",
                content: (
                  <p>
                    30 días para cambiar de talla con la prenda sin usar y con etiqueta. El primer cambio por talla
                    corre por nuestra cuenta. Las piezas de serie cerrada sólo admiten cambio por la misma referencia
                    mientras haya existencia.
                  </p>
                ),
              },
              {
                title: "Cuidados",
                content: (
                  <ul className="space-y-2">
                    {product.care.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ),
              },
            ]}
          />
        </div>
      </div>

      <SizeGuide
        open={guide !== null}
        initialTab={guide ?? "tabla"}
        onClose={() => setGuide(null)}
        chartId={chartId}
        onPick={(picked) => {
          setSize(picked);
          setSizeError(false);
        }}
      />
    </>
  );
}

/* ── Galería ──────────────────────────────────────────────────────────── */

function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Escritorio: columna continua con miniaturas fijas */}
      <div className="hidden gap-4 lg:flex">
        <div className="flex w-20 shrink-0 flex-col gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver imagen ${index + 1}`}
              className={clsx(
                "relative aspect-[3/4] overflow-hidden border transition-colors duration-300",
                active === index ? "border-bone" : "border-transparent opacity-55 hover:opacity-100",
              )}
            >
              <Image src={image} alt="" fill sizes="80px" className="ad-photo object-cover" />
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-carbon">
            <AnimatePresence mode="wait">
              <motion.div
                key={images[active]}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="absolute inset-0"
              >
                <Image
                  src={images[active]}
                  alt={`${name} — vista ${active + 1}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="ad-photo object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Móvil y tableta: carrusel con ajuste */}
      <div className="lg:hidden">
        <ul
          className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5"
          onScroll={(event) => {
            const node = event.currentTarget;
            setActive(Math.round(node.scrollLeft / (node.clientWidth * 0.86)));
          }}
        >
          {images.map((image, index) => (
            <li key={image} className="relative aspect-[3/4] w-[86%] shrink-0 snap-center bg-carbon">
              <Image
                src={image}
                alt={`${name} — vista ${index + 1}`}
                fill
                priority={index === 0}
                sizes="86vw"
                className="ad-photo object-cover"
              />
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center gap-1.5">
          {images.map((image, index) => (
            <span
              key={image}
              className={clsx(
                "h-px flex-1 transition-colors duration-300",
                index === active ? "bg-bone" : "bg-bone/20",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
