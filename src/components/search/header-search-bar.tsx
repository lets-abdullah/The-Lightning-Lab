"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Search, X, Clock, ArrowUpLeft, Sparkles, ChevronRight } from "lucide-react";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import { formatPrice } from "@/lib/utils/format";
import {
  getSearchSuggestions,
  POPULAR_SEARCHES,
  type SearchSuggestion,
} from "@/lib/search/suggestions";
import type { SearchHit } from "@/lib/search/from-hit";

interface HeaderSearchBarProps {
  isMobile?: boolean;
  onNavigate?: () => void;
  placeholder?: string;
}

export function HeaderSearchBar({
  isMobile = false,
  onNavigate,
  placeholder = "Search fixtures, SKUs, or categories (e.g. roof lights, 2x4 panel)…",
}: HeaderSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 200);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [productHits, setProductHits] = useState<SearchHit[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { recent, add: addRecent, clear: clearRecent, remove: removeRecent } = useRecentSearches();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Fetch product search preview when query length >= 2
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 2) {
      setProductHits([]);
      setLoadingProducts(false);
      return;
    }

    const controller = new AbortController();
    setLoadingProducts(true);

    fetch(`/api/search?q=${encodeURIComponent(trimmed)}&per_page=3`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Search request failed");
        return res.json();
      })
      .then((data) => {
        setProductHits(data.hits ?? []);
        setLoadingProducts(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setProductHits([]);
        setLoadingProducts(false);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  // Compute suggestions instantly on keystroke (0ms latency)
  const suggestions = useMemo(() => {
    return getSearchSuggestions(query, 8);
  }, [query]);

  // Reset active keyboard index when query changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const executeSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    addRecent(trimmed);
    setIsOpen(false);
    onNavigate?.();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (activeIndex >= 0 && activeIndex < suggestions.length) {
      executeSearch(suggestions[activeIndex].text);
      return;
    }
    executeSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
        return;
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 >= suggestions.length ? 0 : prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 < 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectProduct = (handle: string) => {
    setIsOpen(false);
    onNavigate?.();
    router.push(`/products/${handle}`);
  };

  // Helper to render autocomplete text with matching text normal and continuation in bold (Google style)
  const renderHighlightedText = (text: string, currentQuery: string) => {
    const trimmed = currentQuery.trim().toLowerCase();
    if (!trimmed) {
      return <span>{text}</span>;
    }

    const lower = text.toLowerCase();
    const idx = lower.indexOf(trimmed);

    if (idx === -1) {
      return <span>{text}</span>;
    }

    const before = text.slice(0, idx);
    const matched = text.slice(idx, idx + trimmed.length);
    const after = text.slice(idx + trimmed.length);

    return (
      <span className="truncate">
        {before && <span className="text-gray-500 font-normal">{before}</span>}
        <span className="text-gray-800 font-normal">{matched}</span>
        {after && <strong className="text-gray-900 font-bold">{after}</strong>}
      </span>
    );
  };

  const isIdle = query.trim().length === 0;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={isMobile ? "Search fixtures or categories..." : placeholder}
          aria-label="Search luminaires and fixtures"
          autoComplete="off"
          spellCheck="false"
          className={
            isMobile
              ? "w-full bg-gray-100 text-sm font-medium rounded-lg p-2.5 pr-16 border border-gray-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8B1812]/20"
              : "w-full bg-[#f4f5f7] hover:bg-[#eef1f5] focus:bg-white text-gray-900 text-sm font-medium rounded-full py-2.5 pl-5 pr-20 border border-transparent focus:border-gray-300 focus:outline-hidden transition-all shadow-inner"
          }
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className={
              isMobile
                ? "absolute right-9 p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                : "absolute right-11 p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
            }
            aria-label="Clear search input"
          >
            <X className="size-4" />
          </button>
        )}

        {/* Submit Button with Dark Red Accent */}
        <button
          type="submit"
          className={
            isMobile
              ? "absolute right-2 size-7 rounded-full bg-[#8B1812] text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs cursor-pointer"
              : "absolute right-1 size-9 rounded-full bg-[#8B1812] hover:bg-[#70130e] text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
          }
          aria-label="Submit search"
        >
          <Search className={isMobile ? "size-3.5" : "size-4"} />
        </button>
      </form>

      {/* RECOMMENDATIONS DROPDOWN (Google / YouTube Dark Style) */}
      {isOpen && (
        <div
          id="search-recommendations-dropdown"
          className="absolute top-full left-0 right-0 mt-2 bg-white text-gray-900 rounded-2xl border border-gray-200 shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto divide-y divide-gray-100"
          style={{ zIndex: 99999 }}
        >
          {/* 1. IDLE STATE: RECENT SEARCHES & POPULAR SEARCHES */}
          {isIdle && (
            <div>
              {/* Recent Searches */}
              {recent.length > 0 && (
                <div className="p-2 border-b border-gray-100">
                  <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3 text-gray-400" />
                      Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={clearRecent}
                      className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer normal-case text-xs"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {recent.map((r) => (
                      <div
                        key={r.term}
                        className="group flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          executeSearch(r.term);
                        }}
                        onClick={() => executeSearch(r.term)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Clock className="size-4 text-gray-400 shrink-0" />
                          <span className="truncate">{r.term}</span>
                        </div>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeRecent(r.term);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRecent(r.term);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          aria-label={`Remove ${r.term} from history`}
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches with 🔍 icons */}
              <div className="p-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <Sparkles className="size-3 text-[#8B1812]" />
                  Popular Lighting Searches
                </div>
                <div className="space-y-0.5">
                  {POPULAR_SEARCHES.slice(0, 6).map((item) => (
                    <button
                      key={item.text}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        executeSearch(item.text);
                      }}
                      onClick={() => executeSearch(item.text)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Search className="size-4 text-gray-400 group-hover:text-gray-700 transition-colors shrink-0" />
                        <span className="truncate group-hover:text-gray-900">{item.text}</span>
                      </div>
                      {item.categoryHint && (
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md shrink-0 ml-2">
                          {item.categoryHint}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. ACTIVE TYPING STATE: AUTOCOMPLETE RECOMMENDATION LIST */}
          {!isIdle && (
            <div>
              {/* Query Recommendations List (Exact format as user's screenshot) */}
              <div className="p-2 space-y-0.5">
                {suggestions.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={item.text}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        executeSearch(item.text);
                      }}
                      onClick={() => executeSearch(item.text)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm transition-colors cursor-pointer group ${
                        isActive
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Search
                          className={`size-4 shrink-0 transition-colors ${
                            isActive
                              ? "text-gray-700"
                              : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        />
                        {renderHighlightedText(item.text, query)}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {item.categoryHint && (
                          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md hidden sm:inline-block">
                            {item.categoryHint}
                          </span>
                        )}
                        <ArrowUpLeft className="size-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Direct Product Matches Preview (if matching products found) */}
              {productHits.length > 0 && (
                <div className="p-3 bg-gray-50 border-t border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block px-1 pb-2">
                    Matching Products ({productHits.length})
                  </span>
                  <div className="space-y-1.5">
                    {productHits.map((hit) => (
                      <button
                        key={hit.product.id}
                        type="button"
                        onClick={() => handleSelectProduct(hit.product.handle)}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white text-left transition-colors cursor-pointer group border border-transparent hover:border-gray-200 hover:shadow-sm"
                      >
                        {hit.product.images[0]?.url ? (
                          <img
                            src={hit.product.images[0].url}
                            alt=""
                            className="size-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200"
                          />
                        ) : (
                          <div className="size-10 rounded-lg bg-gray-100 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-gray-800 group-hover:text-[#8B1812] block truncate transition-colors">
                            {hit.product.title}
                          </span>
                          <div className="text-[11px] text-gray-400">
                            {hit.product.sku} ·{" "}
                            <span className="font-semibold text-gray-600">
                              {formatPrice(hit.product.price)}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="size-4 text-gray-400 group-hover:text-gray-700 shrink-0 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer: Search for full term */}
              <div className="p-2 bg-gray-50 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => executeSearch(query)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-[#8B1812] hover:text-[#70130e] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  <Search className="size-3.5" />
                  <span>Search for &ldquo;{query}&rdquo; (Press Enter)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
