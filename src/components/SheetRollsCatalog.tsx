'use client';

import React, { useState } from 'react';
import { Product } from '../types/store';

interface SheetRollItem {
  id: string;
  title: string;
  category: string;
  originalPrice: string;
  salePrice: string;
  image: string;
  badge: string;
}

interface SheetRollsCatalogProps {
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function SheetRollsCatalog({ onAddToCart }: SheetRollsCatalogProps) {
  const [activeTab, setActiveTab] = useState<'sheets' | 'strips' | 'supplies' | 'controllers'>('sheets');

  const sheetProducts: SheetRollItem[] = [
    {
      id: "sr1",
      title: "16.4ft x 9.45in Giant LED Sheet Roll, 24V 6000K Cool White Flexible Cuttable Dimmable LED Backlight Panel, Paper-T...",
      category: "LED Sheet Roll",
      originalPrice: "$220.00",
      salePrice: "$200.00",
      image: "/images/Switchtoled_backlight_sheet_640x.jpg",
      badge: "Sale"
    },
    {
      id: "sr2",
      title: "16.4ft X 9.45in Giant LED Sheet Roll, 24V 3000K Warm White Flexible Cuttable Dimmable LED Backlight Panel, Paper-T...",
      category: "LED Sheet Roll",
      originalPrice: "$220.00",
      salePrice: "$200.00",
      image: "/images/led_backlight_sheet_gold_roll_640x.jpg",
      badge: "Sale"
    },
    {
      id: "sr3",
      title: "16.4ft X 9.45in Giant LED Sheet Roll 24V Flexible Cuttable Dimmable LED Backlight Panel,...",
      category: "LED Sheet Roll",
      originalPrice: "$275.00",
      salePrice: "$250.00",
      image: "/images/switchtoled_flexible_led_sheet_640x.jpg",
      badge: "Sale"
    },
    {
      id: "sr4",
      title: "16.4FT X 9.45IN Giant RGBW LED Sheet Roll, 24V Flexible Cuttable Dimmable LED Backlight Panel, Paper-Thin Plug & Play...",
      category: "LED Sheet Roll",
      originalPrice: "$302.50",
      salePrice: "$275.00",
      image: "/images/2_3d2dacb3-c239-4218-af8d-d055144054ac_640x.jpg",
      badge: "Sale"
    }
  ];

  const handleAdd = (item: SheetRollItem) => {
    const priceNum = parseFloat(item.salePrice.replace('$', ''));
    const origPriceNum = parseFloat(item.originalPrice.replace('$', ''));
    const prod: Product = {
      id: item.id,
      title: item.title,
      description: "Ultra-thin flexible LED backlight matrix sheet engineered for luxury backlit countertops and architectural features.",
      category: item.category,
      tab: 'sheets',
      price: priceNum,
      originalPrice: origPriceNum,
      rating: 4.9,
      reviewsCount: 24,
      image: item.image,
      badge: item.badge,
      specs: ["24V DC", "Cuttable Grid", "Dimmable", "Paper-Thin"],
      inStock: true
    };
    onAddToCart(prod, 1);
  };

  return (
    <section id="sheets" className="w-full bg-white py-12 sm:py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Tabs matching Screenshot 4: SHEETS | STRIPS | SUPPLIES | CONTROLLERS */}
        <div className="flex items-center justify-center gap-6 sm:gap-12 mb-10 border-b border-gray-100 font-montserrat flex-wrap">
          
          <button
            type="button"
            onClick={() => setActiveTab('sheets')}
            className={`pb-3 text-xs sm:text-base tracking-wider uppercase transition-colors relative font-bold ${
              activeTab === 'sheets'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            SHEETS
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('strips')}
            className={`pb-3 text-xs sm:text-base tracking-wider uppercase transition-colors relative font-bold ${
              activeTab === 'strips'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            STRIPS
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('supplies')}
            className={`pb-3 text-xs sm:text-base tracking-wider uppercase transition-colors relative font-bold ${
              activeTab === 'supplies'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            SUPPLIES
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('controllers')}
            className={`pb-3 text-xs sm:text-base tracking-wider uppercase transition-colors relative font-bold ${
              activeTab === 'controllers'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            CONTROLLERS
          </button>

        </div>

        {/* 4-Column Product Cards (2 cols on mobile) with 'Add To Cart' Button */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {sheetProducts.map((item) => (
            <div key={item.id} className="bg-white flex flex-col justify-between p-2 sm:p-3 relative group transition-all">
              
              {/* Product Image - Click adds to cart */}
              <div 
                onClick={() => handleAdd(item)}
                className="relative aspect-square w-full flex items-center justify-center p-2 mb-3 cursor-pointer select-none"
              >
                {item.badge && (
                  <div className="absolute top-0 left-0 bg-[#e52e2e] text-white text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-none z-10">
                    {item.badge}
                  </div>
                )}
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Title & Price */}
              <div className="flex-1 flex flex-col justify-between">
                <h3 className="text-xs sm:text-sm font-normal text-gray-900 leading-snug line-clamp-2 min-h-10">
                  {item.title}
                </h3>

                <div className="mt-3 mb-4 flex items-baseline gap-2 text-xs sm:text-sm">
                  <span className="line-through text-black font-extrabold">
                    {item.originalPrice}
                  </span>
                  <span className="font-extrabold text-[#e52e2e]">
                    {item.salePrice}
                  </span>
                </div>

                {/* 'Add To Cart' Full-width Button */}
                <button
                  type="button"
                  onClick={() => handleAdd(item)}
                  className="w-full bg-white hover:bg-black text-black hover:text-white border border-black py-2.5 px-4 text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-colors rounded-none focus:outline-none cursor-pointer"
                >
                  Add To Cart
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Centered Show More Button */}
        <div className="text-center mt-10 sm:mt-12">
          <button
            type="button"
            className="inline-block bg-white hover:bg-black text-black hover:text-white border border-black py-2.5 px-10 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-colors rounded-none focus:outline-none cursor-pointer"
          >
            Show More
          </button>
        </div>

      </div>
    </section>
  );
}
