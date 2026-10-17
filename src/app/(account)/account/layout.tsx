import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { VerifyEmailBanner } from "@/components/account/verify-email-banner";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [dbUser] = await db
    .select({
      email: users.email,
      emailVerified: users.emailVerified,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  const isVerified = Boolean(dbUser?.emailVerified);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
      <VerifyEmailBanner
        email={session.user.email ?? dbUser?.email ?? ""}
        verified={isVerified}
      />
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 items-start">
        <aside className="w-full md:sticky md:top-24 bg-card border border-border p-4 rounded-xl shadow-xs">
          <AccountSidebar />
        </aside>
        <section className="w-full min-w-0">{children}</section>
      </div>
    </div>
  );
}
