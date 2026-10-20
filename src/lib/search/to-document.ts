import type { Product } from "@/lib/commerce/types";
import type { ProductDocument } from "./schema";
import { formatSpecLine } from "@/lib/utils/format";

export function productToDocument(product: Product): ProductDocument {
  const primaryImage = product.images[0];
  const rawWattage = product.specs.wattage;
  const wattageParts = rawWattage
    ? rawWattage
        .split("/")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const wattage = rawWattage
    ? Array.from(new Set([rawWattage, ...wattageParts]))
    : [];
  const cct = product.specs.cct
    ? product.specs.cct
        .split("/")
        .map((s) => s.trim())
        .filter((s) => Boolean(s) && s !== "N/A" && s !== "N" && s !== "A")
    : [];
  const certs = product.specs.certifications ?? [];

  // Build comprehensive searchable tags including product type, features, and commercial synonyms
  const enrichedTags = new Set<string>(product.tags ?? []);
  if (product.productType) {
    enrichedTags.add(product.productType);
  }
  if (Array.isArray(product.features)) {
    for (const feat of product.features) {
      if (typeof feat === "string" && feat.trim()) {
        enrichedTags.add(feat.trim());
      }
    }
  }

  // Commercial lighting synonyms for precise domain matching
  const titleLower = product.title.toLowerCase();
  const descLower = (product.shortDescription ?? "").toLowerCase();
  if (titleLower.includes("canopy") || descLower.includes("canopy")) {
    enrichedTags.add("roof");
    enrichedTags.add("roof lights");
    enrichedTags.add("roof light");
    enrichedTags.add("ceiling mount");
    enrichedTags.add("gas station roof");
    enrichedTags.add("garage ceiling");
  }
  if (titleLower.includes("panel") || titleLower.includes("troffer")) {
    enrichedTags.add("drop ceiling");
    enrichedTags.add("grid ceiling");
    enrichedTags.add("ceiling light");
    enrichedTags.add("troffer light");
  }
  if (titleLower.includes("high bay")) {
    enrichedTags.add("warehouse lighting");
    enrichedTags.add("high ceiling");
    enrichedTags.add("industrial light");
  }
  if (titleLower.includes("downlight") || titleLower.includes("wafer")) {
    enrichedTags.add("pot light");
    enrichedTags.add("can light");
    enrichedTags.add("recessed ceiling light");
  }

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    sku: product.sku,
    description: product.shortDescription,
    image: primaryImage?.url ?? "",
    imageAlt: primaryImage?.alt ?? product.title,
    specLine: formatSpecLine(product.specs),
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    collections: product.collections,
    tags: Array.from(enrichedTags),
    wattage: wattage.length ? wattage : undefined,
    cct: cct.length ? cct : undefined,
    voltage: product.specs.voltage
      ? [product.specs.voltage]
      : undefined,
    certifications: certs.length ? certs : undefined,
    dimmable: product.specs.dimmable,
    inStock: product.inventory.available,
    ratingAvg: product.rating?.average,
    ratingCount: product.rating?.count,
    createdAt: Math.floor(new Date(product.createdAt).getTime() / 1000),
    productSnapshot: JSON.stringify(product),
  };
}
