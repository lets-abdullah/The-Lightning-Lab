'use client';

import React from 'react';

export default function BrandStorySection() {
  return (
    <section className="w-full bg-white py-14 sm:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* 50/50 Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Architectural Luxury Villa Photo */}
          <div className="relative aspect-square sm:aspect-square max-h-[480px] rounded-2xl overflow-hidden shadow-lg bg-gray-100 group flex items-center justify-center">
            <img
              src="/images/residential_lights_at_switchtoled.com_640x.jpeg"
              alt="Switch To LED Architectural & Commercial Fixtures"
              className="w-full h-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-103"
              loading="lazy"
            />
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="flex flex-col justify-center">
            
            <span className="text-xs sm:text-sm font-bold tracking-wider text-gray-900 uppercase font-montserrat">
              EXPLORE ALL NEW
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 uppercase mt-2 font-montserrat">
              THE LIGHTNING LAB
            </h2>

            {/* Red Accent Bar */}
            <div className="w-16 h-1 bg-[#8B1812] mt-3 mb-6" />

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify sm:text-left">
              The Lightning Lab stands as a beacon of innovation and excellence in the LED industry, offering high-quality commercial lighting and residential lights for businesses and homes. Our diverse range includes outdoor lighting, LED canopy lights for gas stations, hexagon garage lights for car detailing shops, beauty salons, and gyms, as well as LED wall packs, area lights, shoebox lights, bracket mounts, LED mirrors, troffer lights, LED panel lights, and high bay lights. With certified products, strong warranties, easy returns, and free shipping, The Lightning Lab delivers sustainable, energy-efficient lighting solutions built for a brighter future.
            </p>

            <div className="mt-8">
              <a
                href="#products"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-block bg-[#a61c16] hover:bg-[#8B1812] text-white font-bold px-9 py-3.5 rounded-md text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-95 font-montserrat cursor-pointer"
              >
                Explore More
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
