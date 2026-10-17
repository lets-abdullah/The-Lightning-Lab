"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button
      type="button"
      onClick={() => window.print()}
      className="no-print gap-2"
    >
      <Printer className="w-4 h-4" />
      <span>Print / Save as PDF</span>
    </Button>
  );
}
