"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, RotateCcw, Check } from "lucide-react";
import type { FacetConfig } from "@/lib/commerce/types";
import { resolveFacetOptions } from "@/lib/commerce/filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const ALL_CATEGORIES = [
  {
    group: "All Products",
    items: [{ label: "All Products", handle: "all" }],
  },
  {
    group: "Commercial & Industrial",
    items: [
      { label: "Commercial High Bays", handle: "commercial-industrial" },
      { label: "UFO High Bays", handle: "ufo-high-bays" },
      { label: "Linear High Bays", handle: "linear-high-bays" },
      { label: "Vapor Tight Fixtures", handle: "vapor-tights" },
      { label: "Tube Lights", handle: "tube-lights" },
      { label: "Batten Lights", handle: "batten-lights" },
    ],
  },
  {
    group: "LED Flat Panels",
    items: [
      { label: "LED Panels & Troffers", handle: "led-panel-lights" },
      { label: "LED Troffers", handle: "troffer-lights" },
      { label: "2x2 LED Panels", handle: "2x2-led-panels" },
      { label: "2x4 LED Panels", handle: "2x4-led-panels" },
      { label: "1x4 LED Panels", handle: "1x4-led-panels" },
      { label: "Grid Frames", handle: "grid-frames" },
      { label: "Flush Mount", handle: "flush-mount" },
    ],
  },
  {
    group: "LED Downlights",
    items: [
      { label: "All Downlights", handle: "led-downlights" },
      { label: "Trimless Downlight", handle: "trimless-downlight" },
      { label: "Retrofit Can Lights", handle: "retrofit-can-lights" },
      { label: "LED Bulbs", handle: "led-bulbs" },
      { label: "Light Mirrors", handle: "mirror-lights" },
    ],
  },
  {
    group: "Outdoor Commercial",
    items: [
      { label: "All Outdoor Lighting", handle: "outdoor-lighting" },
      { label: "LED Wall Packs", handle: "wall-packs" },
      { label: "Shoebox Parking Lot", handle: "shoebox-lights" },
      { label: "Canopy Lights", handle: "canopy-lights" },
      { label: "Flood Lights", handle: "flood-lights" },
      { label: "Barn Lights", handle: "barn-lights" },
    ],
  },
  {
    group: "LED Strip Lights",
    items: [
      { label: "All Strip Lights", handle: "led-strip-lights" },
      { label: "Modular Sheet Rolls", handle: "sheet-rolls" },
      { label: "Gold Sheet Rolls", handle: "gold-sheet-roll" },
      { label: "Flexible LED Sheets", handle: "flexible-led-sheet" },
      { label: "RGBW Color Sheets", handle: "rgbw-color-sheet" },
      { label: "Linear Fixtures", handle: "linear-fixtures" },
    ],
  },
  {
    group: "Emergency & Exit",
    items: [
      { label: "Emergency & Exit", handle: "emergency-exit" },
      { label: "Exit Signs Combo", handle: "exit-signs-combo" },
      { label: "Fire Resistant Exit Signs", handle: "fire-resistant-exit-sign" },
      { label: "Emergency Sky Panels", handle: "emergency-sky-panels" },
      { label: "Battery Backup Drivers", handle: "battery-backup-drivers" },
    ],
  },
];

interface FilterSidebarProps {
  facets: FacetConfig[];
  totalCount?: number;
  currentHandle?: string;
}

