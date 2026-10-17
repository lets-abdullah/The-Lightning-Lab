"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import type { Product, Cart } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { useCartUi } from "@/lib/cart/store";
import { FreeShippingBar } from "./free-shipping-bar";
import { CartLineItem } from "./cart-line-item";
import { DiscountForm } from "./discount-form";

interface CartViewProps {
  crossSell?: Product[];
}

export function CartView({ crossSell: _crossSell = [] }: CartViewProps) {
  const cart = useCartUi((state) => state.cart);

  const lines = cart?.lines || [];
  const isEmpty = !cart || lines.length === 0;

  const freeShippingRemaining =
    (cart as (Cart & { freeShippingRemaining?: number }) | null)
      ?.freeShippingRemaining ?? 0;

  if (!cart || isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-xl border bg-card space-y-4">
        <div className="size-20 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
          <ShoppingBag className="size-10" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">
            Your cart is empty
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Looks like you haven&apos;t added any commercial fixtures to your cart yet.
          </p>
        </div>
        <div className="pt-2">
          <Button asChild size="default">
            <Link href="/shop" className="gap-2">
              <span>Browse products</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 8 cols: Free Shipping + Line Items */}
      <div className="lg:col-span-8 space-y-6">
        <FreeShippingBar
          remaining={freeShippingRemaining}
          subtotal={cart.subtotal}
        />

        <div className="rounded-xl border bg-card p-6 divide-y divide-border/60">
          {lines.map((line) => (
            <CartLineItem key={line.id} line={line} />
          ))}
        </div>
      </div>

      {/* Right 4 cols: Discounts + Summary */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-xl border bg-card p-6 space-y-6">
          <h2 className="text-lg font-bold text-foreground border-b pb-3">
            Order Summary
          </h2>

          <DiscountForm applied={cart.discountCodes} />

          <div className="space-y-3 text-sm pt-2">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">
                {formatPrice(cart.subtotal)}
              </span>
            </div>

            {cart.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Discount</span>
                <span>-{formatPrice(cart.discountTotal)}</span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground text-xs">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="flex justify-between text-muted-foreground text-xs">
              <span>Estimated tax</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="flex justify-between text-lg font-bold text-foreground pt-3 border-t">
              <span>Total</span>
              <span>{formatPrice(cart.total)}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Button asChild className="w-full bg-[#b32318] hover:bg-[#8B1812] text-white font-semibold">
              <Link href="/checkout">Proceed to checkout</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/shop">Continue shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
