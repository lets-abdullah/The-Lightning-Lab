"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { resendVerificationAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export function ResendVerificationButton() {
  const [isPending, startTransition] = useTransition();

  const handleResend = () => {
    startTransition(async () => {
      try {
        const res = await resendVerificationAction();
        if (res.ok) {
          toast.success("Verification email sent");
        } else {
          toast.error(res.error);
        }
      } catch {
        toast.error("Failed to resend verification email");
      }
    });
  };

  return (
    <Button
      variant="link"
      size="sm"
      disabled={isPending}
      onClick={handleResend}
      className="p-0 h-auto text-primary text-xs"
    >
      {isPending ? "Sending..." : "Resend verification link"}
    </Button>
  );
}
