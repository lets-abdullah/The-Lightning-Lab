"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Shield, Truck, Zap, CreditCard } from "lucide-react";
import type { Product, ProductVariant } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { addLineAction } from "@/lib/cart/actions";
import { useCartUi } from "@/lib/cart/store";
import { StarRow } from "./star-row";
import { OptionSelector } from "./option-selector";
import { QuantityStepper } from "./quantity-stepper";
import { ShippingEstimator } from "./shipping-estimator";

interface ProductPurchasePanelProps {
  product: Product;
  selectedVariant: ProductVariant;
  onOptionChange: (name: string, value: string) => void;
}

export function ProductPurchasePanel({
  product,
  selectedVariant,
  onOptionChange,
}: ProductPurchasePanelProps) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [showStickyBottom, setShowStickyBottom] = useState(false);
  const [isPending, startTransition] = useTransition();
  const titleRef = useRef<HTMLHeadingElement>(null);

  function handleAddToCart() {
    if (isOutOfStock) return;

    startTransition(async () => {
      try {
        const freshCart = await addLineAction({
          variantId: selectedVariant.id,
          quantity: qty,
        });
        useCartUi.getState().setCart(freshCart);
        useCartUi.getState().open();
        setQty(1);
      } catch (_err) {
        toast.error("This item is no longer available");
      }
    });
  }

  function handleBuyNow() {
    if (isOutOfStock) return;

    startTransition(async () => {
      try {
        const freshCart = await addLineAction({
          variantId: selectedVariant.id,
          quantity: qty,
        });
        useCartUi.getState().setCart(freshCart);
        router.push("/checkout");
      } catch (_err) {
        toast.error("Unable to start instant checkout");
      }
    });
  }

  // IntersectionObserver on <h1> for mobile sticky bar
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setShowStickyBottom(true);
        } else {
          setShowStickyBottom(false);
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isOutOfStock = selectedVariant.inventoryQuantity === 0;
  const isSale =
    Boolean(selectedVariant.compareAtPrice) &&
    selectedVariant.compareAtPrice! > selectedVariant.price;
  const savings = isSale && selectedVariant.compareAtPrice
    ? selectedVariant.compareAtPrice - selectedVariant.price
    : 0;
  const savingsPct = isSale && selectedVariant.compareAtPrice
    ? Math.round((savings / selectedVariant.compareAtPrice) * 100)
    : 0;

  const installmentPrice = (selectedVariant.price / 400).toFixed(2);

  return (
    <div className="space-y-5 text-gray-900">
      {/* Brand & Vendor */}
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
        <span>{product.brand || "The Lightning Lab"}</span>
        <span className="font-mono text-gray-400 font-normal">SKU: {selectedVariant.sku}</span>
      </div>

      {/* Title */}
      <h1
        ref={titleRef}
        className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950 leading-snug"
      >
        {product.title}
      </h1>

      {/* Ratings & Stock Status Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-gray-100 pb-4">
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <StarRow rating={product.rating?.average ?? 5} />
          <span className="font-bold text-gray-900">
            {product.rating?.average?.toFixed(1) ?? "5.0"}
          </span>
          <span className="text-gray-500">
            ({product.rating?.count ?? 16} reviews)
          </span>
        </div>

        {/* Stock Badge */}
        <div className="flex items-center gap-1.5">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full">
              <span className="size-2 rounded-full bg-neutral-400" />
              Out of stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              In Stock — Ships Same Day
            </span>
          )}
        </div>
      </div>

      {/* Price block */}
      <div className="space-y-1.5 bg-gray-50/70 border border-gray-200/80 rounded-xl p-4">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-red-600">
            {formatPrice(selectedVariant.price, product.currency)}
          </span>
          {isSale && selectedVariant.compareAtPrice && (
            <>
              <span className="text-lg sm:text-xl text-gray-400 line-through font-medium">
                {formatPrice(selectedVariant.compareAtPrice, product.currency)}
              </span>
              <span className="bg-red-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                Save {formatPrice(savings, product.currency)} ({savingsPct}%)
              </span>
            </>
          )}
        </div>

        <p className="text-xs text-gray-500 flex items-center gap-1 pt-1">
          <span>or 4 interest-free payments of</span>
          <strong className="text-gray-900 font-semibold">${installmentPrice}</strong>
          <span>with</span>
          <span className="font-bold text-pink-700 uppercase text-[11px] tracking-wide">Klarna</span>
        </p>
      </div>

      {/* Option Selector */}
      <OptionSelector
        options={product.options}
        variants={product.variants}
        selectedValues={selectedVariant.optionValues}
        onChange={onOptionChange}
      />

      {/* Bulk Pricing Tier Box */}
      {product.bulkPricing && product.bulkPricing.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-3.5 bg-white shadow-2xs">
          <div className="text-xs font-bold text-gray-900 mb-2 flex items-center justify-between">
            <span>Buy in bulk and save</span>
            <span className="text-[11px] text-red-600 font-semibold">Tiered Contractor Discounts</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-gray-50 border border-gray-200 rounded p-2">
              <div className="text-[11px] text-gray-500 font-medium">1 - 9 units</div>
              <div className="font-bold text-gray-900 mt-0.5">
                {formatPrice(selectedVariant.price, product.currency)}
              </div>
            </div>
            {product.bulkPricing.slice(0, 2).map((tier) => {
              const discountPct = Math.round(((selectedVariant.price - tier.price) / selectedVariant.price) * 100);
              return (
                <div key={tier.minQty} className="bg-red-50/50 border border-red-200 rounded p-2">
                  <div className="text-[11px] text-gray-600 font-medium">{tier.minQty}+ units</div>
                  <div className="font-bold text-red-600 mt-0.5">
                    {formatPrice(tier.price, product.currency)}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">
                    Save {discountPct > 0 ? discountPct : 10}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Purchase Actions */}
      <div className="space-y-3 pt-2">
        {/* Quantity Stepper + Add to Cart */}
        <div className="flex items-center gap-3">
          <QuantityStepper
            value={qty}
            onChange={setQty}
            min={1}
            disabled={isOutOfStock || isPending}
          />
          <Button
            size="lg"
            disabled={isOutOfStock || isPending}
            onClick={handleAddToCart}
            className="flex-1 h-12 bg-black hover:bg-neutral-800 text-white font-bold text-sm sm:text-base rounded-lg transition-colors shadow-xs"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                <span>Adding to Cart...</span>
              </>
            ) : isOutOfStock ? (
              "Out of stock"
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>

        {/* Buy It Now (Express Checkout) */}
        {!isOutOfStock && (
          <Button
            size="lg"
            type="button"
            disabled={isPending}
            onClick={handleBuyNow}
            className="w-full h-12 bg-[#5A31F4] hover:bg-[#4822d6] text-white font-bold text-sm sm:text-base rounded-lg transition-colors shadow-xs"
          >
            Buy It Now
          </Button>
        )}
      </div>

      {/* Guaranteed Safe Checkout Badges */}
      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 text-center space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          Guaranteed Safe & Secure Checkout
        </span>
        <div className="flex items-center justify-center gap-2 flex-wrap text-gray-600 text-xs font-semibold">
          <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[11px]">Visa</span>
          <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[11px]">Mastercard</span>
          <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[11px]">Amex</span>
          <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[11px]">PayPal</span>
          <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[11px]">Apple Pay</span>
          <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[11px]">Google Pay</span>
        </div>
      </div>

      {/* Shipping Estimator */}
      <ShippingEstimator />

      {/* Key Feature Bullet Points */}
      <div className="border-t border-gray-200 pt-5 space-y-2.5">
        <div className="flex items-start gap-2.5 text-xs text-gray-700">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
          <span><strong className="text-gray-900">DLC 5.1 Premium Qualified</strong> — Maximize local utility cash rebates</span>
        </div>
        <div className="flex items-start gap-2.5 text-xs text-gray-700">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
          <span><strong className="text-gray-900">0-10V Smooth Dimming</strong> — Flicker-free architectural dimming to 10%</span>
        </div>
        <div className="flex items-start gap-2.5 text-xs text-gray-700">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
          <span><strong className="text-gray-900">120-277V Input</strong> — Commercial multi-voltage auto-sensing internal driver</span>
        </div>
        <div className="flex items-start gap-2.5 text-xs text-gray-700">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
          <span><strong className="text-gray-900">5-Year Manufacturer Warranty</strong> — Heavy duty commercial warranty support</span>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      {showStickyBottom && (
        <aside
          aria-label="Quick checkout actions"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 px-4 flex items-center justify-between shadow-lg"
        >
          <div>
            <span className="text-lg font-bold text-red-600">
              {formatPrice(selectedVariant.price, product.currency)}
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isPending}
            className="bg-black hover:bg-neutral-800 text-white font-bold"
          >
            {isOutOfStock ? "Out of stock" : "Add to Cart"}
          </Button>
        </aside>
      )}
    </div>
  );
}
