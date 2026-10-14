import type { Address, CartItem, CartTotals, Order, PaymentProvider } from "@/lib/types";

/**
 * Adaptadores de pago.
 *
 * La tienda no conoce a Stripe ni a Mercado Pago: sólo conoce esta interfaz.
 * Cuando haya backend, cada adaptador llama a su endpoint (`/api/checkout/...`)
 * y devuelve la referencia del cargo; aquí dentro es lo único que cambia.
 */

export interface PaymentIntent {
  provider: PaymentProvider;
  /** Referencia del PSP: payment_intent de Stripe, preference de MP, order de PayPal. */
  reference: string;
  /** Cuando el proveedor requiere salir del sitio. */
  redirectUrl?: string;
  status: "requiere_confirmacion" | "aprobado" | "rechazado";
}

export interface CheckoutPayload {
  items: CartItem[];
  totals: CartTotals;
  address: Address;
  shippingMethodId: string;
  provider: PaymentProvider;
  couponCode?: string;
}

/** Referencia legible y única por pedido. */
function reference(prefix: string): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const noise = Math.floor(Math.random() * 46656)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  return `${prefix}_${stamp}${noise}`;
}

const ADAPTERS: Record<PaymentProvider, (payload: CheckoutPayload) => Promise<PaymentIntent>> = {
  /**
   * Stripe. En producción:
   *   const res = await fetch("/api/checkout/stripe", { method: "POST", body: JSON.stringify(payload) });
   *   const { clientSecret } = await res.json();
   *   return stripe.confirmCardPayment(clientSecret);
   */
  tarjeta: async () => ({
    provider: "tarjeta",
    reference: reference("pi"),
    status: "aprobado",
  }),

  /**
   * Mercado Pago. En producción se crea una preferencia en el servidor y se
   * redirige a `init_point`.
   */
  mercadopago: async () => ({
    provider: "mercadopago",
    reference: reference("pref"),
    status: "aprobado",
  }),

  /** PayPal: orden creada en servidor y aprobación en su dominio. */
  paypal: async () => ({
    provider: "paypal",
    reference: reference("pp"),
    status: "aprobado",
  }),
};

/** Punto único de entrada del cobro. */
export async function createPaymentIntent(payload: CheckoutPayload): Promise<PaymentIntent> {
  const adapter = ADAPTERS[payload.provider];
  // Latencia simulada para que la interfaz muestre su estado de carga real.
  await new Promise((resolve) => setTimeout(resolve, 900));
  return adapter(payload);
}

let sequence = 1041;

/** Arma el pedido con la forma que tendrá la fila de `orders` en la base. */
export function buildOrder(payload: CheckoutPayload, intent: PaymentIntent): Order {
  const now = new Date().toISOString();
  sequence += 1;

  return {
    id: intent.reference.toLowerCase(),
    number: `MG-${sequence}`,
    email: payload.address.email,
    items: payload.items,
    address: payload.address,
    shippingMethodId: payload.shippingMethodId,
    paymentProvider: payload.provider,
    paymentReference: intent.reference,
    couponCode: payload.couponCode,
    totals: payload.totals,
    status: intent.status === "aprobado" ? "pagado" : "pendiente",
    createdAt: now,
    updatedAt: now,
  };
}
