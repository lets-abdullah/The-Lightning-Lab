import React from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/collection/breadcrumbs";
import { ProductCard } from "@/components/product/product-card";
import { SearchFacets } from "@/components/search/search-facets";
import { SearchSortBar } from "@/components/search/search-sort-bar";
import { SearchPagination } from "@/components/search/search-pagination";
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
      title: `Search: ${q}`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: "Search",
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
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
          <h1 className="text-3xl font-extrabold text-gray-950">Search</h1>
          <p className="text-sm text-muted-foreground">
            Type a product name, SKU, or keyword.
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
      <div className="mb-6 space-y-2">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
          Search results for &ldquo;{qStr}&rdquo;
        </h1>
        <p className="text-sm text-muted-foreground">
          {results.found} result{results.found === 1 ? "" : "s"} ·{" "}
          {results.searchTimeMs}ms
        </p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8 items-start">
        <SearchFacets
          facetCounts={results.facetCounts}
          currentFilters={parseSearchFilters(sp)}
          basePath="/search"
        />

        <section className="min-w-0">
          <SearchSortBar current={typeof sort === "string" ? sort : "relevance"} />
          {results.hits.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.hits.map((hit) => (
                  <ProductCard key={hit.product.id} product={hit.product} />
                ))}
              </div>
              <SearchPagination
                found={results.found}
                perPage={24}
                currentPage={Number(page) || 1}
                basePath="/search"
              />
            </>
          ) : (
            <SearchEmptyState q={qStr} suggestions={results.suggestions} />
          )}
        </section>
      </div>
    </main>
  );
}
