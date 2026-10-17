import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ProfileForm } from "@/components/account/profile-form";
import { PasswordForm } from "@/components/account/password-form";
import { ResendVerificationButton } from "@/components/account/resend-verification-button";

export const dynamic = "force-dynamic";

export default async function AccountProfilePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) return null;

  return (
    <div className="space-y-10 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile & Security</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your contact information and login credentials.
        </p>
      </div>

      {/* Account Info / Email Row */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-semibold">Account Details</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-muted/40 rounded-lg text-sm">
          <div>
            <span className="text-muted-foreground">Email: </span>
            <span className="font-medium text-foreground">{user.email}</span>
            <span className="ml-2 inline-block">
              {user.emailVerified ? (
                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 px-2 py-0.5 rounded font-medium">
                  Verified
                </span>
              ) : (
                <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded font-medium">
                  Unverified
                </span>
              )}
            </span>
          </div>
          {!user.emailVerified && <ResendVerificationButton />}
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <ProfileForm
          firstName={user.firstName || ""}
          lastName={user.lastName || ""}
          phone={user.phone || ""}
          marketingOptIn={user.marketingOptIn}
        />
      </div>

      {/* Password Form */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <PasswordForm />
      </div>
    </div>
  );
}
