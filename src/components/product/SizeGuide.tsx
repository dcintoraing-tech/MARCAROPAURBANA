"use client";

import { AnimatePresence, motion } from "motion/react";
import { clsx } from "clsx";
import { useEffect, useMemo, useState } from "react";
import type { SizeCode } from "@/lib/types";
import { SIZE_CHARTS } from "@/lib/data/catalog";
import { IconClose } from "@/components/ui/icons";
import { EASE } from "@/components/ui/motion-primitives";

type Fit = "cenido" | "normal" | "holgado";

const FITS: { value: Fit; label: string; note: string }[] = [
  { value: "cenido", label: "Ceñido", note: "Pegado al cuerpo" },
  { value: "normal", label: "Como marca", note: "El corte original" },
  { value: "holgado", label: "Holgado", note: "Una talla de más" },
];

/**
 * Recomendador de talla. No es un adivinador: combina estatura y peso para
 * estimar el contorno de pecho, lo compara con la tabla real de la prenda y
 * mueve el resultado según la preferencia de ajuste.
 */
function recommend(heightCm: number, weightKg: number, fit: Fit, chartId: string): { size: SizeCode; reason: string } {
  const chart = SIZE_CHARTS[chartId] ?? SIZE_CHARTS.superior;
  const isLower = chartId === "inferior";

  // Estimación del contorno (pecho o cintura) a partir de estatura y peso.
  const estimated = isLower
    ? 0.42 * weightKg + 0.28 * heightCm + 12
    : 0.78 * weightKg + 0.2 * heightCm + 18;

  const key = isLower ? "waist" : "chest";
  const ordered = chart.rows;

  let index = ordered.findIndex((row) => {
    const value = (row[key] as number | undefined) ?? 0;
    // Las medidas de la tabla son de la prenda plana: se duplican al contorno.
    return value * 2 >= estimated + (isLower ? 4 : 10);
  });

  if (index === -1) index = ordered.length - 1;
  if (fit === "holgado") index = Math.min(ordered.length - 1, index + 1);
  if (fit === "cenido") index = Math.max(0, index - 1);

  const row = ordered[index];
  const reason = isLower
    ? `Cintura estimada ${Math.round(estimated)} cm · la talla ${row.code} mide ${row.waist} cm de pretina.`
    : `Contorno de pecho estimado ${Math.round(estimated)} cm · la talla ${row.code} mide ${row.chest} cm de ancho plano.`;

  return { size: row.code, reason };
}

export function SizeGuide({
  open,
  onClose,
  chartId,
  onPick,
  initialTab = "tabla",
}: {
  open: boolean;
  onClose: () => void;
  chartId: string;
  onPick?: (size: SizeCode) => void;
  /** "¿Cuál es mi talla?" entra directo al recomendador. */
  initialTab?: "tabla" | "calculadora";
}) {
  const chart = SIZE_CHARTS[chartId] ?? SIZE_CHARTS.superior;
  const [tab, setTab] = useState<"tabla" | "calculadora">(initialTab);

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[120] flex items-end justify-center md:items-center" role="dialog" aria-modal="true" aria-label="Guía de tallas">
          <motion.button
            type="button"
            aria-label="Cerrar guía de tallas"
            onClick={onClose}
            className="absolute inset-0 h-full w-full bg-ink/80 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative flex max-h-[90svh] w-full max-w-2xl flex-col border rule bg-ink"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <header className="flex items-center justify-between border-b rule px-5 py-4 md:px-7">
              <h2 className="label">Guía de tallas</h2>
              <button type="button" onClick={onClose} aria-label="Cerrar" className="p-1 hover:text-rojo">
                <IconClose className="h-5 w-5" />
              </button>
            </header>

            <div className="flex border-b rule">
              {(["tabla", "calculadora"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value)}
                  className={clsx(
                    "label flex-1 py-3.5 transition-colors duration-300",
                    tab === value ? "bg-bone text-ink" : "text-concrete hover:text-bone",
                  )}
                >
                  {value === "tabla" ? "Tabla de medidas" : "¿Cuál es mi talla?"}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 md:px-7">
              {tab === "tabla" ? <SizeTable chartId={chartId} /> : <SizeFinder chartId={chartId} onPick={onPick} onClose={onClose} />}
            </div>

            <footer className="border-t rule px-5 py-4 md:px-7">
              <p className="label-sm leading-relaxed text-ash">{chart.note}</p>
            </footer>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function SizeTable({ chartId }: { chartId: string }) {
  const chart = SIZE_CHARTS[chartId] ?? SIZE_CHARTS.superior;

  return (
    <div>
      <p className="label mb-5 text-concrete">
        {chart.label} · medidas en {chart.unit}
      </p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b rule">
            <th scope="col" className="label py-3 text-left text-concrete">
              Talla
            </th>
            {chart.columns.map((column) => (
              <th key={String(column.key)} scope="col" className="label py-3 text-right text-concrete">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chart.rows.map((row) => (
            <tr key={row.code} className="border-b rule">
              <th scope="row" className="label py-3.5 text-left">
                {row.code}
              </th>
              {chart.columns.map((column) => (
                <td key={String(column.key)} className="py-3.5 text-right font-mono text-sm tabular-nums text-bone/85">
                  {(row[column.key] as number | undefined) ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SizeFinder({
  chartId,
  onPick,
  onClose,
}: {
  chartId: string;
  onPick?: (size: SizeCode) => void;
  onClose: () => void;
}) {
  const [height, setHeight] = useState(172);
  const [weight, setWeight] = useState(72);
  const [fit, setFit] = useState<Fit>("normal");
  const [done, setDone] = useState(false);

  const result = useMemo(() => recommend(height, weight, fit, chartId), [height, weight, fit, chartId]);

  return (
    <div>
      <div className="space-y-7">
        <Slider label="Estatura" value={height} min={150} max={200} unit="cm" onChange={setHeight} />
        <Slider label="Peso" value={weight} min={45} max={130} unit="kg" onChange={setWeight} />

        <div>
          <span className="label mb-3 block text-concrete">Cómo te gusta que te quede</span>
          <div className="grid grid-cols-3 gap-2">
            {FITS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFit(option.value)}
                aria-pressed={fit === option.value}
                className={clsx(
                  "border px-2 py-3 text-left transition-colors duration-300",
                  fit === option.value ? "border-bone bg-bone text-ink" : "rule hover:border-bone",
                )}
              >
                <span className="label block">{option.label}</span>
                <span className={clsx("label-sm mt-1.5 block", fit === option.value ? "text-ink/60" : "text-ash")}>
                  {option.note}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t rule pt-6">
        {done ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="label text-concrete">Tu talla</p>
            <p className="display mt-3 text-[4rem] leading-none text-rojo">{result.size}</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-concrete">{result.reason}</p>
            {onPick ? (
              <button
                type="button"
                onClick={() => {
                  onPick(result.size);
                  onClose();
                }}
                className="label mt-6 bg-bone px-6 py-3.5 text-ink transition-colors hover:bg-rojo hover:text-paper"
              >
                Usar talla {result.size}
              </button>
            ) : null}
          </motion.div>
        ) : (
          <button
            type="button"
            onClick={() => setDone(true)}
            className="label w-full bg-bone py-4 text-ink transition-colors hover:bg-rojo hover:text-paper"
          >
            Calcular mi talla
          </button>
        )}
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-3 flex items-baseline justify-between">
        <span className="label text-concrete">{label}</span>
        <span className="font-mono text-sm tabular-nums">
          {value} {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1 w-full cursor-pointer appearance-none bg-bone/20 accent-rojo"
      />
    </label>
  );
}
