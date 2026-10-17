import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { commerce } from "@/lib/commerce";
import type { Product, FileRef, Faq } from "@/lib/commerce/types";
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
  buildFaqJsonLd,
} from "@/lib/seo/schema";
import { Breadcrumbs } from "@/components/collection/breadcrumbs";
import { CollectionFaqs } from "@/components/collection/collection-faqs";
import { JsonLd } from "@/components/seo/jsonld";
import { ProductDetail } from "@/components/product/product-detail";
import { TrustRow } from "@/components/product/trust-row";
import { SpecsTable } from "@/components/product/specs-table";
import { ProductTabs } from "@/components/product/product-tabs";
import { RelatedProducts } from "@/components/product/related-products";
import { FrequentlyBoughtTogether } from "@/components/product/frequently-bought-together";
import { ProductFeatureBanners } from "@/components/product/product-feature-banners";
import { ProductReviews } from "@/components/product/product-reviews";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await commerce.getProduct(handle);
  if (!product) return { title: "Product not found" };

  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: {
      canonical: product.seo.canonical ?? `/products/${product.handle}`,
    },
    openGraph: product.seo.ogImage
      ? {
          images: [
            {
              url: product.seo.ogImage.url,
              alt: product.seo.ogImage.alt,
            },
          ],
        }
      : undefined,
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ variant?: string }>;
}) {
  const { handle } = await params;
  const { variant: variantParam } = await searchParams;
  const product = await commerce.getProduct(handle);
  if (!product) notFound();

  const selectedVariant =
    product.variants.find((v) => v.id === variantParam) ??
    product.variants[0] ??
    ({
      id: "var-default",
      sku: product.sku,
      title: product.title,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      inventoryQuantity: product.inventory.quantity,
      optionValues: {},
    } as unknown as typeof product.variants[0]);

  const initialVariantId = selectedVariant.id;

  // Related products — batch fetch, ignore misses.
  const relatedHandles = (product.relatedHandles ?? []).slice(0, 4);
  const relatedRaw = await Promise.all(
    relatedHandles.map((h) => commerce.getProduct(h))
  );
  const relatedProducts = relatedRaw.filter(
    (p): p is Product => p !== null
  );

  const parentCollectionHandle = product.collections?.[0] || "all";
  const parentCollectionName =
    parentCollectionHandle === "led-panel-lights"
      ? "LED Panel Lights"
      : parentCollectionHandle === "troffer-lights"
      ? "Troffer Lights"
      : parentCollectionHandle === "commercial-industrial"
      ? "Commercial High Bays"
      : parentCollectionHandle === "led-strip-lights"
      ? "Strip Lights"
      : "Collections";

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: parentCollectionName, href: `/collections/${parentCollectionHandle}` },
    { label: product.title },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const canonicalUrl = `${baseUrl}/products/${product.handle}`;

  const breadcrumbLd = buildBreadcrumbJsonLd(
    breadcrumbItems.map((i) => ({
      name: i.label,
      url: i.href ? `${baseUrl}${i.href}` : canonicalUrl,
    }))
  );
  const productLd = buildProductJsonLd(product, canonicalUrl);
  const productFaqs = ((product as unknown as { faqs?: Faq[] }).faqs) ?? [];
  const faqLd = buildFaqJsonLd(productFaqs);
  const jsonLd = faqLd ? [breadcrumbLd, productLd, faqLd] : [breadcrumbLd, productLd];

  const hasDownloads = Boolean(
    product.specSheet || product.iesFile || product.installationGuide
  );
  const hasFaqs = Boolean(productFaqs && productFaqs.length > 0);

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* 2-Column Hero Section: Left Gallery, Right Purchase Panel */}
        <ProductDetail product={product} initialVariantId={initialVariantId} />

        {/* Commercial Trust Row */}
        <TrustRow />

        {/* Frequently Bought Together Bundle */}
        <FrequentlyBoughtTogether
          product={product}
          selectedVariant={selectedVariant}
        />

        {/* Visual Feature Callout Banners */}
        <ProductFeatureBanners />

        {/* Tabbed Specifications, Downloads, Warranty */}
        <div className="pt-2">
          <ProductTabs
            description={
              <div
                className="prose max-w-none text-xs sm:text-sm leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            }
            specs={<SpecsTable specs={product.specs} />}
            downloads={<DownloadsSection product={product} />}
            warranty={<WarrantySection product={product} />}
            faqs={<CollectionFaqs faqs={productFaqs} />}
            hasDownloads={hasDownloads}
            hasFaqs={hasFaqs}
          />
        </div>

        {/* Customer Reviews Section */}
        <ProductReviews
          ratingAverage={product.rating?.average ?? 4.9}
          reviewCount={product.rating?.count ?? 18}
        />

        {/* Recommended Commercial Fixtures Grid */}
        <RelatedProducts products={relatedProducts} />

        <JsonLd data={jsonLd} />
      </main>
    </div>
  );
}

function DownloadsSection({ product }: { product: Product }) {
  const items = [
    product.specSheet && { ref: product.specSheet, label: "Official Specification Sheet (PDF)" },
    product.iesFile && { ref: product.iesFile, label: "Photometric IES Data File" },
    product.installationGuide && {
      ref: product.installationGuide,
      label: "Contractor Installation & Wiring Guide (PDF)",
    },
  ].filter(Boolean) as { ref: FileRef; label: string }[];

  if (!items.length) {
    return (
      <p className="text-sm text-gray-500">
        No downloadable spec sheets available for this fixture.
      </p>
    );
  }

  return (
    <ul className="space-y-3 text-sm">
      {items.map(({ ref, label }) => (
        <li
          key={ref.url}
          className="flex items-center justify-between p-3.5 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-100/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <a
                href={ref.url}
                download
                className="text-gray-900 hover:text-red-600 font-bold transition-colors"
              >
                {label}
              </a>
              <span className="text-xs text-gray-500 block">
                {ref.label || "Verified Manufacturer Document"}
              </span>
            </div>
          </div>
          <a
            href={ref.url}
            download
            className="text-xs font-bold text-black px-3.5 py-1.5 bg-white border border-gray-200 rounded-md shadow-2xs hover:bg-black hover:text-white transition-colors"
          >
            Download
          </a>
        </li>
      ))}
    </ul>
  );
}

function WarrantySection({ product }: { product: Product }) {
  const years = product.specs.warrantyYears || 5;
  return (
    <div className="space-y-4 text-sm text-gray-700 bg-gray-50/50 border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🛡️</span>
        <div>
          <h4 className="font-extrabold text-base text-gray-950">
            {years}-Year Limited Commercial Warranty
          </h4>
          <p className="text-xs text-gray-500">
            Comprehensive manufacturer direct coverage for commercial projects
          </p>
        </div>
      </div>
      <p className="text-xs sm:text-sm leading-relaxed text-gray-600">
        The Lightning Lab warrants this commercial luminaire against defects in material and workmanship for a period of {years} years from the original purchase date. In the event of a covered defect, we will provide a complete fixture replacement or component replacement kit with fast expedited ground shipping to prevent site delays.
      </p>
      <div className="text-xs text-gray-500 pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
        <span>For commercial warranty inquiries, contact <strong>support@thelightninglab.com</strong></span>
        <span className="font-semibold text-gray-800">Commercial Grade Reliability Guarantee</span>
      </div>
    </div>
  );
}
