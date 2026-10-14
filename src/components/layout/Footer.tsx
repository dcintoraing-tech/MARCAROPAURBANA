import Link from "next/link";
import { BRAND } from "@/lib/data/brand";
import { MargenMark } from "@/components/brand/Logo";
import { allCategories, allCollections } from "@/lib/repositories";

const AYUDA = [
  { href: "/la-marca#envios", label: "Envíos" },
  { href: "/la-marca#cambios", label: "Cambios y devoluciones" },
  { href: "/la-marca#tallas", label: "Guía de tallas" },
  { href: "/la-marca#preguntas", label: "Preguntas frecuentes" },
];

export function Footer() {
  const categories = allCategories();
  const collections = allCollections();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t rule bg-ink">
      {/* Firma grande */}
      <div className="edge overflow-hidden pb-10 pt-16 md:pt-20">
        <p className="display-tight select-none text-[21vw] leading-[0.74] text-bone/90 md:text-[17vw]">MARGEN</p>
      </div>

      <div className="edge grid gap-10 border-t rule py-12 md:grid-cols-4 md:gap-8">
        <div className="md:col-span-1">
          <MargenMark className="h-7 w-7" accent />
          <p className="serif-it mt-5 max-w-[22ch] text-lg leading-snug">{BRAND.slogan}</p>
          <p className="label-sm mt-6 text-ash">
            {BRAND.contact.studio}
            <br />
            {BRAND.contact.email}
          </p>
        </div>

        <nav aria-labelledby="footer-tienda">
          <h2 id="footer-tienda" className="label mb-5 text-concrete">
            Tienda
          </h2>
          <ul className="space-y-2.5">
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={`/tienda?categoria=${category.slug}`} className="link-draw text-sm text-bone/80 hover:text-bone">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-series">
          <h2 id="footer-series" className="label mb-5 text-concrete">
            Series
          </h2>
          <ul className="space-y-2.5">
            {collections.map((collection) => (
              <li key={collection.id}>
                <Link href={`/colecciones/${collection.slug}`} className="link-draw text-sm text-bone/80 hover:text-bone">
                  {collection.code} — {collection.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/lookbook" className="link-draw text-sm text-bone/80 hover:text-bone">
                Lookbook
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="label mb-5 text-concrete">Ayuda</h2>
          <ul className="space-y-2.5">
            {AYUDA.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-draw text-sm text-bone/80 hover:text-bone">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="label mb-4 mt-8 text-concrete">Síguenos</h2>
          <ul className="space-y-2.5">
            <li>
              <a
                href={BRAND.social.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="link-draw text-sm text-bone/80 hover:text-bone"
              >
                Instagram {BRAND.social.instagram.label}
              </a>
            </li>
            <li>
              <a
                href={BRAND.social.tiktok.url}
                target="_blank"
                rel="noreferrer"
                className="link-draw text-sm text-bone/80 hover:text-bone"
              >
                TikTok {BRAND.social.tiktok.label}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="edge flex flex-col gap-3 border-t rule py-6 text-ash md:flex-row md:items-center md:justify-between">
        <p className="label-sm">
          © {year} {BRAND.legalName} · Hecho en {BRAND.city}
        </p>
        <p className="label-sm">Precios en pesos mexicanos (MXN) · Impuestos incluidos</p>
      </div>
    </footer>
  );
}