export function FilterSidebar({ facets, totalCount, currentHandle }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";

  function updateQuery(updater: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    // Always reset page to 1 when changing filters
    params.delete("page");
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  function handlePriceChange(field: "min_price" | "max_price", dollars: string) {
    const trimmed = dollars.trim();
    updateQuery((params) => {
      if (!trimmed) {
        params.delete(field);
      } else {
        const parsed = parseFloat(trimmed);
        if (!isNaN(parsed) && parsed >= 0) {
          const cents = Math.round(parsed * 100);
          params.set(field, String(cents));
        }
      }
    });
  }

  function handleCheckboxToggle(key: string, value: string) {
    const paramKey = key === "certification" ? "cert" : key;
    const current = searchParams.get(paramKey);
    const existingList = current ? current.split(",").map((s) => s.trim()).filter(Boolean) : [];

    updateQuery((params) => {
      let updated: string[];
      if (existingList.includes(value)) {
        updated = existingList.filter((v) => v !== value);
      } else {
        updated = [...existingList, value];
      }

      if (updated.length > 0) {
        params.set(paramKey, updated.join(","));
      } else {
        params.delete(paramKey);
      }
    });
  }

  function handleRadioChange(key: string, value: string) {
    const paramKey = key === "availability" ? "in_stock" : key;
    updateQuery((params) => {
      if (value === "all") {
        params.delete(paramKey);
      } else {
        params.set(paramKey, value);
      }
    });
  }

  function handleResetAll() {
    updateQuery((params) => {
      params.delete("min_price");
      params.delete("max_price");
      params.delete("wattage");
      params.delete("cct");
      params.delete("voltage");
      params.delete("cert");
      params.delete("certification");
      params.delete("certifications");
      params.delete("dimmable");
      params.delete("in_stock");
      params.delete("availability");
    });
  }

  const hasActiveFilters =
    searchParams.has("min_price") ||
    searchParams.has("max_price") ||
    searchParams.has("wattage") ||
    searchParams.has("cct") ||
    searchParams.has("voltage") ||
    searchParams.has("cert") ||
    searchParams.has("dimmable") ||
    searchParams.has("in_stock");

  const filterContent = (
    <div className="space-y-6 text-gray-900">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h2 className="text-sm font-extrabold tracking-wide uppercase text-gray-950">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            disabled={isPending}
            className="h-8 px-2 text-xs font-semibold text-[#8B1812] hover:text-[#8B1812] hover:bg-red-50"
          >
            <RotateCcw className="size-3 mr-1" />
            Reset all
          </Button>
        )}
      </div>

      {/* Category Dropdown Menu */}
      <div className="space-y-1.5 pb-3 border-b border-gray-200">
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
          Select Category
        </label>
        <Select
          value={currentHandle || "all"}
          onValueChange={(val) => {
            router.push(`/collections/${val}`);
          }}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-white border-gray-300 font-semibold text-gray-900 shadow-2xs hover:border-gray-500">
            <SelectValue placeholder="All Products" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="bottom"
            sideOffset={4}
            avoidCollisions={false}
            className="bg-white border border-gray-200 text-gray-900 shadow-xl max-h-72 z-50 rounded-lg"
          >
            {ALL_CATEGORIES.map((grp) => (
              <SelectGroup key={grp.group}>
                <SelectLabel className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider px-2 py-1 bg-gray-50">
                  {grp.group}
                </SelectLabel>
                {grp.items.map((cat) => (
                  <SelectItem key={cat.handle} value={cat.handle} className="text-xs cursor-pointer">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["categories", "price", "wattage", "cct", "certification"]}
        className="w-full space-y-2"
      >
        {/* Categories Accordion Section */}
        <AccordionItem value="categories" className="border-b border-gray-100">
          <AccordionTrigger className="text-sm font-bold py-2.5 text-gray-900 hover:text-[#8B1812] hover:no-underline">
            <div className="flex items-center gap-2">
              <span>Categories</span>
              {currentHandle && currentHandle !== "all" && (
                <span className="text-[10px] font-bold bg-red-100 text-[#8B1812] rounded-full px-1.5 py-0.2">
                  Active
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1 text-xs">
              {ALL_CATEGORIES.flatMap((grp) => grp.items).map((cat) => {
                const isActive = currentHandle === cat.handle;
                return (
                  <Link
                    key={cat.handle}
                    href={`/collections/${cat.handle}`}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors ${
                      isActive
                        ? "bg-[#8B1812] text-white font-bold"
                        : "text-gray-700 hover:bg-gray-100 hover:text-black font-medium"
                    }`}
                  >
                    <span className="truncate pr-2">{cat.label}</span>
                    {isActive && <Check className="size-3.5 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
        {facets.map((facet) => {
          if (facet.key === "price") {
            const minDollars = minPrice ? (parseInt(minPrice, 10) / 100).toString() : "";
            const maxDollars = maxPrice ? (parseInt(maxPrice, 10) / 100).toString() : "";

            return (
              <AccordionItem key={facet.key} value={facet.key} className="border-b border-gray-100">
                <AccordionTrigger className="text-sm font-bold py-2.5 text-gray-900 hover:text-red-600 hover:no-underline">
                  {facet.label}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                        $
                      </span>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Min"
                        defaultValue={minDollars}
                        key={`min-${minDollars}`}
                        onBlur={(e) => handlePriceChange("min_price", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handlePriceChange("min_price", e.currentTarget.value);
                          }
                        }}
                        className="pl-6 h-9 text-xs bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black font-medium"
                        aria-label="Minimum price in dollars"
                      />
                    </div>
                    <span className="text-gray-400 text-xs font-bold">–</span>
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                        $
                      </span>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Max"
                        defaultValue={maxDollars}
                        key={`max-${maxDollars}`}
                        onBlur={(e) => handlePriceChange("max_price", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handlePriceChange("max_price", e.currentTarget.value);
                          }
                        }}
                        className="pl-6 h-9 text-xs bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black font-medium"
                        aria-label="Maximum price in dollars"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          }

          if (facet.type === "checkbox") {
            const options = resolveFacetOptions(facet);
            const paramKey = facet.key === "certification" ? "cert" : facet.key;
            const currentParam = searchParams.get(paramKey);
            const activeValues = currentParam
              ? currentParam.split(",").map((s) => s.trim())
              : [];

            return (
              <AccordionItem key={facet.key} value={facet.key} className="border-b border-gray-100">
                <AccordionTrigger className="text-sm font-bold py-2.5 text-gray-900 hover:text-red-600 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span>{facet.label}</span>
                    {activeValues.length > 0 && (
                      <span className="text-[10px] font-bold bg-red-100 text-red-600 rounded-full px-1.5 py-0.2">
                        {activeValues.length}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-3">
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {options.map((opt) => {
                      const id = `facet-${facet.key}-${opt}`;
                      const isChecked = activeValues.includes(opt);

                      return (
                        <div key={opt} className="flex items-center space-x-2">
                          <Checkbox
                            id={id}
                            checked={isChecked}
                            onCheckedChange={() => handleCheckboxToggle(facet.key, opt)}
                            className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                          />
                          <Label
                            htmlFor={id}
                            className="text-xs font-medium text-gray-700 hover:text-gray-950 cursor-pointer select-none"
                          >
                            {opt}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          }

          if (facet.type === "radio") {
            const paramKey = facet.key === "availability" ? "in_stock" : facet.key;
            const currentValue = searchParams.get(paramKey) ?? "all";

            const options =
              facet.key === "availability"
                ? [
                    { label: "All", value: "all" },
                    { label: "In Stock Only", value: "true" },
                  ]
                : [
                    { label: "All", value: "all" },
                    { label: "Dimmable", value: "true" },
                    { label: "Non-Dimmable", value: "false" },
                  ];

            return (
              <AccordionItem key={facet.key} value={facet.key} className="border-b border-gray-100">
                <AccordionTrigger className="text-sm font-bold py-2.5 text-gray-900 hover:text-red-600 hover:no-underline">
                  {facet.label}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-3">
                  <RadioGroup
                    value={currentValue}
                    onValueChange={(val) => handleRadioChange(facet.key, val)}
                    className="space-y-1.5"
                  >
                    {options.map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={opt.value}
                          id={`radio-${facet.key}-${opt.value}`}
                          className="border-gray-300 text-black"
                        />
                        <Label
                          htmlFor={`radio-${facet.key}-${opt.value}`}
                          className="text-xs font-medium text-gray-700 hover:text-gray-950 cursor-pointer select-none"
                        >
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
            );
          }

          return null;
        })}
      </Accordion>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Trigger (visible on sm and md screens) */}
      <div className="lg:hidden w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-between bg-white border-gray-300 text-gray-900 font-semibold">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="size-4" />
                <span>Filters</span>
                {totalCount !== undefined && (
                  <span className="text-xs text-gray-500 font-normal">({totalCount})</span>
                )}
              </span>
              {hasActiveFilters && (
                <span className="size-2 rounded-full bg-red-600" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 sm:w-96 overflow-y-auto bg-white text-gray-900 border-r border-gray-200 p-6">
            <SheetHeader className="mb-4 text-left border-b border-gray-200 pb-3">
              <SheetTitle className="text-base font-extrabold text-gray-950">Filter Products</SheetTitle>
            </SheetHeader>
            {filterContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs text-gray-900">
          {filterContent}
        </div>
      </aside>
    </>
  );
}
