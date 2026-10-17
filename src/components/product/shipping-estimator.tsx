"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ShippingEstimator() {
  const [zip, setZip] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  function handleEstimate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (/^\d{5}$/.test(zip.trim())) {
      setError(false);
      setSubmitted(true);
    } else {
      setError(true);
      setSubmitted(false);
    }
  }

  // Calculate estimated delivery dates: today + 3 business days and today + 7 business days
  function addBusinessDays(date: Date, days: number): Date {
    const result = new Date(date);
    let added = 0;
    while (added < days) {
      result.setDate(result.getDate() + 1);
      const dayOfWeek = result.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        added++;
      }
    }
    return result;
  }

  const now = new Date();
  const minDelivery = addBusinessDays(now, 3);
  const maxDelivery = addBusinessDays(now, 7);

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });
  const deliveryRange = `${formatter.format(minDelivery)} – ${formatter.format(maxDelivery)}`;

  return (
    <div className="rounded-md border p-3 bg-muted/20 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">
          Shipping & Delivery
        </span>
      </div>

      <form onSubmit={handleEstimate} className="flex items-center gap-2">
        <Input
          type="text"
          inputMode="numeric"
          maxLength={5}
          placeholder="Enter ZIP"
          value={zip}
          onChange={(e) => {
            setZip(e.target.value);
            if (submitted) setSubmitted(false);
            if (error) setError(false);
          }}
          aria-label="ZIP code"
          className="h-8 text-xs max-w-[120px]"
        />
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-xs"
        >
          Estimate
        </Button>
      </form>

      {error && (
        <p className="text-xs text-muted-foreground">Enter a 5-digit ZIP</p>
      )}

      {submitted && !error && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          Ships within 1 business day. Estimated delivery:{" "}
          <span className="font-semibold text-foreground">{deliveryRange}</span>
        </p>
      )}
    </div>
  );
}
