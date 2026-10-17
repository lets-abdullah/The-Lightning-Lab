'use client';

import React from 'react';
import Link from 'next/link';
import { shopBySpacesCatalog } from '../data/storeData';

export default function ShopBySpace() {
  return (
    <section className="w-full bg-white py-10 sm:py-14 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Title with flanking lines: ─── SHOP BY SPACE ─── */}
        <div className="flex items-center justify-center my-6">
          <div className="flex-1 max-w-xs sm:max-w-md h-[1.5px] bg-[#1a1a1a]" />
          <h2 className="px-4 sm:px-8 text-xl sm:text-2xl md:text-3xl font-black text-[#111] tracking-tight uppercase text-center font-montserrat">
            SHOP BY SPACE
          </h2>
          <div className="flex-1 max-w-xs sm:max-w-md h-[1.5px] bg-[#1a1a1a]" />
        </div>

        {/* 8-Card Grid: 4 columns x 2 rows with bottom banner text */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10">
          {shopBySpacesCatalog.map((space) => (
            <Link
              key={space.id}
              href={space.link}
              className="group relative block rounded-2xl sm:rounded-3xl overflow-hidden aspect-square bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <img
                src={space.image}
                alt={space.name}
                className="w-full h-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Bottom Dark Banner Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-black/70 backdrop-blur-xs py-3 px-3 text-center transition-colors group-hover:bg-black/85">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-montserrat block">
                  {space.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
