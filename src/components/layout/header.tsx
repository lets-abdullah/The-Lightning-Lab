"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, User, ChevronDown, ChevronRight, ArrowRight, Menu, X } from "lucide-react";
import { primaryNav, NavNode } from "@/lib/nav";
import { getSubcategoryImage } from "@/lib/nav-images";
import { useCartUi } from "@/lib/cart/store";

function getNavHref(node: NavNode): string {
  if (node.handle === "home" || node.handle === "/") return "/";
  if (node.handle === "shop-all") return "/collections/all";
  if (node.handle === "#") return "#";
  if (node.handle.startsWith("/")) return node.handle;
  return `/collections/${node.handle}`;
}

const navItems: NavNode[] = [
  { handle: "home", title: "HOME" },
  ...primaryNav,
];

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cart = useCartUi((state) => state.cart);
  const openCart = useCartUi((state) => state.open);
  const cartCount = cart?.lines ? cart.lines.reduce((sum, l) => sum + l.quantity, 0) : 0;

  const handleMouseEnter = (categoryHandle: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveDropdown(categoryHandle);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const activeNode: NavNode | undefined = primaryNav.find(
    (c) => c.handle === activeDropdown
  );

  return (
    <header className="w-full bg-white border-b border-gray-200 z-40">
      {/* 1. Upper Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 lg:gap-8 relative">
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
        {/* On mobile: absolute center. On desktop: normal flow */}
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center">
          <Link href="/" className="flex items-center group select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <div className="bg-[#1d1c1a] hover:bg-[#1d1c1a] hover:border-gray-700 px-2.5 py-1 rounded-xl border border-gray-800 shadow-xs transition-all flex items-center justify-center">
              <div className="relative h-10 sm:h-12 w-32 sm:w-40">
                <Image
                  src="/images/the-lighting-lab-logo.png"
                  alt="The Lighting Lab"
                  fill
                  sizes="(max-width: 640px) 128px, 160px"
                  priority
                  className="object-contain object-center"
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
            {navItems.map((item) => {
              const hasDropdown = Boolean(item.children && item.children.length > 0);
              const isHovered = activeDropdown === item.handle;

              return (
                <li
                  key={item.handle}
                  className="relative py-1"
                  onMouseEnter={() => {
                    if (hasDropdown) {
                      handleMouseEnter(item.handle);
                    } else {
                      setActiveDropdown(null);
                    }
                  }}
                >
                  <Link
                    href={getNavHref(item)}
                    className={`flex items-center gap-1 uppercase transition-colors select-none font-bold cursor-pointer py-1 ${
                      isHovered ? "text-[#8B1812]" : "text-gray-900 hover:text-[#8B1812]"
                    }`}
                  >
                    <span>{item.title}</span>
                    {hasDropdown && (
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

        {/* 3. Full-Width Mega Menu Dropdown with Columns and Subcategories */}
        {activeDropdown && activeNode && activeNode.children && activeNode.children.length > 0 && (
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
              {activeNode.children.some((child) => child.children && child.children.length > 0) ? (
                /* Column-Grouped Mega Menu (e.g. Commercial, Shop All, Outdoor, Strip) */
                <div
                  className={`grid gap-8 lg:gap-10 ${
                    activeNode.children.length >= 4
                      ? "grid-cols-2 lg:grid-cols-4"
                      : activeNode.children.length === 3
                      ? "grid-cols-1 md:grid-cols-3"
                      : "grid-cols-1 md:grid-cols-2"
                  }`}
                >
                  {activeNode.children.map((column, colIdx) => (
                    <div
                      key={column.handle === "#" ? `col-${colIdx}` : column.handle}
                      className="space-y-3"
                    >
                      {/* Column Header */}
                      {column.handle === "#" ? (
                        <div className="border-b-2 border-[#8B1812]/20 pb-2">
                          <h3 className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-gray-950">
                            {column.title}
                          </h3>
                        </div>
                      ) : (
                        <div className="border-b-2 border-[#8B1812]/20 pb-2">
                          <Link
                            href={getNavHref(column)}
                            onClick={() => setActiveDropdown(null)}
                            className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-gray-950 hover:text-[#8B1812] flex items-center justify-between group/col transition-colors"
                          >
                            <span>{column.title}</span>
                            <ChevronRight className="size-3.5 text-gray-400 group-hover/col:text-[#8B1812] group-hover/col:translate-x-0.5 transition-all" />
                          </Link>
                        </div>
                      )}

                      {/* Subcategory Items with Product Images */}
                      <div className="space-y-2 pt-1">
                        {column.children?.map((sub) => (
                          <Link
                            key={sub.handle}
                            href={getNavHref(sub)}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-3 p-1.5 -mx-1.5 rounded-lg hover:bg-gray-50/90 group transition-all"
                          >
                            <div className="size-11 sm:size-12 shrink-0 relative bg-white rounded-md border border-gray-100 flex items-center justify-center p-1 shadow-2xs group-hover:border-gray-300 transition-colors">
                              <Image
                                src={getSubcategoryImage(sub.handle)}
                                alt={sub.title}
                                fill
                                sizes="48px"
                                className="object-contain transition-transform duration-300 ease-out group-hover:scale-110"
                              />
                            </div>
                            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-black group-hover:text-[#8B1812] transition-colors leading-snug">
                              {sub.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Direct Leaf Subcategories (e.g. Residential, Emergency) */
                <div>
                  <div className="border-b-2 border-[#8B1812]/20 pb-2 mb-4">
                    <h3 className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-gray-950">
                      {activeNode.title} Fixtures
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                    {activeNode.children.map((sub) => (
                      <Link
                        key={sub.handle}
                        href={getNavHref(sub)}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50/90 group transition-all"
                      >
                        <div className="size-12 shrink-0 relative bg-white rounded-md flex items-center justify-center p-1 shadow-2xs group-hover:border-gray-300">
                          <Image
                            src={getSubcategoryImage(sub.handle)}
                            alt={sub.title}
                            fill
                            sizes="48px"
                            className="object-contain transition-transform duration-300 ease-out group-hover:scale-110"
                          />
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-black group-hover:text-[#8B1812] transition-colors leading-snug">
                          {sub.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Quick-Info Bar */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                    DLC 5.1 &amp; UL Certified
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="hidden sm:inline">Volume Discounts Auto-Applied</span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="hidden sm:inline">In-Stock Ships in 24h</span>
                </div>
                <Link
                  href={getNavHref(activeNode)}
                  onClick={() => setActiveDropdown(null)}
                  className="text-xs font-bold text-[#8B1812] hover:text-[#70130e] flex items-center gap-1.5 uppercase tracking-wider group"
                >
                  <span>View All {activeNode.title}</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
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

              <ul className="mt-6 space-y-2 text-sm font-bold text-gray-800">
                {navItems.map((item) => {
                  const hasChildren = Boolean(item.children && item.children.length > 0);
                  const isExpanded = mobileExpanded === item.handle;

                  return (
                    <li key={item.handle} className="border-b border-gray-100 pb-2">
                      <div className="flex items-center justify-between">
                        <Link
                          href={getNavHref(item)}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 py-1.5 hover:text-[#8B1812] cursor-pointer uppercase tracking-wide text-xs sm:text-sm font-bold"
                        >
                          {item.title}
                        </Link>
                        {hasChildren && (
                          <button
                            type="button"
                            onClick={() => setMobileExpanded(isExpanded ? null : item.handle)}
                            className="p-1.5 text-gray-500 hover:text-[#8B1812]"
                            aria-label={`Toggle ${item.title} subcategories`}
                          >
                            <ChevronDown
                              className={`size-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-[#8B1812]" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {hasChildren && isExpanded && (
                        <div className="pl-3 pt-2 pb-1 space-y-3 bg-gray-50/80 rounded-lg mt-1 p-2.5">
                          {item.children!.map((col, idx) => {
                            const isCol = Boolean(col.children && col.children.length > 0);
                            if (isCol) {
                              return (
                                <div
                                  key={col.handle === "#" ? `m-col-${idx}` : col.handle}
                                  className="space-y-1.5"
                                >
                                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-900 block border-b border-gray-200 pb-1">
                                    {col.title}
                                  </span>
                                  <ul className="space-y-1.5 pl-1">
                                    {col.children!.map((sub) => (
                                      <li key={sub.handle}>
                                        <Link
                                          href={getNavHref(sub)}
                                          onClick={() => setMobileMenuOpen(false)}
                                          className="flex items-center gap-2.5 py-1 text-xs text-gray-700 hover:text-[#8B1812] font-semibold"
                                        >
                                          <div className="size-8 shrink-0 relative bg-white rounded border border-gray-100 flex items-center justify-center p-0.5">
                                            <Image
                                              src={getSubcategoryImage(sub.handle)}
                                              alt={sub.title}
                                              fill
                                              sizes="32px"
                                              className="object-contain"
                                            />
                                          </div>
                                          <span className="uppercase text-[11px] tracking-wide leading-tight">{sub.title}</span>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            }

                            return (
                              <Link
                                key={col.handle}
                                href={getNavHref(col)}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2.5 py-1 text-xs text-gray-700 hover:text-[#8B1812] font-semibold pl-1"
                              >
                                <div className="size-8 shrink-0 relative bg-white rounded border border-gray-100 flex items-center justify-center p-0.5">
                                  <Image
                                    src={getSubcategoryImage(col.handle)}
                                    alt={col.title}
                                    fill
                                    sizes="32px"
                                    className="object-contain"
                                  />
                                </div>
                                <span className="uppercase text-[11px] tracking-wide leading-tight">{col.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </li>
                  );
                })}
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
