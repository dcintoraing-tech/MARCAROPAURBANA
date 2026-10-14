import { clsx } from "clsx";

/**
 * Sistema de identidad de MARGEN.
 *
 * El logotipo es la palabra precedida por una regla vertical: la línea del
 * margen de una hoja. El monograma aísla esa idea —regla a la izquierda, bloque
 * de texto a la derecha— y es lo que se usa en etiqueta, favicon y bordado.
 * Nada más. No hay escudo, corona ni emblema: la marca es una línea.
 */

type Tone = "bone" | "ink" | "rojo" | "current";

const TONE: Record<Tone, string> = {
  bone: "#E9E5DD",
  ink: "#09090A",
  rojo: "#E2341D",
  current: "currentColor",
};

interface MarkProps {
  className?: string;
  tone?: Tone;
  /** La regla puede ir en rojo mientras el resto queda monocromo. */
  accent?: boolean;
  title?: string;
}

/** Monograma. Cuadrado, funciona desde 16 px. */
export function MargenMark({ className, tone = "current", accent = false, title }: MarkProps) {
  const color = TONE[tone];
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <rect x="0.75" y="0.75" width="30.5" height="30.5" stroke={color} strokeWidth="1.5" />
      <rect x="9" y="0.75" width="1.75" height="30.5" fill={accent ? TONE.rojo : color} />
      <rect x="15" y="14.5" width="11" height="3" fill={color} />
    </svg>
  );
}

interface WordmarkProps {
  className?: string;
  tone?: Tone;
  accent?: boolean;
  /** Oculta la regla cuando el bloque ya está dentro de una caja. */
  rule?: boolean;
}

/** Logotipo horizontal: regla + palabra. */
export function MargenWordmark({ className, tone = "current", accent = true, rule = true }: WordmarkProps) {
  const color = TONE[tone];
  return (
    <span className={clsx("inline-flex items-stretch gap-[0.42em] leading-none", className)}>
      {rule ? (
        <span
          aria-hidden
          className="w-[0.09em] shrink-0 self-stretch"
          style={{ background: accent ? TONE.rojo : color }}
        />
      ) : null}
      <span
        className="display"
        style={{ color: tone === "current" ? undefined : color, letterSpacing: "-0.03em" }}
      >
        MARGEN
      </span>
    </span>
  );
}

/** Bloque vertical para etiqueta de prenda y pie de página. */
export function MargenStack({ className, tone = "current" }: MarkProps) {
  const color = TONE[tone];
  return (
    <span className={clsx("inline-flex flex-col gap-2", className)} style={{ color }}>
      <MargenWordmark tone={tone} className="text-[1.6em]" />
      <span className="label-sm pl-[0.55em] opacity-60">Ciudad de México · MX</span>
    </span>
  );
}
