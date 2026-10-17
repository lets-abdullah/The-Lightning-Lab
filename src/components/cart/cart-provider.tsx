"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Cart } from "@/lib/commerce/types";
import { useCartUi } from "@/lib/cart/store";

interface CartProviderProps {
  initialCart: Cart | null;
  children: ReactNode;
}

export function CartProvider({ initialCart, children }: CartProviderProps) {
  const pathname = usePathname();
  const setCart = useCartUi((state) => state.setCart);

  // Sync initialCart on mount and whenever initialCart prop updates (e.g. across server navigation)
  useEffect(() => {
    if (initialCart) {
      setCart(initialCart);
    }
  }, [initialCart, pathname, setCart]);

  return <>{children}</>;
}
