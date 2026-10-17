"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { carts, cartLines, productVariants, discounts } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import type { Cart } from "@/lib/commerce/types";
import { getOrCreateCart, fetchFullCartById } from "./session";

export async function addLineAction(input: {
  variantId: string;
  quantity: number;
}): Promise<Cart> {
  const cart = await getOrCreateCart();

  // Verify variant exists and is purchasable
  const variantRows = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.id, input.variantId))
    .limit(1);

  if (variantRows.length === 0) {
    throw new Error("Variant not found");
  }

  const variant = variantRows[0];
  if (variant.inventoryQuantity === 0 && variant.inventoryPolicy === "deny") {
    throw new Error("Variant is out of stock");
  }

  const qtyToAdd = Math.max(1, Math.min(999, input.quantity));

  // Upsert into cart_lines
  await db
    .insert(cartLines)
    .values({
      cartId: cart.id,
      variantId: input.variantId,
      quantity: qtyToAdd,
    })
    .onConflictDoUpdate({
      target: [cartLines.cartId, cartLines.variantId],
      set: {
        quantity: sql`LEAST(999, ${cartLines.quantity} + ${qtyToAdd})`,
        updatedAt: sql`now()`,
      },
    });

  revalidatePath("/", "layout");
  const freshCart = await fetchFullCartById(cart.id);
  return freshCart || cart;
}

export async function updateLineAction(input: {
  lineId: string;
  quantity: number;
}): Promise<Cart> {
  const cart = await getOrCreateCart();

  if (input.quantity < 1) {
    await db.delete(cartLines).where(eq(cartLines.id, input.lineId));
  } else {
    const clampedQty = Math.max(1, Math.min(999, input.quantity));
    await db
      .update(cartLines)
      .set({
        quantity: clampedQty,
        updatedAt: sql`now()`,
      })
      .where(and(eq(cartLines.id, input.lineId), eq(cartLines.cartId, cart.id)));
  }

  revalidatePath("/", "layout");
  const freshCart = await fetchFullCartById(cart.id);
  return freshCart || cart;
}

export async function removeLineAction(input: {
  lineId: string;
}): Promise<Cart> {
  const cart = await getOrCreateCart();

  await db
    .delete(cartLines)
    .where(and(eq(cartLines.id, input.lineId), eq(cartLines.cartId, cart.id)));

  revalidatePath("/", "layout");
  const freshCart = await fetchFullCartById(cart.id);
  return freshCart || cart;
}

export async function applyDiscountAction(input: {
  code: string;
}): Promise<{ ok: true; cart: Cart } | { ok: false; error: string }> {
  const cart = await getOrCreateCart();
  const normalizedCode = input.code.trim().toUpperCase();

  if (!normalizedCode) {
    return { ok: false, error: "Please enter a discount code" };
  }

  // Check discount from DB
  const discountRows = await db
    .select()
    .from(discounts)
    .where(eq(discounts.code, normalizedCode))
    .limit(1);

  if (discountRows.length === 0 || !discountRows[0].active) {
    return { ok: false, error: "Code not found" };
  }

  const discount = discountRows[0];
  if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
    return { ok: false, error: "Code has expired" };
  }

  if (discount.minSubtotal && cart.subtotal < discount.minSubtotal) {
    return { ok: false, error: "Minimum subtotal not met" };
  }

  // Append code if not already present
  const currentCodes = cart.discountCodes || [];
  if (!currentCodes.includes(normalizedCode)) {
    const updatedCodes = [...currentCodes, normalizedCode];
    await db
      .update(carts)
      .set({
        discountCodes: updatedCodes,
        updatedAt: sql`now()`,
      })
      .where(eq(carts.id, cart.id));
  }

  revalidatePath("/", "layout");
  const freshCart = await fetchFullCartById(cart.id);
  return { ok: true, cart: freshCart || cart };
}

export async function removeDiscountAction(input: {
  code: string;
}): Promise<Cart> {
  const cart = await getOrCreateCart();
  const normalizedCode = input.code.trim().toUpperCase();

  const currentCodes = cart.discountCodes || [];
  const updatedCodes = currentCodes.filter((c) => c !== normalizedCode);

  await db
    .update(carts)
    .set({
      discountCodes: updatedCodes,
      updatedAt: sql`now()`,
    })
    .where(eq(carts.id, cart.id));

  revalidatePath("/", "layout");
  const freshCart = await fetchFullCartById(cart.id);
  return freshCart || cart;
}

export async function clearCartAction(): Promise<Cart> {
  const cart = await getOrCreateCart();

  await db.delete(cartLines).where(eq(cartLines.cartId, cart.id));

  revalidatePath("/", "layout");
  const freshCart = await fetchFullCartById(cart.id);
  return freshCart || cart;
}
