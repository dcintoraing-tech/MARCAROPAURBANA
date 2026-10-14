import type { Metadata } from "next";
import { FavoritesView } from "@/components/shop/FavoritesView";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Las piezas que guardaste. Las series son cerradas: lo que se acaba no vuelve.",
};

export default function FavoritosPage() {
  return <FavoritesView />;
}
