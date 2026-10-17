"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import { linkPastOrdersAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

interface LinkOrdersBannerProps {
  count: number;
}

export function LinkOrdersBanner({ count }: LinkOrdersBannerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || count <= 0) return null;

  const handleClaim = () => {
    startTransition(async () => {
      try {
        const res = await linkPastOrdersAction();
        if (res.ok) {
          toast.success(`${res.data.linked} order(s) added`);
          router.refresh();
        } else {
          toast.error(res.error);
        }
      } catch {
        toast.error("Failed to claim past orders");
      }
    });
  };

  return (
    <div className="w-full bg-blue-50 border border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-200 px-4 py-3 rounded-lg flex items-center justify-between gap-3 text-sm mb-6">
      <div className="flex items-center gap-2">
        <span className="font-medium">
          We found {count} past order{count > 1 ? "s" : ""} placed with this email. Add them to your account?
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          disabled={isPending}
          onClick={handleClaim}
          className="bg-blue-600 text-white hover:bg-blue-700 h-8 px-3"
        >
          {isPending ? "Claiming..." : "Claim"}
        </Button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-100 p-1"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
