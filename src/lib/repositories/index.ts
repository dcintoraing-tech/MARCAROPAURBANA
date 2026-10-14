/**
 * Capa de acceso a datos.
 *
 * Todo lo que la interfaz necesita saber del catálogo pasa por aquí. Hoy la
 * fuente es un archivo estático; mañana es Supabase. Como las funciones ya son
 * asíncronas y devuelven los tipos del dominio, migrar significa reescribir el
 * cuerpo de estas funciones y nada más:
 *
 *   export async function getProducts(query) {
 *     const { data } = await supabase.from("products").select("*, colors(*), inventory(*)")…
 *     return data.map(toProduct);
 *   }
 */

import type { Category, Collection, Product, ProductQuery, SizeCode } from "@/lib/types";
import { PRODUCTS } from "@/lib/data/products";
import { CATEGORIES, COLLECTIONS } from "@/lib/data/catalog";

/* ── Lectura directa (síncrona) para render en servidor ──────────────── */

export function allProducts(): Product[] {
  return PRODUCTS;
}

export function allCategories(): Category[] {
  return [...CATEGORIES].sort((a, b) => a.order - b.order);
}

export function allCollections(): Collection[] {
  return COLLECTIONS;
}

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function collectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function categoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function collectionById(id: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.id === id);
}

export function productsByCollection(collectionId: string): Product[] {
  return PRODUCTS.filter((p) => p.collectionId === collectionId);
}

/* ── Disponibilidad ───────────────────────────────────────────────────── */

export function stockOf(product: Product, size: SizeCode, colorId: string): number {
  return product.inventory.find((i) => i.size === size && i.colorId === colorId)?.stock ?? 0;
}

export function availableSizes(product: Product, colorId: string): SizeCode[] {
  return product.sizes.filter((s) => stockOf(product, s, colorId) > 0);
}

export function totalStock(product: Product): number {
  return product.inventory.reduce((sum, i) => sum + i.stock, 0);
}

export function isSoldOut(product: Product): boolean {
  return totalStock(product) === 0;
}

/** Piezas restantes de una serie, para el contador del drop. */
export function remainingPieces(collectionId: string): number {
  return productsByCollection(collectionId).reduce((sum, p) => sum + totalStock(p), 0);
}

/* ── Consulta de tienda: filtros, orden y búsqueda ───────────────────── */

export function queryProducts(query: ProductQuery = {}): Product[] {
  const {
    categories,
    collections,
    sizes,
    colorFamilies,
    priceMin,
    priceMax,
    search,
    sort = "recientes",
    onlyAvailable,
  } = query;

  let result = [...PRODUCTS];

  if (categories?.length) {
    const ids = new Set(CATEGORIES.filter((c) => categories.includes(c.slug)).map((c) => c.id));
    result = result.filter((p) => ids.has(p.categoryId));
  }

  if (collections?.length) {
    const ids = new Set(COLLECTIONS.filter((c) => collections.includes(c.slug)).map((c) => c.id));
    result = result.filter((p) => ids.has(p.collectionId));
  }

  if (sizes?.length) {
    result = result.filter((p) =>
      sizes.some((s) => p.inventory.some((i) => i.size === s && i.stock > 0)),
    );
  }

  if (colorFamilies?.length) {
    result = result.filter((p) => p.colors.some((c) => colorFamilies.includes(c.family)));
  }

  if (typeof priceMin === "number") result = result.filter((p) => p.price >= priceMin);
  if (typeof priceMax === "number") result = result.filter((p) => p.price <= priceMax);

  if (onlyAvailable) result = result.filter((p) => !isSoldOut(p));

  if (search?.trim()) result = result.filter((p) => matchesSearch(p, search));

  switch (sort) {
    case "precio-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "precio-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "vendidos":
      result.sort((a, b) => b.unitsSold - a.unitsSold);
      break;
    default:
      result.sort((a, b) => +new Date(b.releasedAt) - +new Date(a.releasedAt));
  }

  return result;
}

/** Normaliza acentos para que "playera negra" encuentre "Playera Negra". */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function matchesSearch(product: Product, term: string): boolean {
  const words = normalize(term).split(/\s+/).filter(Boolean);
  if (!words.length) return true;

  const category = categoryById(product.categoryId)?.name ?? "";
  const collection = collectionById(product.collectionId);
  const haystack = normalize(
    [
      product.name,
      product.subtitle,
      product.description,
      product.material,
      product.sku,
      category,
      collection?.name ?? "",
      collection?.code ?? "",
      product.tags.join(" "),
      product.colors.map((c) => `${c.name} ${c.family}`).join(" "),
      product.fit,
    ].join(" "),
  );

  return words.every((w) => haystack.includes(w));
}

/** Resultados del buscador global, acotados. */
export function search(term: string, limit = 8): Product[] {
  if (!term.trim()) return [];
  return PRODUCTS.filter((p) => matchesSearch(p, term))
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, limit);
}

/**
 * "Combínalo con…": misma colección primero, nunca la misma categoría, y se
 * completa con los más vendidos si falta producto.
 */
export function pairsWith(product: Product, limit = 3): Product[] {
  const sameCollection = PRODUCTS.filter(
    (p) => p.id !== product.id && p.collectionId === product.collectionId && p.categoryId !== product.categoryId,
  );
  const rest = PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      p.categoryId !== product.categoryId &&
      !sameCollection.some((s) => s.id === p.id),
  ).sort((a, b) => b.unitsSold - a.unitsSold);

  return [...sameCollection, ...rest].slice(0, limit);
}

/* ── Rango de precios del catálogo, para el filtro ───────────────────── */

export function priceBounds(): { min: number; max: number } {
  const prices = PRODUCTS.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export const ALL_SIZES: SizeCode[] = ["XS", "S", "M", "L", "XL", "XXL", "UNI"];

export const COLOR_FAMILIES = [
  { id: "negro", name: "Negro", hex: "#0B0B0C" },
  { id: "blanco", name: "Hueso", hex: "#E9E5DD" },
  { id: "gris", name: "Cemento", hex: "#8B8B85" },
  { id: "crudo", name: "Crudo", hex: "#C9C2B2" },
  { id: "verde", name: "Índigo", hex: "#1E2630" },
  { id: "rojo", name: "Rojo", hex: "#E2341D" },
];
