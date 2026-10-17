import { db } from "@/db";
import { discounts } from "@/db/schema";
import { inArray, eq, and } from "drizzle-orm";

export interface KnownDiscount {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minSubtotal?: number | null;
  active: boolean;
  expiresAt?: Date | null;
}

export function applyDiscountsToSubtotal(
  subtotal: number,
  discountCodes: string[],
  known: KnownDiscount[]
): { discountTotal: number } {
  let discountTotal = 0;
  const now = new Date();

  for (const code of discountCodes) {
    const match = known.find(
      (k) => k.code.toUpperCase() === code.toUpperCase()
    );
    if (!match || !match.active) continue;

    // Check expiration if set
    if (match.expiresAt && match.expiresAt < now) continue;

    // Check minSubtotal if set
    if (match.minSubtotal && subtotal < match.minSubtotal) continue;

    let codeDiscount = 0;
    if (match.type === "percentage") {
      codeDiscount = Math.round((subtotal * match.value) / 100);
    } else if (match.type === "fixed") {
      codeDiscount = Math.min(match.value, subtotal);
    }

    discountTotal += codeDiscount;
  }

  // Cap total discount at subtotal (never negative total)
  return { discountTotal: Math.min(discountTotal, subtotal) };
}

export async function loadActiveDiscounts(
  codes: string[]
): Promise<KnownDiscount[]> {
  if (!codes || codes.length === 0) return [];

  const rows = await db
    .select()
    .from(discounts)
    .where(
      and(
        inArray(discounts.code, codes),
        eq(discounts.active, true)
      )
    );

  return rows.map((r) => ({
    code: r.code,
    type: r.type as "percentage" | "fixed",
    value: r.value,
    minSubtotal: r.minSubtotal,
    active: r.active,
    expiresAt: r.expiresAt ? new Date(r.expiresAt) : null,
  }));
}
