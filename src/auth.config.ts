import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET || "dev_secret_key_minimum_length_32_characters_long!",
  pages: { signIn: "/login", error: "/login" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAccount = nextUrl.pathname.startsWith("/account");
      if (!isAccount) return true;
      if (auth?.user) return true;
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("next", nextUrl.pathname);
      return Response.redirect(loginUrl);
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type ?? "retail";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type ?? "retail";
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
