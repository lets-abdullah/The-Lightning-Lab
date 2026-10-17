"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, User, ChevronDown, Menu, X } from "lucide-react";
import { navCategories, type NavCategory } from "@/data/storeData";
import { useCartUi } from "@/lib/cart/store";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cart = useCartUi((state) => state.cart);
  const openCart = useCartUi((state) => state.open);
  const cartCount = cart?.lines ? cart.lines.reduce((sum, l) => sum + l.quantity, 0) : 0;

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
    }, 200);
  };

  const currentActiveCategory: NavCategory | undefined = navCategories.find(
    (c) => c.name === activeDropdown
  );

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40">
      {/* 1. Upper Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 lg:gap-8">
        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-gray-700 hover:text-[#8B1812] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Brand Logo in Black Badge Container */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <div className="bg-[#1c1a1b] hover:bg-[#121111] px-3.5 py-1.5 rounded-xl border border-gray-800 shadow-xs transition-all flex items-center">
              <div className="relative h-7 sm:h-8 w-40 sm:w-44">
                <Image
                  src="/images/the-lighting-lab-logo.png"
                  alt="The Lighting Lab"
                  fill
                  sizes="176px"
                  priority
                  className="object-contain object-left"
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Center Search Input with Dark Red Search Button */}
        <div className="flex-1 max-w-2xl mx-auto relative hidden sm:block">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/collections/all?q=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search luminaires and fixtures"
              className="w-full bg-[#f4f5f7] hover:bg-[#eef1f5] focus:bg-white text-gray-900 text-sm font-medium rounded-full py-2.5 pl-5 pr-14 border border-transparent focus:border-gray-300 focus:outline-hidden transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1 size-9 rounded-full bg-[#8B1812] hover:bg-[#70130e] text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Submit search"
            >
              <Search className="size-4" />
            </button>
          </form>
        </div>

        {/* Right Actions: Cart & Account */}
        <div className="flex items-center gap-5 sm:gap-7">
          {/* Cart with count badge */}
          <button
            type="button"
            onClick={openCart}
            className="flex items-center gap-2 group text-left cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <div className="relative">
              <ShoppingCart className="size-7 text-gray-800 group-hover:text-[#8B1812] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#e52e2e] text-white text-[11px] font-bold size-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-gray-800 group-hover:text-[#8B1812]">
              Cart
            </span>
          </button>

          {/* Account */}
          <Link
            href="/account"
            className="flex items-center gap-2 text-left group cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
            aria-label="My Account"
          >
            <User className="size-7 text-gray-800 group-hover:text-[#8B1812] transition-colors shrink-0" />
            <div className="hidden sm:flex flex-col text-[11px] leading-tight text-gray-600">
              <span>Sign or Register</span>
              <span className="text-[10px] text-gray-400">in</span>
              <span className="font-extrabold text-gray-900 group-hover:text-[#8B1812]">
                My Account
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* 2. Lower Navigation Menu Bar with Exact 7 Sections */}
      <nav
        className="border-t border-gray-100 hidden md:block bg-white relative font-sans"
        onMouseLeave={handleMouseLeave}
        aria-label="Main Navigation Categories"
      >
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-6 lg:gap-8 py-3 text-xs sm:text-[13px] font-bold tracking-wider text-gray-900">
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
                  <Link
                    href={item.href.startsWith("#") ? "/collections/all" : item.href}
                    className={`flex items-center gap-1 uppercase transition-colors select-none font-bold cursor-pointer py-1 ${
                      isHovered ? "text-[#8B1812]" : "text-gray-900 hover:text-[#8B1812]"
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`size-3.5 transition-transform duration-200 ${
                          isHovered ? "rotate-180 text-[#8B1812]" : "text-gray-500"
                        }`}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 3. Full-Width Mega Menu Dropdown with Product Images and Names */}
        {activeDropdown && currentActiveCategory?.hasDropdown && currentActiveCategory.items && (
          <div
            className="absolute top-full left-0 right-0 w-full bg-white border-t border-b border-gray-200 shadow-2xl py-8 px-6 sm:px-12 lg:px-16 z-50 animate-in fade-in duration-100"
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 items-center">
                {currentActiveCategory.items.map((subItem) => (
                  <Link
                    key={subItem.name}
                    href={subItem.link}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-4 group p-1.5 rounded-lg hover:opacity-80 transition-all cursor-pointer"
                  >
                    {/* Left Fixture Image */}
                    <div className="size-16 sm:size-20 flex items-center justify-center shrink-0 bg-transparent relative">
                      <Image
                        src={subItem.image}
                        alt={subItem.name}
                        fill
                        sizes="80px"
                        className="object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Right Bold Uppercase Title */}
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-[13px] md:text-sm font-semibold uppercase tracking-wider text-black group-hover:text-[#8B1812] transition-colors leading-snug block">
                        {subItem.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Watermark in bottom right matching user screenshot */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-end">
                <span className="text-[11px] text-gray-400 font-semibold">
                  Created with <span className="text-[#6366f1] font-bold">Smart Menu</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-4/5 max-w-sm bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-lg font-black text-black uppercase tracking-tight">
                  THE LIGHTNING LAB
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-gray-600 hover:text-black"
                  aria-label="Close menu"
                >
                  <X className="size-6" />
                </button>
              </div>

              <div className="mt-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      setMobileMenuOpen(false);
                      window.location.href = `/collections/all?q=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                  className="relative flex items-center"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search fixtures..."
                    className="w-full bg-gray-100 text-sm font-medium rounded-lg p-2.5 pr-10 border border-gray-200 focus:outline-hidden"
                  />
                  <button type="submit" className="absolute right-2 text-gray-500 hover:text-black">
                    <Search className="size-4" />
                  </button>
                </form>
              </div>

              <ul className="mt-6 space-y-3 text-sm font-bold text-gray-800">
                {navCategories.map((item) => (
                  <li key={item.name} className="border-b border-gray-100 pb-2">
                    <Link
                      href={item.href.startsWith("#") ? "/collections/all" : item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between hover:text-[#8B1812] cursor-pointer"
                    >
                      <span>{item.name}</span>
                      {item.hasDropdown && <ChevronDown className="size-4 text-gray-400" />}
                    </Link>

                    {item.hasDropdown && item.items && (
                      <div className="pl-2 pt-2 space-y-2">
                        {item.items.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.link}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 py-1.5 text-xs sm:text-sm font-bold text-gray-700 hover:text-[#8B1812] cursor-pointer"
                          >
                            <div className="relative size-10 shrink-0 bg-gray-50 rounded-lg p-1">
                              <Image
                                src={sub.image}
                                alt={sub.name}
                                fill
                                sizes="40px"
                                className="object-contain"
                              />
                            </div>
                            <span>{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center bg-[#8B1812] hover:bg-[#70130e] text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-colors"
              >
                Sign In / Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
