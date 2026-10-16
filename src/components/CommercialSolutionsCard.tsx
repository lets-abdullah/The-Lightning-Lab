'use client';

import React from 'react';

export default function CommercialSolutionsCard() {
  return (
    <section className="w-full bg-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Dark Container Card */}
        <div className="bg-[#191919] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Copy & Bullet Points */}
            <div className="flex flex-col justify-center">
              
              {/* Red Accent Bar */}
              <div className="w-14 h-1 bg-[#8B1812] mb-6" />

              <div className="space-y-4 text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
                <p>
                  The Lightning Lab delivers innovative LED lighting solutions through a fast, reliable e-commerce platform.
                </p>
                <p>
                  We provide commercial lighting and residential LED lights for businesses, electricians, contractors, and homeowners.
                </p>
                <p>
                  Our streamlined supply chain ensures high-quality LED products at competitive prices.
                </p>
                <p>
                  Core values: affordability, premium quality, exceptional customer service.
                </p>
              </div>

              {/* Bullet Points */}
              <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-gray-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0 mt-2" />
                  <span>Enjoy free shipping on LED lighting orders over $99.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0 mt-2" />
                  <span>The Lightning Lab leads the future of energy-efficient lighting with a focus on customer satisfaction.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0 mt-2" />
                  <span>Wide selection of LED flat panel lights for offices, schools, and retail spaces.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0 mt-2" />
                  <span>Durable troffer lights designed for commercial ceilings and grid systems.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0 mt-2" />
                  <span>Bulk order discounts and volume pricing available for large projects.</span>
                </li>
              </ul>

              <div className="mt-8">
                <a
                  href="#products"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('products');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-block bg-[#b32318] hover:bg-[#8B1812] text-white px-8 py-3 rounded-md text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 font-montserrat cursor-pointer"
                >
                  Shop Now
                </a>
              </div>

            </div>

            {/* Right Column: Office Grid & Stacked Flat Panel Fixture - 16:9 Uncropped */}
            <a
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-white flex items-center justify-center shadow-lg group block cursor-pointer"
            >
              <img
                src="/images/commercial_lighting_solutions.jpeg"
                alt="Commercial Lighting Solutions"
                className="w-full h-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-102"
                loading="lazy"
              />
            </a>

          </div>
        </div>

      </div>
    </section>
  );
}
