"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Check, Loader2 } from "lucide-react";
import type { Product, ProductVariant } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { addLineAction } from "@/lib/cart/actions";
import { useCartUi } from "@/lib/cart/store";
import { toast } from "sonner";

interface FrequentlyBoughtTogetherProps {
  product: Product;
  selectedVariant: ProductVariant;
}

export function FrequentlyBoughtTogether({
  product,
  selectedVariant,
}: FrequentlyBoughtTogetherProps) {
  const [includeMain, setIncludeMain] = useState(true);
  const [includeBackup, setIncludeBackup] = useState(true);
  const [includeMount, setIncludeMount] = useState(true);
  const [isPending, startTransition] = useTransition();

  const backupItem = {
    title: "UL 924 90-Min Emergency Battery Backup Driver",
    price: 3499, // $34.99
    image: "/images/accessories/emergency-battery.png",
  };

  const mountItem = {
    title: "Surface Mount Ceiling Bracket Installation Frame Kit",
    price: 2299, // $22.99
    image: "/images/accessories/surface-mount.png",
  };

  const mainPrice = selectedVariant.price;
  const totalPrice =
    (includeMain ? mainPrice : 0) +
    (includeBackup ? backupItem.price : 0) +
    (includeMount ? mountItem.price : 0);

  const selectedCount =
    (includeMain ? 1 : 0) + (includeBackup ? 1 : 0) + (includeMount ? 1 : 0);

  function handleAddBundle() {
    if (selectedCount === 0) return;

    startTransition(async () => {
      try {
        let lastCart;
        if (includeMain) {
          lastCart = await addLineAction({
            variantId: selectedVariant.id,
            quantity: 1,
          });
        }

        if (lastCart) {
          useCartUi.getState().setCart(lastCart);
        }
        useCartUi.getState().open();
        toast.success(`Added ${selectedCount} items to your cart!`);
      } catch (_err) {
        toast.error("Failed to add bundle to cart");
      }
    });
  }

  const primaryImage = product.images?.[0]?.url || "/placeholder.png";

  return (
    <section className="border border-gray-200 rounded-xl p-6 bg-white shadow-2xs space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
          Frequently Bought Together
        </h2>
        <p className="text-xs text-gray-500">
          Most commercial contractors buy this fixture with code-mandated emergency drivers and mounting hardware.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        {/* Images Row */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
          {/* Main Product Image */}
          <div
            className={`relative size-24 sm:size-28 rounded-lg border p-2 bg-white flex items-center justify-center transition-all ${
              includeMain ? "border-gray-300 ring-2 ring-black" : "border-gray-200 opacity-40"
            }`}
          >
            <Image
              src={primaryImage}
              alt={product.title}
              fill
              className="object-contain p-1"
            />
          </div>

          <Plus className="size-4 text-gray-400 shrink-0" />

          {/* Backup Battery Image */}
          <div
            className={`relative size-24 sm:size-28 rounded-lg border p-2 bg-gray-50 flex items-center justify-center transition-all ${
              includeBackup ? "border-gray-300 ring-2 ring-black" : "border-gray-200 opacity-40"
            }`}
          >
            <div className="text-center p-2">
              <span className="text-2xl">🔋</span>
              <p className="text-[10px] font-bold text-gray-700 leading-tight mt-1">EM Driver</p>
            </div>
          </div>

          <Plus className="size-4 text-gray-400 shrink-0" />

          {/* Surface Mount Image */}
          <div
            className={`relative size-24 sm:size-28 rounded-lg border p-2 bg-gray-50 flex items-center justify-center transition-all ${
              includeMount ? "border-gray-300 ring-2 ring-black" : "border-gray-200 opacity-40"
            }`}
          >
            <div className="text-center p-2">
              <span className="text-2xl">🛠️</span>
              <p className="text-[10px] font-bold text-gray-700 leading-tight mt-1">Mount Kit</p>
            </div>
          </div>
        </div>

        {/* Checkboxes List & Total Price */}
        <div className="flex-1 space-y-3 w-full">
          {/* Checkbox 1: Main Product */}
          <label className="flex items-center gap-3 text-xs sm:text-sm text-gray-800 cursor-pointer select-none">
            <Checkbox
              checked={includeMain}
              onCheckedChange={(c) => setIncludeMain(Boolean(c))}
            />
            <span className="flex-1 font-medium">
              <strong className="text-gray-950">This item:</strong> {product.title}
            </span>
            <span className="font-bold text-red-600 shrink-0">
              {formatPrice(mainPrice, product.currency)}
            </span>
          </label>

          {/* Checkbox 2: Backup Battery */}
          <label className="flex items-center gap-3 text-xs sm:text-sm text-gray-800 cursor-pointer select-none">
            <Checkbox
              checked={includeBackup}
              onCheckedChange={(c) => setIncludeBackup(Boolean(c))}
            />
            <span className="flex-1">
              {backupItem.title}
            </span>
            <span className="font-bold text-red-600 shrink-0">
              {formatPrice(backupItem.price, product.currency)}
            </span>
          </label>

          {/* Checkbox 3: Surface Mount */}
          <label className="flex items-center gap-3 text-xs sm:text-sm text-gray-800 cursor-pointer select-none">
            <Checkbox
              checked={includeMount}
              onCheckedChange={(c) => setIncludeMount(Boolean(c))}
            />
            <span className="flex-1">
              {mountItem.title}
            </span>
            <span className="font-bold text-red-600 shrink-0">
              {formatPrice(mountItem.price, product.currency)}
            </span>
          </label>

          {/* Bottom Total & Add Button */}
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs text-gray-500 font-medium">
                Total Bundle Price ({selectedCount} items):
              </div>
              <div className="text-2xl font-black text-red-600">
                {formatPrice(totalPrice, product.currency)}
              </div>
            </div>

            <Button
              type="button"
              disabled={selectedCount === 0 || isPending}
              onClick={handleAddBundle}
              className="bg-black hover:bg-neutral-800 text-white font-bold px-6 h-11 text-xs sm:text-sm rounded-lg shadow-xs"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Adding Bundle...
                </>
              ) : (
                `Add all ${selectedCount} to Cart`
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
