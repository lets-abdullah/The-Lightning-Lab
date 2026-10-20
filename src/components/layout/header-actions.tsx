"use client";

import Link from "next/link";
import { Search, ShoppingCart, User } from "lucide-react";
import { useCartUi } from "@/lib/cart/store";

export function HeaderActions() {
  const cart = useCartUi((state) => state.cart);
  const openCart = useCartUi((state) => state.open);
  const cartCount = cart?.lines ? cart.lines.reduce((sum, l) => sum + l.quantity, 0) : 0;

  return (
    <div className="flex items-center gap-5 sm:gap-7">
      <button
        type="button"
        className="p-1.5 text-gray-700 hover:text-[#8B1812] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
        aria-label="Search"
      >
        <Search className="size-5" />
      </button>

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
  );
}
