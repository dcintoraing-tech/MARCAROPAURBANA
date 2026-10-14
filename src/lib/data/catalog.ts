import type { Category, Collection, ShippingMethod, Coupon, PaymentMethod, Size } from "@/lib/types";
import { CONCRETE, HORA_MUERTA, RAW, SKATE, CITY, photo } from "./media";

export const CATEGORIES: Category[] = [
  {
    id: "cat-playeras",
    slug: "playeras",
    name: "Playeras",
    shortName: "Playeras",
    description:
      "Jersey pesado de 220 g, corte caído y cuello reforzado. La prenda que aguanta el lavado número cincuenta.",
    order: 1,
  },
  {
    id: "cat-hoodies",
    slug: "hoodies",
    name: "Hoodies",
    shortName: "Hoodies",
    description:
      "Con capucha, forro perchado y cordón plano. Pensadas para traerse puestas de noviembre a marzo.",
    order: 2,
  },
  {
    id: "cat-sudaderas",
    slug: "sudaderas",
    name: "Sudaderas",
    shortName: "Sudaderas",
    description:
      "Cuello redondo, sin capucha, hombro caído. El término medio entre la playera y el abrigo.",
    order: 3,
  },
  {
    id: "cat-pantalones",
    slug: "pantalones",
    name: "Pantalones",
    shortName: "Pantalones",
    description: "Cargo, recto y de taller. Tiro alto, bastilla ancha, bolsas que sirven.",
    order: 4,
  },
  {
    id: "cat-chamarras",
    slug: "chamarras",
    name: "Chamarras",
    shortName: "Chamarras",
    description: "Capas exteriores en gabardina encerada y nylon mate. Series de menos de cien piezas.",
    order: 5,
  },
  {
    id: "cat-accesorios",
    slug: "accesorios",
    name: "Accesorios",
    shortName: "Accesorios",
    description: "Lo que completa el conjunto y cabe en una bolsa: gorros, gorras, calcetas.",
    order: 6,
  },
];

export const COLLECTIONS: Collection[] = [
  {
    id: "col-01",
    slug: "drop-01-hora-muerta",
    code: "DROP 01",
    name: "HORA MUERTA",
    tagline: "Entre las 3 y las 5 no hay nadie que te vea.",
    concept:
      "La ciudad tiene dos horas en las que no le pertenece a nadie. No queda tráfico, no ha salido el sol y la única luz es la del alumbrado. Esta serie se fotografió entera dentro de esa ventana.",
    story: [
      "Trabajamos catorce noches seguidas entre Doctores y Obrera, de tres a cinco de la mañana, con una cámara y un flash directo. Nadie posó: la gente salía de su turno o entraba al suyo.",
      "Las prendas se diseñaron para esa luz. Negro profundo que no se va a gris, serigrafía mate que no rebota el flash, reflejante sólo en la etiqueta trasera.",
      "Ciento ochenta piezas, numeradas a mano. Se agotó en once días y no vuelve.",
    ],
    releasedAt: "2025-03-21",
    pieces: 180,
    palette: [
      { name: "Negro 3am", hex: "#0B0B0C" },
      { name: "Hueso", hex: "#E9E5DD" },
      { name: "Alumbrado", hex: "#B8B2A4" },
    ],
    cover: HORA_MUERTA.hero,
    gallery: [
      HORA_MUERTA.figure01,
      HORA_MUERTA.backStreet,
      HORA_MUERTA.sign,
      HORA_MUERTA.figure03,
      CITY.wetStreet,
      HORA_MUERTA.profile,
    ],
    status: "archivada",
  },
  {
    id: "col-02",
    slug: "drop-02-concreto",
    code: "DROP 02",
    name: "CONCRETO",
    tagline: "La ciudad no se diseñó para ti. Aun así vives en ella.",
    concept:
      "Una serie sobre los edificios que todos odian y nadie demuele: multifamiliares, pasos a desnivel, estacionamientos. Gris sobre gris, con una sola costura roja por prenda.",
    story: [
      "Fotografiamos en cuatro conjuntos habitacionales construidos entre 1964 y 1979. Ninguno se ha remodelado.",
      "La paleta salió de ahí: cemento húmedo, cemento seco, la cal de las escaleras. La única nota de color es el pespunte rojo del bolsillo interior, que casi nunca se ve.",
      "Doscientas cuarenta piezas. Quedan pocas tallas.",
    ],
    releasedAt: "2025-11-07",
    pieces: 240,
    palette: [
      { name: "Cemento", hex: "#8B8B85" },
      { name: "Cal", hex: "#D6D2C8" },
      { name: "Sombra", hex: "#2A2A2C" },
    ],
    cover: CONCRETE.columns,
    gallery: [CONCRETE.stairs, CONCRETE.grid, CONCRETE.fin, CONCRETE.slab, CONCRETE.wall, CONCRETE.curve],
    status: "activa",
  },
  {
    id: "col-03",
    slug: "drop-03-crudo",
    code: "DROP 03",
    name: "CRUDO",
    tagline: "Sin lavar, sin suavizar, sin pedir permiso.",
    concept:
      "Tejidos sin tratamiento: denim crudo de 14 oz, algodón sin mercerizar, teñido en pieza. La prenda empieza dura y la termina quien la usa.",
    story: [
      "Nos cansamos de entregar prendas ya envejecidas de fábrica. En CRUDO todo sale como salió del telar: rígido, con el color parejo y sin una sola arruga falsa.",
      "A los seis meses no hay dos iguales. Ahí está el punto.",
      "Ciento veinte piezas. La serie cierra sola cuando se acaban.",
    ],
    releasedAt: "2026-09-29",
    pieces: 120,
    palette: [
      { name: "Crudo", hex: "#C9C2B2" },
      { name: "Índigo seco", hex: "#1E2630" },
      { name: "Rojo margen", hex: "#E2341D" },
    ],
    cover: RAW.shutter,
    gallery: [RAW.wallTags, SKATE.nightRoad, RAW.paint, SKATE.grind, RAW.arch, SKATE.plaza],
    status: "activa",
  },
];

