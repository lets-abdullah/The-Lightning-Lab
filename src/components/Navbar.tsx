'use client';

import React, { useState, useRef } from 'react';
import { Search, ShoppingCart, User, ChevronDown, Menu, X } from 'lucide-react';
import { navCategories, productsCatalog, NavCategory } from '../data/storeData';
import { Product } from '../types/store';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onSelectProduct?: (product: Product) => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  onOpenAuth,
  onSelectProduct
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth hover handlers to eliminate the flicker / gap issue
  const handleMouseEnter = (categoryName: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveDropdown(categoryName);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 220);
  };

  // Predictive search filter
  const matchingProducts = searchQuery.trim().length > 1
    ? productsCatalog.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const currentActiveCategory: NavCategory | undefined = navCategories.find(
    (c) => c.name === activeDropdown
  );

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      
      {/* 1. Upper Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-gray-700 hover:text-[#8B1812]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Brand Logo */}
        <div className="flex items-center">
          <a href="#" className="flex items-center group select-none">
            <div className="bg-[#1c1a1b] hover:bg-[#121111] px-3 py-1.5 rounded-xl border border-gray-800 shadow-sm transition-all flex items-center">
              <img
                src="/images/the-lighting-lab-logo.png"
                alt="The Lighting Lab"
                className="h-7 sm:h-9 w-auto object-contain"
              />
            </div>
          </a>
        </div>

        {/* Center Search Input */}
        <div className="flex-1 max-w-2xl mx-auto relative hidden sm:block">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-[#f4f5f7] hover:bg-[#eef1f5] focus:bg-white text-gray-900 text-sm font-medium rounded-full py-2.5 pl-5 pr-14 border border-transparent focus:border-gray-300 focus:outline-none transition-all shadow-inner"
            />
            <button
              type="button"
              className="absolute right-1 w-9 h-9 rounded-full bg-[#8B1812] hover:bg-[#70130e] text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Predictive Search Results Popover */}
          {matchingProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 p-2">
              <div className="text-[11px] font-bold text-gray-400 px-3 py-1 uppercase tracking-wider">
                Matching Luminaires ({matchingProducts.length})
              </div>
              {matchingProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onSelectProduct?.(p);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <img src={p.image} alt={p.title} className="w-10 h-10 object-contain rounded bg-gray-50 p-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{p.title}</p>
                    <p className="text-xs font-black text-[#8B1812]">${p.price.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions: Cart & Account */}
        <div className="flex items-center gap-5 sm:gap-7">
          
          {/* Cart with count badge */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            aria-label="Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-7 h-7 text-gray-800 group-hover:text-[#8B1812] transition-colors" />
              <span className="absolute -top-1.5 -right-2 bg-[#e52e2e] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-gray-800 group-hover:text-[#8B1812]">
              Cart
            </span>
          </button>

          {/* Account */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
          >
            <User className="w-7 h-7 text-gray-800 group-hover:text-[#8B1812] transition-colors flex-shrink-0" />
            <div className="hidden sm:flex flex-col text-[11px] leading-tight text-gray-600">
              <span>Sign or Register</span>
              <span className="text-[10px] text-gray-400">in</span>
              <span className="font-extrabold text-gray-900 group-hover:text-[#8B1812]">My Account</span>
            </div>
          </button>

        </div>
      </div>

      {/* 2. Lower Navigation Menu Bar with Exact 7 Sections from Screenshot */}
      <nav 
        className="border-t border-gray-100 hidden md:block bg-white relative font-montserrat"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-6 lg:gap-8 py-3 text-xs sm:text-[13px] font-bold tracking-wider text-gray-900 font-montserrat">
            {navCategories.map((item) => {
              const isHovered = activeDropdown === item.name;
              return (
                <li
                  key={item.name}
                  className="relative py-1"
                  onMouseEnter={() => {
                    if (item.hasDropdown) {
                      handleMouseEnter(item.name);
                    } else {
                      setActiveDropdown(null);
                    }
                  }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveDropdown(null);
                      const targetId = item.href.replace('#', '') || 'products';
                      const el = document.getElementById(targetId) || document.getElementById('products');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-1 uppercase transition-colors select-none font-bold cursor-pointer py-1 ${
                      isHovered ? 'text-[#8B1812]' : 'text-gray-900 hover:text-[#8B1812]'
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isHovered ? 'rotate-180 text-[#8B1812]' : 'text-gray-500'
                      }`} />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 3. Full-Width Mega Menu Dropdown Matching User Screenshot Exactly */}
        {activeDropdown && currentActiveCategory?.hasDropdown && currentActiveCategory.items && (
          <div
            className="absolute top-full left-0 right-0 w-full bg-white border-t border-b border-gray-200 shadow-2xl py-8 px-6 sm:px-12 lg:px-16 z-50 animate-in fade-in duration-100 font-montserrat"
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-7xl mx-auto">
              {/* 4 columns x 2 rows grid matching screenshot layout */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 items-center">
                {currentActiveCategory.items.map((subItem) => (
                  <a
                    key={subItem.name}
                    href="#products"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveDropdown(null);
                      const el = document.getElementById('products');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-4 group p-1.5 rounded-lg hover:opacity-80 transition-all cursor-pointer"
                  >
                    {/* Left Isolated Fixture Image - Pure Transparent / White Background */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center flex-shrink-0 bg-transparent">
                      <img
                        src={subItem.image}
                        alt={subItem.name}
                        className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-300 ease-out group-hover:scale-108"
                        loading="lazy"
                      />
                    </div>

                    {/* Right Bold Uppercase Title Matching Screenshot */}
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-[13px] md:text-sm font-semibold uppercase tracking-wider text-black group-hover:text-[#8B1812] transition-colors leading-snug block font-montserrat">
                        {subItem.name}
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              {/* Watermark in bottom right matching user screenshot */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-end">
                <span className="text-[11px] text-gray-400 font-semibold font-montserrat">
                  Created with <span className="text-[#6366f1] font-bold">Smart Menu</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="w-4/5 max-w-sm bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto font-montserrat"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-lg font-black text-black uppercase tracking-tight">THE LIGHTNING LAB</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1">
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fixtures..."
                  className="w-full bg-gray-100 text-sm font-medium rounded-lg p-2.5 border border-gray-200"
                />
              </div>

              <ul className="mt-6 space-y-3 text-sm font-bold text-gray-800">
                {navCategories.map((item) => (
                  <li key={item.name} className="border-b border-gray-100 pb-2">
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        const targetId = item.href.replace('#', '') || 'products';
                        const el = document.getElementById(targetId) || document.getElementById('products');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex items-center justify-between hover:text-[#8B1812] cursor-pointer"
                    >
                      <span>{item.name}</span>
                      {item.hasDropdown && <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </a>

                    {item.hasDropdown && item.items && (
                      <div className="pl-2 pt-2 space-y-2">
                        {item.items.map((sub) => (
                          <a
                            key={sub.name}
                            href="#products"
                            onClick={(e) => {
                              e.preventDefault();
                              setMobileMenuOpen(false);
                              const el = document.getElementById('products');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="flex items-center gap-3 py-1.5 text-xs sm:text-sm font-bold text-gray-700 hover:text-[#8B1812] cursor-pointer"
                          >
                            <img src={sub.image} alt={sub.name} className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1 flex-shrink-0" />
                            <span>{sub.name}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full bg-[#8B1812] text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wider"
              >
                Sign In / Register
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
