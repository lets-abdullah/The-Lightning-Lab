import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FilterSidebar } from "@/components/collection/filter-sidebar";
import { ProductGrid } from "@/components/collection/product-grid";
import { SortSelect } from "@/components/collection/sort-select";
import { Pagination } from "@/components/collection/pagination";
import { SearchEmptyState } from "@/components/search/search-empty-state";
import { searchProducts, parseSearchFilters } from "@/lib/search/query";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const rawQ = sp.q;
  const q = rawQ ? String(rawQ).trim().slice(0, 200) : "";

  if (q) {
    return {
      title: `Search: ${q} | The Lightning Lab`,
      description: `Search results for ${q} at The Lightning Lab. Contractor pricing, DLC certified commercial luminaires.`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: "Search | The Lightning Lab",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const { q = "", page = "1", sort, collection } = sp;
  const qStr = String(q).trim().slice(0, 200);

  if (!qStr) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="space-y-4">
          <nav className="text-xs text-gray-500 mb-3 flex items-center gap-1.5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold truncate">Search</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-gray-950">Search Products</h1>
          <p className="text-sm text-muted-foreground">
            Type a product name, SKU, or category to find commercial LED lighting fixtures.
          </p>
        </div>
      </main>
    );
  }

  const results = await searchProducts({
    q: qStr,
    page: Number(page) || 1,
    perPage: 24,
    sort: typeof sort === "string" ? sort : undefined,
    collection: typeof collection === "string" ? collection : undefined,
    filters: parseSearchFilters(sp),
  });

  const products = results.hits.map((h) => h.product);
  const totalPages = Math.ceil(results.found / 24) || 1;
  const currentPage = Number(page) || 1;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Search",
        item: "/search",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb Navigation */}
        <div>
          <nav className="text-xs text-gray-500 mb-3 flex items-center gap-1.5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold truncate">Search</span>
          </nav>
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              Search results for &ldquo;{qStr}&rdquo;
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-3xl mt-1.5 leading-relaxed">
              Found {results.found} {results.found === 1 ? "luminaire" : "luminaires"} matching your search
            </p>
          </div>
        </div>

        {/* Main Content Area: Sidebar + Grid Matching Collection Page */}
        <div className="flex flex-col lg:flex-row gap-8 items-start pt-2">
          {/* Left Filter Sidebar (Exact same collections list from Category Page) */}
          <FilterSidebar totalCount={results.found} />

          {/* Right Product Grid Area */}
          <div className="flex-1 w-full space-y-4">
            {/* Controls Bar: Count + Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
              <div className="text-xs sm:text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{products.length}</span> of{" "}
                <span className="font-semibold text-gray-900">{results.found}</span> products
              </div>
              <div className="flex items-center gap-3">
                <SortSelect />
              </div>
            </div>

            {/* Product Grid or Empty State */}
            {products.length > 0 ? (
              <>
                <ProductGrid products={products} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath="/search"
                  searchParams={sp}
                />
              </>
            ) : (
              <SearchEmptyState q={qStr} suggestions={results.suggestions} />
            )}
          </div>
        </div>

        {/* Collection Trust Row Matching SwitchToLED Reference */}
        <div className="border-t border-b border-gray-200 py-8 bg-gray-50/50 rounded-xl px-4 my-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2 font-bold text-base">
                🚚
              </div>
              <span className="text-xs font-bold text-gray-900">Free Shipping</span>
              <span className="text-[11px] text-gray-500">On all orders over $99</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2 font-bold text-base">
                🛡️
              </div>
              <span className="text-xs font-bold text-gray-900">5-Year Warranty</span>
              <span className="text-[11px] text-gray-500">Hassle-free replacement</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2 font-bold text-base">
                ⚡
              </div>
              <span className="text-xs font-bold text-gray-900">DLC 5.1 Premium</span>
              <span className="text-[11px] text-gray-500">Utility rebate qualified</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2 font-bold text-base">
                ⏱️
              </div>
              <span className="text-xs font-bold text-gray-900">Fast Dispatch</span>
              <span className="text-[11px] text-gray-500">Ships within 24-48 hours</span>
            </div>
            <div className="flex flex-col items-center col-span-2 md:col-span-1">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2 font-bold text-base">
                💰
              </div>
              <span className="text-xs font-bold text-gray-900">Contractor Pricing</span>
              <span className="text-[11px] text-gray-500">Tiered volume discounts</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
