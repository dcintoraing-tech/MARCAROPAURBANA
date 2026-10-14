import { CITY, CONCRETE, HORA_MUERTA, RAW, SKATE } from "./media";

/**
 * Lookbook editorial. Cada toma puede llevar marcas sobre la fotografía que
 * apuntan a un producto: coordenadas en porcentaje para que funcionen igual en
 * cualquier recorte.
 */
export interface LookHotspot {
  productSlug: string;
  /** Porcentaje desde la izquierda y desde arriba. */
  x: number;
  y: number;
  label: string;
}

export interface Look {
  id: string;
  index: string;
  title: string;
  caption: string;
  location: string;
  time: string;
  image: string;
  /** Formato de la toma dentro de la retícula editorial. */
  span: "full" | "half" | "tall" | "wide";
  hotspots: LookHotspot[];
}

export interface LookbookChapter {
  collectionSlug: string;
  code: string;
  name: string;
  epigraph: string;
  looks: Look[];
}

export const LOOKBOOK: LookbookChapter[] = [
  {
    collectionSlug: "drop-01-hora-muerta",
    code: "DROP 01",
    name: "HORA MUERTA",
    epigraph:
      "Catorce noches, dos horas por noche. Nadie posó. La única dirección fue: camina como caminas siempre.",
    looks: [
      {
        id: "lk-01",
        index: "01",
        title: "Salida del turno",
        caption: "Hoodie Hora Muerta sobre playera del mismo drop. Capucha arriba porque hacía frío, no por la foto.",
        location: "Obrera, CDMX",
        time: "03:47",
        image: HORA_MUERTA.figure01,
        span: "tall",
        hotspots: [
          { productSlug: "hoodie-hora-muerta", x: 52, y: 44, label: "Hoodie Hora Muerta" },
          { productSlug: "gorro-margen", x: 50, y: 14, label: "Gorro Margen" },
        ],
      },
      {
        id: "lk-02",
        index: "02",
        title: "Bolívar esquina Fernández",
        caption: "Chamarra Perímetro cerrada hasta el cuello. El nylon no refleja el flash: eso costó tres pruebas de tela.",
        location: "Centro, CDMX",
        time: "04:12",
        image: HORA_MUERTA.jacket,
        span: "half",
        hotspots: [{ productSlug: "chamarra-perimetro", x: 48, y: 52, label: "Chamarra Perímetro" }],
      },
      {
        id: "lk-03",
        index: "03",
        title: "Letrero",
        caption: "La única fuente de luz es el anuncio. No se agregó nada en edición.",
        location: "Doctores, CDMX",
        time: "04:30",
        image: HORA_MUERTA.sign,
        span: "half",
        hotspots: [{ productSlug: "playera-hora-muerta", x: 46, y: 46, label: "Playera Hora Muerta" }],
      },
      {
        id: "lk-04",
        index: "04",
        title: "De espaldas",
        caption: "La serigrafía de la espalda a tamaño real. Mide 28 cm y está impresa a dos pasadas.",
        location: "Eje Central",
        time: "04:51",
        image: HORA_MUERTA.backStreet,
        span: "wide",
        hotspots: [
          { productSlug: "hoodie-ruido", x: 42, y: 40, label: "Hoodie Ruido" },
          { productSlug: "pantalon-cargo-nocturno", x: 44, y: 76, label: "Cargo Nocturno" },
        ],
      },
      {
        id: "lk-05",
        index: "05",
        title: "Perfil",
        caption: "Sudadera 03:47 con el bordado del puño visible. Hilo rojo sobre negro, 6 mm.",
        location: "Obrera, CDMX",
        time: "05:02",
        image: HORA_MUERTA.profile,
        span: "half",
        hotspots: [{ productSlug: "sudadera-0347", x: 50, y: 60, label: "Sudadera 03:47" }],
      },
      {
        id: "lk-06",
        index: "06",
        title: "Última toma",
        caption: "Cinco y cuarto. Ya había camiones. Se terminó la hora muerta.",
        location: "Calzada de Tlalpan",
        time: "05:15",
        image: CITY.wetStreet,
        span: "half",
        hotspots: [],
      },
    ],
  },
  {
    collectionSlug: "drop-02-concreto",
    code: "DROP 02",
    name: "CONCRETO",
    epigraph: "Cuatro conjuntos habitacionales, luz de mediodía, sin rebote. La sombra cae donde cae.",
    looks: [
      {
        id: "lk-07",
        index: "01",
        title: "Columnas",
        caption: "Hoodie Concreto en cemento. El gris de la prenda se buscó contra este muro exacto.",
        location: "Multifamiliar Juárez",
        time: "13:20",
        image: CONCRETE.columns,
        span: "tall",
        hotspots: [{ productSlug: "hoodie-concreto", x: 50, y: 50, label: "Hoodie Concreto" }],
      },
      {
        id: "lk-08",
        index: "02",
        title: "Escalera exterior",
        caption: "Sudadera Obrera y Pants Taller. El conjunto que más repetimos en el estudio.",
        location: "Tlatelolco",
        time: "14:05",
        image: CONCRETE.stairs,
        span: "half",
        hotspots: [
          { productSlug: "sudadera-obrera", x: 48, y: 40, label: "Sudadera Obrera" },
          { productSlug: "pants-taller", x: 50, y: 74, label: "Pants Taller" },
        ],
      },
      {
        id: "lk-09",
        index: "03",
        title: "Retícula",
        caption: "Playera Concreto teñida en pieza. Dos unidades de la misma talla, dos grises distintos.",
        location: "Unidad Independencia",
        time: "15:40",
        image: CONCRETE.grid,
        span: "half",
        hotspots: [{ productSlug: "playera-concreto", x: 52, y: 48, label: "Playera Concreto" }],
      },
      {
        id: "lk-10",
        index: "04",
        title: "Contraluz",
        caption: "Chamarra Contraluz con el forro de franela a la vista.",
        location: "Paso a desnivel, Eje 4",
        time: "17:55",
        image: CONCRETE.fin,
        span: "wide",
        hotspots: [{ productSlug: "chamarra-contraluz", x: 44, y: 52, label: "Chamarra Contraluz" }],
      },
    ],
  },
  {
    collectionSlug: "drop-03-crudo",
    code: "DROP 03",
    name: "CRUDO",
    epigraph: "Sin lavar, sin suavizar. Las prendas salieron del taller el mismo día de la sesión.",
    looks: [
      {
        id: "lk-11",
        index: "01",
        title: "Cortina",
        caption: "Playera Crudo 03 recién cortada. Todavía con el doblez de la caja.",
        location: "Mercado de Sonora",
        time: "19:10",
        image: RAW.shutter,
        span: "tall",
        hotspots: [{ productSlug: "playera-crudo-03", x: 50, y: 46, label: "Playera Crudo 03" }],
      },
      {
        id: "lk-12",
        index: "02",
        title: "Bajada",
        caption: "Pantalón Recto Crudo en su primera puesta. Sin un solo pliegue todavía.",
        location: "Deportivo Venustiano Carranza",
        time: "20:30",
        image: SKATE.nightRoad,
        span: "half",
        hotspots: [{ productSlug: "pantalon-recto-crudo", x: 50, y: 66, label: "Pantalón Recto Crudo" }],
      },
      {
        id: "lk-13",
        index: "03",
        title: "Trazo",
        caption: "Sudadera Crudo contra pintura fresca. El crudo del algodón contra el blanco del aerosol.",
        location: "Av. Chapultepec",
        time: "21:15",
        image: RAW.paint,
        span: "half",
        hotspots: [{ productSlug: "sudadera-crudo", x: 48, y: 44, label: "Sudadera Crudo" }],
      },
      {
        id: "lk-14",
        index: "04",
        title: "Cierre",
        caption: "Hoodie Ruido con el estampado en descarga. Ciento veinte piezas y se acaba.",
        location: "Plaza Tlaxcoaque",
        time: "22:40",
        image: SKATE.grind,
        span: "wide",
        hotspots: [{ productSlug: "hoodie-ruido", x: 40, y: 44, label: "Hoodie Ruido" }],
      },
    ],
  },
];

/** Feed social: mismo material, recorte cuadrado. */
export const SOCIAL_FEED = [
  { image: HORA_MUERTA.figure03, caption: "DROP 01 — 03:47", likes: "4,812" },
  { image: SKATE.grind, caption: "CRUDO en la calle", likes: "6,109" },
  { image: CONCRETE.grid, caption: "Unidad Independencia", likes: "3,540" },
  { image: HORA_MUERTA.flash, caption: "Flash directo, sin rebote", likes: "7,330" },
  { image: RAW.wallTags, caption: "Muro de la Obrera", likes: "2,994" },
  { image: SKATE.taxi, caption: "Esperando el verde", likes: "5,221" },
  { image: HORA_MUERTA.figure05, caption: "Gorro Margen", likes: "3,118" },
  { image: CITY.reflection, caption: "Llovió toda la noche", likes: "4,006" },
];
