"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import type { Product } from "@/lib/commerce/types";

interface SiteShellProps {
  children: React.ReactNode;
  crossSell: Product[];
}

export function SiteShell({ children, crossSell }: SiteShellProps) {
  const pathname = usePathname();
  const isAuth =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-email");

  if (isAuth) {
    return (
      <main className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900 flex items-center justify-center">
        {children}
      </main>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-[60vh] flex-1">{children}</main>
      <Footer />
      <CartDrawer crossSell={crossSell} />
    </>
  );
}
