import "server-only";
import { db } from "@/db";
import { products, productVariants } from "@/db/schema";
import { eq, and, notInArray, desc } from "drizzle-orm";
import type { Cart, Product } from "@/lib/commerce/types";

export async function pickCrossSell(cart: Cart | null): Promise<Product[]> {
  try {
    if (!cart || !cart.lines || cart.lines.length === 0) {
      return [];
    }

  // Collect handles of products already in the cart
  const cartProductHandles = cart.lines.map((l) => l.productHandle);

  // Fetch collections of cart products
  const cartProductRows = await db
    .select({
      collections: products.collections,
    })
    .from(products)
    .where(
      and(
        eq(products.status, "active")
      )
    );

  const cartCollections = new Set<string>();
  for (const row of cartProductRows) {
    if (row.collections) {
      for (const col of row.collections) {
        cartCollections.add(col);
      }
    }
  }

  // Query up to 3 active products not already in the cart, ordered by createdAt desc
  const crossSellRows = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.status, "active"),
        cartProductHandles.length > 0
          ? notInArray(products.handle, cartProductHandles)
          : undefined
      )
    )
    .orderBy(desc(products.createdAt))
    .limit(3);

  // Query variants for the selected cross sell products
  const productList: Product[] = [];
  for (const p of crossSellRows) {
    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, p.id));

    productList.push({
      ...p,
      status: p.status as "active" | "draft" | "archived",
      currency: (p.currency as "USD") || "USD",
      compareAtPrice: p.compareAtPrice ?? undefined,
      costPerItem: p.costPerItem ?? undefined,
      subtitle: p.subtitle ?? undefined,
      brand: p.brand ?? undefined,
      specSheet: p.specSheet ?? undefined,
      iesFile: p.iesFile ?? undefined,
      installationGuide: p.installationGuide ?? undefined,
      videos: p.videos ?? undefined,
      documents: p.documents ?? undefined,
      bulkPricing: p.bulkPricing ?? undefined,
      isB2BOnly: p.isB2BOnly ?? undefined,
      rating: p.rating ?? undefined,
      relatedHandles: p.relatedHandles ?? undefined,
      crossSellHandles: p.crossSellHandles ?? undefined,
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : undefined,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      variants: variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        title: v.title,
        optionValues: v.optionValues,
        price: v.price,
        compareAtPrice: v.compareAtPrice ?? undefined,
        inventoryQuantity: v.inventoryQuantity,
        inventoryPolicy: (v.inventoryPolicy as "deny" | "continue") || "deny",
        weight: v.weight ?? undefined,
        barcode: v.barcode ?? undefined,
        image: v.image ?? undefined,
        bulkPricing: v.bulkPricing ?? undefined,
      })),
    });
  }

    return productList;
  } catch (error) {
    console.error("Failed to pick cross-sell products:", error);
    return [];
  }
}
