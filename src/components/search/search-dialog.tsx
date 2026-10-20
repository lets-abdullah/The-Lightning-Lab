"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Clock, Search, Layers, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Command } from "@/components/ui/command";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import { formatPrice } from "@/lib/utils/format";
import type { SearchHit } from "@/lib/search/from-hit";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuery?: string;
}

interface SearchResponse {
  hits: SearchHit[];
  found?: number;
}

interface CategoryRecommendation {
  handle: string;
  title: string;
  type: "Category" | "Subcategory";
  parentTitle?: string;
  keywords: string[];
}

const CATEGORY_RECOMMENDATIONS: CategoryRecommendation[] = [
  {
    handle: "led-panel-lights",
    title: "LED Flat Panel Lights",
    type: "Category",
    parentTitle: "Commercial Lighting",
    keywords: ["panel", "flat panel", "drop ceiling", "troffer", "led panel", "office lighting"],
  },
  {
    handle: "2x4-led-panels",
    title: "2x4 LED Flat Panels",
    type: "Subcategory",
    parentTitle: "LED Panel Lights",
    keywords: ["2x4", "2 x 4", "panel", "drop ceiling", "troffer", "flat panel"],
  },
  {
    handle: "2x2-led-panels",
    title: "2x2 LED Flat Panels",
    type: "Subcategory",
    parentTitle: "LED Panel Lights",
    keywords: ["2x2", "2 x 2", "panel", "drop ceiling", "troffer", "square panel"],
  },
  {
    handle: "1x4-led-panels",
    title: "1x4 LED Flat Panels",
    type: "Subcategory",
    parentTitle: "LED Panel Lights",
    keywords: ["1x4", "1 x 4", "panel", "linear panel", "narrow panel"],
  },
  {
    handle: "commercial-industrial",
    title: "Commercial & Industrial High Bays",
    type: "Category",
    parentTitle: "High Bay Fixtures",
    keywords: ["high bay", "warehouse", "industrial", "ufo", "linear high bay", "shop light", "ufo high bay"],
  },
  {
    handle: "led-downlights",
    title: "Commercial Recessed LED Downlights",
    type: "Category",
    parentTitle: "Recessed Lighting",
    keywords: ["downlight", "can light", "pot light", "recessed", "wafer", "ceiling light"],
  },
  {
    handle: "6-inch-downlights",
    title: "6-Inch LED Downlights & Wafer",
    type: "Subcategory",
    parentTitle: "LED Downlights",
    keywords: ["6-inch", "6 inch", "6in", "retrofit", "baffle", "wafer", "canless"],
  },
  {
    handle: "4-inch-downlights",
    title: "4-Inch Commercial LED Downlights",
    type: "Subcategory",
    parentTitle: "LED Downlights",
    keywords: ["4-inch", "4 inch", "4in", "canless", "eyeball", "regress"],
  },
  {
    handle: "led-strip-lights",
    title: "Architectural LED Strip Lights",
    type: "Category",
    parentTitle: "Linear Lighting",
    keywords: ["strip", "tape", "cove", "linear", "led strip", "channel"],
  },
  {
    handle: "cob-led-strip-lights",
    title: "Dotless COB LED Strip Lights",
    type: "Subcategory",
    parentTitle: "LED Strip Lights",
    keywords: ["cob", "dotless", "seamless", "tunable", "strip"],
  },
  {
    handle: "outdoor-lighting",
    title: "Commercial Outdoor & Canopy Lights",
    type: "Category",
    parentTitle: "Exterior Fixtures",
    keywords: ["outdoor", "exterior", "shoebox", "wall pack", "flood", "canopy", "roof", "roof lights", "parking lot"],
  },
  {
    handle: "emergency-exit",
    title: "Emergency & Exit Lighting",
    type: "Category",
    parentTitle: "Life Safety",
    keywords: ["emergency", "exit", "battery backup", "exit sign", "combo", "nema 4x"],
  },
];

interface RecommendedProduct {
  handle: string;
  title: string;
  sku: string;
  price: number;
  image: string;
  category: string;
}

