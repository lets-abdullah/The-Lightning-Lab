"use server";

import { z } from "zod";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { users, orders, addresses } from "@/db/schema";
import { hashPassword, verifyPassword, validatePasswordStrength } from "./password";
import { issueToken, consumeToken, lastIssuedAt } from "./tokens";
import { requireUser } from "./session";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email/send";
import { AddressInput, AddressSchema } from "@/lib/checkout/schema";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function registerAction(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<ActionResult<{ userId: string }>> {
  const parsed = RegisterSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const strength = validatePasswordStrength(parsed.data.password);
  if (!strength.ok) {
    return { ok: false, error: strength.message ?? "Password is too weak" };
  }

  const emailLower = parsed.data.email.toLowerCase().trim();

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, emailLower))
    .limit(1);

  if (existing) {
    return { ok: false, error: "An account with that email already exists" };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const fullName = `${parsed.data.firstName} ${parsed.data.lastName}`.trim();

  const [newUser] = await db
    .insert(users)
    .values({
      firstName: parsed.data.firstName.trim(),
      lastName: parsed.data.lastName.trim(),
      name: fullName,
      email: emailLower,
      passwordHash,
      emailVerified: null,
      marketingOptIn: false,
      type: "retail",
    })
    .returning({ id: users.id, email: users.email });

  // Issue verification token and send email (non-blocking)
  Promise.allSettled([
    issueToken(newUser.id, "email_verify").then((token) =>
      sendVerificationEmail({
        email: newUser.email,
        firstName: parsed.data.firstName.trim(),
        token,
      })
    ),
  ]).catch((err) => {
    console.error("Non-blocking verify email error:", err);
  });

  return { ok: true, data: { userId: newUser.id } };
}

export async function resendVerificationAction(): Promise<ActionResult> {
  const user = await requireUser();

  const [dbUser] = await db
    .select({
      email: users.email,
      emailVerified: users.emailVerified,
      firstName: users.firstName,
    })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!dbUser) {
    return { ok: false, error: "User not found" };
  }

  if (dbUser.emailVerified) {
    return { ok: false, error: "Email already verified" };
  }

  const last = await lastIssuedAt(user.id, "email_verify");
  if (last && Date.now() - last.getTime() < 60000) {
    return { ok: false, error: "Please wait before resending" };
  }

  const token = await issueToken(user.id, "email_verify");
  await sendVerificationEmail({
    email: dbUser.email,
    firstName: dbUser.firstName ?? undefined,
    token,
  });

  return { ok: true, data: undefined };
}

export async function verifyEmailAction(input: {
  token: string;
}): Promise<ActionResult> {
  if (!input.token) {
    return { ok: false, error: "Invalid or expired link" };
  }

  const res = await consumeToken(input.token, "email_verify");
  if (!res.ok) {
    return { ok: false, error: "Invalid or expired link" };
  }

  await db
    .update(users)
    .set({ emailVerified: new Date(), updatedAt: new Date() })
    .where(eq(users.id, res.userId));

  return { ok: true, data: undefined };
}

export async function forgotPasswordAction(input: {
  email: string;
}): Promise<ActionResult> {
  const emailSchema = z.string().email();
  const parsed = emailSchema.safeParse(input.email);
  if (!parsed.success) {
    // Return ok to not leak format or existence
    return { ok: true, data: undefined };
  }

  const emailLower = parsed.data.toLowerCase().trim();
  const [user] = await db
    .select({ id: users.id, email: users.email, firstName: users.firstName })
    .from(users)
    .where(eq(users.email, emailLower))
    .limit(1);

  if (user) {
    try {
      const token = await issueToken(user.id, "password_reset");
      await sendPasswordResetEmail({
        email: user.email,
        firstName: user.firstName ?? undefined,
        token,
      });
    } catch (err) {
      console.error("Forgot password email error:", err);
    }
  }

  return { ok: true, data: undefined };
}

export async function resetPasswordAction(input: {
  token: string;
  password: string;
}): Promise<ActionResult> {
  const strength = validatePasswordStrength(input.password);
  if (!strength.ok) {
    return { ok: false, error: strength.message ?? "Password is too weak" };
  }

  const res = await consumeToken(input.token, "password_reset");
  if (!res.ok) {
    return { ok: false, error: "Invalid or expired link" };
  }

  const passwordHash = await hashPassword(input.password);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, res.userId));

  return { ok: true, data: undefined };
}

