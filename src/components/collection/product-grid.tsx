import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "@/components/product/product-card";
import { PackageOpen } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = "No commercial LED products match your selected filters.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 px-4 text-center">
        <PackageOpen className="size-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-base font-semibold text-foreground mb-1">
          No Products Found
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {emptyMessage} Try adjusting or clearing some filters to see available inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product, idx) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={idx < 4}
        />
      ))}
    </div>
  );
}
