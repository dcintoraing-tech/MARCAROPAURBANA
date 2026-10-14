import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finaliza tu pedido. Envíos a todo México.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
