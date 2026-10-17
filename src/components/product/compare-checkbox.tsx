"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CompareCheckboxProps {
  productId: string;
  className?: string;
}

export function CompareCheckbox({ productId, className }: CompareCheckboxProps) {
  const id = `compare-${productId}`;

  return (
    <div className={`flex items-center space-x-1.5 opacity-60 cursor-not-allowed ${className || ""}`}>
      <Checkbox id={id} disabled aria-label="Compare (coming soon)" />
      <Label
        htmlFor={id}
        className="text-xs text-muted-foreground cursor-not-allowed select-none font-normal"
      >
        Compare
      </Label>
    </div>
  );
}
