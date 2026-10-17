'use client';

import React, { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import ShopBySpace from '@/components/ShopBySpace';
import CustomerVideoReviews from '@/components/CustomerVideoReviews';
import ProductGrid from '@/components/ProductGrid';
import HomeDecorBanner from '@/components/HomeDecorBanner';
import NewArrivalsBestSellers from '@/components/NewArrivalsBestSellers';
import LedSheetRollBanner from '@/components/LedSheetRollBanner';
import SheetRollsCatalog from '@/components/SheetRollsCatalog';
import BrandStorySection from '@/components/BrandStorySection';
import CommercialSolutionsCard from '@/components/CommercialSolutionsCard';
import WrittenReviews from '@/components/WrittenReviews';
import CustomerPhotoReviews from '@/components/CustomerPhotoReviews';
import BulkQuoteModal from '@/components/BulkQuoteModal';
import SideCouponTab from '@/components/SideCouponTab';
import FloatingChat from '@/components/FloatingChat';

export default function HomePage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <div className="w-full bg-white text-gray-900 font-sans selection:bg-[#8B1812] selection:text-white">
      {/* 1. Exact 5-Card Hero Grid */}
      <HeroSection />

      {/* 2. SHOP BY CATEGORY (12 Fixture Icons) */}
      <CategoryGrid />

      {/* 3. SHOP BY SPACE (8 Rounded Cards with Bottom Banners) */}
      <ShopBySpace />

      {/* 4. OUR CUSTOMER REVIEWS (Video Cards Carousel) */}
      <CustomerVideoReviews />

      {/* 5. Product Tabs (COMMERCIAL | OUTDOOR | RESIDENTIAL) & 4-Column Cards */}
      <ProductGrid />

      {/* 6. Full-Width LED HOME DECOR LIGHTS Landscape Mansion Banner */}
      <HomeDecorBanner />

      {/* 7. NEW ARRIVALS / BEST SELLERS Catalog Grid */}
      <NewArrivalsBestSellers />

      {/* 8. Full-Width LED SHEET ROLL Illuminated Kitchen Countertop Banner */}
      <LedSheetRollBanner />

      {/* 9. SHEETS / STRIPS / SUPPLIES / CONTROLLERS Catalog Grid */}
      <SheetRollsCatalog />

      {/* 10. EXPLORE ALL NEW - THE LIGHTING LAB 50/50 Editorial Brand Feature */}
      <BrandStorySection />

      {/* 11. Dark Commercial Solutions Feature Card */}
      <CommercialSolutionsCard />

      {/* 12. What People Think About Us Testimonials */}
      <WrittenReviews />

      {/* 13. Customer Photo Reviews Carousel (5 customer install photos) */}
      <CustomerPhotoReviews />

      {/* Floating Widgets */}
      <SideCouponTab />
      <FloatingChat />

      {/* Commercial Bulk Quote Modal */}
      <BulkQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
      />
    </div>
  );
}