const RECOMMENDED_PRODUCTS: RecommendedProduct[] = [
  {
    handle: "2x4-led-flat-panel-selectable-wattage-cct",
    title: "2x4 LED Flat Panel, Selectable Wattage & CCT",
    sku: "STL-0001",
    price: 5999,
    image: "https://placehold.co/800x800/1e293b/ffffff?text=2x4%20LED%20Flat%20Panel%2C%20Sele",
    category: "LED Panels",
  },
  {
    handle: "150w-ufo-led-high-bay-light-21000-lumens",
    title: "150W UFO LED High Bay Light, 21,000 Lumens",
    sku: "STL-0029",
    price: 10999,
    image: "https://placehold.co/800x800/1e293b/ffffff?text=150W%20UFO%20LED%20High%20Bay%20L",
    category: "High Bays",
  },
  {
    handle: "100w-commercial-led-canopy-gas-station-light",
    title: "100W Commercial LED Canopy Light (Garage & Gas Station)",
    sku: "STL-0028",
    price: 7499,
    image: "https://placehold.co/800x800/1e293b/ffffff?text=100W%20Commercial%20LED%20Cano",
    category: "Canopy & Roof Lights",
  },
  {
    handle: "6-inch-ultra-thin-canless-wafer-downlight-14w-5cct",
    title: "6-Inch Ultra-Thin Canless Wafer Downlight 14W 5CCT",
    sku: "STL-0020",
    price: 1699,
    image: "https://placehold.co/800x800/1e293b/ffffff?text=6-Inch%20Ultra-Thin%20Canless%20W",
    category: "Downlights",
  },
  {
    handle: "cob-led-strip-light-24v-dotless-4000k-neutral-white",
    title: "COB LED Strip Light 24V Dotless, 4000K Neutral White",
    sku: "STL-0010",
    price: 4299,
    image: "https://placehold.co/800x800/1e293b/ffffff?text=COB%20LED%20Strip%20Light%2024V%20Dot",
    category: "Strip Lights",
  },
];

