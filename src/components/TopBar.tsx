'use client';

import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';
import { topBarData } from '../data/storeData';

interface TopBarProps {
  onOpenQuote?: () => void;
}

export default function TopBar({ onOpenQuote }: TopBarProps) {
  const [showAnnouncement, setShowAnnouncement] = useState<boolean>(true);

  return (
    <div className="w-full text-xs">
      {/* 1. Black Top Ribbon */}
      {showAnnouncement && (
        <div className="bg-[#121212] text-white py-2 px-4 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between relative">
            <div className="w-6" /> {/* spacer */}
            <div className="text-center font-bold tracking-normal text-xs sm:text-sm flex-1">
              {topBarData.announcement}
            </div>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="text-gray-300 hover:text-white p-0.5 rounded transition-colors focus:outline-none"
              aria-label="Close Announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. White Customer Support & Volume Strip */}
      <div className="bg-[#f8f9fa] border-b border-gray-200 py-2.5 px-4 text-gray-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[13px]">
          {/* Left: Phone & Hours */}
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#001f3f] flex-shrink-0" />
            <a 
              href={`tel:${topBarData.phone.replace(/[^0-9]/g, '')}`}
              className="font-bold text-[#001f3f] hover:underline"
            >
              {topBarData.phone}
            </a>
            <span className="text-gray-500 font-medium ml-1">
              {topBarData.hours}
            </span>
          </div>

          {/* Center: Free shipping & Volume discount notice */}
          <div className="font-extrabold tracking-wide text-[#001f3f] uppercase text-xs sm:text-[13px] text-center font-montserrat">
            {topBarData.promoCenter}
          </div>

          {/* Right: Bulk and Commercial Inquiries */}
          <div>
            <button
              type="button"
              onClick={onOpenQuote}
              className="text-[#004b91] hover:text-[#002f5a] hover:underline font-medium cursor-pointer"
            >
              {topBarData.bulkInquiries}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
