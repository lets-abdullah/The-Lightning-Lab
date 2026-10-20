"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SearchFacets } from "@/lib/search/query";

interface FacetCountItem {
  value: string;
  count: number;
}

interface FacetFieldData {
  field_name: string;
  counts: FacetCountItem[];
}

interface SearchFacetsProps {
  facetCounts: Record<string, unknown>;
  currentFilters: SearchFacets;
  basePath: string;
}

export function SearchFacets({
  facetCounts,
  currentFilters,
  basePath,
}: SearchFacetsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [minPriceInput, setMinPriceInput] = useState(
    currentFilters.minPrice !== undefined
      ? String(Math.floor(currentFilters.minPrice / 100))
      : ""
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    currentFilters.maxPrice !== undefined
      ? String(Math.floor(currentFilters.maxPrice / 100))
      : ""
  );

  const getFacetData = (fieldName: string): FacetCountItem[] => {
    const raw = facetCounts[fieldName] as FacetFieldData | undefined;
    return raw?.counts ?? [];
  };

  const updateFilters = (updated: Partial<SearchFacets>) => {
    const nextFilters: SearchFacets = {
      ...currentFilters,
      ...updated,
    };

    const params = new URLSearchParams();

    // Preserve q
    const q = searchParams.get("q");
    if (q) params.set("q", q);

    // Preserve sort
    const sort = searchParams.get("sort");
    if (sort) params.set("sort", sort);

    // Reset page by omitting it

    // Apply filters
    if (nextFilters.collections && nextFilters.collections.length > 0) {
      params.set("collection", nextFilters.collections.join(","));
    }
    if (nextFilters.wattage && nextFilters.wattage.length > 0) {
      params.set("wattage", nextFilters.wattage.join(","));
    }
    if (nextFilters.cct && nextFilters.cct.length > 0) {
      params.set("cct", nextFilters.cct.join(","));
    }
    if (nextFilters.voltage && nextFilters.voltage.length > 0) {
      params.set("voltage", nextFilters.voltage.join(","));
    }
    if (nextFilters.certifications && nextFilters.certifications.length > 0) {
      params.set("certifications", nextFilters.certifications.join(","));
    }
    if (nextFilters.dimmable === true) {
      params.set("dimmable", "true");
    }
    if (nextFilters.inStock === true) {
      params.set("in_stock", "true");
    }
    if (nextFilters.minPrice !== undefined) {
      params.set("min_price", String(nextFilters.minPrice));
    }
    if (nextFilters.maxPrice !== undefined) {
      params.set("max_price", String(nextFilters.maxPrice));
    }

    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  };

  const toggleArrayFilter = (
    key: "collections" | "wattage" | "cct" | "voltage" | "certifications",
    val: string
  ) => {
    const current = currentFilters[key] ?? [];
    const exists = current.includes(val);
    const next = exists ? current.filter((item) => item !== val) : [...current, val];
    updateFilters({ [key]: next.length ? next : undefined });
  };

  const applyPriceRange = () => {
    const minVal = minPriceInput.trim() ? parseInt(minPriceInput, 10) : undefined;
    const maxVal = maxPriceInput.trim() ? parseInt(maxPriceInput, 10) : undefined;

    const minCents = minVal !== undefined && !Number.isNaN(minVal) ? minVal * 100 : undefined;
    const maxCents = maxVal !== undefined && !Number.isNaN(maxVal) ? maxVal * 100 : undefined;

    updateFilters({ minPrice: minCents, maxPrice: maxCents });
  };

  const collectionCounts = getFacetData("collections");
  const wattageCounts = getFacetData("wattage");
  const cctCounts = getFacetData("cct");
  const voltageCounts = getFacetData("voltage");
  const certificationCounts = getFacetData("certifications");

  const filterContent = (
    <div className="space-y-6 text-gray-900">
      {/* 1. Price Range */}
      <fieldset className="space-y-3">
        <legend className="text-xs font-bold uppercase tracking-wider text-gray-950 pb-1.5 border-b border-gray-200 w-full mb-2">
          Price ($)
        </legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyPriceRange();
            }}
            aria-label="Minimum price in dollars"
            className="w-full text-xs rounded border border-gray-300 px-2 py-1.5 focus:border-[#8B1812] focus:outline-hidden"
          />
          <span className="text-gray-400 text-xs">-</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyPriceRange();
            }}
            aria-label="Maximum price in dollars"
            className="w-full text-xs rounded border border-gray-300 px-2 py-1.5 focus:border-[#8B1812] focus:outline-hidden"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={applyPriceRange}
            className="shrink-0 text-xs px-2.5 h-8 font-semibold"
          >
            Go
          </Button>
        </div>
      </fieldset>

      {/* 2. Collections (only if present) */}
      {collectionCounts.length > 0 && (
        <fieldset className="space-y-2">
          <legend className="text-xs font-bold uppercase tracking-wider text-gray-950 pb-1.5 border-b border-gray-200 w-full mb-2">
            Collection
          </legend>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {collectionCounts.map((c) => {
              const checked = currentFilters.collections?.includes(c.value) ?? false;
              return (
                <label
                  key={c.value}
                  className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-950 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleArrayFilter("collections", c.value)}
                    className="rounded border-gray-300 text-[#8B1812] focus:ring-[#8B1812] size-3.5"
                  />
                  <span className="truncate flex-1">{c.value}</span>
                  <span className="text-muted-foreground text-[11px] shrink-0">
                    ({c.count})
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* 3. Wattage */}
      {wattageCounts.length > 0 && (
        <fieldset className="space-y-2">
          <legend className="text-xs font-bold uppercase tracking-wider text-gray-950 pb-1.5 border-b border-gray-200 w-full mb-2">
            Wattage
          </legend>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {wattageCounts.map((w) => {
              const checked = currentFilters.wattage?.includes(w.value) ?? false;
              return (
                <label
                  key={w.value}
                  className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-950 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleArrayFilter("wattage", w.value)}
                    className="rounded border-gray-300 text-[#8B1812] focus:ring-[#8B1812] size-3.5"
                  />
                  <span className="truncate flex-1">{w.value}</span>
                  <span className="text-muted-foreground text-[11px] shrink-0">
                    ({w.count})
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* 4. Color Temp (cct) */}
      {cctCounts.length > 0 && (
        <fieldset className="space-y-2">
          <legend className="text-xs font-bold uppercase tracking-wider text-gray-950 pb-1.5 border-b border-gray-200 w-full mb-2">
            Color Temp
          </legend>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {cctCounts.map((c) => {
              const checked = currentFilters.cct?.includes(c.value) ?? false;
              return (
                <label
                  key={c.value}
                  className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-950 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleArrayFilter("cct", c.value)}
                    className="rounded border-gray-300 text-[#8B1812] focus:ring-[#8B1812] size-3.5"
                  />
                  <span className="truncate flex-1">{c.value}</span>
                  <span className="text-muted-foreground text-[11px] shrink-0">
                    ({c.count})
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* 5. Voltage */}
      {voltageCounts.length > 0 && (
        <fieldset className="space-y-2">
          <legend className="text-xs font-bold uppercase tracking-wider text-gray-950 pb-1.5 border-b border-gray-200 w-full mb-2">
            Voltage
          </legend>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {voltageCounts.map((v) => {
              const checked = currentFilters.voltage?.includes(v.value) ?? false;
              return (
                <label
                  key={v.value}
                  className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-950 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleArrayFilter("voltage", v.value)}
                    className="rounded border-gray-300 text-[#8B1812] focus:ring-[#8B1812] size-3.5"
                  />
                  <span className="truncate flex-1">{v.value}</span>
                  <span className="text-muted-foreground text-[11px] shrink-0">
                    ({v.count})
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* 6. Certification */}
      {certificationCounts.length > 0 && (
        <fieldset className="space-y-2">
          <legend className="text-xs font-bold uppercase tracking-wider text-gray-950 pb-1.5 border-b border-gray-200 w-full mb-2">
            Certification
          </legend>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {certificationCounts.map((cert) => {
              const checked =
                currentFilters.certifications?.includes(cert.value) ?? false;
              return (
                <label
                  key={cert.value}
                  className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-950 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleArrayFilter("certifications", cert.value)}
                    className="rounded border-gray-300 text-[#8B1812] focus:ring-[#8B1812] size-3.5"
                  />
                  <span className="truncate flex-1">{cert.value}</span>
                  <span className="text-muted-foreground text-[11px] shrink-0">
                    ({cert.count})
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* 7. Dimmable (radio: Any / Yes) */}
      <fieldset className="space-y-2">
        <legend className="text-xs font-bold uppercase tracking-wider text-gray-950 pb-1.5 border-b border-gray-200 w-full mb-2">
          Dimmable
        </legend>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-950 cursor-pointer select-none">
            <input
              type="radio"
              name="dimmable"
              checked={currentFilters.dimmable === undefined}
              onChange={() => updateFilters({ dimmable: undefined })}
              className="text-[#8B1812] focus:ring-[#8B1812] size-3.5"
            />
            <span>Any</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-950 cursor-pointer select-none">
            <input
              type="radio"
              name="dimmable"
              checked={currentFilters.dimmable === true}
              onChange={() => updateFilters({ dimmable: true })}
              className="text-[#8B1812] focus:ring-[#8B1812] size-3.5"
            />
            <span>Yes</span>
          </label>
        </div>
      </fieldset>

      {/* 8. Availability (radio: Any / In stock) */}
      <fieldset className="space-y-2">
        <legend className="text-xs font-bold uppercase tracking-wider text-gray-950 pb-1.5 border-b border-gray-200 w-full mb-2">
          Availability
        </legend>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-950 cursor-pointer select-none">
            <input
              type="radio"
              name="availability"
              checked={currentFilters.inStock === undefined}
              onChange={() => updateFilters({ inStock: undefined })}
              className="text-[#8B1812] focus:ring-[#8B1812] size-3.5"
            />
            <span>Any</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-950 cursor-pointer select-none">
            <input
              type="radio"
              name="availability"
              checked={currentFilters.inStock === true}
              onChange={() => updateFilters({ inStock: true })}
              className="text-[#8B1812] focus:ring-[#8B1812] size-3.5"
            />
            <span>In stock</span>
          </label>
        </div>
      </fieldset>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Trigger (visible on screens < lg) */}
      <div className="lg:hidden w-full mb-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between bg-white border-gray-300 text-gray-900 font-semibold"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="size-4" />
                <span>Filters</span>
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 sm:w-96 overflow-y-auto bg-white text-gray-900 border-r border-gray-200 p-6"
          >
            <SheetHeader className="mb-4 text-left border-b border-gray-200 pb-3">
              <SheetTitle className="text-base font-extrabold text-gray-950">
                Search Filters
              </SheetTitle>
            </SheetHeader>
            {filterContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 sticky top-24 self-start">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs text-gray-900">
          <div className="pb-3 border-b border-gray-200 mb-4">
            <h2 className="text-sm font-black tracking-wider uppercase text-gray-950">
              Filters
            </h2>
          </div>
          {filterContent}
        </div>
      </aside>
    </>
  );
}
