"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchSortBarProps {
  current?: string;
}

export function SearchSortBar({ current = "relevance" }: SearchSortBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const selectedValue =
    current === "price-asc" || current === "price-desc" || current === "newest"
      ? current
      : "relevance";

  return (
    <div className="flex items-center justify-end gap-2 mb-6">
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        Sort by:
      </span>
      <Select value={selectedValue} onValueChange={handleSortChange}>
        <SelectTrigger
          className="w-[180px] h-9 text-xs bg-white border-gray-300 text-gray-900 shadow-2xs hover:border-gray-500 focus:ring-1 focus:ring-black"
          aria-label="Sort products"
        >
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent
          align="end"
          position="popper"
          side="bottom"
          sideOffset={4}
          className="bg-white border border-gray-200 text-gray-900 shadow-xl z-50 rounded-lg overflow-hidden min-w-[180px]"
        >
          <SelectItem value="relevance" className="text-xs cursor-pointer">
            Relevance
          </SelectItem>
          <SelectItem value="price-asc" className="text-xs cursor-pointer">
            Price: Low to High
          </SelectItem>
          <SelectItem value="price-desc" className="text-xs cursor-pointer">
            Price: High to Low
          </SelectItem>
          <SelectItem value="newest" className="text-xs cursor-pointer">
            Newest
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
