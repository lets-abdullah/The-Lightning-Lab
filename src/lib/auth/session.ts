import "server-only";
import { auth } from "@/auth";

export async function getSession() {
  return auth();
}

export async function requireUser() {
  const s = await auth();
  if (!s?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }
  return s.user;
}
