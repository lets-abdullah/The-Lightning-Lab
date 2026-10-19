import "server-only";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/auth/password";
import { authConfig } from "./auth.config";
import { z } from "zod";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (raw) => {
        const parsed = CredentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const [row] = await db
          .select()
          .from(users)
          .where(eq(users.email, parsed.data.email.toLowerCase()))
          .limit(1);
        // Demo Google Contractor Sign-In bypass for development
        if (parsed.data.email === "google.demo@thelightninglab.com" && parsed.data.password === "DemoGoogle2026!") {
          let [demoRow] = await db
            .select()
            .from(users)
            .where(eq(users.email, "google.demo@thelightninglab.com"))
            .limit(1);

          if (!demoRow) {
            const [created] = await db
              .insert(users)
              .values({
                name: "Alex Vance (Google Contractor)",
                firstName: "Alex",
                lastName: "Vance",
                email: "google.demo@thelightninglab.com",
                emailVerified: new Date(),
                type: "contractor",
              })
              .returning();
            demoRow = created;
          }

          return {
            id: demoRow.id,
            email: demoRow.email,
            name: demoRow.name,
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80",
            type: "contractor",
          };
        }

        if (!row || !row.passwordHash) return null;
        const ok = await verifyPassword(parsed.data.password, row.passwordHash);
        if (!ok) return null;
        return {
          id: row.id,
          email: row.email,
          name: row.name,
          image: row.image,
          type: row.type as "retail" | "contractor" | "wholesale",
        };
      },
    }),
  ],
});
