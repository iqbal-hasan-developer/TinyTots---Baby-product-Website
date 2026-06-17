"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductVariantSelection } from "@/lib/products";

export interface CartItem {
  id: string;
  lineId?: string;
  slug?: string;
  sku?: string;
  name: string;
  nameBn?: string;
  price: number;
  image?: string;
  selectedVariants?: ProductVariantSelection[];
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  hasHydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      addItem: (item) => set((state) => {
        const itemKey = item.lineId ?? item.id;
        const existing = state.items.find((i) => (i.lineId ?? i.id) === itemKey);
        if (existing) {
          return {
            items: state.items.map((i) =>
              (i.lineId ?? i.id) === itemKey ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        return { items: [...state.items, { ...item, lineId: itemKey, quantity: 1 }] };
      }),
      removeItem: (lineId) => set((state) => ({
        items: state.items.filter((i) => (i.lineId ?? i.id) !== lineId),
      })),
      updateQuantity: (lineId, quantity) => set((state) => ({
        items: state.items.map((i) =>
          (i.lineId ?? i.id) === lineId ? { ...i, quantity: Math.max(1, quantity) } : i
        ),
      })),
      clearCart: () => set({ items: [] }),
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "tinytots-cart",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
