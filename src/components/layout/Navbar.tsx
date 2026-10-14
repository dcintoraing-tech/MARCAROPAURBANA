"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { MargenMark, MargenWordmark } from "@/components/brand/Logo";
import { IconBag, IconClose, IconHeart, IconSearch, IconUser } from "@/components/ui/icons";
import { useCart } from "@/lib/store/cart";
import { useFavorites } from "@/lib/store/favorites";
import { useUI } from "@/lib/store/ui";
import { BRAND } from "@/lib/data/brand";
import { EASE } from "@/components/ui/motion-primitives";

export const NAV_LINKS = [
  { href: "/drop", label: "New Drop", accent: true },
  { href: "/tienda", label: "Shop" },
  { href: "/colecciones", label: "Colecciones" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/la-marca", label: "La marca" },
];

export function Navbar() {
  const pathname = usePathname();
  const { open, isOpen, close, toggle } = useUI();
  const cart = useCart();
  const favorites = useFavorites();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));

  const onHome = pathname === "/";
  const menuOpen = isOpen("menu");

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-[90] transition-[background-color,backdrop-filter,border-color] duration-500",
          scrolled || !onHome || menuOpen
            ? "border-b rule bg-ink/88 backdrop-blur-md"
            : "border-b border-transparent bg-gradient-to-b from-ink/70 to-transparent",
        )}
      >
        <nav className="edge flex h-[62px] items-center justify-between gap-6 md:h-[70px]" aria-label="Principal">
          {/* Izquierda: logo */}
          <div className="flex flex-1 items-center gap-4">
            <button
              type="button"
              onClick={() => toggle("menu")}
              className="-ml-2 p-2 lg:hidden"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <IconClose className="h-5 w-5" />
              ) : (
                <span aria-hidden className="flex h-5 w-5 flex-col justify-center gap-[5px]">
                  <span className="h-px w-5 bg-current" />
                  <span className="h-px w-3.5 bg-current" />
                </span>
              )}
            </button>

            <Link href="/" className="flex items-center gap-2.5" aria-label={`${BRAND.name} — inicio`}>
              <MargenMark className="hidden h-5 w-5 md:block" accent />
              <MargenWordmark className="text-[1.05rem] md:text-[1.15rem]" rule={false} />
            </Link>
          </div>

          {/* Centro: navegación */}
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-active={active}
                    className={clsx(
                      "label link-draw transition-colors duration-300 hover:text-bone",
                      active ? "text-bone" : "text-concrete",
                      link.accent && "text-rojo hover:text-rojo",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Derecha: utilidades */}
          <div className="flex flex-1 items-center justify-end gap-1 md:gap-2">
            <button type="button" onClick={() => open("search")} aria-label="Buscar" className="p-2 transition-colors hover:text-rojo">
              <IconSearch className="h-[18px] w-[18px]" />
            </button>
            <Link href="/cuenta" aria-label="Cuenta" className="hidden p-2 transition-colors hover:text-rojo sm:block">
              <IconUser className="h-[18px] w-[18px]" />
            </Link>
            <Link href="/favoritos" aria-label="Favoritos" className="relative hidden p-2 transition-colors hover:text-rojo sm:block">
              <IconHeart className="h-[18px] w-[18px]" />
              {favorites.count > 0 ? (
                <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-rojo" />
              ) : null}
            </Link>
            <button
              type="button"
              onClick={() => open("cart")}
              className="relative flex items-center gap-2 p-2 transition-colors hover:text-rojo"
              aria-label={`Carrito, ${cart.count} artículos`}
            >
              <IconBag className="h-[18px] w-[18px]" />
              <span className="label tabular-nums">{cart.hydrated ? cart.count.toString().padStart(2, "0") : "00"}</span>
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={close} pathname={pathname} />
    </>
  );
}

function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="menu"
          className="fixed inset-0 z-[80] flex flex-col bg-ink pt-[62px] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <nav className="edge flex flex-1 flex-col justify-center gap-1 pb-16" aria-label="Menú móvil">
            {NAV_LINKS.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.06 + index * 0.05, ease: EASE }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={clsx(
                    "display block border-b rule py-5 text-[2.6rem] leading-none transition-colors duration-300",
                    pathname === link.href ? "text-rojo" : "text-bone",
                  )}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              className="mt-8 flex flex-wrap gap-x-7 gap-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.34 }}
            >
              <Link href="/cuenta" onClick={onClose} className="label text-concrete">
                Cuenta
              </Link>
              <Link href="/favoritos" onClick={onClose} className="label text-concrete">
                Favoritos
              </Link>
              <a href={BRAND.social.instagram.url} className="label text-concrete" target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href={BRAND.social.tiktok.url} className="label text-concrete" target="_blank" rel="noreferrer">
                TikTok
              </a>
            </motion.div>

            <motion.p
              className="serif-it mt-10 max-w-xs text-lg text-concrete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.42 }}
            >
              {BRAND.slogan}
            </motion.p>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
