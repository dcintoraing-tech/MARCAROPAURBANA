/** Iconografía: trazo de 1.2, esquinas rectas, mismo peso que la tipografía. */

type IconProps = { className?: string };

const base = "none";

export function IconSearch({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill={base} stroke="currentColor" strokeWidth="1.2" className={className} aria-hidden>
      <circle cx="9" cy="9" r="5.4" />
      <path d="M13 13 L17.5 17.5" />
    </svg>
  );
}

export function IconBag({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill={base} stroke="currentColor" strokeWidth="1.2" className={className} aria-hidden>
      <path d="M3.4 6h13.2l-1 11.4H4.4L3.4 6Z" />
      <path d="M7.2 8V5.4a2.8 2.8 0 0 1 5.6 0V8" />
    </svg>
  );
}

export function IconUser({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill={base} stroke="currentColor" strokeWidth="1.2" className={className} aria-hidden>
      <circle cx="10" cy="6.6" r="3.3" />
      <path d="M3.6 17.4c.6-3.5 3.2-5.4 6.4-5.4s5.8 1.9 6.4 5.4" />
    </svg>
  );
}

export function IconHeart({ className, filled }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : base}
      stroke="currentColor"
      strokeWidth="1.2"
      className={className}
      aria-hidden
    >
      <path d="M10 16.6S3.2 12.5 3.2 7.9A3.6 3.6 0 0 1 10 6.1a3.6 3.6 0 0 1 6.8 1.8c0 4.6-6.8 8.7-6.8 8.7Z" />
    </svg>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill={base} stroke="currentColor" strokeWidth="1.2" className={className} aria-hidden>
      <path d="M4.5 4.5 15.5 15.5M15.5 4.5 4.5 15.5" />
    </svg>
  );
}

export function IconArrow({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill={base} stroke="currentColor" strokeWidth="1.2" className={className} aria-hidden>
      <path d="M3 10h14M12 5l5 5-5 5" />
    </svg>
  );
}

export function IconFilter({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill={base} stroke="currentColor" strokeWidth="1.2" className={className} aria-hidden>
      <path d="M2.5 6h15M5.5 10h9M8.5 14h3" />
    </svg>
  );
}
