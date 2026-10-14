"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUI } from "@/lib/store/ui";
import { search as searchProducts, allCategories } from "@/lib/repositories";
import { price } from "@/lib/format";
import { IconClose } from "@/components/ui/icons";
import { EASE } from "@/components/ui/motion-primitives";

const SUGGESTIONS = ["hoodie", "negra", "playera", "crudo", "cargo", "gorro", "concreto"];

export function SearchOverlay() {
  const { isOpen, close } = useUI();
  const open = isOpen("search");
  const [term, setTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const categories = useMemo(() => allCategories(), []);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 420);
      return () => clearTimeout(id);
    }
    setTerm("");
  }, [open]);

  const results = useMemo(() => searchProducts(term, 6), [term]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[110] overflow-y-auto bg-ink"
          role="dialog"
          aria-modal="true"
          aria-label="Buscar"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <div className="edge flex h-[62px] items-center justify-between border-b rule md:h-[70px]">
            <span className="label text-concrete">Buscar</span>
            <button type="button" onClick={close} aria-label="Cerrar búsqueda" className="-mr-2 p-2 transition-colors hover:text-rojo">
              <IconClose className="h-5 w-5" />
            </button>
          </div>

          <div className="edge py-10 md:py-16">
            <label className="block border-b rule pb-5">
              <span className="sr-only">Buscar productos</span>
              <input
                ref={inputRef}
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="¿Qué buscas?"
                className="display w-full bg-transparent text-[2.2rem] leading-none outline-none placeholder:text-ash md:text-[4rem]"
              />
            </label>

            {!term ? (
              <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
                <div>
                  <p className="label mb-5 text-concrete">Búsquedas frecuentes</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setTerm(suggestion)}
                        className="label border rule px-4 py-2.5 transition-colors duration-300 hover:border-bone hover:bg-bone hover:text-ink"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="label mb-5 text-concrete">Categorías</p>
                  <ul className="grid grid-cols-2 gap-x-6">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/tienda?categoria=${category.slug}`}
                          onClick={close}
                          className="display block border-b rule py-3 text-xl transition-colors duration-300 hover:text-rojo"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="mt-8">
                <p className="label mb-6 text-concrete">
                  {results.length === 0
                    ? "Sin resultados"
                    : `${results.length} ${results.length === 1 ? "resultado" : "resultados"}`}
                </p>

                {results.length === 0 ? (
                  <p className="max-w-md text-sm text-concrete">
                    No encontramos nada con <span className="text-bone">“{term}”</span>. Prueba con el tipo de prenda
                    (hoodie, playera), un color o el nombre de una serie.
                  </p>
                ) : (
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
                    {results.map((product, index) => (
                      <motion.li
                        key={product.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: index * 0.04, ease: EASE }}
                      >
                        <Link href={`/producto/${product.slug}`} onClick={close} className="group block">
                          <div className="relative aspect-[3/4] overflow-hidden bg-carbon">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 50vw, 16vw"
                              className="ad-photo object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                          <p className="mt-3 text-sm leading-tight">{product.name}</p>
                          <p className="font-mono text-xs text-concrete">{price(product.price)}</p>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
