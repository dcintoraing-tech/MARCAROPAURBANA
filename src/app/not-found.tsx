import Link from "next/link";
import Image from "next/image";
import { CITY } from "@/lib/data/media";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[78svh] items-end overflow-hidden border-b rule">
      <Image
        src={CITY.lamp}
        alt=""
        fill
        sizes="100vw"
        className="ad-photo-soft object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />

      <div className="edge relative w-full pb-14 pt-24">
        <span className="label text-rojo">Error 404</span>
        <h1 className="display-tight mt-5 text-[clamp(3rem,14vw,9rem)]">
          Esta página
          <br />
          se agotó
        </h1>
        <p className="serif-it mt-6 max-w-[34ch] text-xl text-concrete">
          O nunca existió. Pasa con las series cerradas y pasa con las direcciones mal escritas.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="label bg-bone px-7 py-4 text-ink transition-colors duration-500 hover:bg-rojo hover:text-paper"
          >
            Volver al inicio
          </Link>
          <Link
            href="/tienda"
            className="label border rule px-7 py-4 transition-colors duration-500 hover:bg-bone hover:text-ink"
          >
            Ver la tienda
          </Link>
        </div>
      </div>
    </section>
  );
}
