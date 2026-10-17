"use client";

import { create } from "zustand";
import type { Cart } from "@/lib/commerce/types";

interface CartUiState {
  cart: Cart | null;
  isOpen: boolean;
  isPending: boolean;
  open: () => void;
  close: () => void;
  setCart: (cart: Cart) => void;
  clear: () => void;
}

export const useCartUi = create<CartUiState>((set) => ({
  cart: null,
  isOpen: false,
  isPending: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setCart: (cart: Cart) => set({ cart }),
  clear: () => set({ cart: null }),
}));
