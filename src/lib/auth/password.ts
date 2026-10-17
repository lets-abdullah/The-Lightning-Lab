import "server-only";
import bcrypt from "bcryptjs";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function validatePasswordStrength(p: string): {
  ok: boolean;
  message?: string;
} {
  if (p.length < 8) {
    return {
      ok: false,
      message: "Password must be at least 8 characters long",
    };
  }
  if (!/[a-zA-Z]/.test(p)) {
    return {
      ok: false,
      message: "Password must contain at least one letter",
    };
  }
  if (!/[0-9]/.test(p)) {
    return {
      ok: false,
      message: "Password must contain at least one number",
    };
  }
  return { ok: true };
}
