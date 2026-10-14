"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { clsx } from "clsx";
import { useState } from "react";
import { useCart } from "@/lib/store/cart";
import { useUI } from "@/lib/store/ui";
import { price } from "@/lib/format";
import { IconClose } from "@/components/ui/icons";
import { Action } from "@/components/ui/primitives";
import { EASE } from "@/components/ui/motion-primitives";

export function CartDrawer() {
  const { isOpen, close } = useUI();
  const cart = useCart();
  const open = isOpen("cart");

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-label="Carrito">
          <motion.button
            type="button"
            aria-label="Cerrar carrito"
            onClick={close}
            className="absolute inset-0 h-full w-full bg-ink/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />

          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-[29rem] flex-col border-l rule bg-ink"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.62, ease: EASE }}
          >
            <header className="flex items-center justify-between border-b rule px-5 py-5 md:px-7">
              <h2 className="label">
                Carrito <span className="text-concrete">({cart.count})</span>
              </h2>
              <button type="button" onClick={close} aria-label="Cerrar" className="p-1 transition-colors hover:text-rojo">
                <IconClose className="h-5 w-5" />
              </button>
            </header>

            {cart.items.length === 0 ? <EmptyCart onClose={close} /> : <CartBody />}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-6 px-5 md:px-7">
      <p className="display text-3xl leading-[0.9]">
        Todavía
        <br />
        no hay nada
      </p>
      <p className="max-w-xs text-sm text-concrete">
        Las series son cortas y no se reponen. Si algo te late, es ahora.
      </p>
      <Action href="/tienda" onClick={onClose} variant="outline">
        Ver la tienda
      </Action>
    </div>
  );
}

function CartBody() {
  const cart = useCart();
  const { close } = useUI();
  const [couponInput, setCouponInput] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);

  const { totals } = cart;
  const progress = Math.min(
    100,
    Math.round(((totals.freeShippingThreshold - totals.remainingForFreeShipping) / totals.freeShippingThreshold) * 100),
  );

  return (
    <>
      {/* Barra de envío gratis */}
      <div className="border-b rule px-5 py-4 md:px-7">
        <p className="label-sm mb-2.5 text-concrete">
          {totals.remainingForFreeShipping > 0 ? (
            <>
              Te faltan <span className="text-bone">{price(totals.remainingForFreeShipping)}</span> para envío gratis
            </>
          ) : (
            <span className="text-bone">Envío estándar sin costo</span>
          )}
        </p>
        <div className="h-px w-full bg-bone/15">
          <motion.div
            className="h-px bg-rojo"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 md:px-7">
        <AnimatePresence initial={false}>
          {cart.items.map((item) => (
            <motion.div
              key={item.lineId}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden"
            >
              <div
                className={clsx(
                  "flex gap-4 border-b rule py-5 transition-colors duration-700",
                  cart.lastAdded === item.lineId && "bg-bone/[0.04]",
                )}
              >
                <Link href={`/producto/${item.slug}`} onClick={close} className="relative aspect-[3/4] w-[5.5rem] shrink-0 bg-carbon">
                  <Image src={item.image} alt={item.name} fill sizes="88px" className="ad-photo object-cover" />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/producto/${item.slug}`} onClick={close} className="text-sm font-medium leading-tight">
                      {item.name}
                    </Link>
                    <span className="font-mono text-[0.78rem] tabular-nums">{price(item.price * item.quantity)}</span>
                  </div>

                  <p className="label-sm mt-2 text-concrete">
                    {item.color.name} · Talla {item.size}
                  </p>
                  <p className="label-sm mt-1 text-ash">{item.sku}</p>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <div className="flex items-center border rule">
                      <button
                        type="button"
                        onClick={() => cart.setQuantity(item.lineId, item.quantity - 1)}
                        className="px-3 py-1.5 text-sm transition-colors hover:text-rojo"
                        aria-label={`Quitar una unidad de ${item.name}`}
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center font-mono text-xs tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => cart.setQuantity(item.lineId, item.quantity + 1)}
                        className="px-3 py-1.5 text-sm transition-colors hover:text-rojo"
                        aria-label={`Agregar una unidad de ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => cart.remove(item.lineId)}
                      className="label-sm text-ash transition-colors hover:text-rojo"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Cupón */}
        <div className="py-5">
          {cart.coupon ? (
            <div className="flex items-center justify-between border rule px-4 py-3">
              <span className="label text-bone">
                {cart.coupon.code} <span className="text-concrete">· {cart.coupon.description}</span>
              </span>
              <button type="button" onClick={cart.removeCoupon} className="label-sm text-ash hover:text-rojo">
                Quitar
              </button>
            </div>
          ) : showCoupon ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (cart.applyCoupon(couponInput)) setCouponInput("");
              }}
              className="flex items-end gap-3"
            >
              <label className="flex-1">
                <span className="label-sm mb-2 block text-concrete">Código</span>
                <input
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                  placeholder="MARGEN10"
                  className="w-full border-b border-bone/20 bg-transparent pb-2 font-mono text-sm uppercase outline-none focus:border-bone"
                />
              </label>
              <button type="submit" className="label border rule px-4 py-2.5 transition-colors hover:bg-bone hover:text-ink">
                Aplicar
              </button>
            </form>
          ) : (
            <button type="button" onClick={() => setShowCoupon(true)} className="label-sm text-concrete hover:text-bone">
              ¿Tienes un código?
            </button>
          )}
          {cart.couponError ? <p className="label-sm mt-2 text-rojo">{cart.couponError}</p> : null}
        </div>
      </div>

      <footer className="border-t rule px-5 py-5 md:px-7">
        <dl className="mb-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-concrete">Subtotal</dt>
            <dd className="font-mono tabular-nums">{price(totals.subtotal)}</dd>
          </div>
          {totals.discount > 0 ? (
            <div className="flex justify-between text-rojo">
              <dt>Descuento</dt>
              <dd className="font-mono tabular-nums">−{price(totals.discount)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between">
            <dt className="text-concrete">Envío</dt>
            <dd className="font-mono tabular-nums">{totals.shipping === 0 ? "Gratis" : price(totals.shipping)}</dd>
          </div>
          <div className="flex justify-between border-t rule pt-3 text-base">
            <dt className="label pt-1">Total</dt>
            <dd className="font-mono tabular-nums">{price(totals.total)}</dd>
          </div>
        </dl>

        <Action href="/checkout" onClick={close} full>
          Finalizar compra
        </Action>
        <p className="label-sm mt-3 text-center text-ash">Impuestos incluidos · Cambios dentro de 30 días</p>
      </footer>
    </>
  );
}
