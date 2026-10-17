import type { ProductSpecs } from "@/lib/commerce/types";

export function formatPrice(cents: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function formatSpecLine(specs: ProductSpecs): string {
  const parts: string[] = [];
  if (specs.wattage) parts.push(specs.wattage);
  if (specs.cct) parts.push(specs.cct);
  if (specs.certifications && specs.certifications.length > 0) {
    parts.push(specs.certifications[0]);
  }
  const joined = parts.join(" · ");
  if (joined.length <= 40) return joined;
  return joined.slice(0, 37) + "...";
}

export function savePercent(price: number, compareAt: number): number {
  if (compareAt <= price) return 0;
  return Math.max(0, Math.round((1 - price / compareAt) * 100));
}

