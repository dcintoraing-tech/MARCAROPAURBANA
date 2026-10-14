"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { CartItem, CartTotals, Coupon, Product, SizeCode } from "@/lib/types";
import { COUPONS, FREE_SHIPPING_THRESHOLD, SHIPPING_METHODS } from "@/lib/data/catalog";

const STORAGE_KEY = "margen.cart.v1";

type State = {
  items: CartItem[];
  couponCode: string | null;
  shippingMethodId: string;
};

type Action =
  | { type: "hydrate"; state: State }
  | { type: "add"; item: CartItem }
  | { type: "remove"; lineId: string }
  | { type: "quantity"; lineId: string; quantity: number }
  | { type: "coupon"; code: string | null }
  | { type: "shipping"; id: string }
  | { type: "clear" };

const initialState: State = {
  items: [],
  couponCode: null,
  shippingMethodId: SHIPPING_METHODS[0].id,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      const existing = state.items.find((i) => i.lineId === action.item.lineId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.lineId === action.item.lineId ? { ...i, quantity: i.quantity + action.item.quantity } : i,
          ),
        };
      }
      return { ...state, items: [action.item, ...state.items] };
    }
    case "remove":
      return { ...state, items: state.items.filter((i) => i.lineId !== action.lineId) };
    case "quantity":
      return {
        ...state,
        items: state.items
          .map((i) => (i.lineId === action.lineId ? { ...i, quantity: action.quantity } : i))
          .filter((i) => i.quantity > 0),
      };
    case "coupon":
      return { ...state, couponCode: action.code };
    case "shipping":
      return { ...state, shippingMethodId: action.id };
    case "clear":
      return { ...initialState };
    default:
      return state;
  }
}

/** Cálculo de totales. Única fuente de verdad del dinero en el cliente. */
export function computeTotals(items: CartItem[], coupon: Coupon | null, shippingMethodId: string): CartTotals {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const method = SHIPPING_METHODS.find((m) => m.id === shippingMethodId) ?? SHIPPING_METHODS[0];

  let discount = 0;
  let freeShipping = false;

  if (coupon && subtotal >= (coupon.minimum ?? 0)) {
    if (coupon.type === "porcentaje") discount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.type === "monto") discount = Math.min(coupon.value, subtotal);
    if (coupon.type === "envio") freeShipping = true;
  }

  const qualifiesByAmount = subtotal - discount >= FREE_SHIPPING_THRESHOLD;
  const baseShipping = items.length === 0 ? 0 : method.price;
  const shipping =
    freeShipping || (qualifiesByAmount && method.id === "ship-standard") ? 0 : baseShipping;

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - (subtotal - discount));

  return {
    subtotal,
    discount,
    shipping,
    total: Math.max(0, subtotal - discount + shipping),
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    remainingForFreeShipping: items.length === 0 ? FREE_SHIPPING_THRESHOLD : remaining,
  };
}

export function lineIdFor(productId: string, colorId: string, size: SizeCode) {
  return `${productId}:${colorId}:${size}`;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  totals: CartTotals;
  coupon: Coupon | null;
  couponError: string | null;
  shippingMethodId: string;
  /** Línea recién agregada: dispara el destello de confirmación en el drawer. */
  lastAdded: string | null;
  add: (input: {
    product: Product;
    size: SizeCode;
    colorId: string;
    quantity?: number;
  }) => void;
  remove: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  setShippingMethod: (id: string) => void;
  clear: () => void;
  hydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        if (Array.isArray(parsed.items)) {
          dispatch({ type: "hydrate", state: { ...initialState, ...parsed } });
        }
      }
    } catch {
      /* almacenamiento bloqueado: el carrito simplemente arranca vacío */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* sin persistencia */
    }
  }, [state, hydrated]);

  useEffect(() => () => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
  }, []);

  const coupon = useMemo(
    () => COUPONS.find((c) => c.code === state.couponCode) ?? null,
    [state.couponCode],
  );

  const totals = useMemo(
    () => computeTotals(state.items, coupon, state.shippingMethodId),
    [state.items, coupon, state.shippingMethodId],
  );

  const add: CartContextValue["add"] = useCallback(({ product, size, colorId, quantity = 1 }) => {
    const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
    const image = color.images?.[0] ?? product.images[0];
    const lineId = lineIdFor(product.id, color.id, size);

    dispatch({
      type: "add",
      item: {
        lineId,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image,
        price: product.price,
        size,
        color: { id: color.id, name: color.name, hex: color.hex },
        quantity,
        sku: `${product.sku}-${color.id.toUpperCase().slice(0, 3)}-${size}`,
      },
    });

    setLastAdded(lineId);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setLastAdded(null), 2600);
  }, []);

  const applyCoupon = useCallback((code: string) => {
    const found = COUPONS.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
    if (!found) {
      setCouponError("Ese código no existe.");
      return false;
    }
    setCouponError(null);
    dispatch({ type: "coupon", code: found.code });
    return true;
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      count: state.items.reduce((sum, i) => sum + i.quantity, 0),
      totals,
      coupon,
      couponError,
      shippingMethodId: state.shippingMethodId,
      lastAdded,
      add,
      remove: (lineId) => dispatch({ type: "remove", lineId }),
      setQuantity: (lineId, quantity) => dispatch({ type: "quantity", lineId, quantity }),
      applyCoupon,
      removeCoupon: () => {
        setCouponError(null);
        dispatch({ type: "coupon", code: null });
      },
      setShippingMethod: (id) => dispatch({ type: "shipping", id }),
      clear: () => dispatch({ type: "clear" }),
      hydrated,
    }),
    [state.items, state.shippingMethodId, totals, coupon, couponError, lastAdded, add, applyCoupon, hydrated],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
