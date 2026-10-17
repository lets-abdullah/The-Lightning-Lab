"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartLine } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/utils/format";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { updateLineAction, removeLineAction } from "@/lib/cart/actions";
import { useCartUi } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

interface CartLineItemProps {
  line: CartLine;
}

export function CartLineItem({ line }: CartLineItemProps) {
  const [isPending, startTransition] = useTransition();
  const setCart = useCartUi((state) => state.setCart);

  function handleQuantityChange(nextQty: number) {
    startTransition(async () => {
      const updatedCart = await updateLineAction({
        lineId: line.id,
        quantity: nextQty,
      });
      setCart(updatedCart);
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const updatedCart = await removeLineAction({ lineId: line.id });
      setCart(updatedCart);
    });
  }

  return (
    <div
      className={cn(
        "flex gap-4 py-4 border-b border-border/60 transition-opacity items-start",
        isPending && "opacity-60 pointer-events-none"
      )}
    >
      {/* Product Image */}
      <div className="relative size-16 shrink-0 rounded-md border bg-muted/20 overflow-hidden">
        <Image
          src={line.image}
          alt={line.title}
          fill
          sizes="64px"
          className="object-contain p-1"
        />
      </div>

      {/* Details & Controls */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${line.productHandle}`}
            className="text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
          >
            {line.title}
          </Link>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-destructive"
            aria-label={`Remove ${line.title}`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        {line.variantTitle && (
          <p className="text-xs text-muted-foreground truncate">
            {line.variantTitle}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono text-[11px]">SKU: {line.sku}</span>
          {line.bulkTierApplied && (
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              ({line.bulkTierApplied} bulk tier applied)
            </span>
          )}
        </div>

        {/* Stepper & Pricing Row */}
        <div className="flex items-center justify-between pt-2">
          <QuantityStepper
            value={line.quantity}
            min={1}
            max={999}
            onChange={handleQuantityChange}
            disabled={isPending}
          />

          <div className="text-right">
            <span className="text-sm font-bold text-foreground">
              {formatPrice(line.lineTotal)}
            </span>
            {line.quantity > 1 && (
              <p className="text-[11px] text-muted-foreground">
                {formatPrice(line.unitPrice)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
