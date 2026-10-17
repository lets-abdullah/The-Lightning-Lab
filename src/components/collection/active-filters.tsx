"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ActiveFilterItem {
  key: string;
  label: string;
  value?: string;
  paramKey: string;
}

export function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeFilters: ActiveFilterItem[] = [];

  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  if (minPrice && maxPrice) {
    activeFilters.push({
      key: "price-range",
      label: `$${parseInt(minPrice, 10) / 100} - $${parseInt(maxPrice, 10) / 100}`,
      paramKey: "price_both",
    });
  } else if (minPrice) {
    activeFilters.push({
      key: "price-min",
      label: `Min $${parseInt(minPrice, 10) / 100}`,
      paramKey: "min_price",
    });
  } else if (maxPrice) {
    activeFilters.push({
      key: "price-max",
      label: `Max $${parseInt(maxPrice, 10) / 100}`,
      paramKey: "max_price",
    });
  }

  const multiKeys = [
    { paramKey: "wattage", prefix: "Wattage: " },
    { paramKey: "cct", prefix: "CCT: " },
    { paramKey: "voltage", prefix: "Voltage: " },
    { paramKey: "cert", prefix: "Cert: " },
  ];

  for (const { paramKey, prefix } of multiKeys) {
    const raw = searchParams.get(paramKey);
    if (raw) {
      const vals = raw.split(",").map((s) => s.trim()).filter(Boolean);
      for (const val of vals) {
        activeFilters.push({
          key: `${paramKey}-${val}`,
          label: `${prefix}${val}`,
          value: val,
          paramKey,
        });
      }
    }
  }

  const dimmable = searchParams.get("dimmable");
  if (dimmable === "true") {
    activeFilters.push({
      key: "dimmable-true",
      label: "Dimmable",
      paramKey: "dimmable",
    });
  } else if (dimmable === "false") {
    activeFilters.push({
      key: "dimmable-false",
      label: "Non-Dimmable",
      paramKey: "dimmable",
    });
  }

  const inStock = searchParams.get("in_stock");
  if (inStock === "true") {
    activeFilters.push({
      key: "in-stock-true",
      label: "In Stock Only",
      paramKey: "in_stock",
    });
  }

  function removeFilter(item: ActiveFilterItem) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (item.paramKey === "price_both") {
      params.delete("min_price");
      params.delete("max_price");
    } else if (item.value) {
      const current = params.get(item.paramKey);
      if (current) {
        const remaining = current
          .split(",")
          .map((s) => s.trim())
          .filter((v) => v !== item.value);
        if (remaining.length > 0) {
          params.set(item.paramKey, remaining.join(","));
        } else {
          params.delete(item.paramKey);
        }
      }
    } else {
      params.delete(item.paramKey);
    }

    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  function handleClearAll() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("min_price");
    params.delete("max_price");
    params.delete("wattage");
    params.delete("cct");
    params.delete("voltage");
    params.delete("cert");
    params.delete("dimmable");
    params.delete("in_stock");
    params.delete("page");
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-2">
      <span className="text-xs text-muted-foreground mr-1">Active filters:</span>
      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          className="inline-flex items-center gap-1.5 pr-1 pl-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200 shadow-2xs hover:bg-gray-200 transition-colors"
        >
          <span>{filter.label}</span>
          <button
            type="button"
            onClick={() => removeFilter(filter)}
            disabled={isPending}
            className="rounded-full p-0.5 hover:bg-gray-300 text-gray-500 hover:text-black transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-black"
            aria-label={`Remove filter: ${filter.label}`}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="link"
        size="sm"
        onClick={handleClearAll}
        disabled={isPending}
        className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 ml-2"
      >
        Clear all
      </Button>
    </div>
  );
}
