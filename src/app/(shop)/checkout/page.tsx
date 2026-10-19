import type { Metadata } from "next";
import { auth } from "@/auth";
import { getCartIfExists } from "@/lib/cart/session";
import { CheckoutView } from "@/components/checkout/checkout-view";
import type { Cart } from "@/lib/commerce/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout | The Lightning Lab",
  description: "Secure contractor checkout for commercial LED lighting orders.",
};

const EMPTY_CART: Cart = {
  id: "",
  token: "",
  currencyCode: "USD",
  lines: [],
  discounts: [],
  subtotal: 0,
  discountTotal: 0,
  taxTotal: 0,
  shippingTotal: 0,
  total: 0,
};

export default async function CheckoutPage() {
  const session = await auth();
  const cart = (await getCartIfExists()) ?? EMPTY_CART;

  return (
    <main className="min-h-screen bg-gray-50/50">
      <CheckoutView
        initialCart={cart}
        userEmail={session?.user?.email || ""}
        userName={session?.user?.name || ""}
      />
    </main>
  );
}