/** Ciclo de lanzamientos: cada serie cierra 28 días después de la anterior. */
export const DROP_CYCLE_DAYS = 28;
export const DROP_ANCHOR = "2026-10-24T21:00:00-06:00";

/**
 * Fecha de cierre del drop vigente. Si la fecha ancla ya pasó, avanza por
 * ciclos completos para que el contador siga teniendo sentido.
 */
export function currentDropCloseISO(now: Date = new Date()): string {
  const anchor = new Date(DROP_ANCHOR);
  const cycle = DROP_CYCLE_DAYS * 24 * 60 * 60 * 1000;
  let t = anchor.getTime();
  while (t <= now.getTime()) t += cycle;
  return new Date(t).toISOString();
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "ship-standard",
    name: "Envío estándar",
    description: "Paquetería nacional con guía rastreable.",
    price: 14900,
    estimate: "3 a 6 días hábiles",
    freeOver: 150000,
  },
  {
    id: "ship-express",
    name: "Envío express",
    description: "Salida el mismo día si compras antes de las 13:00 h.",
    price: 29900,
    estimate: "1 a 2 días hábiles",
  },
];

export const FREE_SHIPPING_THRESHOLD = 150000;

export const COUPONS: Coupon[] = [
  {
    code: "MARGEN10",
    type: "porcentaje",
    value: 10,
    description: "10% en tu primer pedido",
  },
  {
    code: "HORAMUERTA",
    type: "envio",
    value: 100,
    minimum: 80000,
    description: "Envío sin costo desde $800",
  },
  {
    code: "CRUDO200",
    type: "monto",
    value: 20000,
    minimum: 180000,
    description: "$200 de descuento en compras desde $1,800",
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "tarjeta",
    name: "Tarjeta de crédito o débito",
    description: "Visa, Mastercard y American Express. Hasta 12 meses sin intereses.",
    integration: "stripe",
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    description: "Paga con tu saldo, tarjeta guardada o en efectivo.",
    integration: "mercadopago",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Te redirigimos para autorizar el cargo.",
    integration: "paypal",
  },
];

/* ── Guía de tallas ───────────────────────────────────────────────────── */

export interface SizeChart {
  id: string;
  label: string;
  unit: "cm";
  columns: { key: keyof Size; label: string }[];
  rows: Size[];
  note: string;
}

export const SIZE_CHARTS: Record<string, SizeChart> = {
  superior: {
    id: "superior",
    label: "Playeras, hoodies y sudaderas",
    unit: "cm",
    columns: [
      { key: "chest", label: "Pecho" },
      { key: "length", label: "Largo" },
      { key: "sleeve", label: "Manga" },
    ],
    rows: [
      { code: "XS", chest: 52, length: 66, sleeve: 20 },
      { code: "S", chest: 55, length: 69, sleeve: 21 },
      { code: "M", chest: 58, length: 72, sleeve: 22 },
      { code: "L", chest: 61, length: 74, sleeve: 23 },
      { code: "XL", chest: 64, length: 76, sleeve: 24 },
      { code: "XXL", chest: 67, length: 78, sleeve: 25 },
    ],
    note: "Medidas de la prenda extendida sobre la mesa, no del cuerpo. Corte caído: si estás entre dos tallas, la menor te queda holgada.",
  },
  inferior: {
    id: "inferior",
    label: "Pantalones",
    unit: "cm",
    columns: [
      { key: "waist", label: "Cintura" },
      { key: "inseam", label: "Entrepierna" },
      { key: "length", label: "Largo total" },
    ],
    rows: [
      { code: "XS", waist: 72, inseam: 76, length: 102 },
      { code: "S", waist: 76, inseam: 77, length: 104 },
      { code: "M", waist: 81, inseam: 78, length: 106 },
      { code: "L", waist: 86, inseam: 79, length: 108 },
      { code: "XL", waist: 91, inseam: 80, length: 110 },
      { code: "XXL", waist: 97, inseam: 81, length: 112 },
    ],
    note: "El denim crudo cede entre 2 y 3 cm de cintura durante el primer mes.",
  },
};

export const LOOKBOOK_COVER = photo("1708533644414-5f2c34f8a30d", "tall");
