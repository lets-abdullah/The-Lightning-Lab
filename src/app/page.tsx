'use client';

import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import CategoryGrid from '../components/CategoryGrid';
import ShopBySpace from '../components/ShopBySpace';
import CustomerVideoReviews from '../components/CustomerVideoReviews';
import ProductGrid from '../components/ProductGrid';
import HomeDecorBanner from '../components/HomeDecorBanner';
import NewArrivalsBestSellers from '../components/NewArrivalsBestSellers';
import LedSheetRollBanner from '../components/LedSheetRollBanner';
import SheetRollsCatalog from '../components/SheetRollsCatalog';
import BrandStorySection from '../components/BrandStorySection';
import CommercialSolutionsCard from '../components/CommercialSolutionsCard';
import WrittenReviews from '../components/WrittenReviews';
import CustomerPhotoReviews from '../components/CustomerPhotoReviews';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import QuickViewModal from '../components/QuickViewModal';
import BulkQuoteModal from '../components/BulkQuoteModal';
import AuthModal from '../components/AuthModal';
import SideCouponTab from '../components/SideCouponTab';
import FloatingChat from '../components/FloatingChat';
import { productsCatalog } from '../data/storeData';
import { Product, CartItem } from '../types/store';
import { CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  // Cart state initialized with 1 best-selling commercial item
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: productsCatalog[0], // 2x4 LED Flat Panel
      quantity: 2,
      selectedCct: '5000K Daylight',
      selectedWattage: '60W'
    }
  ]);

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Add to cart handler
  const handleAddToCart = (product: Product, quantity = 1, cct?: string, wattage?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedCct: cct, selectedWattage: wattage }];
    });
    showToast(`Added "${product.title.slice(0, 32)}..." to your cart`);
  };

  // Update quantity handler
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Remove item handler
  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-[#8B1812] selection:text-white relative">
      {/* 1. Exact Top Ribbon (Black announcement + White support info strip) */}
      <TopBar onOpenQuote={() => setIsQuoteOpen(true)} />

      {/* 2. Main Header & Centered Navigation Menu */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSelectProduct={(prod) => setQuickViewProduct(prod)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* 3. Exact 5-Card Hero Grid */}
        <HeroSection />

        {/* 4. SHOP BY CATEGORY (12 Clean Fixture Icons) */}
        <CategoryGrid />

        {/* 5. SHOP BY SPACE (8 Rounded Cards with Bottom Banners) */}
        <ShopBySpace />

        {/* 6. OUR CUSTOMER REVIEWS (Video Cards Carousel) */}
        <CustomerVideoReviews />

        {/* 7. Product Tabs (COMMERCIAL | OUTDOOR | RESIDENTIAL) & 4-Column Cards */}
        <ProductGrid
          onQuickView={(prod) => setQuickViewProduct(prod)}
        />

        {/* 8. Full-Width LED HOME DECOR LIGHTS Landscape Mansion Banner */}
        <HomeDecorBanner />

        {/* 9. NEW ARRIVALS / BEST SELLERS Catalog Grid */}
        <NewArrivalsBestSellers
          onQuickView={(prod) => setQuickViewProduct(prod)}
        />

        {/* 10. Full-Width LED SHEET ROLL Illuminated Kitchen Countertop Banner */}
        <LedSheetRollBanner />

        {/* 11. SHEETS / STRIPS / SUPPLIES / CONTROLLERS Catalog Grid with Add To Cart */}
        <SheetRollsCatalog
          onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
        />

        {/* 12. EXPLORE ALL NEW - SWITCH TO LED 50/50 Editorial Brand Feature */}
        <BrandStorySection />

        {/* 13. Dark Commercial Solutions Feature Card */}
        <CommercialSolutionsCard />

        {/* 14. What People Think About Us Testimonials */}
        <WrittenReviews />

        {/* 15. Customer Photo Reviews Carousel (5 customer install photos) */}
        <CustomerPhotoReviews />
      </main>

      {/* 16. Professional 100% Exact Dark Footer */}
      <Footer />

      {/* Floating Widgets from Screenshots */}
      <SideCouponTab />
      <FloatingChat />

      {/* Interactive Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* Quick View / Select Options Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Commercial Bulk Quote Modal */}
      <BulkQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
      />

      {/* Contractor Account / Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#232323] text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
