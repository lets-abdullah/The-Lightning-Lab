"use client";

import { useState } from "react";
import { X, Phone } from "lucide-react";

export function AnnouncementBar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full text-xs">
      {/* 1. Black Top Ribbon with dismiss */}
      {isOpen && (
        <aside
          aria-label="Announcement"
          className="bg-[#121212] text-white py-2 px-4 transition-all"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between relative">
            <div className="w-6" />
            <div className="text-center font-bold tracking-normal text-xs sm:text-sm flex-1">
              Free Shipping Above Orders $99
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Dismiss announcement"
              className="text-gray-300 hover:text-white p-0.5 rounded transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* 2. Customer Support & Volume Strip */}
      <div className="bg-[#f8f9fa] border-b border-gray-200 py-2.5 px-4 text-gray-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[13px]">
          {/* Phone & Hours */}
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#001f3f] shrink-0" />
            <a
              href="tel:4709390782"
              className="font-bold text-[#001f3f] hover:underline focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
            >
              (470)-939-0782
            </a>
            <span className="text-gray-500 font-medium ml-1">
              Monday - Sunday 5am - 5pm (PST)
            </span>
          </div>

          {/* Center Promo Notice */}
          <div className="font-extrabold tracking-wide text-[#001f3f] uppercase text-xs sm:text-[13px] text-center">
            FREE SHIPPING / AUTOMATIC VOLUME DISCOUNT
          </div>

          {/* Right link */}
          <div>
            <a
              href="/quote-request"
              className="font-semibold text-primary hover:underline hover:text-red-700 transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
            >
              Bulk and Commercial Inquiries
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
