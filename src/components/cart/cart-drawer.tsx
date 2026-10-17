"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight } from "lucide-react";
import type { Product, Cart } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/utils/format";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartUi } from "@/lib/cart/store";
import { FreeShippingBar } from "./free-shipping-bar";
import { CartLineItem } from "./cart-line-item";
import { DiscountForm } from "./discount-form";

export interface CartDrawerProps {
  crossSell?: Product[];
}

export function CartDrawer({ crossSell = [] }: CartDrawerProps) {
  const isOpen = useCartUi((state) => state.isOpen);
  const close = useCartUi((state) => state.close);
  const cart = useCartUi((state) => state.cart);

  const lines = cart?.lines || [];
  const isEmpty = !cart || lines.length === 0;

  const freeShippingRemaining =
    (cart as (Cart & { freeShippingRemaining?: number }) | null)
      ?.freeShippingRemaining ?? 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (!open ? close() : undefined)}>
      <SheetContent
        side="right"
        className="flex flex-col justify-between w-full sm:max-w-md p-0 gap-0"
      >
        <SheetHeader className="p-4 border-b text-left">
          <SheetTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <span>Your Cart</span>
            {cart && !isEmpty && (
              <span className="text-xs text-muted-foreground font-normal">
                ({lines.reduce((sum, l) => sum + l.quantity, 0)} items)
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            View items in your shopping cart
          </SheetDescription>
        </SheetHeader>

        {!cart || isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="size-16 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
              <ShoppingBag className="size-8" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-foreground">
                Your cart is empty
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                Add commercial fixtures, panels, or linear strip lighting to begin.
              </p>
            </div>
            <Button
              type="button"
              variant="default"
              onClick={close}
              className="mt-2 text-xs"
            >
              Continue shopping
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Free Shipping Bar */}
            <FreeShippingBar
              remaining={freeShippingRemaining}
              subtotal={cart.subtotal}
            />

            {/* Scrollable Line Items */}
            <div className="divide-y divide-border/60">
              {lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </div>

            {/* Discount Form */}
            <div className="pt-2">
              <DiscountForm applied={cart.discountCodes} />
            </div>

            {/* Cross-Sell Strip */}
            {crossSell.length > 0 && (
              <div className="pt-4 border-t space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Add a dimmer or driver
                </h4>
                <div className="space-y-2.5">
                  {crossSell.map((product) => {
                    const primaryVariant = product.variants[0];
                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between gap-3 p-2 rounded-md border bg-muted/20"
                      >
                        <div className="relative size-10 shrink-0 rounded bg-background border overflow-hidden">
                          <Image
                            src={product.images[0]?.url || "/placeholder.png"}
                            alt={product.title}
                            fill
                            sizes="40px"
                            className="object-contain p-0.5"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <Link
                            href={`/products/${product.handle}`}
                            onClick={close}
                            className="text-xs font-medium text-foreground hover:underline truncate block"
                          >
                            {product.title}
                          </Link>
                          <span className="text-xs font-bold text-foreground">
                            {formatPrice(primaryVariant?.price || product.price)}
                          </span>
                        </div>
                        <Link
                          href={`/products/${product.handle}`}
                          onClick={close}
                          className="shrink-0 text-xs font-semibold text-primary hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Totals & Checkout CTAs */}
        {!isEmpty && (
          <SheetFooter className="p-4 border-t bg-card space-y-3 sm:space-y-3 flex-col sm:flex-col">
            <div className="space-y-1.5 text-xs w-full">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">
                  {formatPrice(cart.subtotal)}
                </span>
              </div>
              {cart.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span className="font-medium">
                    -{formatPrice(cart.discountTotal)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground text-[11px]">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-base font-bold text-foreground pt-1.5 border-t">
                <span>Total</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full pt-1">
              <Button asChild variant="outline" size="sm" onClick={close}>
                <Link href="/cart">View cart</Link>
              </Button>
              <Button asChild size="sm" className="bg-[#b32318] hover:bg-[#8B1812] text-white">
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