export function SearchDialog({ open, onOpenChange, initialQuery }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery ?? "");
  const [debouncedQuery] = useDebounce(query, 200);
  const [results, setResults] = useState<SearchResponse>({ hits: [] });
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const { recent, add, clear: clearRecent } = useRecentSearches();

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults({ hits: [] });
      setLoading(false);
      setIsError(false);
      return;
    }
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [open, initialQuery]);

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults({ hits: [] });
      setLoading(false);
      setIsError(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setIsError(false);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery.trim())}&per_page=6`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Search request failed");
        return res.json();
      })
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setResults({ hits: [] });
        setIsError(true);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  const submitSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    add(trimmed);
    onOpenChange(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const selectProduct = (handle: string) => {
    onOpenChange(false);
    router.push(`/products/${handle}`);
  };

  const selectCategory = (handle: string) => {
    onOpenChange(false);
    router.push(`/collections/${handle}`);
  };

  const matchingCategories = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return CATEGORY_RECOMMENDATIONS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.parentTitle && c.parentTitle.toLowerCase().includes(q)) ||
        c.keywords.some((k) => k.toLowerCase().includes(q))
    ).slice(0, 4);
  }, [debouncedQuery]);

  const isIdle = debouncedQuery.trim().length < 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 max-w-2xl sm:rounded-xl">
        <DialogTitle className="sr-only">Product Search</DialogTitle>
        <Command shouldFilter={false} className="border-none shadow-none">
          <Command.Input
            placeholder="Search products, SKUs, or categories (e.g. roof lights, 2x4 panel, high bay)…"
            value={query}
            onValueChange={setQuery}
            aria-label="Search"
            onKeyDown={(e) => {
              if (e.key === "Enter" && debouncedQuery.trim()) {
                submitSearch(debouncedQuery.trim());
              }
            }}
          />
          <Command.List className="max-h-[70vh] overflow-y-auto">
            {loading && <Command.Loading>Searching…</Command.Loading>}

            {isError && (
              <div className="p-6 text-center text-xs text-muted-foreground">
                Search is temporarily unavailable
              </div>
            )}

            {/* INITIAL / EMPTY STATE: SHOW RECENT + RECOMMENDED CATEGORIES + RECOMMENDED PRODUCTS */}
            {!loading && !isError && isIdle && (
              <>
                {recent.length > 0 && (
                  <Command.Group heading="Recent Searches">
                    {recent.map((r) => (
                      <Command.Item
                        key={r.term}
                        value={`recent-${r.term}`}
                        onSelect={() => {
                          setQuery(r.term);
                          submitSearch(r.term);
                        }}
                        className="cursor-pointer"
                      >
                        <Clock className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>{r.term}</span>
                      </Command.Item>
                    ))}
                    <Command.Item
                      value="__clear_recent__"
                      onSelect={clearRecent}
                      className="text-muted-foreground text-xs cursor-pointer"
                    >
                      Clear recent searches
                    </Command.Item>
                  </Command.Group>
                )}

                <Command.Group heading="Recommended Categories">
                  {CATEGORY_RECOMMENDATIONS.slice(0, 6).map((cat) => (
                    <Command.Item
                      key={cat.handle}
                      value={`cat-${cat.handle}`}
                      onSelect={() => selectCategory(cat.handle)}
                      className="cursor-pointer"
                    >
                      <Layers className="mr-3 h-4 w-4 shrink-0 text-red-700" />
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="text-sm font-medium">{cat.title}</span>
                        {cat.parentTitle && (
                          <span className="text-xs text-muted-foreground">{cat.type} · {cat.parentTitle}</span>
                        )}
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Recommended Products">
                  {RECOMMENDED_PRODUCTS.map((prod) => (
                    <Command.Item
                      key={prod.handle}
                      value={`rec-prod-${prod.handle}`}
                      onSelect={() => selectProduct(prod.handle)}
                      className="cursor-pointer"
                    >
                      <img
                        src={prod.image}
                        alt=""
                        className="mr-3 h-10 w-10 rounded object-cover shrink-0 border border-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-sm font-medium text-gray-900">{prod.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {prod.sku} · {formatPrice(prod.price)}
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {prod.category}
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </>
            )}

            {/* ACTIVE SEARCH STATE */}
            {!loading && !isError && !isIdle && (
              <>
                {/* 1. MATCHING CATEGORIES & SUBCATEGORIES */}
                {matchingCategories.length > 0 && (
                  <Command.Group heading="Categories & Subcategories">
                    {matchingCategories.map((cat) => (
                      <Command.Item
                        key={cat.handle}
                        value={`match-cat-${cat.handle}`}
                        onSelect={() => selectCategory(cat.handle)}
                        className="cursor-pointer"
                      >
                        <Layers className="mr-3 h-4 w-4 shrink-0 text-red-700" />
                        <div className="flex-1 min-w-0 flex items-center justify-between">
                          <span className="text-sm font-medium">{cat.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {cat.type}{cat.parentTitle ? ` · ${cat.parentTitle}` : ""}
                          </span>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {/* 2. MATCHING PRODUCTS */}
                {results.hits.length > 0 && (
                  <Command.Group heading="Products">
                    {results.hits.slice(0, 6).map((hit) => (
                      <Command.Item
                        key={hit.product.id}
                        value={`product-${hit.product.handle}`}
                        onSelect={() => selectProduct(hit.product.handle)}
                        className="cursor-pointer"
                      >
                        {hit.product.images[0]?.url ? (
                          <img
                            src={hit.product.images[0].url}
                            alt=""
                            className="mr-3 h-10 w-10 rounded object-cover shrink-0 border border-gray-100"
                          />
                        ) : (
                          <div className="mr-3 h-10 w-10 rounded bg-gray-100 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="truncate text-sm font-medium">{hit.product.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {hit.product.sku} · {formatPrice(hit.product.price)}
                          </div>
                        </div>
                      </Command.Item>
                    ))}
                    <Command.Item
                      value="__all__"
                      onSelect={() => submitSearch(debouncedQuery)}
                      className="cursor-pointer text-red-700 font-semibold"
                    >
                      <Search className="mr-2 h-4 w-4 shrink-0" />
                      <span>See all results for "{debouncedQuery}"</span>
                    </Command.Item>
                  </Command.Group>
                )}

                {/* 3. ZERO MATCHES FALLBACK */}
                {matchingCategories.length === 0 && results.hits.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    <p className="font-medium text-gray-900">No products found for "{debouncedQuery}"</p>
                    <p className="mt-1 text-xs">Try searching for a different product, or browse our recommended categories:</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                      {CATEGORY_RECOMMENDATIONS.slice(0, 4).map((c) => (
                        <button
                          key={c.handle}
                          type="button"
                          onClick={() => selectCategory(c.handle)}
                          className="px-2.5 py-1 text-xs rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                        >
                          {c.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
