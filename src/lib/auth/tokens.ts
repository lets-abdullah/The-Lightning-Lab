import "server-only";
import crypto from "crypto";
import { db } from "@/db";
import { authTokens } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export type TokenPurpose = "email_verify" | "password_reset";

export async function issueToken(
  userId: string,
  purpose: TokenPurpose
): Promise<string> {
  const rawBytes = crypto.randomBytes(32);
  const rawToken = rawBytes.toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const now = new Date();
  const ttlMs =
    purpose === "email_verify"
      ? 24 * 60 * 60 * 1000 // 24 hours
      : 1 * 60 * 60 * 1000; // 1 hour
  const expiresAt = new Date(now.getTime() + ttlMs);

  await db.insert(authTokens).values({
    userId,
    purpose,
    tokenHash,
    expiresAt,
  });

  return rawToken;
}

export async function consumeToken(
  rawToken: string,
  purpose: TokenPurpose
): Promise<{ ok: true; userId: string } | { ok: false; reason: string }> {
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const [row] = await db
    .select()
    .from(authTokens)
    .where(
      and(
        eq(authTokens.tokenHash, tokenHash),
        eq(authTokens.purpose, purpose)
      )
    )
    .limit(1);

  if (!row || row.usedAt !== null) {
    return { ok: false, reason: "invalid" };
  }

  if (row.expiresAt.getTime() <= Date.now()) {
    return { ok: false, reason: "expired" };
  }

  await db
    .update(authTokens)
    .set({ usedAt: new Date() })
    .where(eq(authTokens.id, row.id));

  return { ok: true, userId: row.userId };
}

export async function lastIssuedAt(
  userId: string,
  purpose: TokenPurpose
): Promise<Date | null> {
  const [row] = await db
    .select({ createdAt: authTokens.createdAt })
    .from(authTokens)
    .where(
      and(
        eq(authTokens.userId, userId),
        eq(authTokens.purpose, purpose)
      )
    )
    .orderBy(desc(authTokens.createdAt))
    .limit(1);

  return row ? new Date(row.createdAt) : null;
}
