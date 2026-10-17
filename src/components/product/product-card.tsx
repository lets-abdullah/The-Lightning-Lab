import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { resolveProductImage } from "@/lib/commerce/resolve-image";
import { formatPrice } from "@/lib/utils/format";
import { StarRow } from "./star-row";
import { CompareCheckbox } from "./compare-checkbox";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const isOutOfStock = !product.inventory.available || product.inventory.quantity <= 0;
  const isSale = !!product.compareAtPrice && product.compareAtPrice > product.price;
  const savings = isSale && product.compareAtPrice ? product.compareAtPrice - product.price : 0;
  const imageUrl = resolveProductImage(product);

  return (
    <div className="group relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white text-gray-900 shadow-xs transition-all duration-200 hover:shadow-md hover:border-gray-300 overflow-hidden">
      <div>
        {/* Thumbnail container */}
        <div className="relative aspect-square w-full overflow-hidden bg-white p-4">
          <Link
            href={`/products/${product.handle}`}
            className="block h-full w-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
            tabIndex={-1}
            aria-hidden="true"
          >
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              priority={priority}
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 items-start pointer-events-none z-10">
            {isOutOfStock ? (
              <span className="bg-neutral-800 text-white font-bold text-[11px] px-2.5 py-0.5 rounded tracking-wide uppercase">
                Out of Stock
              </span>
            ) : isSale ? (
              <span className="bg-red-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded tracking-wide uppercase shadow-xs">
                Sale
              </span>
            ) : null}
            {product.isB2BOnly && (
              <span className="bg-blue-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded">
                B2B Only
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 z-10 opacity-80 hover:opacity-100">
            <CompareCheckbox productId={product.id} />
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {/* Brand & SKU */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="truncate max-w-[140px] font-medium">{product.brand || "The Lightning Lab"}</span>
            <span className="font-mono text-[11px] text-gray-400">{product.sku}</span>
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 text-sm sm:text-base font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors">
            <Link
              href={`/products/${product.handle}`}
              className="hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black rounded-xs"
            >
              {product.title}
            </Link>
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <StarRow rating={product.rating?.average ?? 5} />
            <span className="text-xs text-gray-500 font-medium">
              ({product.rating && product.rating.count > 0 ? product.rating.count : 8})
            </span>
          </div>
        </div>
      </div>

      {/* Footer Area: Price & Action Buttons */}
      <div className="p-4 pt-0 space-y-3">
        {/* Pricing */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-lg sm:text-xl font-extrabold text-red-600">
            {formatPrice(product.price, product.currency)}
          </span>
          {isSale && product.compareAtPrice && (
            <>
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </span>
              <span className="text-[11px] font-semibold text-red-600">
                Save {formatPrice(savings, product.currency)}
              </span>
            </>
          )}
        </div>

        {/* Action Button */}
        <div>
          {isOutOfStock ? (
            <button
              disabled
              className="w-full bg-gray-200 text-gray-500 font-bold py-2.5 px-4 rounded text-xs sm:text-sm text-center cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : (
            <Link
              href={`/products/${product.handle}`}
              className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-2.5 px-4 rounded text-xs sm:text-sm text-center flex items-center justify-center gap-1 transition-colors shadow-xs"
            >
              <span>Choose Options</span>
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

