'use client';

import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { showcaseProducts, ProductItem } from '../data/storeData';
import { Product } from '../types/store';

interface ProductGridProps {
  onQuickView: (product: Product) => void;
}

export default function ProductGrid({ onQuickView }: ProductGridProps) {
  const [activeTab, setActiveTab] = useState<'commercial' | 'outdoor' | 'residential'>('commercial');

  const filteredProducts = showcaseProducts.filter(
    (product) => product.tab === activeTab
  );

  const handleSelectOptions = (item: ProductItem) => {
    // Map ProductItem to full Product object for QuickView modal
    const priceNum = parseFloat(item.salePrice.replace('$', ''));
    const origPriceNum = parseFloat(item.originalPrice.replace('$', ''));
    const prod: Product = {
      id: item.id,
      title: item.title,
      description: "Specification grade luminaire engineered with DLC 5.1 Premium certification and 0-10V dimmable drivers.",
      category: item.category,
      tab: item.tab === 'commercial' ? 'commercial' : item.tab === 'outdoor' ? 'outdoor' : 'sheets',
      price: priceNum,
      originalPrice: origPriceNum,
      rating: 4.9,
      reviewsCount: 38,
      image: item.image,
      badge: item.badge || 'Sale',
      specs: ["DLC 5.1 Premium", "5CCT Selectable", "0-10V Dimmable", "5-Yr Warranty"],
      inStock: true
    };
    onQuickView(prod);
  };

  return (
    <section id="products" className="w-full bg-white py-12 sm:py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Tabs matching Screenshot 5: COMMERCIAL | OUTDOOR | RESIDENTIAL */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 mb-10 border-b border-gray-100 font-montserrat">
          
          <button
            type="button"
            onClick={() => setActiveTab('commercial')}
            className={`pb-3 text-sm sm:text-base tracking-wider uppercase transition-colors relative font-bold ${
              activeTab === 'commercial'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            COMMERCIAL
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('outdoor')}
            className={`pb-3 text-sm sm:text-base tracking-wider uppercase transition-colors relative font-bold ${
              activeTab === 'outdoor'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            OUTDOOR
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('residential')}
            className={`pb-3 text-sm sm:text-base tracking-wider uppercase transition-colors relative font-bold ${
              activeTab === 'residential'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            RESIDENTIAL
          </button>

        </div>

        {/* 4-Column Product Grid (2 cols on mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectOptions={handleSelectOptions}
            />
          ))}
        </div>

        {/* Show More Button */}
        <div className="text-center mt-10 sm:mt-12">
          <button
            type="button"
            className="inline-block bg-white hover:bg-black text-black hover:text-white border border-black py-2.5 px-10 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors rounded-none focus:outline-none cursor-pointer font-montserrat"
          >
            Show More
          </button>
        </div>

      </div>
    </section>
  );
}
