'use client';

import React from 'react';
import Link from 'next/link';
import { ProductItem } from '../data/storeData';

interface ProductCardProps {
  product: ProductItem;
  onSelectOptions?: (productItem: ProductItem) => void;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const productUrl = `/products/${product.handle || '2x4-led-flat-panel-selectable-wattage-cct'}`;

  return (
    <div className="bg-white flex flex-col justify-between p-2 sm:p-3 relative group transition-all">
      
      {/* Top Image Container - Click navigates to Product Page */}
      <Link 
        href={productUrl}
        className="relative aspect-square w-full flex items-center justify-center p-2 mb-3 cursor-pointer select-none"
      >
        {/* Red Square 'Sale' Badge in top-left */}
        {product.badge && (
          <div className="absolute top-0 left-0 bg-[#e52e2e] text-white text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-none z-10">
            {product.badge}
          </div>
        )}

        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        
        {/* Title (2 lines) - Click navigates to Product Page */}
        <Link 
          href={productUrl}
          className="text-xs sm:text-sm font-normal text-gray-900 leading-snug line-clamp-2 min-h-10 cursor-pointer hover:text-[#8B1812] transition-colors block"
        >
          {product.title}
        </Link>

        {/* Pricing */}
        <div className="mt-3 mb-4 flex items-baseline gap-1.5 text-xs sm:text-sm">
          {product.originalPrice && (
            <span className="line-through text-black font-extrabold">
              {product.originalPrice}
            </span>
          )}
          {product.hasFrom && (
            <span className="text-gray-500 font-normal text-xs">
              From
            </span>
          )}
          <span className="font-extrabold text-[#e52e2e]">
            {product.salePrice}
          </span>
        </div>

        {/* Full-width 'Select Options' Button - Click navigates to Product Page */}
        <Link
          href={productUrl}
          className="w-full bg-white hover:bg-black text-black hover:text-white border border-black py-2 sm:py-2.5 px-2 sm:px-4 text-[11px] sm:text-sm font-bold tracking-wide uppercase transition-colors rounded-none focus:outline-none cursor-pointer font-montserrat text-center block"
        >
          Select Options
        </Link>

      </div>

    </div>
  );
}
