'use client';

import React from 'react';
import Link from 'next/link';
import { categoriesCatalog } from '../data/storeData';

export default function CategoryGrid() {
  return (
    <section className="w-full bg-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Title with flanking lines: ─── SHOP BY CATEGORY ─── */}
        <div className="flex items-center justify-center my-6">
          <div className="flex-1 max-w-xs sm:max-w-md h-[1.5px] bg-[#1a1a1a]" />
          <h2 className="px-4 sm:px-8 text-xl sm:text-2xl md:text-3xl font-black text-[#111] tracking-tight uppercase text-center font-montserrat">
            SHOP BY CATEGORY
          </h2>
          <div className="flex-1 max-w-xs sm:max-w-md h-[1.5px] bg-[#1a1a1a]" />
        </div>

        {/* 12-Item Clean Grid: 4 columns x 3 rows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 sm:gap-y-12 mt-10">
          {categoriesCatalog.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="group flex flex-col items-center text-center cursor-pointer select-none"
            >
              {/* Product fixture isolated photo - Full uncropped display */}
              <div className="w-full h-48 sm:h-56 flex items-center justify-center p-2 sm:p-3 transition-transform duration-300 ease-out group-hover:scale-105">
                <img
                  src={category.image}
                  alt={category.name}
                  className="max-h-full max-w-full w-auto h-auto object-contain filter group-hover:brightness-105 transition-all"
                  loading="lazy"
                />
              </div>

              {/* Title label */}
              <h3 className="mt-3 text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#8B1812] transition-colors font-montserrat">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
