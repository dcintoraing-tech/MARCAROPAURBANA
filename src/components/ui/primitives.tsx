"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { EASE } from "./motion-primitives";

/* ── Botones ──────────────────────────────────────────────────────────── */

type Variant = "solid" | "outline" | "ghost" | "inverse";

const VARIANTS: Record<Variant, string> = {
  solid: "bg-bone text-ink hover:bg-rojo hover:text-paper",
  inverse: "bg-ink text-bone hover:bg-rojo hover:text-paper",
  outline: "border border-bone/35 text-bone hover:border-bone hover:bg-bone hover:text-ink",
  ghost: "text-bone hover:text-rojo",
};

interface ActionProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  full?: boolean;
  cursor?: string;
}

export function Action({
  children,
  href,
  onClick,
  variant = "solid",
  className,
  disabled,
  type = "button",
  full,
  cursor,
}: ActionProps) {
  const classes = clsx(
    "label inline-flex items-center justify-center gap-3 px-6 py-4 transition-colors duration-500 disabled:cursor-not-allowed disabled:opacity-40",
    VARIANTS[variant],
    full && "w-full",
    className,
  );

  if (href && !disabled) {
    return (
      <Link href={href} onClick={onClick} className={classes} data-cursor={cursor}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} data-cursor={cursor}>
      {children}
    </button>
  );
}

/* ── Acordeón ─────────────────────────────────────────────────────────── */

export interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

export function Accordion({
  items,
  defaultOpen,
  className,
  tone = "dark",
}: {
  items: AccordionItem[];
  defaultOpen?: number;
  className?: string;
  tone?: "dark" | "light";
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen ?? null);
  const base = useId();
  const border = tone === "dark" ? "border-bone/12" : "border-ink/12";
  const muted = tone === "dark" ? "text-concrete" : "text-ash";

  return (
    <div className={clsx("border-t", border, className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.title} className={clsx("border-b", border)}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${base}-${index}`}
              onClick={() => setOpen(isOpen ? null : index)}
              className="label flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-300 hover:text-rojo"
            >
              {item.title}
              <span aria-hidden className="relative h-3 w-3 shrink-0">
                <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
                <span
                  className={clsx(
                    "absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-500",
                    isOpen && "scale-y-0",
                  )}
                />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={`${base}-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className={clsx("pb-6 pr-6 text-sm leading-relaxed", muted)}>{item.content}</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ── Campos de formulario ─────────────────────────────────────────────── */

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  maxLength?: number;
}

export function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
  value,
  onChange,
  error,
  className,
  inputMode,
  maxLength,
}: FieldProps) {
  return (
    <label className={clsx("block", className)}>
      <span className="label-sm mb-2 block text-concrete">
        {label}
        {required ? <span className="text-rojo"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        aria-invalid={Boolean(error)}
        className={clsx(
          "w-full border-b bg-transparent pb-3 pt-1 text-base outline-none transition-colors duration-300",
          error ? "border-rojo" : "border-bone/20 focus:border-bone",
        )}
      />
      {error ? <span className="label-sm mt-2 block text-rojo">{error}</span> : null}
    </label>
  );
}

export function Select({
  label,
  name,
  value,
  onChange,
  options,
  className,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  required?: boolean;
}) {
  return (
    <label className={clsx("block", className)}>
      <span className="label-sm mb-2 block text-concrete">
        {label}
        {required ? <span className="text-rojo"> *</span> : null}
      </span>
      <div className="relative">
        <select
          name={name}
          value={value}
          required={required}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none border-b border-bone/20 bg-transparent pb-3 pt-1 text-base outline-none transition-colors duration-300 focus:border-bone"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-ink text-bone">
              {option.label}
            </option>
          ))}
        </select>
        <span aria-hidden className="pointer-events-none absolute bottom-4 right-0 text-concrete">
          ↓
        </span>
      </div>
    </label>
  );
}

/* ── Encabezado de sección ────────────────────────────────────────────── */

export function SectionHeading({
  index,
  title,
  note,
  className,
}: {
  index: string;
  title: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={clsx("flex flex-wrap items-baseline justify-between gap-4 border-t rule pt-4", className)}>
      <div className="flex items-baseline gap-4">
        <span className="label text-rojo">{index}</span>
        <h2 className="display text-2xl md:text-3xl">{title}</h2>
      </div>
      {note ? <span className="label text-concrete">{note}</span> : null}
    </div>
  );
}
