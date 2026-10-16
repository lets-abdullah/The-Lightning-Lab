'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LedSheetRollBanner() {
  return (
    <section className="w-full bg-white py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <a
          href="#sheets"
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById('sheets');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group relative block w-full rounded-2xl sm:rounded-3xl overflow-hidden aspect-1880/720 shadow-sm hover:shadow-xl transition-all duration-300 bg-black cursor-pointer"
        >
          <Image
            src="/images/led_sheet_roll_banner.jpeg"
            alt="LED Sheet Roll Lights"
            fill
            sizes="100vw"
            className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-102"
          />
        </a>
      </div>
    </section>
  );
}
