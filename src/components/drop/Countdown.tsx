"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { pad } from "@/lib/format";

interface CountdownProps {
  /** Fecha objetivo en ISO. */
  target: string;
  className?: string;
  size?: "sm" | "lg";
  label?: string;
}

type Remaining = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function remainingFrom(target: string): Remaining {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

/**
 * El contador sólo arranca en el cliente: así el HTML del servidor y el del
 * navegador coinciden y no hay parpadeo de hidratación.
 */
export function Countdown({ target, className, size = "lg", label }: CountdownProps) {
  const [time, setTime] = useState<Remaining | null>(null);

  useEffect(() => {
    setTime(remainingFrom(target));
    const id = setInterval(() => setTime(remainingFrom(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { value: time?.days, label: "días" },
    { value: time?.hours, label: "hrs" },
    { value: time?.minutes, label: "min" },
    { value: time?.seconds, label: "seg" },
  ];

  return (
    <div className={className}>
      {label ? <p className="label mb-4 text-concrete">{label}</p> : null}
      <div className="flex items-end gap-5 md:gap-8">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col">
            <span
              className={clsx(
                "font-mono tabular-nums leading-none",
                size === "lg" ? "text-[clamp(2.4rem,8vw,4.6rem)]" : "text-2xl",
              )}
            >
              {unit.value === undefined ? "––" : pad(unit.value)}
            </span>
            <span className="label-sm mt-2 text-concrete">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Barra de piezas restantes de una serie. */
export function PiecesBar({ remaining, total, className }: { remaining: number; total: number; className?: string }) {
  const sold = Math.max(0, total - remaining);
  const percent = Math.min(100, Math.round((sold / total) * 100));

  return (
    <div className={className}>
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="label text-concrete">Piezas colocadas</span>
        <span className="font-mono text-sm tabular-nums">
          {sold}
          <span className="text-concrete"> / {total}</span>
        </span>
      </div>
      <div className="h-px w-full bg-bone/15">
        <div className="h-px bg-rojo transition-[width] duration-1000" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
