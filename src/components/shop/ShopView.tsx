"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { clsx } from "clsx";
import type { Category, Collection, Product, ProductQuery, SizeCode, SortKey } from "@/lib/types";
import { queryProducts, ALL_SIZES, COLOR_FAMILIES } from "@/lib/repositories";
import { ProductCard } from "@/components/shop/ProductCard";
import { IconClose, IconFilter } from "@/components/ui/icons";
import { price } from "@/lib/format";
import { EASE } from "@/components/ui/motion-primitives";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio-asc", label: "Precio menor" },
  { value: "precio-desc", label: "Precio mayor" },
  { value: "vendidos", label: "Más vendidos" },
];

interface ShopViewProps {
  categories: Category[];
  collections: Collection[];
  bounds: { min: number; max: number };
}

/** Lee los filtros de la URL para que cualquier vista se pueda compartir. */
function useShopQuery(bounds: { min: number; max: number }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const list = useCallback((key: string) => params.get(key)?.split(",").filter(Boolean) ?? [], [params]);

  const query = useMemo<ProductQuery>(
    () => ({
      categories: list("categoria"),
      collections: list("serie"),
      sizes: list("talla") as SizeCode[],
      colorFamilies: list("color"),
      priceMax: params.get("max") ? Number(params.get("max")) : undefined,
      sort: (params.get("orden") as SortKey) ?? "recientes",
      onlyAvailable: params.get("disponible") === "1",
    }),
    [params, list],
  );

  const update = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
      const search = next.toString();
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const toggleIn = useCallback(
    (key: string, value: string) => {
      const current = list(key);
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      update(key, next.join(","));
    },
    [list, update],
  );

  const clear = useCallback(() => router.replace(pathname, { scroll: false }), [pathname, router]);

  const activeCount =
    (query.categories?.length ?? 0) +
    (query.collections?.length ?? 0) +
    (query.sizes?.length ?? 0) +
    (query.colorFamilies?.length ?? 0) +
    (query.priceMax && query.priceMax < bounds.max ? 1 : 0) +
    (query.onlyAvailable ? 1 : 0);

  return { query, update, toggleIn, clear, activeCount, list };
}

