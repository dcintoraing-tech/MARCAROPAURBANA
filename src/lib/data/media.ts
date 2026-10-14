/**
 * Fototeca de la campaña.
 *
 * Toda la producción vive aquí para que la dirección de arte se pueda auditar
 * de un vistazo: una sola serie, blanco y negro, flash de noche. Las imágenes
 * son material de referencia (Unsplash) para el prototipo; al sustituirlas por
 * la producción real sólo cambian estas constantes.
 */

const BASE = "https://images.unsplash.com/photo-";

type Crop = "portrait" | "square" | "wide" | "tall";

const RATIO: Record<Crop, { w: number; h: number }> = {
  portrait: { w: 1200, h: 1600 },
  square: { w: 1200, h: 1200 },
  wide: { w: 1800, h: 1012 },
  tall: { w: 1000, h: 1600 },
};

/** Construye la URL con recorte y compresión consistentes. */
export function photo(id: string, crop: Crop = "portrait") {
  const { w, h } = RATIO[crop];
  return `${BASE}${id}?auto=format&fit=crop&crop=entropy&w=${w}&h=${h}&q=72`;
}

/* ── Serie principal: DROP 01 "HORA MUERTA" ───────────────────────────── */
export const HORA_MUERTA = {
  hero: photo("1752674316405-549b77559eb3", "tall"),
  heroWide: photo("1752674316405-549b77559eb3", "wide"),
  masked: photo("1708533296434-e95a094f3fff"),
  figure01: photo("1708533477284-7f214548873b"),
  figure02: photo("1708533476212-de2c6c748ca2"),
  figure03: photo("1708533644703-c43549dbdadd"),
  figure04: photo("1708533644102-ac2905efb974"),
  figure05: photo("1708533644414-5f2c34f8a30d"),
  figure06: photo("1708533643337-afbfc999ebc6"),
  backStreet: photo("1770236512224-794bda74b28f"),
  profile: photo("1789938680760-5d630f611bc3"),
  sign: photo("1787527968941-224afe451819"),
  tunnel: photo("1774720433719-1f86d71cf977"),
  flash: photo("1572466040501-4d2415fcbb88"),
  jacket: photo("1760920527114-2958980d44d2"),
  dark: photo("1770236512224-794bda74b28f"),
  alley: photo("1788362773791-015176b45803"),
  pose: photo("1789343011598-ca61ed754d0b"),
  stance: photo("1790684669935-21740f394c82"),
  night: photo("1762052508072-04def56e34d1"),
};

/* ── Prendas ──────────────────────────────────────────────────────────── */
export const GARMENT = {
  hoodieBlackBack: photo("1609873814058-a8928924184a"),
  hoodieBlackFront: photo("1677538537484-324385aff147"),
  hoodieDark: photo("1586791400644-b04429f7d808"),
  hoodieHood: photo("1578768079052-aa76e52ff62e"),
  hoodieGrey: photo("1564557287817-3785e38ec1f5"),
  hoodieAlley: photo("1565978771542-0db9ab9ad3de"),
  hoodieWoman: photo("1633292750937-120a94f5c2bb"),
  hoodie889: photo("1611817757591-c3f345024273"),
  hoodieGman: photo("1656339504243-2df4c5ebf1c0"),
  hoodieFog: photo("1565986829115-4e19371ce860"),
  hoodieBoxy: photo("1746971054333-8b9610b397a5"),
  hoodieStreet: photo("1542406775-ade58c52d2e4"),
  hoodieWall: photo("1633292587737-f898a032e562"),
  hoodieSit: photo("1542327534-59a1fe8daf73"),

  teeHanging: photo("1583743814966-8936f5b7be1a"),
  teeFlat: photo("1618354691438-25bc04584c23"),
  teeFlatHang: photo("1618354691373-d851c5c3a990"),
  teePrint: photo("1627225925683-1da7021732ea"),
  teeBack: photo("1618453292459-53424b66bb6a"),
  teeBones: photo("1503341504253-dff4815485f1"),
  teeStreet: photo("1726140872004-850c80900ae3"),
  teeChain: photo("1683737082838-cdc2286dff91"),
  teeMask: photo("1618328198676-499703032285"),
  teeType: photo("1591390298153-a25494c924b8"),

  pantsFigure: photo("1660486044177-45cd45bb5e99"),
  pantsBlack: photo("1552902865-b72c031ac5ea"),
  pantsDetail: photo("1779040621437-f74e405f07d5"),
  pantsStairs: photo("1652845007844-5592b02b52e5"),
  pantsCrew: photo("1773235893614-eed521a99db5"),

  beanieHand: photo("1612887726773-e64e20cf08fe"),
  beanieWorn: photo("1691689761290-2641cf0fc59a"),
  capBack: photo("1574427797991-b086946fa9e7"),
  capDark: photo("1527413232440-2cf20e325d6a"),

  sneakerDetail: photo("1789581672431-4a6a30b00f06"),
  sneakerPair: photo("1784887879910-a93ffb442b9a"),
  sneakerStep: photo("1771502244768-a9671a764b2e"),
  sneakerCurb: photo("1764862199253-576faf7c7eb6"),
};

/* ── Ciudad, textura, lifestyle ───────────────────────────────────────── */
export const CITY = {
  rails: photo("1516900557549-41557d405adf", "wide"),
  wetStreet: photo("1642019341061-f81d61659c62", "tall"),
  reflection: photo("1571366657764-16ca342d3284", "wide"),
  avenue: photo("1585978075589-fc6561e20296", "tall"),
  storefront: photo("1608690158878-1a96b29b455b", "wide"),
  lamp: photo("1752486345389-ed3b299f34af", "tall"),
  crossing: photo("1513689559427-a303dfc617d2", "wide"),
  puddle: photo("1667228837240-eff7c55820e9", "tall"),
};

export const CONCRETE = {
  slab: photo("1536924491042-b0466800ce46", "wide"),
  columns: photo("1546414701-81cc6963c67f", "tall"),
  stairs: photo("1565626424178-c699f6601afd", "tall"),
  grid: photo("1595658511703-2cad160de181", "wide"),
  fin: photo("1591394197887-b27e1ba3b2f9", "tall"),
  curve: photo("1625308216182-218ff63d47bb", "wide"),
  wall: photo("1598138967311-98e4bdc1fea1", "tall"),
};

export const RAW = {
  wallTags: photo("1611063158871-7dd3ed4a2ac8", "wide"),
  shutter: photo("1494026222377-872a605b54ba", "tall"),
  tunnel: photo("1534162169564-158041fc3992", "wide"),
  paint: photo("1565476599063-a9b93037c7f0", "tall"),
  arch: photo("1581515290072-58a77ef204ec", "tall"),
  lot: photo("1620055672875-75bf8d19067f", "wide"),
};

export const SKATE = {
  nightRoad: photo("1609973794003-c8e39c41faaa", "tall"),
  grind: photo("1693036432242-1de0d9c70cf9", "wide"),
  deck: photo("1633359719539-c39fa4f2ddb1", "tall"),
  crew: photo("1633359676821-755f8eaddd20", "wide"),
  bowl: photo("1650040363953-3ce7c24cfe0d", "tall"),
  taxi: photo("1771556087192-786ac03b5843", "wide"),
  roll: photo("1476106900527-9664af9d4d28", "tall"),
  jump: photo("1620250536965-0b91b653a5e7", "wide"),
  plaza: photo("1763044936791-8d464641b14e", "tall"),
  blur: photo("1763044937128-225a4f964fdf", "wide"),
  stair: photo("1786347582720-777d41a20752", "tall"),
};
