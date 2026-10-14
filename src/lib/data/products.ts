import type { ColorOption, InventoryEntry, Product, SizeCode } from "@/lib/types";
import { CITY, CONCRETE, GARMENT, HORA_MUERTA, RAW, SKATE } from "./media";

/* ── Colores del sistema ──────────────────────────────────────────────── */

const NEGRO: ColorOption = { id: "negro", name: "Negro 3am", family: "negro", hex: "#0B0B0C" };
const HUESO: ColorOption = { id: "hueso", name: "Hueso", family: "blanco", hex: "#E9E5DD" };
const CEMENTO: ColorOption = { id: "cemento", name: "Cemento", family: "gris", hex: "#8B8B85" };
const CRUDO: ColorOption = { id: "crudo", name: "Crudo", family: "crudo", hex: "#C9C2B2" };
const INDIGO: ColorOption = { id: "indigo", name: "Índigo seco", family: "verde", hex: "#1E2630" };
const ROJO: ColorOption = { id: "rojo", name: "Rojo margen", family: "rojo", hex: "#E2341D" };

const TALLAS: SizeCode[] = ["XS", "S", "M", "L", "XL", "XXL"];
const TALLA_UNICA: SizeCode[] = ["UNI"];

/**
 * Existencias deterministas: la misma combinación siempre devuelve el mismo
 * número. Permite que algunas tallas aparezcan agotadas sin inventar una lista
 * a mano por producto —cuando entre el backend, esto lo sustituye la tabla
 * `inventory`—.
 */
function stockFor(sku: string, size: SizeCode, colorId: string): number {
  const seed = `${sku}|${size}|${colorId}`;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const n = Math.abs(h) % 100;
  if (n < 11) return 0;
  if (n < 24) return 1 + (n % 3);
  return 4 + (n % 14);
}

function buildInventory(sku: string, sizes: SizeCode[], colors: ColorOption[]): InventoryEntry[] {
  return colors.flatMap((color) =>
    sizes.map((size) => ({ size, colorId: color.id, stock: stockFor(sku, size, color.id) })),
  );
}

type Seed = Omit<Product, "inventory" | "currency"> & { inventory?: InventoryEntry[] };

function build(seed: Seed): Product {
  return {
    ...seed,
    currency: "MXN",
    inventory: seed.inventory ?? buildInventory(seed.sku, seed.sizes, seed.colors),
  };
}

const CUIDADOS_ALGODON = [
  "Lavar a máquina en frío, del revés, con prendas de color similar.",
  "No usar blanqueador ni suavizante: apelmazan la serigrafía.",
  "Secar a la sombra. La secadora encoge el algodón sin preencoger.",
  "Planchar del revés, nunca sobre el estampado.",
];

const CUIDADOS_DENIM = [
  "Las primeras diez puestas, sin lavar. El denim crudo necesita marcarse.",
  "Lavar a mano en frío, del revés, sin detergente enzimático.",
  "Colgar a secar de la pretina. No retorcer.",
  "Destiñe. Esa es la idea.",
];