export function ShopView({ categories, collections, bounds }: ShopViewProps) {
  const { query, update, toggleIn, clear, activeCount, list } = useShopQuery(bounds);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const products = useMemo(() => queryProducts(query), [query]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const filters = (
    <FilterGroups
      categories={categories}
      collections={collections}
      bounds={bounds}
      query={query}
      list={list}
      update={update}
      toggleIn={toggleIn}
    />
  );

  return (
    <div className="pb-24">
      {/* Barra de control: a sangre, con el mismo margen tipográfico que el resto */}
      <div className="edge sticky top-[62px] z-40 flex items-center justify-between gap-4 border-b rule bg-ink/92 py-3 backdrop-blur-md md:top-[70px]">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="label flex items-center gap-2.5 transition-colors hover:text-rojo lg:hidden"
          >
            <IconFilter className="h-4 w-4" />
            Filtrar
            {activeCount > 0 ? <span className="text-rojo">({activeCount})</span> : null}
          </button>
          <span className="label hidden text-concrete lg:inline">
            {products.length} {products.length === 1 ? "pieza" : "piezas"}
          </span>
        </div>

        <label className="flex items-center gap-3">
          <span className="label hidden text-concrete sm:inline">Ordenar</span>
          <select
            value={query.sort}
            onChange={(event) => update("orden", event.target.value)}
            className="label cursor-pointer appearance-none bg-transparent pr-5 outline-none"
            style={{ backgroundImage: "none" }}
            aria-label="Ordenar productos"
          >
            {SORTS.map((option) => (
              <option key={option.value} value={option.value} className="bg-ink text-bone">
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="edge grid gap-10 pt-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
        {/* Sidebar de escritorio */}
        <aside className="hidden lg:block">
          <div className="sticky top-[140px] max-h-[calc(100svh-170px)] overflow-y-auto pr-2">
            <div className="mb-5 flex items-center justify-between">
              <span className="label text-concrete">Filtros</span>
              {activeCount > 0 ? (
                <button type="button" onClick={clear} className="label-sm text-rojo hover:underline">
                  Limpiar ({activeCount})
                </button>
              ) : null}
            </div>
            {filters}
          </div>
        </aside>

        {/* Cuadrícula */}
        <div>
          {products.length === 0 ? (
            <div className="border-t rule py-20">
              <p className="display text-3xl">Nada con esos filtros</p>
              <p className="mt-4 max-w-sm text-sm text-concrete">
                Las series son cortas y a veces no queda la combinación que buscas. Prueba quitando una talla o un
                color.
              </p>
              <button type="button" onClick={clear} className="label mt-7 border rule px-6 py-3.5 hover:bg-bone hover:text-ink">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
              {products.map((product, index) => (
                <li key={product.id}>
                  <ProductCard product={product} index={index} priority={index < 4} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Drawer móvil */}
      <AnimatePresence>
        {drawerOpen ? (
          <div className="fixed inset-0 z-[110] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
            <motion.button
              type="button"
              aria-label="Cerrar filtros"
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 h-full w-full bg-ink/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 flex max-h-[86svh] flex-col border-t rule bg-ink"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <header className="flex items-center justify-between border-b rule px-5 py-4">
                <span className="label">Filtros {activeCount > 0 ? `(${activeCount})` : ""}</span>
                <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Cerrar">
                  <IconClose className="h-5 w-5" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-5 py-2">{filters}</div>

              <footer className="flex gap-3 border-t rule px-5 py-4">
                <button type="button" onClick={clear} className="label flex-1 border rule py-3.5">
                  Limpiar
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="label flex-1 bg-bone py-3.5 text-ink"
                >
                  Ver {products.length}
                </button>
              </footer>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ── Grupos de filtro, compartidos por sidebar y drawer ──────────────── */

function FilterGroups({
  categories,
  collections,
  bounds,
  query,
  list,
  update,
  toggleIn,
}: {
  categories: Category[];
  collections: Collection[];
  bounds: { min: number; max: number };
  query: ProductQuery;
  list: (key: string) => string[];
  update: (key: string, value: string | null) => void;
  toggleIn: (key: string, value: string) => void;
}) {
  const maxValue = query.priceMax ?? bounds.max;

  return (
    <div className="space-y-7 pb-6">
      <FilterBlock title="Categoría">
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <Check
                checked={list("categoria").includes(category.slug)}
                onChange={() => toggleIn("categoria", category.slug)}
                label={category.name}
              />
            </li>
          ))}
        </ul>
      </FilterBlock>

      <FilterBlock title="Talla">
        <div className="flex flex-wrap gap-1.5">
          {ALL_SIZES.map((size) => {
            const active = list("talla").includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleIn("talla", size)}
                aria-pressed={active}
                className={clsx(
                  "label border px-3 py-2 transition-colors duration-300",
                  active ? "border-bone bg-bone text-ink" : "rule hover:border-bone",
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterBlock>

      <FilterBlock title="Color">
        <ul className="space-y-2">
          {COLOR_FAMILIES.map((color) => {
            const active = list("color").includes(color.id);
            return (
              <li key={color.id}>
                <button
                  type="button"
                  onClick={() => toggleIn("color", color.id)}
                  aria-pressed={active}
                  className="flex w-full items-center gap-3 py-0.5 text-left"
                >
                  <span
                    className={clsx(
                      "h-3.5 w-3.5 rounded-full border transition-all",
                      active ? "border-bone ring-1 ring-bone ring-offset-2 ring-offset-ink" : "border-bone/25",
                    )}
                    style={{ background: color.hex }}
                  />
                  <span className={clsx("text-sm", active ? "text-bone" : "text-concrete")}>{color.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </FilterBlock>

      <FilterBlock title="Precio">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="label-sm text-concrete">{price(bounds.min)}</span>
            <span className="font-mono text-xs tabular-nums">{price(maxValue)}</span>
          </div>
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={5000}
            value={maxValue}
            onChange={(event) =>
              update("max", Number(event.target.value) >= bounds.max ? null : event.target.value)
            }
            aria-label="Precio máximo"
            className="h-1 w-full cursor-pointer appearance-none bg-bone/20 accent-rojo"
          />
        </div>
      </FilterBlock>

      <FilterBlock title="Serie">
        <ul className="space-y-2">
          {collections.map((collection) => (
            <li key={collection.id}>
              <Check
                checked={list("serie").includes(collection.slug)}
                onChange={() => toggleIn("serie", collection.slug)}
                label={`${collection.code} — ${collection.name}`}
              />
            </li>
          ))}
        </ul>
      </FilterBlock>

      <FilterBlock title="Disponibilidad">
        <Check
          checked={query.onlyAvailable ?? false}
          onChange={() => update("disponible", query.onlyAvailable ? null : "1")}
          label="Sólo disponibles"
        />
      </FilterBlock>
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t rule pt-4">
      <h3 className="label mb-3.5 text-concrete">{title}</h3>
      {children}
    </section>
  );
}

function Check({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" onClick={onChange} aria-pressed={checked} className="flex w-full items-center gap-3 text-left">
      <span
        className={clsx(
          "flex h-3.5 w-3.5 shrink-0 items-center justify-center border transition-colors duration-300",
          checked ? "border-bone bg-bone" : "border-bone/30",
        )}
      >
        {checked ? <span className="h-1.5 w-1.5 bg-ink" /> : null}
      </span>
      <span className={clsx("text-sm leading-tight", checked ? "text-bone" : "text-concrete")}>{label}</span>
    </button>
  );
}
