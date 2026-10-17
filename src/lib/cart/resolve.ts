import type { Cart, CartLine, ProductVariant } from "@/lib/commerce/types";
import { FREE_SHIPPING_THRESHOLD } from "./constants";
import { applyDiscountsToSubtotal, type KnownDiscount } from "./discounts";

export interface ResolvedLineRow {
  lineId: string;
  quantity: number;
  variant: {
    id: string;
    sku: string;
    title: string;
    price: number;
    inventoryQuantity: number;
    inventoryPolicy: string;
    bulkPricing?: { minQty: number; price: number; label?: string }[] | null;
    image?: { url: string; alt?: string } | null;
  } | null;
  product: {
    handle: string;
    title: string;
    images?: { url: string; alt?: string }[] | null;
  } | null;
}

export function resolveLinePrice(
  variant: { price: number; bulkPricing?: { minQty: number; price: number; label?: string }[] | null },
  quantity: number
): { unitPrice: number; bulkTierApplied?: string } {
  if (variant.bulkPricing && variant.bulkPricing.length > 0) {
    const qualifyingTiers = variant.bulkPricing
      .filter((tier) => tier.minQty <= quantity)
      .sort((a, b) => b.minQty - a.minQty);

    if (qualifyingTiers.length > 0) {
      const bestTier = qualifyingTiers[0];
      return {
        unitPrice: bestTier.price,
        bulkTierApplied: bestTier.label || `${bestTier.minQty}+`,
      };
    }
  }

  return { unitPrice: variant.price };
}

export function buildCartSnapshot({
  cart,
  lines,
  knownDiscounts = [],
}: {
  cart: {
    id: string;
    token: string;
    discountCodes?: string[] | null;
    note?: string | null;
    poNumber?: string | null;
  };
  lines: ResolvedLineRow[];
  knownDiscounts?: KnownDiscount[];
}): Cart {
  const cartLines: CartLine[] = [];
  let subtotal = 0;

  for (const row of lines) {
    if (!row.variant || !row.product) continue;

    // Drop any line whose variant is out of stock AND inventoryPolicy is "deny"
    if (
      row.variant.inventoryQuantity === 0 &&
      row.variant.inventoryPolicy === "deny"
    ) {
      continue;
    }

    const { unitPrice, bulkTierApplied } = resolveLinePrice(
      row.variant,
      row.quantity
    );
    const lineTotal = unitPrice * row.quantity;
    subtotal += lineTotal;

    const imageUrl =
      row.variant.image?.url ||
      row.product.images?.[0]?.url ||
      "/placeholder.png";

    cartLines.push({
      id: row.lineId,
      productHandle: row.product.handle,
      variantId: row.variant.id,
      title: row.product.title,
      variantTitle: row.variant.title,
      sku: row.variant.sku,
      image: imageUrl,
      quantity: row.quantity,
      unitPrice,
      lineTotal,
      bulkTierApplied,
    });
  }

  const discountCodes = cart.discountCodes || [];
  const { discountTotal } = applyDiscountsToSubtotal(
    subtotal,
    discountCodes,
    knownDiscounts
  );

  const total = subtotal - discountTotal;
  const freeShippingRemaining = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - (subtotal - discountTotal)
  );

  return {
    id: cart.id,
    token: cart.token,
    lines: cartLines,
    subtotal,
    discountTotal,
    total,
    currency: "USD",
    discountCodes,
    note: cart.note ?? undefined,
    poNumber: cart.poNumber ?? undefined,
    shippingEstimate: undefined,
    taxEstimate: undefined,
    freeShippingRemaining,
  } as Cart & { freeShippingRemaining: number };
}