export const PRODUCTS: Product[] = [
  /* ── Playeras ──────────────────────────────────────────────────────── */
  build({
    id: "p-01",
    slug: "playera-hora-muerta",
    sku: "MG-HM-TEE-01",
    name: "Playera Hora Muerta",
    subtitle: "Serigrafía mate a dos tintas",
    categoryId: "cat-playeras",
    collectionId: "col-01",
    price: 74900,
    description:
      "La playera con la que abrió la marca. Jersey de 220 g tejido en Puebla, cuello de dos agujas que no se vence y una serigrafía mate en la espalda con el horario exacto en el que se fotografió la serie.",
    details: [
      "Corte caído, hombro bajo",
      "Cuello reforzado de 2 cm",
      "Serigrafía a dos tintas en espalda",
      "Etiqueta tejida en costado",
    ],
    material: "100% algodón peinado 220 g/m²",
    care: CUIDADOS_ALGODON,
    fit: "oversize",
    origin: "Tejido en Puebla, confeccionado en CDMX",
    images: [GARMENT.teeHanging, GARMENT.teeFlat, HORA_MUERTA.figure01, GARMENT.teeBack],
    colors: [
      { ...NEGRO, images: [GARMENT.teeHanging, GARMENT.teeFlat, HORA_MUERTA.figure01] },
      { ...HUESO, images: [GARMENT.teeFlatHang, GARMENT.teeStreet, GARMENT.teeBack] },
    ],
    sizes: TALLAS,
    tags: ["playera", "negra", "serigrafía", "hora muerta", "básico"],
    releasedAt: "2025-03-21",
    unitsSold: 412,
    badge: "últimas piezas",
  }),
  build({
    id: "p-02",
    slug: "playera-nota-al-margen",
    sku: "MG-HM-TEE-02",
    name: "Playera Nota al Margen",
    subtitle: "Línea roja impresa en el canto",
    categoryId: "cat-playeras",
    collectionId: "col-01",
    price: 69900,
    description:
      "Lleva la línea de margen impresa en el costado derecho, de la axila a la bastilla. De frente no se ve: aparece cuando caminas.",
    details: [
      "Línea impresa de 4 mm en costado",
      "Bastilla doble",
      "Cuello tubular sin costura de hombro",
      "Numerada en etiqueta interior",
    ],
    material: "100% algodón peinado 210 g/m²",
    care: CUIDADOS_ALGODON,
    fit: "regular",
    origin: "Confeccionado en CDMX",
    images: [GARMENT.teeFlatHang, GARMENT.teePrint, GARMENT.teeStreet, CITY.lamp],
    colors: [
      { ...HUESO, images: [GARMENT.teeFlatHang, GARMENT.teeStreet] },
      { ...NEGRO, images: [GARMENT.teePrint, GARMENT.teeChain] },
    ],
    sizes: TALLAS,
    tags: ["playera", "blanca", "hueso", "línea", "minimal"],
    releasedAt: "2025-04-02",
    unitsSold: 388,
  }),
  build({
    id: "p-03",
    slug: "playera-concreto",
    sku: "MG-CO-TEE-03",
    name: "Playera Concreto",
    subtitle: "Teñida en pieza, gris cemento",
    categoryId: "cat-playeras",
    collectionId: "col-02",
    price: 77900,
    description:
      "Teñida después de confeccionar, así que ninguna sale igual a otra. El gris tira a verde con la luz de la tarde y a azul con la del alumbrado.",
    details: [
      "Teñido en pieza (garment dyed)",
      "Variación de tono entre unidades",
      "Pespunte rojo en bolsillo interior",
      "Corte recto, largo 72 cm en M",
    ],
    material: "100% algodón 240 g/m², teñido en pieza",
    care: CUIDADOS_ALGODON,
    fit: "boxy",
    origin: "Confeccionado y teñido en CDMX",
    images: [GARMENT.teeType, GARMENT.teeChain, CONCRETE.wall, GARMENT.teeStreet],
    colors: [
      { ...CEMENTO, images: [GARMENT.teeType, CONCRETE.wall] },
      { ...NEGRO, images: [GARMENT.teeChain, GARMENT.teeStreet] },
    ],
    sizes: TALLAS,
    tags: ["playera", "gris", "cemento", "concreto", "teñido"],
    releasedAt: "2025-11-07",
    unitsSold: 254,
  }),
  build({
    id: "p-04",
    slug: "playera-crudo-03",
    sku: "MG-CR-TEE-04",
    name: "Playera Crudo 03",
    subtitle: "Algodón sin mercerizar",
    categoryId: "cat-playeras",
    collectionId: "col-03",
    price: 72900,
    description:
      "Algodón sin tratamiento: raspa un poco los primeros días y después se ablanda solo. El tejido deja ver la fibra a contraluz.",
    details: ["Algodón sin mercerizar", "Tejido abierto, 230 g", "Costuras vistas", "Sin estampado"],
    material: "100% algodón crudo 230 g/m²",
    care: CUIDADOS_ALGODON,
    fit: "relaxed",
    origin: "Confeccionado en CDMX",
    images: [GARMENT.teeBones, GARMENT.teeMask, RAW.shutter, GARMENT.teeFlat],
    colors: [
      { ...CRUDO, images: [GARMENT.teeBones, RAW.shutter] },
      { ...NEGRO, images: [GARMENT.teeMask, GARMENT.teeFlat] },
    ],
    sizes: TALLAS,
    tags: ["playera", "crudo", "natural", "sin estampado"],
    releasedAt: "2026-09-29",
    unitsSold: 96,
    badge: "nuevo",
  }),
  build({
    id: "p-05",
    slug: "playera-sin-firma",
    sku: "MG-BS-TEE-05",
    name: "Playera Sin Firma",
    subtitle: "Sin logo visible",
    categoryId: "cat-playeras",
    collectionId: "col-02",
    price: 64900,
    description:
      "No trae nombre por ningún lado. La única marca es la etiqueta tejida del cuello, y se puede cortar. Es la que más repetimos y la que menos presumimos.",
    details: ["Sin logotipo exterior", "Cuello tubular", "Jersey de 220 g", "Reposición permanente"],
    material: "100% algodón peinado 220 g/m²",
    care: CUIDADOS_ALGODON,
    fit: "regular",
    origin: "Confeccionado en CDMX",
    images: [GARMENT.teeFlat, GARMENT.teeHanging, GARMENT.teeStreet],
    colors: [
      { ...NEGRO, images: [GARMENT.teeFlat, GARMENT.teeHanging] },
      { ...HUESO, images: [GARMENT.teeFlatHang, GARMENT.teeStreet] },
      { ...CEMENTO, images: [GARMENT.teeType, CONCRETE.wall] },
    ],
    sizes: TALLAS,
    tags: ["playera", "básico", "sin logo", "negra", "blanca"],
    releasedAt: "2025-11-07",
    unitsSold: 601,
  }),

  /* ── Hoodies ───────────────────────────────────────────────────────── */
  build({
    id: "p-06",
    slug: "hoodie-hora-muerta",
    sku: "MG-HM-HOO-06",
    name: "Hoodie Hora Muerta",
    subtitle: "Felpa de 480 g, capucha forrada",
    categoryId: "cat-hoodies",
    collectionId: "col-01",
    price: 189000,
    compareAtPrice: 209000,
    description:
      "La pieza central del primer drop. Felpa francesa de 480 g, capucha de doble capa que se sostiene sola y bolsa canguro con fondo reforzado. En la espalda, el horario de la serie impreso en tinta mate.",
    details: [
      "Felpa francesa 480 g/m²",
      "Capucha de doble capa con cordón plano",
      "Puños y cintura acanalados 2x2",
      "Impresión reflejante en etiqueta trasera",
    ],
    material: "80% algodón, 20% poliéster reciclado — 480 g/m²",
    care: CUIDADOS_ALGODON,
    fit: "oversize",
    origin: "Confeccionado en CDMX",
    images: [HORA_MUERTA.figure01, GARMENT.hoodieBlackFront, GARMENT.hoodieBlackBack, HORA_MUERTA.figure03],
    colors: [
      { ...NEGRO, images: [HORA_MUERTA.figure01, GARMENT.hoodieBlackFront, GARMENT.hoodieBlackBack] },
      { ...CEMENTO, images: [GARMENT.hoodieGrey, GARMENT.hoodieHood, CONCRETE.stairs] },
    ],
    sizes: TALLAS,
    tags: ["hoodie", "negra", "capucha", "hora muerta", "felpa"],
    releasedAt: "2025-03-21",
    unitsSold: 523,
    badge: "edición limitada",
  }),
  build({
    id: "p-07",
    slug: "hoodie-capucha-doble",
    sku: "MG-CO-HOO-07",
    name: "Hoodie Capucha Doble",
    subtitle: "Dos capuchas, una encima de la otra",
    categoryId: "cat-hoodies",
    collectionId: "col-02",
    price: 209000,
    description:
      "Lleva dos capuchas montadas: la interior ajusta y la exterior cae. Es incómoda de describir y evidente en cuanto te la pones.",
    details: [
      "Doble capucha montada",
      "Felpa perchada 520 g",
      "Cremallera oculta en bolsa lateral",
      "Hombro caído 4 cm",
    ],
    material: "85% algodón, 15% poliéster — 520 g/m²",
    care: CUIDADOS_ALGODON,
    fit: "oversize",
    origin: "Confeccionado en CDMX",
    images: [GARMENT.hoodieHood, GARMENT.hoodieDark, GARMENT.hoodieFog, CONCRETE.stairs],
    colors: [
      { ...NEGRO, images: [GARMENT.hoodieDark, GARMENT.hoodieFog] },
      { ...CEMENTO, images: [GARMENT.hoodieHood, CONCRETE.stairs] },
    ],
    sizes: TALLAS,
    tags: ["hoodie", "capucha", "invierno", "oversize"],
    releasedAt: "2025-11-07",
    unitsSold: 287,
  }),
  build({
    id: "p-08",
    slug: "hoodie-concreto",
    sku: "MG-CO-HOO-08",
    name: "Hoodie Concreto",
    subtitle: "Gris cal con pespunte rojo",
    categoryId: "cat-hoodies",
    collectionId: "col-02",
    price: 179000,
    description:
      "El gris más claro que fuimos capaces de teñir sin que se vea sucio a la segunda puesta. Pespunte rojo en el interior de la bolsa: sólo lo ve quien la trae.",
    details: ["Felpa 460 g", "Pespunte rojo interior", "Cordón plano de algodón", "Bastilla recta"],
    material: "100% algodón 460 g/m²",
    care: CUIDADOS_ALGODON,
    fit: "relaxed",
    origin: "Confeccionado en CDMX",
    images: [GARMENT.hoodieGrey, GARMENT.hoodieWall, CONCRETE.grid, GARMENT.hoodieHood],
    colors: [
      { ...CEMENTO, images: [GARMENT.hoodieGrey, CONCRETE.grid] },
      { ...HUESO, images: [GARMENT.hoodieWall, GARMENT.hoodieBoxy] },
    ],
    sizes: TALLAS,
    tags: ["hoodie", "gris", "concreto", "cemento"],
    releasedAt: "2025-11-07",
    unitsSold: 341,
  }),
  build({
    id: "p-09",
    slug: "hoodie-ruido",
    sku: "MG-CR-HOO-09",
    name: "Hoodie Ruido",
    subtitle: "Estampado de interferencia al frente",
    categoryId: "cat-hoodies",
    collectionId: "col-03",
    price: 199000,
    description:
      "El estampado es una captura de interferencia de radio convertida a trama de un bit. Se imprimió en descarga, así que la tinta está dentro del tejido y no encima.",
    details: [
      "Estampado en descarga (discharge)",
      "Felpa cruda sin perchar",
      "Canalé grueso en puños",
      "120 piezas numeradas",
    ],
    material: "100% algodón crudo 500 g/m²",
    care: CUIDADOS_ALGODON,
    fit: "oversize",
    origin: "Serigrafía e hilado en CDMX",
    images: [GARMENT.hoodieWoman, GARMENT.hoodieAlley, GARMENT.hoodie889, SKATE.plaza],
    colors: [
      { ...NEGRO, images: [GARMENT.hoodieWoman, GARMENT.hoodie889] },
      { ...CRUDO, images: [GARMENT.hoodieBoxy, RAW.arch] },
    ],
    sizes: TALLAS,
    tags: ["hoodie", "estampado", "crudo", "negra", "limitada"],
    releasedAt: "2026-09-29",
    unitsSold: 74,
    badge: "nuevo",
  }),

  /* ── Sudaderas ─────────────────────────────────────────────────────── */
  build({
    id: "p-10",
    slug: "sudadera-crudo",
    sku: "MG-CR-SUD-10",
    name: "Sudadera Crudo",
    subtitle: "Cuello redondo, sin tratamiento",
    categoryId: "cat-sudaderas",
    collectionId: "col-03",
    price: 159000,
    description:
      "Cuello redondo clásico en felpa cruda. Se siente áspera el primer mes y después se vuelve la prenda que no te quitas.",
    details: ["Cuello acanalado reforzado con cinta", "Felpa cruda 460 g", "Sin estampado", "Corte recto"],
    material: "100% algodón crudo 460 g/m²",
    care: CUIDADOS_ALGODON,
    fit: "boxy",
    origin: "Confeccionado en CDMX",
    images: [GARMENT.hoodieBoxy, GARMENT.hoodieSit, RAW.paint, GARMENT.hoodieStreet],
    colors: [
      { ...CRUDO, images: [GARMENT.hoodieBoxy, RAW.paint] },
      { ...NEGRO, images: [GARMENT.hoodieSit, GARMENT.hoodieStreet] },
    ],
    sizes: TALLAS,
    tags: ["sudadera", "crewneck", "crudo", "sin estampado"],
    releasedAt: "2026-09-29",
    unitsSold: 112,
    badge: "nuevo",
  }),
  build({
    id: "p-11",
    slug: "sudadera-0347",
    sku: "MG-HM-SUD-11",
    name: "Sudadera 03:47",
    subtitle: "La hora bordada en el puño",
    categoryId: "cat-sudaderas",
    collectionId: "col-01",
    price: 169000,
    description:
      "03:47 es la hora de la fotografía que abrió el primer drop. Va bordada en hilo rojo en el puño izquierdo, en 6 mm.",
    details: ["Bordado en puño izquierdo", "Felpa perchada 480 g", "Hombro caído", "Cuello con cinta de refuerzo"],
    material: "80% algodón, 20% poliéster — 480 g/m²",
    care: CUIDADOS_ALGODON,
    fit: "oversize",
    origin: "Bordado y confección en CDMX",
    images: [GARMENT.hoodieStreet, HORA_MUERTA.figure04, GARMENT.hoodieGman, HORA_MUERTA.night],
    colors: [
      { ...NEGRO, images: [GARMENT.hoodieStreet, HORA_MUERTA.figure04] },
      { ...CEMENTO, images: [GARMENT.hoodieGman, CONCRETE.fin] },
    ],
    sizes: TALLAS,
    tags: ["sudadera", "bordado", "hora muerta", "negra"],
    releasedAt: "2025-03-21",
    unitsSold: 298,
  }),
  build({
    id: "p-12",
    slug: "sudadera-obrera",
    sku: "MG-CO-SUD-12",
    name: "Sudadera Obrera",
    subtitle: "Felpa pesada, corte de taller",
    categoryId: "cat-sudaderas",
    collectionId: "col-02",
    price: 149000,
    description:
      "Copiada de las sudaderas de trabajo de los años setenta que seguimos encontrando en el mercado de La Lagunilla. Mangas montadas rectas y cuerpo corto.",
    details: ["Manga montada recta", "Cuerpo corto, 68 cm en M", "Felpa 500 g", "Codera reforzada"],
    material: "100% algodón 500 g/m²",
    care: CUIDADOS_ALGODON,
    fit: "regular",
    origin: "Confeccionado en CDMX",
    images: [GARMENT.hoodieWall, GARMENT.hoodieGman, CONCRETE.slab, GARMENT.hoodieSit],
    colors: [
      { ...CEMENTO, images: [GARMENT.hoodieWall, CONCRETE.slab] },
      { ...NEGRO, images: [GARMENT.hoodieGman, GARMENT.hoodieSit] },
    ],
    sizes: TALLAS,
    tags: ["sudadera", "crewneck", "gris", "trabajo"],
    releasedAt: "2025-11-07",
    unitsSold: 376,
  }),

  /* ── Pantalones ────────────────────────────────────────────────────── */
  build({
    id: "p-13",
    slug: "pantalon-cargo-nocturno",
    sku: "MG-HM-PAN-13",
    name: "Pantalón Cargo Nocturno",
    subtitle: "Seis bolsas, bastilla ancha",
    categoryId: "cat-pantalones",
    collectionId: "col-01",
    price: 189000,
    description:
      "Gabardina de algodón encerada en seco: repele la llovizna sin volverse impermeable de plástico. Las bolsas laterales caben una cartera y un teléfono grande sin colgarse.",
    details: ["Seis bolsas funcionales", "Encerado en seco", "Tiro alto, bastilla de 24 cm", "Cordón interior en tobillo"],
    material: "98% algodón, 2% elastano — gabardina 320 g",
    care: [
      "Lavar a máquina en frío, ciclo corto.",
      "No usar secadora: el encerado se degrada con el calor.",
      "Reencerar una vez al año si se usa a diario.",
    ],
    fit: "relaxed",
    origin: "Confeccionado en León, Guanajuato",
    images: [GARMENT.pantsFigure, GARMENT.pantsDetail, GARMENT.pantsStairs, SKATE.deck],
    colors: [
      { ...NEGRO, images: [GARMENT.pantsFigure, GARMENT.pantsStairs] },
      { ...INDIGO, images: [GARMENT.pantsDetail, SKATE.deck] },
    ],
    sizes: TALLAS,
    tags: ["pantalón", "cargo", "negro", "bolsas"],
    releasedAt: "2025-03-21",
    unitsSold: 219,
  }),
  build({
    id: "p-14",
    slug: "pantalon-recto-crudo",
    sku: "MG-CR-PAN-14",
    name: "Pantalón Recto Crudo",
    subtitle: "Denim de 14 oz sin lavar",
    categoryId: "cat-pantalones",
    collectionId: "col-03",
    price: 199000,
    description:
      "Denim crudo de 14 onzas, orillo cerrado, sin una sola arruga de fábrica. Sale rígido. En seis meses tiene tus pliegues y los de nadie más.",
    details: ["Denim 14 oz con orillo", "Remaches de cobre sin recubrir", "Tiro medio-alto", "Corte recto desde la rodilla"],
    material: "100% algodón, denim crudo 14 oz",
    care: CUIDADOS_DENIM,
    fit: "regular",
    origin: "Tejido en Japón, confeccionado en CDMX",
    images: [GARMENT.pantsDetail, GARMENT.pantsBlack, GARMENT.pantsCrew, RAW.lot],
    colors: [
      { ...INDIGO, images: [GARMENT.pantsDetail, RAW.lot] },
      { ...NEGRO, images: [GARMENT.pantsBlack, GARMENT.pantsCrew] },
    ],
    sizes: TALLAS,
    tags: ["pantalón", "denim", "crudo", "índigo", "jeans"],
    releasedAt: "2026-09-29",
    unitsSold: 88,
    badge: "nuevo",
  }),
  build({
    id: "p-15",
    slug: "pants-taller",
    sku: "MG-CO-PAN-15",
    name: "Pants Taller",
    subtitle: "Jogger de felpa, puño elástico",
    categoryId: "cat-pantalones",
    collectionId: "col-02",
    price: 129000,
    description:
      "El pantalón que usamos en el taller. Felpa de 400 g, cintura con cordón plano y bolsa trasera con cierre para que no se caiga nada al agacharse.",
    details: ["Felpa 400 g", "Bolsa trasera con cierre", "Puño elástico", "Cordón plano teñido"],
    material: "80% algodón, 20% poliéster — 400 g/m²",
    care: CUIDADOS_ALGODON,
    fit: "relaxed",
    origin: "Confeccionado en CDMX",
    images: [GARMENT.pantsStairs, GARMENT.pantsCrew, CONCRETE.curve, GARMENT.pantsFigure],
    colors: [
      { ...NEGRO, images: [GARMENT.pantsStairs, GARMENT.pantsFigure] },
      { ...CEMENTO, images: [GARMENT.pantsCrew, CONCRETE.curve] },
    ],
    sizes: TALLAS,
    tags: ["pantalón", "jogger", "pants", "felpa"],
    releasedAt: "2025-11-07",
    unitsSold: 404,
  }),

  /* ── Chamarras ─────────────────────────────────────────────────────── */
  build({
    id: "p-16",
    slug: "chamarra-perimetro",
    sku: "MG-HM-CHA-16",
    name: "Chamarra Perímetro",
    subtitle: "Nylon mate, forro de malla",
    categoryId: "cat-chamarras",
    collectionId: "col-01",
    price: 329000,
    description:
      "Nylon mate sin brillo, cortado tipo bomber con cuello alto. Pesa poco y corta el aire, que es exactamente lo que se necesita en la ciudad a las cuatro de la mañana.",
    details: [
      "Nylon mate con tratamiento repelente",
      "Forro de malla transpirable",
      "Cierre de doble corredera",
      "Bolsa interior para documentos",
    ],
    material: "Exterior 100% nylon, forro 100% poliéster",
    care: [
      "Lavar a máquina en frío con bolsa de malla.",
      "No planchar: el nylon se marca de forma permanente.",
      "Secar colgada a la sombra.",
    ],
    fit: "regular",
    origin: "Confeccionado en CDMX",
    images: [HORA_MUERTA.jacket, HORA_MUERTA.dark, HORA_MUERTA.alley, CITY.crossing],
    colors: [
      { ...NEGRO, images: [HORA_MUERTA.jacket, HORA_MUERTA.dark] },
      { ...INDIGO, images: [HORA_MUERTA.alley, CITY.crossing] },
    ],
    sizes: TALLAS,
    tags: ["chamarra", "bomber", "nylon", "negra"],
    releasedAt: "2025-03-21",
    unitsSold: 141,
    badge: "últimas piezas",
  }),
  build({
    id: "p-17",
    slug: "chamarra-contraluz",
    sku: "MG-CO-CHA-17",
    name: "Chamarra Contraluz",
    subtitle: "Coach jacket en gabardina encerada",
    categoryId: "cat-chamarras",
    collectionId: "col-02",
    price: 289000,
    description:
      "Coach jacket de gabardina encerada con broches de presión y forro de franela. El encerado mancha un poco la primera semana: se asienta solo.",
    details: ["Gabardina encerada 340 g", "Forro de franela de algodón", "Broches de presión mate", "Bolsas de parche"],
    material: "Exterior 100% algodón encerado, forro 100% algodón",
    care: [
      "Cepillar en seco. No lavar a máquina.",
      "Limpieza en seco una vez por temporada.",
      "Reencerar cuando la tela deje de repeler.",
    ],
    fit: "relaxed",
    origin: "Confeccionado en CDMX",
    images: [HORA_MUERTA.stance, CONCRETE.fin, HORA_MUERTA.pose, CONCRETE.columns],
    colors: [
      { ...NEGRO, images: [HORA_MUERTA.stance, HORA_MUERTA.pose] },
      { ...CEMENTO, images: [CONCRETE.fin, CONCRETE.columns] },
    ],
    sizes: TALLAS,
    tags: ["chamarra", "coach", "encerada", "gabardina"],
    releasedAt: "2025-11-07",
    unitsSold: 97,
  }),

  /* ── Accesorios ────────────────────────────────────────────────────── */
  build({
    id: "p-18",
    slug: "gorro-margen",
    sku: "MG-BS-ACC-18",
    name: "Gorro Margen",
    subtitle: "Lana merino, etiqueta tejida",
    categoryId: "cat-accesorios",
    collectionId: "col-02",
    price: 54900,
    description:
      "Lana merino de grosor medio con doblez corto. No pica y no se estira después de la tercera puesta, que es el problema de todos los gorros baratos.",
    details: ["Lana merino extrafina", "Doblez corto de 5 cm", "Etiqueta tejida al frente", "Talla única"],
    material: "100% lana merino",
    care: ["Lavar a mano en frío con jabón neutro.", "Secar en plano, nunca colgado.", "No usar secadora."],
    fit: "unisex",
    origin: "Tejido en Tlaxcala",
    images: [GARMENT.beanieHand, GARMENT.beanieWorn, HORA_MUERTA.figure05, GARMENT.capDark],
    colors: [
      { ...NEGRO, images: [GARMENT.beanieHand, HORA_MUERTA.figure05] },
      { ...HUESO, images: [GARMENT.beanieWorn, GARMENT.capDark] },
      { ...ROJO, images: [GARMENT.beanieHand, GARMENT.beanieWorn] },
    ],
    sizes: TALLA_UNICA,
    tags: ["gorro", "beanie", "lana", "accesorio", "invierno"],
    releasedAt: "2025-11-07",
    unitsSold: 512,
  }),
  build({
    id: "p-19",
    slug: "gorra-nota",
    sku: "MG-BS-ACC-19",
    name: "Gorra Nota",
    subtitle: "Cinco paneles, visera curva",
    categoryId: "cat-accesorios",
    collectionId: "col-02",
    price: 64900,
    description:
      "Cinco paneles en gabardina lavada, visera curva de fábrica y cierre metálico. La línea de margen va bordada en el panel trasero.",
    details: ["Cinco paneles", "Visera precurvada", "Cierre metálico ajustable", "Bordado trasero"],
    material: "100% algodón gabardina lavada",
    care: ["Limpiar con paño húmedo.", "No lavar a máquina: deforma la visera."],
    fit: "unisex",
    origin: "Confeccionada en CDMX",
    images: [GARMENT.capBack, GARMENT.capDark, GARMENT.beanieWorn, SKATE.crew],
    colors: [
      { ...NEGRO, images: [GARMENT.capDark, SKATE.crew] },
      { ...CEMENTO, images: [GARMENT.capBack, GARMENT.beanieWorn] },
    ],
    sizes: TALLA_UNICA,
    tags: ["gorra", "cap", "accesorio", "bordado"],
    releasedAt: "2025-11-07",
    unitsSold: 333,
  }),
  build({
    id: "p-20",
    slug: "calcetas-margen",
    sku: "MG-BS-ACC-20",
    name: "Calcetas Margen",
    subtitle: "Par, canalé alto con línea roja",
    categoryId: "cat-accesorios",
    collectionId: "col-03",
    price: 34900,
    description:
      "Canalé alto con la línea de margen tejida —no impresa— en el costado. Algodón con refuerzo en talón y punta para que no se agujeren en un mes.",
    details: ["Tejido canalé alto", "Línea tejida en costado", "Refuerzo en talón y punta", "Se vende por par"],
    material: "75% algodón, 22% poliamida, 3% elastano",
    care: ["Lavar a máquina en frío.", "Secar a la sombra."],
    fit: "unisex",
    origin: "Tejidas en Aguascalientes",
    images: [GARMENT.sneakerDetail, GARMENT.sneakerStep, GARMENT.sneakerPair, GARMENT.sneakerCurb],
    colors: [
      { ...NEGRO, images: [GARMENT.sneakerDetail, GARMENT.sneakerStep] },
      { ...HUESO, images: [GARMENT.sneakerPair, GARMENT.sneakerCurb] },
    ],
    sizes: TALLA_UNICA,
    tags: ["calcetas", "accesorio", "par", "canalé"],
    releasedAt: "2026-09-29",
    unitsSold: 187,
    badge: "nuevo",
  }),
];
