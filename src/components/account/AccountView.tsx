"use client";

import Link from "next/link";
import { useState } from "react";
import { clsx } from "clsx";
import { ORDER_STATUS_FLOW } from "@/lib/types";
import { Field } from "@/components/ui/primitives";
import { SplitText } from "@/components/ui/motion-primitives";
import { BRAND } from "@/lib/data/brand";

const BENEFICIOS = [
  { title: "Tus pedidos", note: "Historial completo con guía de rastreo y estado en tiempo real." },
  { title: "Acceso anticipado", note: "Los drops abren 24 horas antes para quien tiene cuenta." },
  { title: "Tallas guardadas", note: "Tu talla por tipo de prenda, para no volver a medir." },
  { title: "Cambios en línea", note: "Solicitud de cambio de talla sin escribir un correo." },
];

export function AccountView() {
  const [mode, setMode] = useState<"entrar" | "crear">("entrar");
  const [sent, setSent] = useState(false);

  return (
    <>
      <header className="edge border-b rule pb-10 pt-14 md:pb-14 md:pt-20">
        <h1 className="display text-[clamp(2.8rem,10vw,6.5rem)] leading-[0.84]">
          <SplitText text="CUENTA" />
        </h1>
      </header>

      <div className="edge grid gap-14 py-14 pb-24 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div className="flex gap-7 border-b rule pb-4">
            {(["entrar", "crear"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setMode(value);
                  setSent(false);
                }}
                aria-pressed={mode === value}
                className={clsx(
                  "label transition-colors duration-300",
                  mode === value ? "text-bone" : "text-ash hover:text-concrete",
                )}
              >
                {value === "entrar" ? "Entrar" : "Crear cuenta"}
              </button>
            ))}
          </div>

          {sent ? (
            <div className="mt-8">
              <p className="serif-it text-2xl leading-snug">
                Las cuentas se habilitan cuando conectemos el backend.
              </p>
              <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-concrete">
                Esta demostración no guarda datos ni envía correos. La pantalla queda lista para conectarse a Supabase
                Auth: mismo formulario, misma validación, misma ruta.
              </p>
              <button type="button" onClick={() => setSent(false)} className="label mt-7 text-rojo hover:underline">
                Volver al formulario
              </button>
            </div>
          ) : (
            <form
              className="mt-8 space-y-7"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
            >
              {mode === "crear" ? (
                <div className="grid gap-7 sm:grid-cols-2">
                  <Field label="Nombre" name="firstName" required autoComplete="given-name" />
                  <Field label="Apellidos" name="lastName" required autoComplete="family-name" />
                </div>
              ) : null}

              <Field label="Correo" name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" />
              <Field
                label="Contraseña"
                name="password"
                type="password"
                required
                autoComplete={mode === "crear" ? "new-password" : "current-password"}
              />

              <button
                type="submit"
                className="label w-full bg-bone py-4 text-ink transition-colors duration-500 hover:bg-rojo hover:text-paper"
              >
                {mode === "entrar" ? "Entrar" : "Crear cuenta"}
              </button>

              <p className="label-sm text-ash">
                {mode === "entrar" ? (
                  <>¿Olvidaste tu contraseña? Escríbenos a {BRAND.contact.email}</>
                ) : (
                  <>Al crear tu cuenta aceptas recibir avisos de drops. Puedes darte de baja cuando quieras.</>
                )}
              </p>
            </form>
          )}
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <p className="label text-concrete">Qué incluye</p>
          <ul className="mt-6 divide-y divide-bone/10 border-y rule">
            {BENEFICIOS.map((item) => (
              <li key={item.title} className="grid gap-2 py-5 md:grid-cols-12 md:gap-6">
                <p className="label md:col-span-4">{item.title}</p>
                <p className="text-sm leading-relaxed text-concrete md:col-span-8">{item.note}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <p className="label text-concrete">Estados de un pedido</p>
            <ol className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-3">
              {ORDER_STATUS_FLOW.map((status, index) => (
                <li key={status} className="flex items-center gap-3">
                  <span className="label border rule px-3 py-2">{status}</span>
                  {index < ORDER_STATUS_FLOW.length - 1 ? (
                    <span aria-hidden className="h-px w-5 bg-bone/20" />
                  ) : null}
                </li>
              ))}
            </ol>
            <p className="label-sm mt-4 text-ash">
              Un pedido cancelado sale de este flujo y conserva su historial.
            </p>
          </div>

          <Link href="/favoritos" className="label link-draw mt-10 inline-block text-rojo">
            Ver tus favoritos
          </Link>
        </div>
      </div>
    </>
  );
}
