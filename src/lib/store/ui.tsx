"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Panel = "cart" | "search" | "menu" | "size-guide" | null;

interface UIContextValue {
  panel: Panel;
  open: (panel: Exclude<Panel, null>) => void;
  close: () => void;
  toggle: (panel: Exclude<Panel, null>) => void;
  isOpen: (panel: Exclude<Panel, null>) => boolean;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null);
  const pathname = usePathname();

  /* Cambiar de página cierra cualquier panel abierto: ningún enlace tiene que
     acordarse de hacerlo por su cuenta. */
  useEffect(() => {
    setPanel(null);
  }, [pathname]);

  const close = useCallback(() => setPanel(null), []);
  const open = useCallback((next: Exclude<Panel, null>) => setPanel(next), []);
  const toggle = useCallback(
    (next: Exclude<Panel, null>) => setPanel((current) => (current === next ? null : next)),
    [],
  );

  /* Escape cierra cualquier panel y el scroll se bloquea mientras haya uno abierto. */
  useEffect(() => {
    if (!panel) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", onKey);

    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.overflow = previous;
    };
  }, [panel]);

  const value = useMemo<UIContextValue>(
    () => ({ panel, open, close, toggle, isOpen: (p) => panel === p }),
    [panel, open, close, toggle],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI debe usarse dentro de <UIProvider>");
  return ctx;
}
