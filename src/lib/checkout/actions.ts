"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { orders, orderLines, cartLines } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { getOrCreateCart } from "@/lib/cart/session";
import { CART_COOKIE_NAME } from "@/lib/cart/constants";
import type { Address } from "@/lib/commerce/types";

export interface PlaceOrderInput {
  email: string;
  phone?: string;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  shippingTotal: number;
  paymentMethod: "card" | "net30";
  poNumber?: string;
  notes?: string;
}

export async function createOrderAction(input: PlaceOrderInput): Promise<{ ok: true; orderId: string } | { ok: false; error: string }> {
  try {
    const session = await auth();
    const cart = await getOrCreateCart();

    if (!cart.lines || cart.lines.length === 0) {
      return { ok: false, error: "Your cart is empty" };
    }

    const orderNumber = `LL-${Math.floor(100000 + Math.random() * 900000)}`;
    const subtotal = cart.subtotal;
    const discountTotal = cart.discountTotal || 0;
    const shippingTotal = input.shippingTotal;
    const taxTotal = Math.round((subtotal - discountTotal) * 0.065); // 6.5% estimated tax
    const total = subtotal - discountTotal + shippingTotal + taxTotal;

    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: session?.user?.id ?? null,
        email: input.email.trim().toLowerCase(),
        phone: input.phone?.trim() || null,
        status: input.paymentMethod === "net30" ? "processing" : "paid",
        currency: "USD",
        subtotal,
        discountTotal,
        shippingTotal,
        taxTotal,
        total,
        discountCodes: cart.discountCodes || [],
        shippingAddress: input.shippingAddress,
        billingAddress: input.billingAddress,
        shippingMethod: input.shippingMethod,
        notes: input.notes?.trim() || null,
        poNumber: input.poNumber?.trim() || null,
        paymentMethod: input.paymentMethod,
        paymentTerms: input.paymentMethod === "net30" ? "Net 30 Days" : "Credit Card (Instant)",
        paidAt: input.paymentMethod === "net30" ? null : new Date(),
      })
      .returning();

    // Insert order lines
    for (const line of cart.lines) {
      await db.insert(orderLines).values({
        orderId: newOrder.id,
        productHandle: line.productHandle,
        variantId: line.variantId,
        title: line.title,
        variantTitle: line.variantTitle || "Default",
        sku: line.sku,
        image: line.image,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        lineTotal: line.lineTotal,
        bulkTierApplied: line.bulkTierApplied || null,
      });
    }

    // Clear cart lines from DB
    await db.delete(cartLines).where(eq(cartLines.cartId, cart.id));
    try {
      const cookieStore = await cookies();
      cookieStore.delete(CART_COOKIE_NAME);
    } catch {
      // ignore cookie error
    }

    return { ok: true, orderId: newOrder.id };
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return { ok: false, error: error?.message || "Failed to place order" };
  }
}
