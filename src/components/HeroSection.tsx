'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="w-full bg-white py-3 sm:py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Clean 5-Card Banner Grid with Full Uncropped Banners & Safe Scroll On Click */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 items-start">
          
          {/* LEFT: Large Main Hero Banner (One Trusted Source For All Your LED Lighting Needs) */}
          <a
            href="#products"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('products');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative block w-full rounded-2xl sm:rounded-3xl overflow-hidden aspect-899/498 shadow-sm hover:shadow-xl transition-all duration-300 bg-gray-100 cursor-pointer"
          >
            <Image
              src="/images/hero_one_trusted_source.png"
              alt="One Trusted Source For All Your LED Lighting Needs"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain object-center transition-transform duration-500 ease-out group-hover:scale-102"
            />
          </a>

          {/* RIGHT: 2x2 Grid (Image-Only Banners, Native 1.80 Ratio, Zero Cut-off) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
            
            {/* 1. Top-Left: LED Flat Panel Lights */}
            <a
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative block w-full rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden aspect-640/356 shadow-sm hover:shadow-lg transition-all duration-300 bg-gray-100 cursor-pointer"
            >
              <Image
                src="/images/led_flat_panel_lights_640x.jpeg"
                alt="LED Flat Panel Lights"
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-contain object-center transition-transform duration-500 ease-out group-hover:scale-103"
              />
            </a>

            {/* 2. Top-Right: Bulk Discounts */}
            <a
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative block w-full rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden aspect-640/356 shadow-sm hover:shadow-lg transition-all duration-300 bg-gray-100 cursor-pointer"
            >
              <Image
                src="/images/bulk_discounts_and_free_shippings_at_switchtoled_640x.jpeg"
                alt="Bulk Discounts"
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-contain object-center transition-transform duration-500 ease-out group-hover:scale-103"
              />
            </a>

            {/* 3. Bottom-Left: LED Shoebox Light */}
            <a
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative block w-full rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden aspect-640/356 shadow-sm hover:shadow-lg transition-all duration-300 bg-gray-900 cursor-pointer"
            >
              <Image
                src="/images/led_outdoor_lighting_640x.jpeg"
                alt="LED Shoebox Light"
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-contain object-center transition-transform duration-500 ease-out group-hover:scale-103"
              />
            </a>

            {/* 4. Bottom-Right: Free Shipping */}
            <a
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative block w-full rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden aspect-640/356 shadow-sm hover:shadow-lg transition-all duration-300 bg-gray-100 cursor-pointer"
            >
              <Image
                src="/images/Free_shipping_and_discount_coupons_640x.jpeg"
                alt="Free Shipping On Orders $99+"
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-contain object-center transition-transform duration-500 ease-out group-hover:scale-103"
              />
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}
