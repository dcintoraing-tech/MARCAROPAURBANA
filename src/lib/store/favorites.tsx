"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "margen.favorites.v1";

interface FavoritesContextValue {
  ids: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  count: number;
  hydrated: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setIds(parsed);
      }
    } catch {
      /* sin persistencia */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* sin persistencia */
    }
  }, [ids, hydrated]);

  const toggle = useCallback((slug: string) => {
    setIds((current) =>
      current.includes(slug) ? current.filter((s) => s !== slug) : [slug, ...current],
    );
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({ ids, has: (slug) => ids.includes(slug), toggle, count: ids.length, hydrated }),
    [ids, toggle, hydrated],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites debe usarse dentro de <FavoritesProvider>");
  return ctx;
}
