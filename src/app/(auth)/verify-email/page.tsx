import { Metadata } from "next";
import Link from "next/link";
import { verifyEmailAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Email Verification - The Lightning Lab",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  let verified = false;
  if (token) {
    const res = await verifyEmailAction({ token });
    if (res.ok) {
      verified = true;
    }
  }

  return (
    <div className="space-y-6 text-center">
      {verified ? (
        <div className="space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Email Verified</h1>
          <p className="text-sm text-muted-foreground">
            Your email is verified. You can close this tab or return to your
            account.
          </p>
          <div className="pt-2">
            <Button asChild className="w-full">
              <Link href="/account">Go to account</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-destructive/15 text-destructive flex items-center justify-center">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Verification Failed
          </h1>
          <p className="text-sm text-muted-foreground">
            Invalid or expired verification link. Sign in and request a new one
            from your profile.
          </p>
          <div className="pt-2">
            <Button asChild className="w-full">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
