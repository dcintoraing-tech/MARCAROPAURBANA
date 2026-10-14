"use client";

import Image from "next/image";
import { useState } from "react";
import { clsx } from "clsx";
import { BRAND } from "@/lib/data/brand";
import { SOCIAL_FEED } from "@/lib/data/lookbook";
import { Reveal } from "@/components/ui/motion-primitives";

/** Feed de la marca: ocho tomas, recorte cuadrado, sin marco de teléfono. */
export function SocialFeed({ index = "06" }: { index?: string }) {
  return (
    <section className="border-b rule py-16 md:py-24" aria-labelledby="social">
      <div className="edge flex flex-wrap items-end justify-between gap-4 border-b rule pb-5">
        <div className="flex items-baseline gap-4">
          <span className="label text-rojo">{index}</span>
          <h2 id="social" className="display text-2xl md:text-4xl">
            En la calle
          </h2>
        </div>
        <div className="flex gap-5">
          <a href={BRAND.social.instagram.url} target="_blank" rel="noreferrer" className="label link-draw hover:text-rojo">
            Instagram {BRAND.social.instagram.label}
          </a>
          <a href={BRAND.social.tiktok.url} target="_blank" rel="noreferrer" className="label link-draw hover:text-rojo">
            TikTok
          </a>
        </div>
      </div>

      <ul className="hide-scrollbar edge mt-6 flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-3 md:overflow-visible lg:grid-cols-8">
        {SOCIAL_FEED.map((post, i) => (
          <Reveal as="li" key={post.caption} delay={i * 0.04} className="w-[42vw] shrink-0 md:w-auto">
            <a
              href={BRAND.social.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="group relative block aspect-square overflow-hidden bg-carbon"
              data-cursor="ABRIR"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 768px) 42vw, 12vw"
                className="ad-photo object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-ink/0 p-2.5 opacity-0 transition-all duration-500 group-hover:bg-ink/50 group-hover:opacity-100">
                <span className="label-sm text-bone">{post.caption}</span>
                <span className="label-sm mt-1 text-concrete">{post.likes}</span>
              </div>
            </a>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

/** Alta a la lista de acceso anticipado. */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (!valid) {
      setState("error");
      return;
    }
    // Aquí entraría el alta real (Supabase `subscribers` o el proveedor de correo).
    setState("done");
  };

  return (
    <section className="border-b rule py-20 md:py-28" aria-labelledby="newsletter">
      <div className="edge grid gap-10 md:grid-cols-12">
        <div className="md:col-span-6">
          <h2 id="newsletter" className="display text-[clamp(2.4rem,8vw,5rem)] leading-[0.86]">
            Entra antes
            <br />
            que todos
          </h2>
        </div>

        <div className="md:col-span-5 md:col-start-8">
          <p className="max-w-[40ch] text-[0.95rem] leading-relaxed text-concrete">
            Acceso anticipado a nuevos drops, colaboraciones y lanzamientos. Escribimos poco y nunca para vender algo
            que ya está en la tienda.
          </p>

          {state === "done" ? (
            <div className="mt-8 border-t rule pt-6">
              <p className="serif-it text-2xl">Listo. Nos vemos en el próximo drop.</p>
              <p className="label-sm mt-3 text-concrete">Te escribiremos a {email}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8" noValidate>
              <div className="flex items-end gap-4 border-b rule pb-3">
                <label className="flex-1">
                  <span className="sr-only">Correo electrónico</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (state === "error") setState("idle");
                    }}
                    placeholder="tu@correo.com"
                    autoComplete="email"
                    aria-invalid={state === "error"}
                    className="w-full bg-transparent text-lg outline-none placeholder:text-ash"
                  />
                </label>
                <button
                  type="submit"
                  className={clsx(
                    "label shrink-0 pb-1 transition-colors duration-300",
                    state === "error" ? "text-rojo" : "text-bone hover:text-rojo",
                  )}
                >
                  Unirme
                </button>
              </div>
              {state === "error" ? (
                <p className="label-sm mt-3 text-rojo">Revisa el correo: falta algo.</p>
              ) : (
                <p className="label-sm mt-3 text-ash">Sin spam. Baja en un clic.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
