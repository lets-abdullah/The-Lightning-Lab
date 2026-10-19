import { db } from "@/db";
import { products, productVariants, collections } from "@/db/schema";
import { eq, desc, asc, and, arrayContains, gte, lte, sql, type SQL } from "drizzle-orm";
import { resolveGalleryImages } from "./resolve-image";
import { CATEGORY_HEROES, getCategoryHero } from "./category-heroes";
import type { CommerceAdapter } from "./index";
import type { ProductFilter, SortOption } from "./filters";
import type {
  Product,
  Collection,
  ProductVariant,
  Cart,
  Customer,
  Order,
  Quote,
} from "./types";

export interface ListProductsParams {
  collection?: string;
  collectionHandle?: string;
  filters?: ProductFilter;
  sort?: SortOption;
  page?: number;
  perPage?: number;
  limit?: number;
  cursor?: string;
}

export interface ListProductsResult {
  products: Product[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
  nextCursor?: string;
}

export interface ListCollectionsParams {
  parentHandle?: string;
}

export class DbAdapter implements CommerceAdapter {
  async getProduct(handle: string): Promise<Product | null> {
    const productRows = await db
      .select()
      .from(products)
      .where(eq(products.handle, handle))
      .limit(1);

    if (productRows.length === 0) return null;
    const productRow = productRows[0];

    const variantRows = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, productRow.id));

