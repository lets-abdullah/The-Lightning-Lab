"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { applyDiscountAction, removeDiscountAction } from "@/lib/cart/actions";
import { useCartUi } from "@/lib/cart/store";

interface DiscountFormProps {
  applied?: string[];
}

export function DiscountForm({ applied = [] }: DiscountFormProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const setCart = useCartUi((state) => state.setCart);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setError(null);
    startTransition(async () => {
      const result = await applyDiscountAction({ code });
      if (!result.ok) {
        setError(result.error);
      } else {
        setCart(result.cart);
        setCode("");
      }
    });
  }

  function handleRemove(c: string) {
    startTransition(async () => {
      const updatedCart = await removeDiscountAction({ code: c });
      setCart(updatedCart);
    });
  }

  return (
    <div className="space-y-2.5">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Discount code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError(null);
          }}
          disabled={isPending}
          className="h-9 text-xs uppercase"
          aria-label="Discount code"
        />
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          disabled={isPending || !code.trim()}
          className="h-9 px-3 text-xs shrink-0"
        >
          Apply
        </Button>
      </form>

      {error && (
        <p className="text-xs text-destructive font-medium">{error}</p>
      )}

      {/* Applied Discount Chips */}
      {applied.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {applied.map((c) => (
            <Badge
              key={c}
              variant="secondary"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold uppercase"
            >
              <span>{c}</span>
              <button
                type="button"
                onClick={() => handleRemove(c)}
                disabled={isPending}
                className="rounded-full p-0.5 hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary"
                aria-label={`Remove coupon ${c}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
