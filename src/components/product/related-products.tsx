import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "@/components/product/product-card";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  const displayed = products.slice(0, 4);

  return (
    <section className="space-y-6 pt-8 border-t border-gray-200" aria-labelledby="related-products-heading">
      <div className="space-y-1">
        <h2
          id="related-products-heading"
          className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-950"
        >
          Recommended Commercial Fixtures
        </h2>
        <p className="text-xs text-gray-500">
          Complementary architectural luminaires, matching emergency power, and commercial controls.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayed.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