    return this.mapProduct(productRow, variantRows);
  }

  async listProducts(
    params?: ListProductsParams
  ): Promise<ListProductsResult> {
    const rawTarget = params?.collectionHandle ?? params?.collection;
    const aliases: Record<string, string> = {
      "high-bays": "commercial-industrial",
      "high-bay-lights": "commercial-industrial",
      "linear-high-bay": "commercial-industrial",
      "ufo-high-bay": "commercial-industrial",
      "ufo-high-bays": "commercial-industrial",
      "linear-fixtures": "led-strip-lights",
      "linear-lights": "led-strip-lights",
      "strip-light-fixtures": "commercial-industrial",
      "vapor-tight-fixture": "commercial-industrial",
      "architectural-linear": "commercial-industrial",
      "linear-connectors": "commercial-industrial",
      "panels": "led-panel-lights",
      "troffers": "troffer-lights",
      "wall-packs": "outdoor-lighting",
      "wall-pack": "outdoor-lighting",
      "canopy-lights": "outdoor-lighting",
      "canopy-light": "outdoor-lighting",
      "emergency": "emergency-exit",
      "emergency-drivers": "emergency-exit",
      "led-exit-signs": "emergency-exit",
      "tubes": "commercial-industrial",
      "t8-led-tube-light": "commercial-industrial",
      "led-tube-light-fixture": "commercial-industrial",
      "vapor-tight": "commercial-industrial",
      "vapor-tights": "commercial-industrial",
      "downlights": "led-downlights",
      "downlight": "led-downlights",
      "commercial-recessed-downlights": "led-downlights",
      "bulb": "led-downlights",
      "led-bulb": "led-downlights",
      "batten-light": "commercial-industrial",
      "flush-mount": "led-panel-lights",
      "led-light-mirror": "led-downlights",
      "sheets": "led-strip-lights",
      "sheet-rolls": "led-strip-lights",
      "12v-cob-strip": "led-strip-lights",
      "24v-cob-strip": "led-strip-lights",
      "waterproof-led-tape": "led-strip-lights",
      "led-sheet-roll": "led-strip-lights",
      "strip-lighting": "led-strip-lights",
      "strip": "led-strip-lights",
      "power-supply": "led-strip-lights",
      "dimmable-power-supply": "led-strip-lights",
      "commercial": "commercial-industrial",
      "outdoor": "outdoor-lighting",
      "residential": "led-downlights",
      "led-flood-lights": "outdoor-lighting",
      "led-area-lights": "outdoor-lighting",
      "security-lights": "outdoor-lighting",
      "landscaping-light": "outdoor-lighting",
      "post-light": "outdoor-lighting",
      "bollard-lights": "outdoor-lighting",
    };
    const targetCollection = rawTarget ? (aliases[rawTarget] || rawTarget) : undefined;
    const perPage = params?.perPage ?? params?.limit ?? 24;
    const page = params?.page ?? 1;
    const offset = (page - 1) * perPage;
    const filters = params?.filters;

    const conditions: SQL[] = [];

    // Filter by membership in products.collections[] or subcategory keywords
    if (targetCollection && targetCollection !== "all") {
      switch (targetCollection) {
        case "commercial":
        case "commercial-industrial":
          conditions.push(
            sql`(${products.collections} && array['commercial-industrial'] OR ${products.title} ILIKE '%high bay%' OR ${products.title} ILIKE '%troffer%' OR ${products.title} ILIKE '%tube%')`
          );
          break;
        case "residential":
        case "led-downlights":
          conditions.push(
            sql`(${products.collections} && array['led-downlights', '4-inch-downlights', '6-inch-downlights'] OR ${products.title} ILIKE '%downlight%' OR ${products.title} ILIKE '%bulb%' OR ${products.title} ILIKE '%mirror%')`
          );
          break;
        case "outdoor":
        case "outdoor-lighting":
          conditions.push(
            sql`(${products.collections} && array['outdoor-lighting'] OR ${products.title} ILIKE '%outdoor%' OR ${products.title} ILIKE '%flood%' OR ${products.title} ILIKE '%wall pack%' OR ${products.title} ILIKE '%area%')`
          );
          break;
        case "strip":
        case "strip-lighting":
        case "led-strip-lights":
          conditions.push(
            sql`(${products.collections} && array['led-strip-lights', 'cob-led-strip-lights', 'rgb-rgbw-strip-lights', 'single-color-strip-lights', 'waterproof-strip-lights'] OR ${products.title} ILIKE '%strip%' OR ${products.title} ILIKE '%sheet%' OR ${products.title} ILIKE '%tape%')`
          );
          break;
        case "emergency":
        case "emergency-exit":
          conditions.push(
            sql`(${products.collections} && array['emergency-exit'] OR ${products.title} ILIKE '%emergency%' OR ${products.title} ILIKE '%exit%')`
          );
          break;
        case "troffer-lights":
          conditions.push(
            sql`(${products.collections} && array['led-panel-lights','2x4-led-panels','2x2-led-panels','1x4-led-panels'] OR ${products.title} ILIKE '%troffer%')`
          );
          break;
        case "ufo-high-bays":
          conditions.push(
            sql`(${products.title} ILIKE '%ufo%' OR ${products.collections} && array['commercial-industrial'])`
          );
          break;
        case "linear-high-bays":
          conditions.push(
            sql`(${products.title} ILIKE '%linear%high%bay%' OR ${products.title} ILIKE '%shop light%' OR ${products.title} ILIKE '%linear%')`
          );
          break;
        case "vapor-tights":
        case "vapor-tight":
          conditions.push(
            sql`(${products.title} ILIKE '%vapor%' OR ${products.collections} && array['commercial-industrial'])`
          );
          break;
        case "tube-lights":
        case "tubes":
          conditions.push(
            sql`(${products.title} ILIKE '%tube%' OR ${products.title} ILIKE '%t8%' OR ${products.collections} && array['commercial-industrial'])`
          );
          break;
        case "batten-lights":
          conditions.push(
            sql`(${products.title} ILIKE '%batten%' OR ${products.title} ILIKE '%linear%' OR ${products.collections} && array['commercial-industrial'])`
          );
          break;
        case "2x2-led-panels":
          conditions.push(
            sql`(${products.title} ILIKE '%2x2%' OR ${products.collections} && array['2x2-led-panels', 'led-panel-lights'])`
          );
          break;
        case "2x4-led-panels":
          conditions.push(
            sql`(${products.title} ILIKE '%2x4%' OR ${products.collections} && array['2x4-led-panels', 'led-panel-lights'])`
          );
          break;
        case "1x4-led-panels":
          conditions.push(
            sql`(${products.title} ILIKE '%1x4%' OR ${products.collections} && array['1x4-led-panels', 'led-panel-lights'])`
          );
          break;
        case "grid-frames":
          conditions.push(
            sql`(${products.title} ILIKE '%grid%' OR ${products.title} ILIKE '%frame%' OR ${products.collections} && array['led-panel-lights'])`
          );
          break;
        case "flush-mount":
          conditions.push(
            sql`(${products.title} ILIKE '%flush%' OR ${products.title} ILIKE '%surface%' OR ${products.collections} && array['led-panel-lights'])`
          );
          break;
        case "4-inch-downlights":
          conditions.push(
            sql`(${products.title} ILIKE '%4"%' OR ${products.title} ILIKE '%4-inch%' OR ${products.collections} && array['led-downlights'])`
          );
          break;
        case "6-inch-downlights":
          conditions.push(
            sql`(${products.title} ILIKE '%6"%' OR ${products.title} ILIKE '%6-inch%' OR ${products.collections} && array['led-downlights'])`
          );
          break;
        case "trimless-downlight":
          conditions.push(
            sql`(${products.title} ILIKE '%trimless%' OR ${products.title} ILIKE '%regress%' OR ${products.collections} && array['led-downlights'])`
          );
          break;
        case "retrofit-can-lights":
          conditions.push(
            sql`(${products.title} ILIKE '%retrofit%' OR ${products.title} ILIKE '%baffle%' OR ${products.collections} && array['led-downlights'])`
          );
          break;
        case "led-bulbs":
          conditions.push(
            sql`(${products.title} ILIKE '%bulb%' OR ${products.collections} && array['led-downlights'])`
          );
          break;
        case "mirror-lights":
          conditions.push(
            sql`(${products.title} ILIKE '%mirror%' OR ${products.collections} && array['led-downlights'])`
          );
          break;
        case "shoebox-lights":
          conditions.push(
            sql`(${products.title} ILIKE '%shoebox%' OR ${products.title} ILIKE '%parking%' OR ${products.collections} && array['outdoor-lighting'])`
          );
          break;
        case "area-lights":
          conditions.push(
            sql`(${products.title} ILIKE '%area%' OR ${products.title} ILIKE '%shoebox%' OR ${products.collections} && array['outdoor-lighting'])`
          );
          break;
        case "wall-packs":
          conditions.push(
            sql`(${products.title} ILIKE '%wall pack%' OR ${products.collections} && array['outdoor-lighting'])`
          );
          break;
        case "canopy-lights":
          conditions.push(
            sql`(${products.title} ILIKE '%canopy%' OR ${products.collections} && array['outdoor-lighting'])`
          );
          break;
        case "flood-lights":
          conditions.push(
            sql`(${products.title} ILIKE '%flood%' OR ${products.collections} && array['outdoor-lighting'])`
          );
          break;
        case "barn-lights":
          conditions.push(
            sql`(${products.title} ILIKE '%barn%' OR ${products.collections} && array['outdoor-lighting'])`
          );
          break;
        case "sheet-rolls":
        case "sheets":
          conditions.push(
            sql`(${products.title} ILIKE '%sheet%' OR ${products.title} ILIKE '%roll%' OR ${products.collections} && array['led-strip-lights'])`
          );
          break;
        case "gold-sheet-roll":
          conditions.push(
            sql`(${products.title} ILIKE '%gold%' OR ${products.title} ILIKE '%sheet%' OR ${products.collections} && array['led-strip-lights'])`
          );
          break;
        case "flexible-led-sheet":
          conditions.push(
            sql`(${products.title} ILIKE '%flexible%' OR ${products.title} ILIKE '%sheet%' OR ${products.collections} && array['led-strip-lights'])`
          );
          break;
        case "rgbw-color-sheet":
          conditions.push(
            sql`(${products.title} ILIKE '%rgbw%' OR ${products.title} ILIKE '%sheet%' OR ${products.collections} && array['led-strip-lights'])`
          );
          break;
        case "cob-led-strip-lights":
          conditions.push(
            sql`(${products.title} ILIKE '%cob%' OR ${products.collections} && array['led-strip-lights'])`
          );
          break;
        case "rgb-rgbw-strip-lights":
          conditions.push(
            sql`(${products.title} ILIKE '%rgb%' OR ${products.collections} && array['led-strip-lights'])`
          );
          break;
        case "single-color-strip-lights":
          conditions.push(
            sql`(${products.title} ILIKE '%single%' OR ${products.collections} && array['led-strip-lights'])`
          );
          break;
        case "waterproof-strip-lights":
          conditions.push(
            sql`(${products.title} ILIKE '%waterproof%' OR ${products.title} ILIKE '%ip67%' OR ${products.collections} && array['led-strip-lights'])`
          );
          break;
        case "linear-fixtures":
          conditions.push(
            sql`(${products.title} ILIKE '%linear%' OR ${products.collections} && array['led-strip-lights'])`
          );
          break;
        case "exit-signs-combo":
          conditions.push(
            sql`(${products.title} ILIKE '%exit%' OR ${products.title} ILIKE '%combo%' OR ${products.collections} && array['emergency-exit'])`
          );
          break;
        case "fire-resistant-exit-sign":
          conditions.push(
            sql`(${products.title} ILIKE '%fire%' OR ${products.title} ILIKE '%exit%' OR ${products.collections} && array['emergency-exit'])`
          );
          break;
        case "emergency-sky-panels":
          conditions.push(
            sql`(${products.title} ILIKE '%sky%' OR ${products.title} ILIKE '%emergency%' OR ${products.collections} && array['emergency-exit'])`
          );
          break;
        case "battery-backup-drivers":
          conditions.push(
            sql`(${products.title} ILIKE '%battery%' OR ${products.title} ILIKE '%backup%' OR ${products.collections} && array['emergency-exit', 'accessories'])`
          );
          break;
        case "power-supplies":
          conditions.push(
            sql`(${products.title} ILIKE '%driver%' OR ${products.title} ILIKE '%power%' OR ${products.collections} && array['accessories', 'led-strip-lights'])`
          );
          break;
        case "smart-lighting":
          conditions.push(
            sql`(${products.title} ILIKE '%sensor%' OR ${products.title} ILIKE '%smart%' OR ${products.collections} && array['smart-lighting', 'accessories'])`
          );
          break;
        case "accessories":
          conditions.push(
            sql`(${products.title} ILIKE '%mount%' OR ${products.title} ILIKE '%kit%' OR ${products.title} ILIKE '%cable%' OR ${products.collections} && array['accessories'])`
          );
          break;
        default:
          conditions.push(
            sql`(${arrayContains(products.collections, [targetCollection])} OR ${products.title} ILIKE ${'%' + targetCollection.replace(/-/g, ' ') + '%'})`
          );
          break;
      }
    }

    // minPrice / maxPrice: filter on products.price (cents)
    if (filters?.minPrice !== undefined) {
      conditions.push(gte(products.price, filters.minPrice));
    }
    if (filters?.maxPrice !== undefined) {
      conditions.push(lte(products.price, filters.maxPrice));
    }

    // wattage / cct / voltage: products.specs->>'wattage' etc. IN list
    if (filters?.wattage && filters.wattage.length > 0) {
      conditions.push(
        sql`${products.specs}->>'wattage' IN (${sql.join(
          filters.wattage.map((w) => sql`${w}`),
          sql`, `
        )})`
      );
    }
    if (filters?.cct && filters.cct.length > 0) {
      conditions.push(
        sql`${products.specs}->>'cct' IN (${sql.join(
          filters.cct.map((c) => sql`${c}`),
          sql`, `
        )})`
      );
    }
    if (filters?.voltage && filters.voltage.length > 0) {
      conditions.push(
        sql`${products.specs}->>'voltage' IN (${sql.join(
          filters.voltage.map((v) => sql`${v}`),
          sql`, `
        )})`
      );
    }

    // certifications: products.specs->'certifications' ?| list
    if (filters?.certifications && filters.certifications.length > 0) {
      conditions.push(
        sql`${products.specs}->'certifications' ?| array[${sql.join(
          filters.certifications.map((c) => sql`${c}`),
          sql`, `
        )}]`
      );
    }

    // dimmable: products.specs->>'dimmable' = 'true' when true, omit when false/undefined
    if (filters?.dimmable === true) {
      conditions.push(sql`${products.specs}->>'dimmable' = 'true'`);
    }

    // inStock: products.inventory->>'available' = 'true' when true
    if (filters?.inStock === true) {
      conditions.push(sql`${products.inventory}->>'available' = 'true'`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderBy;
    switch (params?.sort) {
      case "price-asc":
        orderBy = asc(products.price);
        break;
      case "price-desc":
        orderBy = desc(products.price);
        break;
      case "newest":
        orderBy = sql`${products.publishedAt} DESC NULLS LAST`;
        break;
      case "best-selling":
        // Sort by best-selling falls back to created_at until order analytics exist
        orderBy = desc(products.createdAt);
        break;
      case "featured":
      default:
        orderBy = desc(products.createdAt);
        break;
    }

    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(whereClause);
    const total = countResult[0]?.count ?? 0;
    const pageCount = Math.max(1, Math.ceil(total / perPage));

    const productRows = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(perPage)
      .offset(offset);

    const resultProducts: Product[] = [];
    for (const p of productRows) {
      const variantRows = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, p.id));
      resultProducts.push(this.mapProduct(p, variantRows));
    }

    let finalTotal = total;
    let finalPageCount = pageCount;

    // Fallback: If specific subcategory query returned 0 products, guarantee at least 1+ products from parent collection
    if (resultProducts.length === 0 && rawTarget && rawTarget !== "all") {
      const PARENT_MAP: Record<string, string> = {
        "residential": "led-downlights",
        "led-emergency-panel-light": "led-panel-lights",
        "led-edge-light": "led-panel-lights",
        "artificial-sky-panel": "led-panel-lights",
        "track-lights": "commercial-industrial",
        "under-cabinet-lights": "commercial-industrial",
        "hexagon-garage-lights": "commercial-industrial",
        "explosion-proof-lighting": "commercial-industrial",
        "pendant-light": "commercial-industrial",
        "exhaust-fan": "commercial-industrial",
        "up-down-sconce": "outdoor-lighting",
        "rgb-wall-washer": "outdoor-lighting",
        "led-light-brackets": "outdoor-lighting",
        "pole": "outdoor-lighting",
        "corn-bulb": "outdoor-lighting",
        "landscaping-transformer": "outdoor-lighting",
        "double-sided-tube": "commercial-industrial",
        "batten-light": "commercial-industrial",
        "led-light-mirror": "led-downlights",
        "wall-pack": "outdoor-lighting",
        "connector": "led-strip-lights",
        "module": "led-strip-lights",
        "controller-remote": "led-strip-lights",
        "aluminum-track": "led-strip-lights",
      };

      const fallbackCollection = PARENT_MAP[rawTarget] || "commercial-industrial";
      const fallbackRows = await db
        .select()
        .from(products)
        .where(sql`${products.collections} && array[${fallbackCollection}]`)
        .orderBy(orderBy)
        .limit(perPage);

      for (const p of fallbackRows) {
        const variantRows = await db
          .select()
          .from(productVariants)
          .where(eq(productVariants.productId, p.id));
        resultProducts.push(this.mapProduct(p, variantRows));
      }
      finalTotal = resultProducts.length;
      finalPageCount = 1;
    }

    return {
      products: resultProducts,
      total: finalTotal,
      page,
      perPage,
      pageCount: finalPageCount,
      nextCursor: page < finalPageCount ? String(page + 1) : undefined,
    };
  }

  async getCollection(handle: string): Promise<Collection | null> {
    const hero = CATEGORY_HEROES[handle] || getCategoryHero(handle);
    if (hero) {
      const rows = await db
        .select()
        .from(collections)
        .where(eq(collections.handle, handle))
        .limit(1);

      if (rows.length > 0) {
        const mapped = this.mapCollection(rows[0]);
        return {
          ...mapped,
          title: hero.title,
          description: hero.description,
          heroImage: { url: hero.bgImage, alt: hero.title, type: "image" },
        };
      }

      return {
        id: handle,
        handle,
        title: hero.title,
        description: hero.description,
        productCount: 12,
        sortDefault: "featured",
        heroImage: { url: hero.bgImage, alt: hero.title, type: "image" },
        filters: [
          { key: "price", label: "Price", type: "range" },
          { key: "wattage", label: "Wattage", type: "checkbox", options: ["30W", "40W", "50W", "60W", "100W", "150W", "200W"] },
          { key: "cct", label: "Color Temperature", type: "checkbox", options: ["3000K", "3500K", "4000K", "5000K", "5700K"] },
          { key: "voltage", label: "Voltage", type: "checkbox", options: ["120-277V", "277-480V", "120V"] },
          { key: "certification", label: "Certifications", type: "checkbox", options: ["DLC Premium", "DLC Standard", "UL Listed", "ETL Listed", "RoHS"] },
          { key: "dimmable", label: "0-10V Dimmable", type: "radio" },
          { key: "availability", label: "In Stock Only", type: "radio" },
        ],
        seo: {
          title: `${hero.title} | The Lightning Lab`,
          description: hero.description,
        },
      };
    }

    const rows = await db
      .select()
      .from(collections)
      .where(eq(collections.handle, handle))
      .limit(1);

    if (rows.length === 0) return null;
    return this.mapCollection(rows[0]);
  }

  async listCollections(
    params?: ListCollectionsParams
  ): Promise<Collection[]> {
    let rows;
    if (params?.parentHandle !== undefined) {
      rows = await db
        .select()
        .from(collections)
        .where(eq(collections.parentHandle, params.parentHandle));
    } else {
      rows = await db.select().from(collections);
    }

    return rows.map((r) => this.mapCollection(r));
  }

  createCart(): Promise<Cart> {
    throw new Error("not implemented");
  }

  addLine(
    _cartId: string,
    _variantId: string,
    _quantity: number
  ): Promise<Cart> {
    throw new Error("not implemented");
  }

  updateLine(
    _cartId: string,
    _lineId: string,
    _quantity: number
  ): Promise<Cart> {
    throw new Error("not implemented");
  }

  removeLine(_cartId: string, _lineId: string): Promise<Cart> {
    throw new Error("not implemented");
  }

  getCart(_cartId: string): Promise<Cart | null> {
    throw new Error("not implemented");
  }

  applyDiscount(_cartId: string, _code: string): Promise<Cart> {
    throw new Error("not implemented");
  }

  getCustomer(_id: string): Promise<Customer | null> {
    throw new Error("not implemented");
  }

  listOrders(_customerId: string): Promise<Order[]> {
    throw new Error("not implemented");
  }

  createQuote(_input: {
    email: string;
    lines: {
      variantId: string;
      sku: string;
      quantity: number;
      targetPrice?: number;
    }[];
    company?: string;
    message?: string;
  }): Promise<Quote> {
    throw new Error("not implemented");
  }

  private mapProduct(
    p: typeof products.$inferSelect,
    variantRows: (typeof productVariants.$inferSelect)[]
  ): Product {
    const resolvedImages = resolveGalleryImages({
      handle: p.handle,
      title: p.title,
      collections: p.collections,
      images: p.images,
    });

    const variants: ProductVariant[] = variantRows.map((v) => ({
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
      image: v.image && !v.image.url.includes("placehold.co") ? v.image : resolvedImages[0],
      bulkPricing: v.bulkPricing ?? undefined,
    }));

    return {
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
      images: resolvedImages,
      videos: p.videos ?? undefined,
      documents: p.documents ?? undefined,
      specs: p.specs,
      options: p.options,
      variants,
      inventory: p.inventory,
      shipping: p.shipping,
      bulkPricing: p.bulkPricing ?? undefined,
      isB2BOnly: p.isB2BOnly,
      rating: p.rating ?? undefined,
      seo: p.seo,
      relatedHandles: p.relatedHandles ?? undefined,
      crossSellHandles: p.crossSellHandles ?? undefined,
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : undefined,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }

  private mapCollection(c: typeof collections.$inferSelect): Collection {
    return {
      id: c.id,
      handle: c.handle,
      title: c.title,
      description: c.description,
      longDescription: c.longDescription ?? undefined,
      parentHandle: c.parentHandle ?? undefined,
      heroImage: c.heroImage ?? undefined,
      icon: c.icon ?? undefined,
      seo: c.seo,
      productCount: c.productCount,
      sortDefault: c.sortDefault as
        | "featured"
        | "price-asc"
        | "price-desc"
        | "newest"
        | "best-selling",
      filters: c.filters,
      featuredProducts: c.featuredProducts ?? undefined,
      faqs: c.faqs ?? undefined,
    };
  }
}
