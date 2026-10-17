"use client";

import { FREE_SHIPPING_THRESHOLD } from "@/lib/cart/constants";
import { formatPrice } from "@/lib/utils/format";

interface FreeShippingBarProps {
  remaining: number;
  subtotal: number;
}

export function FreeShippingBar({ remaining, subtotal }: FreeShippingBarProps) {
  const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="space-y-1.5 p-3 rounded-md bg-muted/40 border">
      <p className="text-xs font-medium text-foreground text-center">
        {remaining > 0 ? (
          <>
            You&apos;re <span className="font-bold text-primary">{formatPrice(remaining)}</span> away from free shipping
          </>
        ) : (
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            You&apos;ve unlocked free shipping!
          </span>
        )}
      </p>

      {/* Track & Fill */}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
