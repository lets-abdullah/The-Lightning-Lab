import type { Product } from "@/lib/commerce/types";

export interface SearchHit {
  product: Product;
  highlight?: { title?: string; sku?: string };
}

export function hitToProduct(hit: {
  document: { productSnapshot: string };
  highlight?: Record<string, { snippet?: string }>;
}): SearchHit | null {
  try {
    const product = JSON.parse(hit.document.productSnapshot) as Product;
    if (!product || typeof product.handle !== "string") return null;
    return {
      product,
      highlight: hit.highlight
        ? {
            title: hit.highlight.title?.snippet,
            sku: hit.highlight.sku?.snippet,
          }
        : undefined,
    };
  } catch {
    return null;
  }
}
