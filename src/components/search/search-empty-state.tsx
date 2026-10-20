import React from "react";
import Link from "next/link";

interface SearchEmptyStateProps {
  q: string;
  suggestions: string[];
}

const TOP_CATEGORIES = [
  { handle: "led-panel-lights", title: "LED Panel Lights" },
  { handle: "led-strip-lights", title: "LED Strip Lights" },
  { handle: "led-downlights", title: "LED Downlights" },
  { handle: "outdoor-lighting", title: "Outdoor Lighting" },
  { handle: "emergency-exit", title: "Emergency & Exit" },
  { handle: "commercial-industrial", title: "Commercial & Industrial" },
];

export function SearchEmptyState({ q, suggestions }: SearchEmptyStateProps) {
  return (
    <div className="py-12 px-4 text-center max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          No products found for &ldquo;{q}&rdquo;
        </h2>
        <p className="text-sm text-muted-foreground">
          Try a different spelling or one of these:
        </p>
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <Link
              key={s}
              href={`/search?q=${encodeURIComponent(s)}`}
              className="rounded-lg border border-gray-200 px-3.5 py-1.5 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              {s}
            </Link>
          ))}
        </div>
      )}

      <div className="pt-6 border-t border-gray-100 space-y-4">
        <p className="text-sm font-semibold text-gray-800">
          Or browse our top categories:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 text-left">
          {TOP_CATEGORIES.map((cat) => (
            <Link
              key={cat.handle}
              href={`/collections/${cat.handle}`}
              className="group p-4 rounded-xl border border-gray-200 hover:border-[#8B1812] bg-white hover:bg-gray-50 transition-all shadow-2xs"
            >
              <div className="text-sm font-bold text-gray-900 group-hover:text-[#8B1812] transition-colors">
                {cat.title}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Browse collection &rarr;
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
