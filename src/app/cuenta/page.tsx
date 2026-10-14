import type { Metadata } from "next";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = {
  title: "Cuenta",
  description: "Entra a tu cuenta para seguir tus pedidos y entrar a los drops antes que nadie.",
};

export default function CuentaPage() {
  return <AccountView />;
}
