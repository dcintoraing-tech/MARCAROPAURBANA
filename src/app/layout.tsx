import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, Space_Mono } from "next/font/google";
import "./globals.css";

import { CartProvider } from "@/lib/store/cart";
import { FavoritesProvider } from "@/lib/store/favorites";
import { UIProvider } from "@/lib/store/ui";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { BootScreen, BrandCursor, RouteTransition, SmoothScroll } from "@/components/ui/Experience";
import { BRAND } from "@/lib/data/brand";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono-space",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${BRAND.domain}`),
  title: {
    default: `${BRAND.name} — ${BRAND.slogan}`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "Marca de ropa urbana hecha en la Ciudad de México. Series cortas, numeradas y cerradas: cuando un drop se termina, no vuelve.",
  keywords: ["streetwear", "ropa urbana", "CDMX", "drop", "hoodie", "playera", "México"],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.slogan}`,
    description: "Series cortas, numeradas y cerradas. Hecho en la Ciudad de México.",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090A",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${archivo.variable} ${instrument.variable} ${spaceMono.variable}`}>
      <body className="min-h-screen antialiased">
        <UIProvider>
          <FavoritesProvider>
            <CartProvider>
              <SmoothScroll />
              <BootScreen />
              <BrandCursor />

              <a
                href="#contenido"
                className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:bg-bone focus:px-4 focus:py-3 focus:text-ink"
              >
                Saltar al contenido
              </a>

              <Navbar />

              <main id="contenido" className="pt-[62px] md:pt-[70px]">
                <RouteTransition>{children}</RouteTransition>
              </main>

              <Footer />

              <CartDrawer />
              <SearchOverlay />
            </CartProvider>
          </FavoritesProvider>
        </UIProvider>
      </body>
    </html>
  );
}
