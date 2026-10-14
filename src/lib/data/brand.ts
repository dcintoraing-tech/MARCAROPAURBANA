/**
 * Identidad verbal de MARGEN.
 *
 * El nombre viene de las notas al margen: lo que alguien escribe fuera del
 * texto principal porque no cabía dentro. La marca entera se sostiene sobre
 * esa idea —el margen como el único lugar donde se escribe algo honesto— y de
 * ahí salen el logotipo (una línea de margen), el rojo de corrección y la
 * forma de hablar: corta, seca, sin adjetivos de catálogo.
 */

export const BRAND = {
  name: "MARGEN",
  legalName: "Margen Estudio S.A. de C.V.",
  domain: "margen.mx",
  handle: "@margen.mx",
  founded: 2021,
  city: "Ciudad de México",

  slogan: "Nada importante se escribió en el centro.",
  sloganShort: "Nada se escribió en el centro.",
  claim: "No hacemos ropa para encajar.",

  /** Tres frases que pueden rotar en navbar, tickers y etiquetas. */
  tickers: [
    "Nada importante se escribió en el centro",
    "Hecho en CDMX",
    "Series cortas, nunca repetidas",
    "El margen es el texto",
  ],

  concept:
    "Un margen es el espacio que el papel deja de sobra. Nadie lo diseña para ser leído y aun así es donde se escribe lo que de verdad se piensa. MARGEN hace ropa con esa lógica: prendas que no compiten por el centro, que se sostienen solas, que envejecen bien y que no necesitan explicarse.",

  story: [
    "MARGEN empezó en 2021 en un cuarto de la colonia Obrera con una serigrafía prestada y cuarenta piezas. No había plan de negocio: había una idea terca de que la ropa que se usa todos los días merece la misma atención que la que se usa una vez.",
    "Producimos en series cortas, numeradas y cerradas. Cuando un drop se termina, se termina: no hay reposición ni segunda tanda. Es una limitación que nos impusimos para no caer en lo mismo que criticamos —hacer mucho de algo que a nadie le importa—.",
    "Cortamos y cosemos en talleres de la Ciudad de México con gente a la que conocemos por su nombre. Pagamos a 15 días. Si eso encarece la prenda, encarece la prenda.",
  ],

  manifesto: [
    "No seguimos temporadas.",
    "No hacemos tallas que no vamos a surtir.",
    "No ponemos el logo más grande de lo necesario.",
    "No llamamos colaboración a un favor.",
    "Lo que no resiste tres años, no sale.",
  ],

  personality: [
    { word: "Terca", note: "Repetimos una idea hasta que queda bien." },
    { word: "Seca", note: "Hablamos como se habla en la calle, no como en un brief." },
    { word: "Limpia", note: "El ruido lo pone la ciudad, no la prenda." },
    { word: "Cercana", note: "Conocemos a quien cose y a quien compra." },
  ],

  /** Sistema cromático — se muestra tal cual en la página de marca. */
  palette: [
    { name: "Tinta", hex: "#09090A", use: "Fondo principal, prenda base" },
    { name: "Hueso", hex: "#E9E5DD", use: "Tipografía sobre tinta, papel de etiqueta" },
    { name: "Concreto", hex: "#8B8B85", use: "Texto secundario, datos técnicos" },
    { name: "Rojo margen", hex: "#E2341D", use: "Corrección, acento, nunca relleno" },
  ],

  typography: [
    {
      family: "Archivo",
      role: "Titulares",
      note: "Grotesca de asta estrecha. 800–900, interletraje negativo, siempre en caja alta.",
      sample: "MARGEN",
    },
    {
      family: "Instrument Serif",
      role: "Contrapunto editorial",
      note: "Itálica. Aparece una vez por sección, nunca dos.",
      sample: "al margen",
    },
    {
      family: "Space Mono",
      role: "Datos",
      note: "SKU, tallas, precios, fechas. Todo lo que es información y no voz.",
      sample: "MG—01—HM",
    },
  ],

  contact: {
    email: "hola@margen.mx",
    wholesale: "mayoreo@margen.mx",
    press: "prensa@margen.mx",
    studio: "Calle Bolívar 87, Obrera, CDMX",
  },

  social: {
    instagram: { label: "@margen.mx", url: "https://instagram.com" },
    tiktok: { label: "@margen.mx", url: "https://tiktok.com" },
  },
} as const;

/** Preguntas de la guía "¿cuál es mi talla?" y del pie de página. */
export const FAQ = [
  {
    q: "¿Cuánto tarda un pedido?",
    a: "De 2 a 4 días hábiles en CDMX y zona metropolitana. De 3 a 6 días al resto del país. Los drops se envían el día hábil siguiente al lanzamiento.",
  },
  {
    q: "¿Puedo cambiar la talla?",
    a: "Sí, dentro de los 30 días posteriores a la entrega, con la prenda sin usar y con etiqueta. El primer cambio por talla corre por nuestra cuenta.",
  },
  {
    q: "¿Reponen las piezas agotadas?",
    a: "No. Cada serie es cerrada y numerada. Lo que se acabó, se acabó.",
  },
  {
    q: "¿Dónde se produce?",
    a: "Corte, confección y serigrafía en talleres de la Ciudad de México. El algodón es mexicano y peruano según la prenda.",
  },
];
