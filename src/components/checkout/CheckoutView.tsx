"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { clsx } from "clsx";
import type { Address, Order, PaymentProvider } from "@/lib/types";
import { PAYMENT_METHODS, SHIPPING_METHODS } from "@/lib/data/catalog";
import { useCart } from "@/lib/store/cart";
import { price } from "@/lib/format";
import { Field, Select } from "@/components/ui/primitives";
import { buildOrder, createPaymentIntent } from "@/lib/payments";
import { EASE, SplitText } from "@/components/ui/motion-primitives";
import { MargenMark } from "@/components/brand/Logo";

const ESTADOS = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua",
  "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero",
  "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla",
  "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas",
  "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas",
];

type FormState = Omit<Address, "country">;

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  interior: "",
  city: "",
  state: "Ciudad de México",
  postalCode: "",
  notes: "",
};

export function CheckoutView() {
  const cart = useCart();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [provider, setProvider] = useState<PaymentProvider>("tarjeta");
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const set = (key: keyof FormState) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) next.firstName = "Falta tu nombre";
    if (!form.lastName.trim()) next.lastName = "Faltan tus apellidos";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) next.email = "Revisa el correo";
    if (form.phone.replace(/\D/g, "").length !== 10) next.phone = "Diez dígitos, sin lada internacional";
    if (!form.street.trim()) next.street = "Falta la calle y el número";
    if (!form.city.trim()) next.city = "Falta la ciudad";
    if (!/^\d{5}$/.test(form.postalCode)) next.postalCode = "Cinco dígitos";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      document.querySelector("[aria-invalid=true]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    const payload = {
      items: cart.items,
      totals: cart.totals,
      address: { ...form, country: "MX" as const },
      shippingMethodId: cart.shippingMethodId,
      provider,
      couponCode: cart.coupon?.code,
    };

    const intent = await createPaymentIntent(payload);
    const created = buildOrder(payload, intent);

    setOrder(created);
    setSubmitting(false);
    cart.clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (order) return <OrderConfirmation order={order} />;

  if (cart.hydrated && cart.items.length === 0) {
    return (
      <div className="edge flex min-h-[62svh] flex-col items-start justify-center py-20">
        <p className="display text-[clamp(2.4rem,8vw,4.5rem)] leading-[0.88]">
          No hay nada
          <br />
          que pagar
        </p>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-concrete">
          Tu carrito está vacío. Las series son cortas: lo que ves hoy puede no estar la semana que entra.
        </p>
        <Link href="/tienda" className="label mt-8 bg-bone px-7 py-4 text-ink transition-colors hover:bg-rojo hover:text-paper">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="edge border-b rule pb-8 pt-12 md:pb-10 md:pt-16">
        <h1 className="display text-[clamp(2.2rem,8vw,4.5rem)] leading-[0.86]">
          <SplitText text="FINALIZAR COMPRA" />
        </h1>
      </header>

      <form onSubmit={submit} className="edge grid gap-12 pb-24 pt-10 lg:grid-cols-[1.3fr_1fr] lg:gap-20" noValidate>
      <div>
        {/* Contacto */}
        <section aria-labelledby="contacto-checkout">
          <div className="flex items-baseline gap-4 border-b rule pb-4">
            <span className="label text-rojo">01</span>
            <h2 id="contacto-checkout" className="display text-xl md:text-2xl">
              Contacto
            </h2>
          </div>
          <div className="mt-7 grid gap-7 sm:grid-cols-2">
            <Field label="Nombre" name="firstName" required value={form.firstName} onChange={set("firstName")} error={errors.firstName} autoComplete="given-name" />
            <Field label="Apellidos" name="lastName" required value={form.lastName} onChange={set("lastName")} error={errors.lastName} autoComplete="family-name" />
            <Field label="Correo" name="email" type="email" inputMode="email" required value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />
            <Field label="Teléfono" name="phone" type="tel" inputMode="tel" required value={form.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" placeholder="55 1234 5678" maxLength={14} />
          </div>
        </section>

        {/* Dirección */}
        <section className="mt-14" aria-labelledby="direccion">
          <div className="flex items-baseline gap-4 border-b rule pb-4">
            <span className="label text-rojo">02</span>
            <h2 id="direccion" className="display text-xl md:text-2xl">
              Dirección de entrega
            </h2>
          </div>
          <div className="mt-7 grid gap-7 sm:grid-cols-2">
            <Field className="sm:col-span-2" label="Calle y número" name="street" required value={form.street} onChange={set("street")} error={errors.street} autoComplete="address-line1" />
            <Field label="Interior o referencias" name="interior" value={form.interior ?? ""} onChange={set("interior")} autoComplete="address-line2" />
            <Field label="Ciudad" name="city" required value={form.city} onChange={set("city")} error={errors.city} autoComplete="address-level2" />
            <Select label="Estado" name="state" required value={form.state} onChange={set("state")} options={ESTADOS.map((e) => ({ value: e, label: e }))} />
            <Field label="Código postal" name="postalCode" inputMode="numeric" maxLength={5} required value={form.postalCode} onChange={set("postalCode")} error={errors.postalCode} autoComplete="postal-code" />
            <Field className="sm:col-span-2" label="Indicaciones para la entrega" name="notes" value={form.notes ?? ""} onChange={set("notes")} placeholder="Entre qué calles, portón, horario" />
          </div>
        </section>

        {/* Envío */}
        <section className="mt-14" aria-labelledby="envio">
          <div className="flex items-baseline gap-4 border-b rule pb-4">
            <span className="label text-rojo">03</span>
            <h2 id="envio" className="display text-xl md:text-2xl">
              Envío
            </h2>
          </div>
          <ul className="mt-6 space-y-2">
            {SHIPPING_METHODS.map((method) => {
              const selected = cart.shippingMethodId === method.id;
              const free = method.freeOver !== undefined && cart.totals.subtotal - cart.totals.discount >= method.freeOver;
              return (
                <li key={method.id}>
                  <button
                    type="button"
                    onClick={() => cart.setShippingMethod(method.id)}
                    aria-pressed={selected}
                    className={clsx(
                      "flex w-full items-center justify-between gap-5 border px-5 py-4 text-left transition-colors duration-300",
                      selected ? "border-bone" : "rule hover:border-bone/40",
                    )}
                  >
                    <span className="flex items-center gap-4">
                      <span className={clsx("flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border", selected ? "border-bone" : "border-bone/30")}>
                        {selected ? <span className="h-1.5 w-1.5 rounded-full bg-rojo" /> : null}
                      </span>
                      <span>
                        <span className="block text-sm">{method.name}</span>
                        <span className="label-sm mt-1.5 block text-ash">{method.estimate} · {method.description}</span>
                      </span>
                    </span>
                    <span className="font-mono text-sm tabular-nums">{free ? "Gratis" : price(method.price)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Pago */}
        <section className="mt-14" aria-labelledby="pago">
          <div className="flex items-baseline gap-4 border-b rule pb-4">
            <span className="label text-rojo">04</span>
            <h2 id="pago" className="display text-xl md:text-2xl">
              Pago
            </h2>
          </div>

          <ul className="mt-6 space-y-2">
            {PAYMENT_METHODS.map((method) => {
              const selected = provider === method.id;
              return (
                <li key={method.id}>
                  <button
                    type="button"
                    onClick={() => setProvider(method.id)}
                    aria-pressed={selected}
                    className={clsx(
                      "flex w-full items-center justify-between gap-5 border px-5 py-4 text-left transition-colors duration-300",
                      selected ? "border-bone" : "rule hover:border-bone/40",
                    )}
                  >
                    <span className="flex items-center gap-4">
                      <span className={clsx("flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border", selected ? "border-bone" : "border-bone/30")}>
                        {selected ? <span className="h-1.5 w-1.5 rounded-full bg-rojo" /> : null}
                      </span>
                      <span>
                        <span className="block text-sm">{method.name}</span>
                        <span className="label-sm mt-1.5 block text-ash">{method.description}</span>
                      </span>
                    </span>
                    <span className="label-sm text-ash">{method.integration}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {provider === "tarjeta" ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mt-6 border rule p-5">
                <p className="label-sm mb-5 text-ash">
                  Demostración: los datos de tarjeta no se capturan ni se envían. En producción este bloque lo sustituye
                  el campo embebido de Stripe.
                </p>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field className="sm:col-span-2" label="Número de tarjeta" name="card" placeholder="•••• •••• •••• ••••" />
                  <Field label="Vencimiento" name="exp" placeholder="MM / AA" />
                  <Field label="CVV" name="cvv" placeholder="•••" />
                </div>
              </div>
            </motion.div>
          ) : null}
        </section>
      </div>

      {/* Resumen */}
      <aside className="lg:sticky lg:top-[100px] lg:self-start">
        <div className="border rule">
          <h2 className="label border-b rule px-5 py-4">Tu pedido ({cart.count})</h2>

          <ul className="max-h-[22rem] overflow-y-auto px-5">
            {cart.items.map((item) => (
              <li key={item.lineId} className="flex gap-4 border-b rule py-4 last:border-b-0">
                <div className="relative aspect-[3/4] w-16 shrink-0 bg-carbon">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="ad-photo object-cover" />
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-bone font-mono text-[0.65rem] text-ink">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-tight">{item.name}</p>
                  <p className="label-sm mt-1.5 text-ash">
                    {item.color.name} · {item.size}
                  </p>
                </div>
                <span className="font-mono text-xs tabular-nums">{price(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <dl className="space-y-2.5 border-t rule px-5 py-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-concrete">Subtotal</dt>
              <dd className="font-mono tabular-nums">{price(cart.totals.subtotal)}</dd>
            </div>
            {cart.totals.discount > 0 ? (
              <div className="flex justify-between text-rojo">
                <dt>Descuento {cart.coupon ? `(${cart.coupon.code})` : ""}</dt>
                <dd className="font-mono tabular-nums">−{price(cart.totals.discount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-concrete">Envío</dt>
              <dd className="font-mono tabular-nums">
                {cart.totals.shipping === 0 ? "Gratis" : price(cart.totals.shipping)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t rule pt-3">
              <dt className="label">Total</dt>
              <dd className="font-mono text-lg tabular-nums">{price(cart.totals.total)}</dd>
            </div>
          </dl>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="label mt-4 w-full bg-bone py-4 text-ink transition-colors duration-500 hover:bg-rojo hover:text-paper disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "Procesando…" : `Pagar ${price(cart.totals.total)}`}
        </button>

        <p className="label-sm mt-4 leading-relaxed text-ash">
          Al confirmar aceptas los términos de venta. Esta es una demostración: no se realiza ningún cargo real.
        </p>
      </aside>
      </form>
    </>
  );
}

function OrderConfirmation({ order }: { order: Order }) {
  const method = SHIPPING_METHODS.find((m) => m.id === order.shippingMethodId);

  return (
    <motion.div
      className="edge grid gap-12 py-16 md:py-24 lg:grid-cols-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="lg:col-span-6">
        <MargenMark className="h-8 w-8" accent />
        <h1 className="display mt-8 text-[clamp(2.6rem,9vw,5.6rem)] leading-[0.86]">
          Pedido
          <br />
          confirmado
        </h1>
        <p className="serif-it mt-6 max-w-[32ch] text-2xl text-concrete">
          Te escribimos a {order.address.email} con la guía en cuanto salga del taller.
        </p>

        <Link href="/tienda" className="label mt-10 inline-block border rule px-7 py-4 transition-colors hover:bg-bone hover:text-ink">
          Seguir viendo
        </Link>
      </div>

      <div className="lg:col-span-5 lg:col-start-8">
        <dl className="border-y rule">
          {[
            { label: "Número de pedido", value: order.number },
            { label: "Estado", value: order.status, caps: true },
            { label: "Referencia de pago", value: order.paymentReference ?? "—" },
            { label: "Método", value: order.paymentProvider, caps: true },
            { label: "Envío", value: `${method?.name ?? "Estándar"} · ${method?.estimate ?? ""}` },
            { label: "Total", value: price(order.totals.total) },
          ].map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-6 border-b rule py-4 last:border-b-0">
              <dt className="label-sm text-concrete">{row.label}</dt>
              <dd className={clsx("text-right font-mono text-sm tabular-nums", row.caps && "capitalize")}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8">
          <p className="label mb-4 text-concrete">Seguimiento</p>
          <ol className="space-y-3">
            {["pendiente", "pagado", "preparando", "enviado", "entregado"].map((status) => {
              const reached = ["pendiente", "pagado"].includes(status);
              return (
                <li key={status} className="flex items-center gap-4">
                  <span className={clsx("h-1.5 w-1.5 rounded-full", reached ? "bg-rojo" : "bg-bone/20")} />
                  <span className={clsx("label", reached ? "text-bone" : "text-ash")}>{status}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </motion.div>
  );
}
