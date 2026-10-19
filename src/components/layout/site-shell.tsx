"use client";

import React, { createContext, useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import type { Product } from "@/lib/commerce/types";

interface ShellContextType {
  isNotFound: boolean;
  setIsNotFound: (val: boolean) => void;
}

const ShellContext = createContext<ShellContextType>({
  isNotFound: false,
  setIsNotFound: () => {},
});

export function useShell() {
  return useContext(ShellContext);
}

interface SiteShellProps {
  children: React.ReactNode;
  crossSell: Product[];
}

export function SiteShell({ children, crossSell }: SiteShellProps) {
  const [isNotFound, setIsNotFound] = useState(false);
  const pathname = usePathname();

  const isAuth =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-email");

  // 1. 404 Fullscreen Layout
  if (isNotFound) {
    return (
      <ShellContext.Provider value={{ isNotFound, setIsNotFound }}>
        <main className="h-screen w-full overflow-hidden bg-[#0c0a0b] text-white">
          {children}
        </main>
      </ShellContext.Provider>
    );
  }

  // 2. Auth Pages: Light Clean Background + Logo Top Left + Back to Home Top Right
  if (isAuth) {
    return (
      <ShellContext.Provider value={{ isNotFound, setIsNotFound }}>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
          <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            {/* Top Left: Logo */}
            <Link
              href="/"
              className="flex items-center group select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            >
              <div className="bg-[#231f20] hover:bg-[#231f20] px-3.5 py-1.5 rounded-xl border border-gray-800 shadow-xs transition-all flex items-center justify-center">
                <div className="relative h-7 sm:h-8 w-36 sm:w-40 flex items-center justify-center">
                  <Image
                    src="/images/the-lighting-lab-logo.png"
                    alt="The Lighting Lab"
                    fill
                    sizes="160px"
                    priority
                    className="object-contain object-center"
                  />
                </div>
              </div>
            </Link>

            {/* Top Right: Back to Home Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm border border-gray-200 shadow-xs transition-all active:scale-95"
            >
              <Home className="size-4 text-[#8B1812]" />
              <span>Back to home</span>
            </Link>
          </header>

          {/* Centered Auth Card */}
          <main className="flex-1 flex items-center justify-center p-4">
            {children}
          </main>

          {/* Clean Subdued Footer */}
          <footer className="py-4 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} The Lightning Lab Commercial Lighting. All rights reserved.
          </footer>
        </div>
      </ShellContext.Provider>
    );
  }

  // 3. Normal Shop Layout with Full Header & Footer
  return (
    <ShellContext.Provider value={{ isNotFound, setIsNotFound }}>
      <div data-site-shell-header>
        <AnnouncementBar />
        <Header />
      </div>
      <main className="min-h-[60vh] flex-1">{children}</main>
      <div data-site-shell-footer>
        <Footer />
        <CartDrawer crossSell={crossSell} />
      </div>
    </ShellContext.Provider>
  );
}
