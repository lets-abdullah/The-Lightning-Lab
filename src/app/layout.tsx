import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SessionProvider } from "next-auth/react";
import { getCartIfExists } from "@/lib/cart/session";
import { pickCrossSell } from "@/lib/cart/cross-sell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Lightning Lab | Commercial & Industrial LED Lighting",
    template: "%s | The Lightning Lab",
  },
  description:
    "Commercial LED lighting fixtures, DLC 5.1 premium panels, high bays, linear strips, troffers, downlights, and emergency lights with contractor volume pricing.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

import { SiteShell } from "@/components/layout/site-shell";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialCart = null;
  let crossSell: any[] = [];
  try {
    initialCart = await getCartIfExists();
    crossSell = await pickCrossSell(initialCart);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && (err as { digest?: string }).digest === "DYNAMIC_SERVER_USAGE") {
      throw err;
    }
    console.error("RootLayout initial data load error:", err);
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col">
        <SessionProvider>
          <CartProvider initialCart={initialCart}>
            <SiteShell crossSell={crossSell}>{children}</SiteShell>
          </CartProvider>
        </SessionProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
