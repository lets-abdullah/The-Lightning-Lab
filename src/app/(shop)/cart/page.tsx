import type { Metadata } from "next";
import { getOrCreateCart } from "@/lib/cart/session";
import { pickCrossSell } from "@/lib/cart/cross-sell";
import { CartView } from "@/components/cart/cart-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your cart | The Lightning Lab",
  description: "View and manage items in your commercial lighting shopping cart.",
};

export default async function CartPage() {
  const cart = await getOrCreateCart();
  const crossSell = await pickCrossSell(cart);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <h1 className="text-3xl font-semibold text-foreground">Your cart</h1>
      <CartView crossSell={crossSell} />
    </main>
  );
}
