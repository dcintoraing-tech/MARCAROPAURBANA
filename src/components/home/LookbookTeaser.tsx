import Image from "next/image";
import Link from "next/link";
import { LOOKBOOK } from "@/lib/data/lookbook";
import { ImageReveal, Reveal, SplitText } from "@/components/ui/motion-primitives";
import { Action } from "@/components/ui/primitives";

/** Antesala del lookbook: dos tomas del primer capítulo y el epígrafe. */
export function LookbookTeaser({ index = "05" }: { index?: string }) {
  const chapter = LOOKBOOK[0];
  const [first, second] = chapter.looks;

  return (
    <section className="relative border-b rule bg-paper py-16 text-ink md:py-24" aria-labelledby="lookbook">
      <div className="edge">
        <div className="flex items-end justify-between border-b rule-dark pb-5">
          <div className="flex items-baseline gap-4">
            <span className="label text-rojo">{index}</span>
            <h2 id="lookbook" className="display text-2xl md:text-4xl">
              Lookbook
            </h2>
          </div>
          <Link href="/lookbook" className="label link-draw hover:text-rojo">
            Ver completo
          </Link>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <ImageReveal className="aspect-[3/4]" parallax={30}>
              <Image
                src={first.image}
                alt={first.caption}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="ad-photo object-cover"
              />
            </ImageReveal>
            <p className="label-sm mt-3 text-ash">
              {first.index} · {first.location} · {first.time}
            </p>
          </div>

          <div className="flex flex-col justify-center md:col-span-4 md:px-2">
            <span className="label text-ash">{chapter.code}</span>
            <h3 className="display mt-4 text-[clamp(2.6rem,9vw,5rem)] leading-[0.84]">
              <SplitText text={chapter.name.split(" ")[0]} className="block" />
              <SplitText text={chapter.name.split(" ")[1] ?? ""} className="block text-rojo" delay={0.08} />
            </h3>
            <Reveal delay={0.16}>
              <p className="serif-it mt-6 text-xl leading-snug text-ink/70">{chapter.epigraph}</p>
              <Action href="/lookbook" variant="inverse" className="mt-8">
                Ver la sesión
              </Action>
            </Reveal>
          </div>

          <div className="md:col-span-3 md:pt-24">
            <ImageReveal className="aspect-[4/5]" parallax={20} delay={0.1}>
              <Image
                src={second.image}
                alt={second.caption}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="ad-photo object-cover"
              />
            </ImageReveal>
            <p className="label-sm mt-3 text-ash">
              {second.index} · {second.location} · {second.time}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
