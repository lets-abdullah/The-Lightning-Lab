"use client";

import React from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import type { FacetConfig } from "@/lib/commerce/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface CollectionFilterItem {
  label: string;
  handle: string;
  count: number;
}

export const DEFAULT_COLLECTIONS: CollectionFilterItem[] = [
  { label: "All Products", handle: "all", count: 32 },
  { label: "LED Panel Lights", handle: "led-panel-lights", count: 8 },
  { label: "Troffer Lights", handle: "troffers", count: 6 },
  { label: "LED Emergency Panel Light", handle: "led-emergency-panel-light", count: 4 },
  { label: "LED Edge Light", handle: "led-edge-light", count: 3 },
  { label: "Artificial Sky Panel", handle: "artificial-sky-panel", count: 4 },
  { label: "LED Linear High Bay Light", handle: "linear-high-bay", count: 6 },
  { label: "UFO High Bay Lights", handle: "ufo-high-bay", count: 5 },
  { label: "Vapor Tight Fixture", handle: "vapor-tight-fixture", count: 4 },
  { label: "Strip Light Fixtures", handle: "strip-light-fixtures", count: 8 },
  { label: "Architectural Linear Light", handle: "architectural-linear", count: 5 },
  { label: "Linear Connectors", handle: "linear-connectors", count: 3 },
  { label: "Commercial Recessed Downlights", handle: "commercial-recessed-downlights", count: 6 },
  { label: "LED Tube Light Fixture", handle: "led-tube-light-fixture", count: 5 },
  { label: "T8 LED Tube Light", handle: "t8-led-tube-light", count: 6 },
  { label: "Track Lights", handle: "track-lights", count: 4 },
  { label: "Under Cabinet Lights", handle: "under-cabinet-lights", count: 3 },
  { label: "Hexagon LED Garage Lights", handle: "hexagon-garage-lights", count: 3 },
  { label: "Explosion Proof Lighting", handle: "explosion-proof-lighting", count: 2 },
  { label: "Pendant Light", handle: "pendant-light", count: 4 },
  { label: "Exhaust Fan", handle: "exhaust-fan", count: 2 },
  { label: "LED Bulb", handle: "led-bulb", count: 6 },
  { label: "Downlight", handle: "downlight", count: 6 },
  { label: "Flush Mount", handle: "flush-mount", count: 4 },
  { label: "Trimless Downlight", handle: "trimless-downlight", count: 3 },
  { label: "Retrofit Can Lights", handle: "retrofit-can-lights", count: 5 },
  { label: "Batten Light", handle: "batten-light", count: 4 },
  { label: "LED Light Mirror", handle: "led-light-mirror", count: 3 },
  { label: "LED Area Lights", handle: "led-area-lights", count: 6 },
  { label: "LED Flood Lights", handle: "led-flood-lights", count: 5 },
  { label: "Wall Pack", handle: "wall-pack", count: 6 },
  { label: "Canopy Light", handle: "canopy-light", count: 4 },
  { label: "Security Lights", handle: "security-lights", count: 4 },
  { label: "Landscaping Light", handle: "landscaping-light", count: 5 },
  { label: "Post Light", handle: "post-light", count: 3 },
  { label: "Bollard Lights", handle: "bollard-lights", count: 4 },
  { label: "Up Down Sconce Lights", handle: "up-down-sconce", count: 4 },
  { label: "RGB Wall Washer", handle: "rgb-wall-washer", count: 3 },
  { label: "LED Light Brackets", handle: "led-light-brackets", count: 4 },
  { label: "Pole", handle: "pole", count: 3 },
  { label: "Corn Bulb", handle: "corn-bulb", count: 5 },
  { label: "Landscaping Transformer", handle: "landscaping-transformer", count: 3 },
  { label: "Double Sided Tube Light", handle: "double-sided-tube", count: 3 },
  { label: "12V COB LED Strip Light", handle: "12v-cob-strip", count: 4 },
  { label: "24V COB LED Strip Light", handle: "24v-cob-strip", count: 5 },
  { label: "Waterproof LED Tape", handle: "waterproof-led-tape", count: 4 },
  { label: "LED Sheet Roll", handle: "led-sheet-roll", count: 5 },
  { label: "Module", handle: "module", count: 3 },
  { label: "Power Supply", handle: "power-supply", count: 6 },
  { label: "Dimmable Power Supply", handle: "dimmable-power-supply", count: 5 },
  { label: "Dimmer Switch", handle: "dimmer-switch", count: 4 },
  { label: "Controller & Remote", handle: "controller-remote", count: 4 },
  { label: "Connector", handle: "connector", count: 4 },
  { label: "Aluminum Track", handle: "aluminum-track", count: 4 },
  { label: "LED Exit Signs", handle: "led-exit-signs", count: 4 },
  { label: "Emergency Drivers", handle: "emergency-drivers", count: 3 },
];

export const ALL_CATEGORIES = DEFAULT_COLLECTIONS.map((c) => ({
  group: "Collections",
  items: [c],
}));

interface FilterSidebarProps {
  facets?: FacetConfig[];
  totalCount?: number;
  currentHandle?: string;
  collections?: CollectionFilterItem[];
}

export function FilterSidebar({
  totalCount,
  currentHandle,
  collections,
}: FilterSidebarProps) {
  const collectionList =
    collections && collections.length > 0 ? collections : DEFAULT_COLLECTIONS;

  const content = (
    <div className="w-full text-gray-900">
      {/* Title with Count matching reference: COLLECTIONS (X) */}
      <div className="pb-3 border-b border-gray-200 mb-3">
        <h2 className="text-sm font-black tracking-wider uppercase text-gray-950">
          COLLECTIONS ({collectionList.length})
        </h2>
      </div>

      {/* Scrollable Collections List */}
      <div className="space-y-1 max-h-[560px] overflow-y-auto pr-1.5 [scrollbar-width:thin] [scrollbar-color:#d1d5db_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
        {collectionList.map((cat) => {
          const isActive = currentHandle === cat.handle;
          const displayCount =
            cat.handle === "all" && totalCount !== undefined
              ? totalCount
              : cat.count;

          return (
            <Link
              key={cat.handle}
              href={`/collections/${cat.handle}`}
              className={`group flex items-center justify-between py-2 px-2.5 rounded-lg transition-all text-sm ${
                isActive
                  ? "bg-[#8B1812] text-white font-bold shadow-xs"
                  : "text-gray-700 hover:text-gray-950 hover:bg-gray-100/80 font-normal"
              }`}
            >
              <span className="truncate pr-3 leading-snug">{cat.label}</span>
              <span
                className={`shrink-0 text-xs font-semibold rounded-full px-2 py-0.5 min-w-[24px] text-center transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-800"
                }`}
              >
                {displayCount}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Trigger (visible on screens < lg) */}
      <div className="lg:hidden w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between bg-white border-gray-300 text-gray-900 font-semibold"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="size-4" />
                <span>Collections</span>
                <span className="text-xs text-gray-500 font-normal">
                  ({collectionList.length})
                </span>
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 sm:w-96 overflow-y-auto bg-white text-gray-900 border-r border-gray-200 p-6"
          >
            <SheetHeader className="mb-4 text-left border-b border-gray-200 pb-3">
              <SheetTitle className="text-base font-extrabold text-gray-950">
                Browse Collections
              </SheetTitle>
            </SheetHeader>
            {content}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 sticky top-24 self-start">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs text-gray-900">
          {content}
        </div>
      </aside>
    </>
  );
}
