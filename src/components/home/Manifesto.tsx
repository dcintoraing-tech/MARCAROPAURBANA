import Image from "next/image";
import { BRAND } from "@/lib/data/brand";
import { HORA_MUERTA, SKATE, CITY } from "@/lib/data/media";
import { ImageReveal, Reveal, SplitText } from "@/components/ui/motion-primitives";
import { Action } from "@/components/ui/primitives";

/**
 * Campaña editorial. Tipografía grande, tres fotografías de tamaños distintos
 * y muy poco texto: la sección existe para que el ojo descanse del catálogo.
 */
export function Manifesto() {
  return (
    <section className="relative overflow-hidden border-b rule py-20 md:py-32" aria-labelledby="manifiesto">
      <div className="edge">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <span className="label text-rojo">02 / Manifiesto</span>
            <h2 id="manifiesto" className="display mt-7 text-[clamp(2.5rem,8.2vw,6.2rem)] leading-[0.84]">
              <SplitText text="NO HACEMOS" className="block" />
              <SplitText text="ROPA PARA" className="block" delay={0.07} />
              <span className="flex flex-wrap items-baseline gap-x-5">
                <SplitText text="ENCAJAR" delay={0.14} />
                <span className="serif-it text-rojo">—</span>
              </span>
            </h2>
          </div>

          <Reveal className="flex flex-col justify-end lg:col-span-4 lg:col-start-9" delay={0.2}>
            <p className="text-[0.95rem] leading-relaxed text-concrete">{BRAND.concept}</p>
            <ul className="mt-8 space-y-3 border-t rule pt-6">
              {BRAND.manifesto.map((line) => (
                <li key={line} className="flex gap-4 text-sm leading-snug">
                  <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-rojo" />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Tres tomas, tres pesos distintos */}
        <div className="mt-16 grid gap-4 md:mt-24 md:grid-cols-12 md:gap-6">
          <ImageReveal className="aspect-[4/5] md:col-span-5 md:mt-20" parallax={28}>
            <Image
              src={HORA_MUERTA.figure03}
              alt="Detalle de hoodie con capucha arriba bajo luz de alumbrado"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="ad-photo object-cover"
            />
          </ImageReveal>

          <ImageReveal className="aspect-[3/4] md:col-span-4" parallax={44} delay={0.08}>
            <Image
              src={SKATE.nightRoad}
              alt="Patinador cruzando una avenida vacía de madrugada"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="ad-photo object-cover"
            />
          </ImageReveal>

          <div className="flex flex-col justify-between gap-6 md:col-span-3 md:pt-28">
            <ImageReveal className="aspect-square" parallax={18} delay={0.16}>
              <Image
                src={CITY.reflection}
                alt="Reflejo del alumbrado sobre el asfalto mojado"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="ad-photo object-cover"
              />
            </ImageReveal>
            <Reveal delay={0.2}>
              <p className="serif-it text-xl leading-snug">{BRAND.story[0].split(".")[0]}.</p>
              <Action href="/la-marca" variant="ghost" className="mt-5 px-0">
                Leer la historia
              </Action>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
