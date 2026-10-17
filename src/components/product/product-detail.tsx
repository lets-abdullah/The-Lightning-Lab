"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Product, ProductVariant } from "@/lib/commerce/types";
import { ProductGallery } from "./product-gallery";
import { ProductPurchasePanel } from "./product-purchase-panel";

interface ProductDetailProps {
  product: Product;
  initialVariantId: string;
}

function findMatchingVariant(
  variants: ProductVariant[],
  selection: Record<string, string>
): ProductVariant | undefined {
  return variants.find((v) =>
    Object.entries(selection).every(([k, val]) => v.optionValues[k] === val)
  );
}

export function ProductDetail({
  product,
  initialVariantId,
}: ProductDetailProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    initialVariantId || product.variants[0]?.id || ""
  );

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ??
    product.variants[0];

  function handleOptionChange(name: string, value: string) {
    if (!selectedVariant) return;
    const targetSelection = {
      ...selectedVariant.optionValues,
      [name]: value,
    };
    const match = findMatchingVariant(product.variants, targetSelection);
    if (match) {
      setSelectedVariantId(match.id);
      router.replace(`${pathname}?variant=${match.id}`, { scroll: false });
    }
  }

  if (!selectedVariant) return null;

  const galleryImages = selectedVariant.image
    ? [
        selectedVariant.image,
        ...product.images.filter((i) => i.url !== selectedVariant.image?.url),
      ]
    : product.images;

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <ProductGallery
        images={galleryImages}
        videos={product.videos}
        alt={product.title}
      />
      <ProductPurchasePanel
        product={product}
        selectedVariant={selectedVariant}
        onOptionChange={handleOptionChange}
      />
    </div>
  );
}
