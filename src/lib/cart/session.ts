import "server-only";
import { cookies } from "next/headers";
import { db } from "@/db";
import { carts, cartLines, productVariants, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Cart } from "@/lib/commerce/types";
import { CART_COOKIE_NAME, CART_COOKIE_MAX_AGE } from "./constants";
export { CART_COOKIE_NAME, CART_COOKIE_MAX_AGE } from "./constants";
import { buildCartSnapshot, type ResolvedLineRow } from "./resolve";
import { loadActiveDiscounts } from "./discounts";

export async function fetchFullCartById(cartId: string): Promise<Cart | null> {
  try {
    const cartRows = await db
      .select()
      .from(carts)
      .where(eq(carts.id, cartId))
      .limit(1);

    // Cart ID exists in cookie but not in DB (stale / deleted) — not an error
    if (cartRows.length === 0) return null;
    const rawCart = cartRows[0];

    const lineRows = await db
      .select({
        lineId: cartLines.id,
        quantity: cartLines.quantity,
        variant: {
          id: productVariants.id,
          sku: productVariants.sku,
          title: productVariants.title,
          price: productVariants.price,
          inventoryQuantity: productVariants.inventoryQuantity,
          inventoryPolicy: productVariants.inventoryPolicy,
          bulkPricing: productVariants.bulkPricing,
          image: productVariants.image,
        },
        product: {
          handle: products.handle,
          title: products.title,
          images: products.images,
        },
      })
      .from(cartLines)
      .innerJoin(productVariants, eq(cartLines.variantId, productVariants.id))
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(eq(cartLines.cartId, rawCart.id));

    const knownDiscounts = await loadActiveDiscounts(rawCart.discountCodes || []);

    return buildCartSnapshot({
      cart: rawCart,
      lines: lineRows as ResolvedLineRow[],
      knownDiscounts,
    });
  } catch (error) {
    // Only log real DB / network failures, not "cart not found" cases
    console.warn("[cart] fetchFullCartById error:", error);
    return null;
  }
}

export async function getCartIfExists(): Promise<Cart | null> {
  let cartId: string | undefined;
  let cookieStore: Awaited<ReturnType<typeof cookies>>;
  try {
    cookieStore = await cookies();
    cartId = cookieStore.get(CART_COOKIE_NAME)?.value;
  } catch (error) {
    if ((error as any)?.digest === "DYNAMIC_SERVER_USAGE") {
      throw error;
    }
    return null;
  }

  if (!cartId) return null;

  const cart = await fetchFullCartById(cartId);

  // Stale cookie — cart was deleted or DB was reset. Clear it so the next
  // request creates a fresh cart instead of querying a dead ID every time.
  if (!cart) {
    try {
      cookieStore!.delete(CART_COOKIE_NAME);
    } catch {
      // Ignore: cookie deletion is best-effort in RSC context
    }
  }

  return cart;
}

export async function getOrCreateCart(): Promise<Cart> {
  const cookieStore = await cookies();
  const cartIdCookie = cookieStore.get(CART_COOKIE_NAME);

  if (cartIdCookie?.value) {
    const existing = await fetchFullCartById(cartIdCookie.value);
    if (existing) return existing;
  }

  // Create new cart
  const token = crypto.randomUUID();
  const [newCartRow] = await db
    .insert(carts)
    .values({
      token,
      discountCodes: [],
    })
    .returning();

  cookieStore.set(CART_COOKIE_NAME, newCartRow.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });

  return buildCartSnapshot({
    cart: newCartRow,
    lines: [],
    knownDiscounts: [],
  });
}
