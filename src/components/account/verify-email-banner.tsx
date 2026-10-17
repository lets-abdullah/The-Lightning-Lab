"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { resendVerificationAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

interface VerifyEmailBannerProps {
  email: string;
  verified: boolean;
}

export function VerifyEmailBanner({ email, verified }: VerifyEmailBannerProps) {
  const [isPending, startTransition] = useTransition();

  if (verified) return null;

  const handleResend = () => {
    startTransition(async () => {
      try {
        const res = await resendVerificationAction();
        if (res.ok) {
          toast.success("Sent — check your inbox");
        } else {
          toast.error(res.error);
        }
      } catch {
        toast.error("Failed to resend verification email");
      }
    });
  };

  return (
    <div className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 px-4 py-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm mb-6">
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>
          Verify your email ({email}) to secure your account and claim past
          orders.
        </span>
      </div>
      <Button
        variant="link"
        size="sm"
        disabled={isPending}
        onClick={handleResend}
        className="p-0 h-auto text-amber-900 dark:text-amber-200 font-semibold underline hover:no-underline"
      >
        {isPending ? "Sending..." : "Resend verification email"}
      </Button>
    </div>
  );
}
