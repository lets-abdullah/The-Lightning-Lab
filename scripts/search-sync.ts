#!/usr/bin/env tsx
import { Client } from "typesense";
import { env } from "../src/lib/env";
import { db } from "../src/db";
import { products, productVariants } from "../src/db/schema";
import { PRODUCT_SCHEMA } from "../src/lib/search/schema";
import { productToDocument } from "../src/lib/search/to-document";
import type { Product, ProductVariant } from "../src/lib/commerce/types";

async function main() {
  const startTime = Date.now();

  const typesense = new Client({
    nodes: [
      {
        host: env.TYPESENSE_HOST,
        port: env.TYPESENSE_PORT,
        protocol: env.TYPESENSE_PROTOCOL,
      },
    ],
    apiKey: env.TYPESENSE_API_KEY,
    connectionTimeoutSeconds: 5,
  });

  // 1. Check or create collection
  let collectionExisted = false;
  let schemaMismatched = false;

  try {
    const existing = await typesense.collections("products").retrieve();
    collectionExisted = true;
    const existingFields = new Map((existing.fields ?? []).map((f) => [f.name, f]));
    for (const field of PRODUCT_SCHEMA.fields) {
      const ef = existingFields.get(field.name);
      if (!ef || ef.type !== field.type || Boolean(ef.facet) !== Boolean(field.facet)) {
        schemaMismatched = true;
        break;
      }
    }

    if (schemaMismatched) {
      console.log("Schema changed — dropping and recreating collection.");
      await typesense.collections("products").delete();
      await typesense.collections().create(PRODUCT_SCHEMA);
    }
  } catch (err: unknown) {
    // Collection missing: create
    await typesense.collections().create(PRODUCT_SCHEMA);
  }

  // If collection existed and schema didn't change, clean out existing documents
  if (collectionExisted && !schemaMismatched) {
    try {
      await typesense.collections("products").documents().delete({ filter_by: "" });
    } catch {
      // Ignore if empty
    }
  }

  // 2. Fetch products from DB directly (not via commerce adapter)
  const productRows = await db.select().from(products);
  const variantRows = await db.select().from(productVariants);

  const variantsByProductId = new Map<string, ProductVariant[]>();
  for (const v of variantRows) {
    const list = variantsByProductId.get(v.productId) ?? [];
    list.push({
      id: v.id,
      sku: v.sku,
      title: v.title,
      optionValues: v.optionValues,
      price: v.price,
      compareAtPrice: v.compareAtPrice ?? undefined,
      inventoryQuantity: v.inventoryQuantity,
      inventoryPolicy: v.inventoryPolicy as "deny" | "continue",
      weight: v.weight ?? undefined,
      barcode: v.barcode ?? undefined,
      image: v.image ?? undefined,
      bulkPricing: v.bulkPricing ?? undefined,
    });
    variantsByProductId.set(v.productId, list);
  }

  const documents = productRows.map((p) => {
    const product: Product = {
      id: p.id,
      handle: p.handle,
      title: p.title,
      subtitle: p.subtitle ?? undefined,
      brand: p.brand ?? undefined,
      sku: p.sku,
      status: p.status as "active" | "draft" | "archived",
      price: p.price,
      compareAtPrice: p.compareAtPrice ?? undefined,
      currency: "USD",
      costPerItem: p.costPerItem ?? undefined,
      productType: p.productType,
      collections: p.collections,
      tags: p.tags,
      shortDescription: p.shortDescription,
      descriptionHtml: p.descriptionHtml,
      features: p.features,
      specSheet: p.specSheet ?? undefined,
      iesFile: p.iesFile ?? undefined,
      installationGuide: p.installationGuide ?? undefined,
      images: p.images,
      videos: p.videos ?? undefined,
      documents: p.documents ?? undefined,
      specs: p.specs,
      options: p.options,
      variants: variantsByProductId.get(p.id) ?? [],
      inventory: p.inventory,
      shipping: p.shipping,
      bulkPricing: p.bulkPricing ?? undefined,
      isB2BOnly: p.isB2BOnly,
      rating: p.rating ?? undefined,
      seo: p.seo,
      relatedHandles: p.relatedHandles ?? undefined,
      crossSellHandles: p.crossSellHandles ?? undefined,
      publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : undefined,
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
      updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : String(p.updatedAt),
    };
    return productToDocument(product);
  });

  // 3. Batch import (100 per call)
  const batchSize = 100;
  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    await typesense.collections("products").documents().import(batch, { action: "upsert" });
  }

  const elapsedMs = Date.now() - startTime;
  console.log(`Indexed ${documents.length} products in ${elapsedMs}ms`);
  process.exit(0);
}

main().catch((err) => {
  console.error("search-sync failed:", err);
  process.exit(1);
});
