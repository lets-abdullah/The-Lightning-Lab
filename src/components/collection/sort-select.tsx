"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortOption } from "@/lib/commerce/filters";
import { parseSort } from "@/lib/commerce/filters";

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  newest: "Newest Arrivals",
  "best-selling": "Best Selling",
};

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSort = parseSort(searchParams.get("sort") ?? undefined);

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("page");
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
        Sort by:
      </span>
      <Select
        value={currentSort}
        onValueChange={handleSortChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-[180px] h-9 text-xs bg-white border-gray-300 text-gray-900 shadow-2xs hover:border-gray-500 focus:ring-1 focus:ring-black" aria-label="Sort products">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent
          align="end"
          position="popper"
          side="bottom"
          sideOffset={4}
          avoidCollisions={false}
          className="bg-white border border-gray-200 text-gray-900 shadow-xl z-50 rounded-lg overflow-hidden min-w-[180px]"
        >
          <SelectItem value="featured" className="text-xs cursor-pointer">
            {SORT_LABELS["featured"]}
          </SelectItem>
          <SelectItem value="price-asc" className="text-xs cursor-pointer">
            {SORT_LABELS["price-asc"]}
          </SelectItem>
          <SelectItem value="price-desc" className="text-xs cursor-pointer">
            {SORT_LABELS["price-desc"]}
          </SelectItem>
          <SelectItem value="newest" className="text-xs cursor-pointer">
            {SORT_LABELS["newest"]}
          </SelectItem>
          <SelectItem value="best-selling" className="text-xs cursor-pointer">
            {SORT_LABELS["best-selling"]}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