export async function changePasswordAction(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<ActionResult> {
  const user = await requireUser();

  const [row] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!row || !row.passwordHash) {
    return { ok: false, error: "Cannot change password for this account" };
  }

  const valid = await verifyPassword(input.currentPassword, row.passwordHash);
  if (!valid) {
    return { ok: false, error: "Incorrect current password" };
  }

  const strength = validatePasswordStrength(input.newPassword);
  if (!strength.ok) {
    return { ok: false, error: strength.message ?? "Password is too weak" };
  }

  const newHash = await hashPassword(input.newPassword);
  await db
    .update(users)
    .set({ passwordHash: newHash, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  return { ok: true, data: undefined };
}

export async function updateProfileAction(input: {
  firstName: string;
  lastName: string;
  phone?: string;
  marketingOptIn: boolean;
}): Promise<ActionResult> {
  const user = await requireUser();

  const fullName = `${input.firstName} ${input.lastName}`.trim();

  await db
    .update(users)
    .set({
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      name: fullName,
      phone: input.phone?.trim() || null,
      marketingOptIn: input.marketingOptIn,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return { ok: true, data: undefined };
}

export async function linkPastOrdersAction(): Promise<
  ActionResult<{ linked: number }>
> {
  const user = await requireUser();

  const [dbUser] = await db
    .select({
      email: users.email,
      emailVerified: users.emailVerified,
    })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!dbUser?.emailVerified) {
    return { ok: false, error: "Verify your email before claiming orders" };
  }

  const userEmailLower = dbUser.email.toLowerCase().trim();

  const updatedRows = await db
    .update(orders)
    .set({
      userId: user.id,
      updatedAt: new Date(),
    })
    .where(
      and(
        isNull(orders.userId),
        sql`lower(${orders.email}) = ${userEmailLower}`
      )
    )
    .returning({ id: orders.id });

  return { ok: true, data: { linked: updatedRows.length } };
}

export async function deleteAddressAction(input: {
  id: string;
}): Promise<ActionResult> {
  const user = await requireUser();

  await db
    .delete(addresses)
    .where(and(eq(addresses.id, input.id), eq(addresses.userId, user.id)));

  return { ok: true, data: undefined };
}

export async function upsertAddressAction(
  input: AddressInput
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const parsed = AddressSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid address" };
  }

  const data = parsed.data;

  if (data.isDefaultBilling) {
    await db
      .update(addresses)
      .set({ isDefaultBilling: false })
      .where(eq(addresses.userId, user.id));
  }

  if (data.isDefaultShipping) {
    await db
      .update(addresses)
      .set({ isDefaultShipping: false })
      .where(eq(addresses.userId, user.id));
  }

  if (data.id) {
    const [updated] = await db
      .update(addresses)
      .set({
        label: data.label || null,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company || null,
        line1: data.line1,
        line2: data.line2 || null,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone || null,
        isDefaultBilling: data.isDefaultBilling,
        isDefaultShipping: data.isDefaultShipping,
        updatedAt: new Date(),
      })
      .where(and(eq(addresses.id, data.id), eq(addresses.userId, user.id)))
      .returning({ id: addresses.id });

    if (!updated) {
      return { ok: false, error: "Address not found" };
    }
    return { ok: true, data: { id: updated.id } };
  }

  const [inserted] = await db
    .insert(addresses)
    .values({
      userId: user.id,
      label: data.label || null,
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company || null,
      line1: data.line1,
      line2: data.line2 || null,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      phone: data.phone || null,
      isDefaultBilling: data.isDefaultBilling,
      isDefaultShipping: data.isDefaultShipping,
    })
    .returning({ id: addresses.id });

  return { ok: true, data: { id: inserted.id } };
}

export async function setDefaultAddressAction(input: {
  id: string;
  kind: "billing" | "shipping";
}): Promise<ActionResult> {
  const user = await requireUser();

  if (input.kind === "shipping") {
    await db
      .update(addresses)
      .set({ isDefaultShipping: false })
      .where(eq(addresses.userId, user.id));

    await db
      .update(addresses)
      .set({ isDefaultShipping: true })
      .where(and(eq(addresses.id, input.id), eq(addresses.userId, user.id)));
  } else {
    await db
      .update(addresses)
      .set({ isDefaultBilling: false })
      .where(eq(addresses.userId, user.id));

    await db
      .update(addresses)
      .set({ isDefaultBilling: true })
      .where(and(eq(addresses.id, input.id), eq(addresses.userId, user.id)));
  }

  return { ok: true, data: undefined };
}
