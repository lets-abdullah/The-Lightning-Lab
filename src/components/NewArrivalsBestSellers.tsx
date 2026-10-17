'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { showcaseProducts, ProductItem } from '../data/storeData';
import { Product } from '../types/store';

interface NewArrivalsBestSellersProps {
  onQuickView?: (product: Product) => void;
}

export default function NewArrivalsBestSellers({ }: NewArrivalsBestSellersProps) {
  // 8 best-selling products (2 full rows of 4 cards) across top commercial, outdoor, and residential fixtures
  const bestSellerIds = ['p1', 'p2', 'p4', 'p9', 'p3', 'p10', 'p11', 'p17'];
  const products = bestSellerIds
    .map((id) => showcaseProducts.find((p) => p.id === id))
    .filter((p): p is ProductItem => Boolean(p));

  return (
    <section className="w-full bg-white py-12 sm:py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Title: NEW ARRIVALS / BEST SELLERS */}
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tight uppercase inline-flex items-center gap-3 font-montserrat">
            <span>NEW ARRIVALS</span>
            <span className="text-[#8B1812] font-light">/</span>
            <span>BEST SELLERS</span>
          </h2>
        </div>

        {/* 4-Column Product Grid (2 cols on mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {/* Show More Button linking to /collections/all */}
        <div className="text-center mt-10 sm:mt-12">
          <Link
            href="/collections/all"
            className="inline-block bg-white hover:bg-black text-black hover:text-white border border-black py-2.5 px-10 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors rounded-none focus:outline-none cursor-pointer font-montserrat"
          >
            Show More
          </Link>
        </div>

      </div>
    </section>
  );
}
