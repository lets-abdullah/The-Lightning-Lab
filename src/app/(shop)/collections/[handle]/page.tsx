import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import {
  parseFilters,
  parseSort,
  parsePage,
  resolveFacets,
  DEFAULT_PER_PAGE,
} from "@/lib/commerce/filters";
import { getCategoryHero } from "@/lib/commerce/category-heroes";
import { FilterSidebar } from "@/components/collection/filter-sidebar";
import { SortSelect } from "@/components/collection/sort-select";
import { ActiveFilters } from "@/components/collection/active-filters";
import { ProductGrid } from "@/components/collection/product-grid";
import { Pagination } from "@/components/collection/pagination";
import { CollectionFaqs } from "@/components/collection/collection-faqs";
import { JsonLd } from "@/components/seo/jsonld";

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params;
  const collection = await commerce.getCollection(handle);
  if (!collection) return { title: "Collection Not Found" };

  const title = collection.seo?.title || `${collection.title} | Commercial LED Lighting`;
  const description =
    collection.seo?.description ||
    collection.description ||
    `Shop ${collection.title} at The Lightning Lab. Contractor pricing, DLC certified fixtures, fast shipping.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: collection.heroImage?.url ? [{ url: collection.heroImage.url }] : undefined,
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { handle } = await params;
  const rawParams = await searchParams;

  const collection = await commerce.getCollection(handle);
  if (!collection) {
    notFound();
  }

  const filters = parseFilters(rawParams);
  const sort = parseSort(
    typeof rawParams.sort === "string" ? rawParams.sort : undefined
  );
  const page = parsePage(
    typeof rawParams.page === "string" ? rawParams.page : undefined
  );

  const facets = resolveFacets(collection);

  const { products, total, pageCount } = await commerce.listProducts({
    collectionHandle: handle,
    filters,
    sort,
    page,
    perPage: DEFAULT_PER_PAGE,
  });

  const heroData = getCategoryHero(handle, collection.title, collection.description);

  // Construct JSON-LD CollectionPage schema
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: heroData.title,
    description: heroData.description,
    url: `/collections/${handle}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((prod, index) => ({
        "@type": "ListItem",
        position: (page - 1) * DEFAULT_PER_PAGE + index + 1,
        url: `/products/${prod.handle}`,
        name: prod.title,
      })),
    },
  };

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        <JsonLd data={jsonLdData} />

        {/* Proper Category Hero Banner with Background Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-xs border border-gray-200/80 min-h-[200px] sm:min-h-[240px] lg:min-h-[270px] flex items-center">
          {/* Background Image */}
          <Image
            src={heroData.bgImage}
            alt={heroData.title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center"
          />

          {/* Dark gradient overlay for extreme legibility & contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/35" />

          {/* Content */}
          <div className="relative z-10 p-6 sm:p-8 lg:p-10 max-w-3xl space-y-3">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/15 text-white backdrop-blur-md border border-white/20">
              <span className="size-1.5 rounded-full bg-[#8B1812]" />
              {heroData.badge}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {heroData.title}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal max-w-2xl">
              {heroData.description}
            </p>

            {/* Key Spec Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {heroData.features.map((feat) => (
                <span
                  key={feat}
                  className="inline-flex items-center text-[11px] font-semibold text-white/90 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/15"
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start pt-2">
          {/* Left Filter Sidebar (Desktop & Mobile Drawer) */}
          <FilterSidebar facets={facets} totalCount={total} currentHandle={handle} />

          {/* Right Product Grid Area */}
          <div className="flex-1 w-full space-y-4">
            {/* Controls Bar: Count, Active Chips, Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
              <div className="text-xs sm:text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{products.length}</span> of{" "}
                <span className="font-semibold text-gray-900">{total}</span> products
              </div>
              <div className="flex items-center gap-3">
                <SortSelect />
              </div>
            </div>

            {/* Active Filter Chips */}
            <ActiveFilters />

            {/* Product Grid */}
            <ProductGrid products={products} />

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={pageCount}
              basePath={`/collections/${handle}`}
              searchParams={rawParams}
            />
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

        {/* Long Description / SEO Text Block */}
        {collection.longDescription && (
          <section className="border-t border-gray-200 pt-10 mt-12 max-w-4xl space-y-3 text-gray-600">
            <h2 className="text-lg font-bold text-gray-900">
              About {collection.title}
            </h2>
            <div
              className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: collection.longDescription }}
            />
          </section>
        )}

        {/* FAQs Accordion */}
        <CollectionFaqs faqs={collection.faqs} />
      </div>
    </div>
  );
}
