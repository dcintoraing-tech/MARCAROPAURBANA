/**
 * Modelo de dominio de MARGEN.
 *
 * Estas interfaces son la fuente de verdad del catálogo y del flujo de compra.
 * Hoy se alimentan de archivos en `src/lib/data`; mañana, de Supabase (ver
 * `src/lib/repositories`). Los nombres de campo están pensados para mapear
 * 1:1 contra tablas SQL en snake_case sin renombrar nada en la UI.
 */

export type ID = string;
export type ISODate = string;

/* ──────────────────────────────── Catálogo ─────────────────────────────── */

export type SizeCode = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "UNI";

export interface Size {
  code: SizeCode;
  /** Medidas de la prenda en cm, no del cuerpo. */
  chest?: number;
  length?: number;
  sleeve?: number;
  waist?: number;
  inseam?: number;
}

export interface ColorOption {
  id: ID;
  name: string;
  /** Familia cromática para filtrar sin depender del nombre comercial. */
  family: "negro" | "blanco" | "gris" | "crudo" | "verde" | "rojo";
  hex: string;
  /** Un color puede tener su propia secuencia fotográfica. */
  images?: string[];
}

export interface Category {
  id: ID;
  slug: string;
  name: string;
  /** Plural corto para navegación. */
  shortName: string;
  description: string;
  order: number;
}

export interface Collection {
  id: ID;
  slug: string;
  /** DROP 01, DROP 02… */
  code: string;
  name: string;
  tagline: string;
  concept: string;
  /** Texto largo, 2–3 párrafos. */
  story: string[];
  releasedAt: ISODate;
  pieces: number;
  palette: { name: string; hex: string }[];
  cover: string;
  gallery: string[];
  status: "activa" | "archivada" | "proxima";
}

export interface InventoryEntry {
  size: SizeCode;
  colorId: ID;
  /** Unidades disponibles. 0 = agotado. */
  stock: number;
}

export interface Product {
  id: ID;
  slug: string;
  sku: string;
  name: string;
  /** Línea corta bajo el nombre en la cuadrícula. */
  subtitle: string;
  categoryId: ID;
  collectionId: ID;
  /** Precio en centavos MXN para evitar aritmética de punto flotante. */
  price: number;
  compareAtPrice?: number;
  currency: "MXN";
  description: string;
  /** Viñetas de ficha técnica. */
  details: string[];
  material: string;
  care: string[];
  fit: "oversize" | "regular" | "relaxed" | "boxy" | "unisex";
  origin: string;
  images: string[];
  colors: ColorOption[];
  sizes: SizeCode[];
  inventory: InventoryEntry[];
  tags: string[];
  /** Orden base de "más recientes". */
  releasedAt: ISODate;
  /** Métrica ficticia que alimenta el orden "más vendidos". */
  unitsSold: number;
  badge?: "nuevo" | "últimas piezas" | "agotado" | "edición limitada";
}

/* ───────────────────────────────── Carrito ─────────────────────────────── */

export interface CartItem {
  /** `${productId}:${colorId}:${size}` — identidad de la línea. */
  lineId: string;
  productId: ID;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: SizeCode;
  color: { id: ID; name: string; hex: string };
  quantity: number;
  sku: string;
}

export interface Coupon {
  code: string;
  type: "porcentaje" | "monto" | "envio";
  value: number;
  minimum?: number;
  description: string;
  expiresAt?: ISODate;
}

export interface ShippingMethod {
  id: ID;
  name: string;
  description: string;
  /** Centavos MXN. */
  price: number;
  estimate: string;
  freeOver?: number;
}

export type PaymentProvider = "tarjeta" | "paypal" | "mercadopago";

export interface PaymentMethod {
  id: PaymentProvider;
  name: string;
  description: string;
  /** Lo que habrá que implementar cuando entre el backend. */
  integration: "stripe" | "paypal" | "mercadopago";
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
}

/* ─────────────────────────── Clientes y pedidos ────────────────────────── */

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  interior?: string;
  city: string;
  state: string;
  postalCode: string;
  country: "MX";
  notes?: string;
}

export interface User {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  createdAt: ISODate;
  /** Acceso anticipado a drops. */
  newsletter: boolean;
  role: "cliente" | "staff" | "admin";
}

export type OrderStatus =
  | "pendiente"
  | "pagado"
  | "preparando"
  | "enviado"
  | "entregado"
  | "cancelado";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pendiente",
  "pagado",
  "preparando",
  "enviado",
  "entregado",
];

export interface Order {
  id: ID;
  /** MG-0001 */
  number: string;
  userId?: ID;
  email: string;
  items: CartItem[];
  address: Address;
  shippingMethodId: ID;
  paymentProvider: PaymentProvider;
  /** Referencia del PSP (payment intent de Stripe, preference de MP…). */
  paymentReference?: string;
  couponCode?: string;
  totals: CartTotals;
  status: OrderStatus;
  trackingNumber?: string;
  createdAt: ISODate;
  updatedAt: ISODate;
}

/* ─────────────────────────── Consultas de tienda ───────────────────────── */

export type SortKey = "recientes" | "precio-asc" | "precio-desc" | "vendidos";

export interface ProductQuery {
  categories?: string[];
  collections?: string[];
  sizes?: SizeCode[];
  colorFamilies?: string[];
  /** Centavos MXN. */
  priceMin?: number;
  priceMax?: number;
  search?: string;
  sort?: SortKey;
  onlyAvailable?: boolean;
}
