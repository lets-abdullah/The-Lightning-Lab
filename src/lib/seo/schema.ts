import type { Product, Faq } from "@/lib/commerce/types";

export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildProductJsonLd(
  product: Product,
  canonicalUrl: string
): Record<string, unknown> {
  const strippedDescription = (product.shortDescription || product.title)
    .replace(/<[^>]*>/g, "")
    .trim();

  const nextYearDate = new Date();
  nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
  const priceValidUntil = nextYearDate.toISOString().split("T")[0];

  const imageUrls = (product.images || [])
    .map((img) => img.url)
    .filter(Boolean);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    sku: product.sku,
    description: strippedDescription,
    image: imageUrls,
    brand: {
      "@type": "Brand",
      name: product.brand || "Switch to LED Alternative",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency || "USD",
      price: product.price / 100,
      availability: product.inventory?.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: canonicalUrl,
      priceValidUntil,
    },
  };

  if (product.rating && product.rating.count > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating.average,
      reviewCount: product.rating.count,
    };
  }

  return schema;
}

export function buildFaqJsonLd(faqs: Faq[]): Record<string, unknown> | null {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
