import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BRAND, FAQ } from "@/lib/data/brand";
import { CITY, CONCRETE, GARMENT, HORA_MUERTA, RAW, SKATE } from "@/lib/data/media";
import { SIZE_CHARTS, SHIPPING_METHODS } from "@/lib/data/catalog";
import { MargenMark, MargenWordmark } from "@/components/brand/Logo";
import { ImageReveal, Marquee, Reveal, SplitText } from "@/components/ui/motion-primitives";
import { Accordion } from "@/components/ui/primitives";
import { price } from "@/lib/format";

export const metadata: Metadata = {
  title: "La marca",
  description:
    "MARGEN nació en 2021 en la colonia Obrera con cuarenta piezas. Producimos en series cortas, numeradas y cerradas en la Ciudad de México.",
};

export default function LaMarcaPage() {
  return (
    <>
      {/* Apertura */}
      <section className="relative overflow-hidden border-b rule">
        <div className="edge grid gap-10 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="label text-rojo">Desde {BRAND.founded} · {BRAND.city}</span>
            <h1 className="display-tight mt-6 text-[clamp(2.8rem,11vw,8rem)]">
              <SplitText text="NO HACEMOS" className="block" />
              <SplitText text="ROPA PARA" className="block" delay={0.07} />
              <SplitText text="ENCAJAR" className="block text-rojo" delay={0.14} />
            </h1>
          </div>

          <Reveal className="flex items-end lg:col-span-4 lg:col-start-9" delay={0.2}>
            <p className="serif-it text-2xl leading-snug text-concrete">{BRAND.slogan}</p>
          </Reveal>
        </div>

        <ImageReveal className="aspect-[16/10] w-full md:aspect-[16/7]" parallax={40}>
          <Image
            src={HORA_MUERTA.masked}
            alt="Retrato nocturno de campaña"
            fill
            priority
            sizes="100vw"
            className="ad-photo object-cover object-[50%_30%]"
          />
        </ImageReveal>
      </section>

      {/* Historia */}
      <section className="edge grid gap-12 border-b rule py-16 md:py-24 lg:grid-cols-12" aria-labelledby="historia">
        <div className="lg:col-span-4">
          <h2 id="historia" className="display text-3xl md:text-4xl">
            La historia
          </h2>
          <p className="label mt-4 text-concrete">01 / Origen</p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <p className="serif-it text-2xl leading-snug md:text-3xl">{BRAND.concept}</p>
          <div className="mt-8 space-y-5">
            {BRAND.story.map((paragraph) => (
              <Reveal key={paragraph}>
                <p className="text-[0.95rem] leading-relaxed text-concrete">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-6 lg:col-span-12">
          <ImageReveal className="aspect-[4/5]" parallax={22}>
            <Image src={CITY.storefront} alt="Fachada del estudio en la colonia Obrera" fill sizes="33vw" className="ad-photo object-cover" />
          </ImageReveal>
          <ImageReveal className="aspect-[4/5] md:mt-10" parallax={30} delay={0.08}>
            <Image src={GARMENT.pantsDetail} alt="Detalle de costura y remache" fill sizes="33vw" className="ad-photo object-cover" />
          </ImageReveal>
          <ImageReveal className="aspect-[4/5]" parallax={16} delay={0.16}>
            <Image src={SKATE.plaza} alt="Grupo en la plaza de noche" fill sizes="33vw" className="ad-photo object-cover" />
          </ImageReveal>
        </div>
      </section>

      {/* Manifiesto */}
      <section className="border-b rule bg-paper py-16 text-ink md:py-24" aria-labelledby="manifiesto-marca">
        <div className="edge grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="manifiesto-marca" className="display text-3xl md:text-4xl">
              Manifiesto
            </h2>
            <p className="label mt-4 text-ash">02 / Reglas</p>
          </div>

          <ul className="lg:col-span-7 lg:col-start-6">
            {BRAND.manifesto.map((line, index) => (
              <Reveal as="li" key={line} delay={index * 0.06} className="border-b rule-dark py-6">
                <div className="flex items-baseline gap-6">
                  <span className="label text-rojo">{String(index + 1).padStart(2, "0")}</span>
                  <p className="display text-xl leading-tight md:text-2xl">{line}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Personalidad */}
      <section className="edge border-b rule py-16 md:py-24" aria-labelledby="personalidad">
        <div className="flex items-end justify-between border-b rule pb-5">
          <h2 id="personalidad" className="display text-3xl md:text-4xl">
            Cómo hablamos
          </h2>
          <span className="label text-concrete">03 / Tono</span>
        </div>

        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {BRAND.personality.map((trait, index) => (
            <Reveal as="li" key={trait.word} delay={index * 0.07}>
              <p className="display text-[clamp(2rem,5vw,3rem)] leading-none">{trait.word}</p>
              <p className="mt-4 text-sm leading-relaxed text-concrete">{trait.note}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <div className="label border-b rule py-3 text-concrete">
        <Marquee items={BRAND.tickers} duration={42} />
      </div>

      {/* Sistema de identidad */}
      <section className="edge border-b rule py-16 md:py-24" aria-labelledby="identidad">
        <div className="flex items-end justify-between border-b rule pb-5">
          <h2 id="identidad" className="display text-3xl md:text-4xl">
            Identidad
          </h2>
          <span className="label text-concrete">04 / Sistema</span>
        </div>

        {/* Logotipo */}
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="label text-concrete">Logotipo</p>
            <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-concrete">
              Una regla vertical y la palabra. La regla es la línea del margen de una hoja: separa lo que estaba
              previsto de lo que alguien escribió después. Nunca se usa el logotipo sin ella salvo dentro de una caja
              que ya la contenga.
            </p>

            <div className="mt-8 grid gap-px bg-bone/10">
              <div className="flex items-center justify-center bg-ink py-12">
                <MargenWordmark className="text-3xl" tone="bone" />
              </div>
              <div className="flex items-center justify-center bg-paper py-12">
                <MargenWordmark className="text-3xl" tone="ink" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="label text-concrete">Monograma</p>
            <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-concrete">
              Para etiqueta, bordado, favicon y redes. Legible desde 16 píxeles y desde 8 milímetros de bordado.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-px bg-bone/10 sm:grid-cols-4">
              {[
                { bg: "bg-ink", tone: "bone" as const, size: "h-16 w-16", label: "64 px" },
                { bg: "bg-ink", tone: "bone" as const, size: "h-9 w-9", label: "32 px" },
                { bg: "bg-paper", tone: "ink" as const, size: "h-9 w-9", label: "32 px" },
                { bg: "bg-rojo", tone: "ink" as const, size: "h-9 w-9", label: "Acento" },
              ].map((variant, index) => (
                <div key={index} className={`flex flex-col items-center justify-center gap-4 py-10 ${variant.bg}`}>
                  <MargenMark className={variant.size} tone={variant.tone} />
                  <span className={`label-sm ${variant.tone === "bone" ? "text-concrete" : "text-ink/60"}`}>
                    {variant.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Paleta */}
        <div className="mt-14 border-t rule pt-10">
          <p className="label text-concrete">Paleta</p>
          <ul className="mt-6 grid gap-px bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {BRAND.palette.map((color) => (
              <li key={color.hex} className="bg-ink p-5">
                <div className="mb-5 h-24 w-full border rule" style={{ background: color.hex }} />
                <p className="label">{color.name}</p>
                <p className="mt-2 font-mono text-xs uppercase text-concrete">{color.hex}</p>
                <p className="mt-3 text-xs leading-relaxed text-ash">{color.use}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Tipografía */}
        <div className="mt-14 border-t rule pt-10">
          <p className="label text-concrete">Tipografía</p>
          <ul className="mt-6 divide-y divide-bone/10 border-y rule">
            {BRAND.typography.map((family) => (
              <li key={family.family} className="grid gap-5 py-8 md:grid-cols-12 md:gap-6">
                <div className="md:col-span-3">
                  <p className="label">{family.family}</p>
                  <p className="label-sm mt-2 text-ash">{family.role}</p>
                </div>
                <p
                  className={
                    family.family === "Archivo"
                      ? "display text-5xl md:col-span-5 md:text-6xl"
                      : family.family === "Instrument Serif"
                        ? "serif-it text-5xl md:col-span-5 md:text-6xl"
                        : "font-mono text-3xl md:col-span-5 md:text-4xl"
                  }
                >
                  {family.sample}
                </p>
                <p className="text-sm leading-relaxed text-concrete md:col-span-4">{family.note}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Aplicaciones */}
        <div className="mt-14 border-t rule pt-10">
          <p className="label text-concrete">Aplicaciones</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <li>
              <div className="flex aspect-square items-center justify-center bg-paper p-8">
                <div className="w-full max-w-[9rem] border border-ink/15 bg-paper p-4 text-ink">
                  <MargenWordmark className="text-base" tone="ink" />
                  <p className="label-sm mt-4 text-ink/50">100% algodón</p>
                  <p className="label-sm mt-1 text-ink/50">Hecho en México</p>
                  <p className="label-sm mt-4 text-rojo">MG—03—CR</p>
                </div>
              </div>
              <p className="label-sm mt-3 text-ash">Etiqueta de prenda</p>
            </li>

            <li>
              <div className="relative aspect-square overflow-hidden bg-carbon">
                <Image src={GARMENT.teeFlat} alt="Aplicación sobre playera" fill sizes="25vw" className="ad-photo object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <MargenMark className="h-10 w-10 text-bone/90" />
                </div>
              </div>
              <p className="label-sm mt-3 text-ash">Playera · serigrafía 1 tinta</p>
            </li>

            <li>
              <div className="relative aspect-square overflow-hidden bg-carbon">
                <Image src={GARMENT.hoodieBlackBack} alt="Aplicación sobre sudadera" fill sizes="25vw" className="ad-photo object-cover" />
                <div className="absolute inset-x-0 bottom-6 flex justify-center">
                  <MargenWordmark className="text-xl" tone="bone" />
                </div>
              </div>
              <p className="label-sm mt-3 text-ash">Hoodie · espalda</p>
            </li>

            <li>
              <div className="flex aspect-square flex-col justify-between bg-ink p-5 ring-1 ring-bone/10">
                <div className="flex items-center justify-between">
                  <MargenMark className="h-6 w-6" accent />
                  <span className="label-sm text-concrete">{BRAND.handle}</span>
                </div>
                <div>
                  <p className="display text-3xl leading-none">DROP 03</p>
                  <p className="serif-it mt-1 text-xl text-rojo">crudo</p>
                </div>
                <p className="label-sm text-ash">Publicación · 1080 × 1080</p>
              </div>
              <p className="label-sm mt-3 text-ash">Redes sociales</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Producción */}
      <section className="edge grid gap-12 border-b rule py-16 md:py-24 lg:grid-cols-12" aria-labelledby="produccion">
        <div className="lg:col-span-4">
          <h2 id="produccion" className="display text-3xl md:text-4xl">
            Cómo se hace
          </h2>
          <p className="label mt-4 text-concrete">05 / Taller</p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <ul className="divide-y divide-bone/10 border-y rule">
            {[
              { step: "01", title: "Patrón", note: "Dos semanas de prueba por pieza. Si una muestra no funciona a la tercera, se descarta." },
              { step: "02", title: "Corte", note: "Talleres de Obrera y Doctores. Corte por lotes de menos de sesenta piezas." },
              { step: "03", title: "Serigrafía", note: "Tinta al agua y descarga. Nada de plastisol grueso que se cuartee." },
              { step: "04", title: "Numerado", note: "Cada prenda lleva su número de serie escrito a mano en la etiqueta interior." },
            ].map((item) => (
              <li key={item.step} className="grid gap-3 py-6 md:grid-cols-12 md:gap-6">
                <span className="label text-rojo md:col-span-2">{item.step}</span>
                <p className="label md:col-span-3">{item.title}</p>
                <p className="text-sm leading-relaxed text-concrete md:col-span-7">{item.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:col-span-12">
          <ImageReveal className="aspect-[16/10]" parallax={22}>
            <Image src={CONCRETE.slab} alt="Fachada de concreto" fill sizes="50vw" className="ad-photo object-cover" />
          </ImageReveal>
          <ImageReveal className="aspect-[16/10] md:mt-10" parallax={30} delay={0.08}>
            <Image src={RAW.wallTags} alt="Muro intervenido" fill sizes="50vw" className="ad-photo object-cover" />
          </ImageReveal>
        </div>
      </section>

      {/* Ayuda */}
      <section className="edge grid gap-12 border-b rule py-16 md:py-24 lg:grid-cols-12" aria-labelledby="ayuda">
        <div className="lg:col-span-4">
          <h2 id="ayuda" className="display text-3xl md:text-4xl">
            Lo práctico
          </h2>
          <p className="label mt-4 text-concrete">06 / Ayuda</p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div id="envios" className="scroll-mt-28">
            <h3 className="label text-concrete">Envíos</h3>
            <ul className="mt-4 divide-y divide-bone/10 border-y rule">
              {SHIPPING_METHODS.map((method) => (
                <li key={method.id} className="flex flex-wrap items-baseline justify-between gap-3 py-5">
                  <div>
                    <p className="text-sm">{method.name}</p>
                    <p className="label-sm mt-1.5 text-ash">{method.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm tabular-nums">{price(method.price)}</p>
                    <p className="label-sm mt-1.5 text-ash">{method.estimate}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="label-sm mt-4 text-concrete">
              Envío estándar sin costo en pedidos desde {price(150000)}.
            </p>
          </div>

          <div id="tallas" className="mt-14 scroll-mt-28">
            <h3 className="label text-concrete">Guía de tallas</h3>
            {Object.values(SIZE_CHARTS).map((chart) => (
              <div key={chart.id} className="mt-5">
                <p className="label-sm mb-3 text-ash">{chart.label}</p>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b rule">
                      <th scope="col" className="label py-2.5 text-left text-concrete">
                        Talla
                      </th>
                      {chart.columns.map((column) => (
                        <th key={String(column.key)} scope="col" className="label py-2.5 text-right text-concrete">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.rows.map((row) => (
                      <tr key={row.code} className="border-b rule">
                        <th scope="row" className="label py-3 text-left">
                          {row.code}
                        </th>
                        {chart.columns.map((column) => (
                          <td key={String(column.key)} className="py-3 text-right font-mono text-sm tabular-nums text-bone/80">
                            {(row[column.key] as number | undefined) ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="label-sm mt-3 text-ash">{chart.note}</p>
              </div>
            ))}
          </div>

          <div id="cambios" className="mt-14 scroll-mt-28">
            <h3 className="label text-concrete">Cambios y devoluciones</h3>
            <p className="mt-4 text-sm leading-relaxed text-concrete">
              Tienes 30 días desde la entrega para cambiar de talla con la prenda sin usar y con etiqueta. El primer
              cambio por talla corre por nuestra cuenta; los siguientes tienen costo de envío. Las piezas de serie
              cerrada sólo se cambian por la misma referencia mientras quede existencia. Escríbenos a{" "}
              <a href={`mailto:${BRAND.contact.email}`} className="link-draw text-bone">
                {BRAND.contact.email}
              </a>{" "}
              con tu número de pedido.
            </p>
          </div>

          <div id="preguntas" className="mt-14 scroll-mt-28">
            <h3 className="label mb-4 text-concrete">Preguntas frecuentes</h3>
            <Accordion items={FAQ.map((item) => ({ title: item.q, content: item.a }))} />
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="edge grid gap-10 py-16 md:py-24 lg:grid-cols-12" aria-labelledby="contacto">
        <div className="lg:col-span-6">
          <h2 id="contacto" className="display text-[clamp(2.4rem,8vw,5rem)] leading-[0.86]">
            Hablamos
            <br />
            con gente,
            <br />
            no con tickets
          </h2>
        </div>

        <dl className="lg:col-span-5 lg:col-start-8">
          {[
            { label: "General", value: BRAND.contact.email },
            { label: "Mayoreo", value: BRAND.contact.wholesale },
            { label: "Prensa", value: BRAND.contact.press },
          ].map((item) => (
            <div key={item.value} className="border-b rule py-5">
              <dt className="label-sm text-concrete">{item.label}</dt>
              <dd className="mt-2">
                <a href={`mailto:${item.value}`} className="link-draw text-lg">
                  {item.value}
                </a>
              </dd>
            </div>
          ))}
          <div className="border-b rule py-5">
            <dt className="label-sm text-concrete">Estudio</dt>
            <dd className="mt-2 text-lg">{BRAND.contact.studio}</dd>
            <dd className="label-sm mt-2 text-ash">Visitas con cita previa, martes a viernes</dd>
          </div>

          <Link href="/tienda" className="label link-draw mt-8 inline-block text-rojo">
            Ver la tienda
          </Link>
        </dl>
      </section>
    </>
  );
}
