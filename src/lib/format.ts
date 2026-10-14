/** Todo el dinero del proyecto vive en centavos MXN. Aquí se vuelve legible. */

const MXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const MXN_CENTS = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

export function price(cents: number): string {
  return cents % 100 === 0 ? MXN.format(cents / 100) : MXN_CENTS.format(cents / 100);
}

export function plainPrice(cents: number): string {
  return new Intl.NumberFormat("es-MX", { minimumFractionDigits: 0 }).format(cents / 100);
}

/** "2026-09-29" se interpreta como UTC y en México se vería un día antes. */
function parseDate(iso: string): Date {
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T12:00:00`) : new Date(iso);
}

const LONG_DATE = new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "long", year: "numeric" });
const SHORT_DATE = new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "2-digit", year: "2-digit" });

export function longDate(iso: string): string {
  return LONG_DATE.format(parseDate(iso));
}

export function shortDate(iso: string): string {
  return SHORT_DATE.format(parseDate(iso));
}

export function pad(value: number): string {
  return value.toString().padStart(2, "0");
}
