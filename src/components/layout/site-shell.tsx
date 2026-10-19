"use client";

import React, { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
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

  if (isAuth || isNotFound) {
    return (
      <ShellContext.Provider value={{ isNotFound, setIsNotFound }}>
        <main className="h-screen w-full overflow-hidden bg-[#0c0a0b] text-white">
          {children}
        </main>
      </ShellContext.Provider>
    );
  }

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
