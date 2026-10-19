"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  Package,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import type { Cart, CartLine } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/utils/format";
import { useCartUi } from "@/lib/cart/store";
import { updateLineAction, removeLineAction } from "@/lib/cart/actions";
import { createOrderAction } from "@/lib/checkout/actions";
import { Button } from "@/components/ui/button";

interface CheckoutViewProps {
  initialCart: Cart;
  userEmail?: string;
  userName?: string;
}

export function CheckoutView({
  initialCart,
  userEmail = "",
  userName = "",
}: CheckoutViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Sync with global cart store if available, fallback to initialCart
  const storeCart = useCartUi((state) => state.cart);
  const setCart = useCartUi((state) => state.setCart);

  // Local lines state for instant optimistic updates when user increases/decreases quantity
  const [lines, setLines] = useState<CartLine[]>(
    storeCart?.lines && storeCart.lines.length > 0
      ? storeCart.lines
      : initialCart.lines || []
  );

  // Shipping selection
  const [shippingMethod, setShippingMethod] = useState<"standard" | "expedited" | "ltl">("standard");

  // Payment selection
  const [paymentMethod, setPaymentMethod] = useState<"card" | "net30">("card");
  const [poNumber, setPoNumber] = useState("");

  // Customer & Shipping Form
  const [formData, setFormData] = useState({
    firstName: userName.split(" ")[0] || "",
    lastName: userName.split(" ").slice(1).join(" ") || "",
    company: "",
    email: userEmail || "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    province: "OH",
    postalCode: "",
    country: "US",
    notes: "",
  });

  // Calculate dynamic totals directly from current lines so quantity increase updates price in real time!
  const subtotal = lines.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountTotal = storeCart?.discountTotal || initialCart.discountTotal || 0;
  const taxableSubtotal = Math.max(0, subtotal - discountTotal);

  // Dynamic shipping calculation
  let shippingCost = 0;
  if (shippingMethod === "standard") {
    shippingCost = taxableSubtotal >= 9900 ? 0 : 995; // Free over $99
  } else if (shippingMethod === "expedited") {
    shippingCost = 2495; // $24.95
  } else if (shippingMethod === "ltl") {
    shippingCost = taxableSubtotal >= 50000 ? 0 : 4500; // Free over $500
  }

  const taxTotal = Math.round(taxableSubtotal * 0.065); // 6.5% estimated sales tax
  const total = taxableSubtotal + shippingCost + taxTotal;

  // Handle instantaneous quantity change with real-time price increase!
  const handleQuantityChange = (lineId: string, delta: number) => {
    const updatedLines = lines
      .map((item) => {
        if (item.id === lineId) {
          const newQty = Math.max(1, Math.min(999, item.quantity + delta));
          return {
            ...item,
            quantity: newQty,
            lineTotal: item.unitPrice * newQty,
          };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setLines(updatedLines);

    // Persist to server cart
    const targetLine = lines.find((l) => l.id === lineId);
    if (targetLine) {
      const nextQty = Math.max(1, targetLine.quantity + delta);
      startTransition(async () => {
        try {
          const freshCart = await updateLineAction({
            lineId,
            quantity: nextQty,
          });
          setCart(freshCart);
        } catch (err) {
          console.error("Cart update error:", err);
        }
      });
    }
  };

  // Handle remove line
  const handleRemoveLine = (lineId: string) => {
    setLines((prev) => prev.filter((item) => item.id !== lineId));
    startTransition(async () => {
      try {
        const freshCart = await removeLineAction({ lineId });
        setCart(freshCart);
      } catch (err) {
        console.error("Cart remove error:", err);
      }
    });
  };

  // Place Order Handler
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) {
      setOrderError("Your cart is empty. Please add items before checking out.");
      return;
    }

    setOrderError(null);
    setIsPlacingOrder(true);

    const addressPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      company: formData.company || undefined,
      address1: formData.address1,
      address2: formData.address2 || undefined,
      city: formData.city,
      province: formData.province,
      postalCode: formData.postalCode,
      country: formData.country,
      phone: formData.phone || undefined,
    };

    const res = await createOrderAction({
      email: formData.email,
      phone: formData.phone,
      shippingAddress: addressPayload,
      billingAddress: addressPayload,
      shippingMethod:
        shippingMethod === "standard"
          ? "Standard Ground Freight"
          : shippingMethod === "expedited"
          ? "Job-Site Priority 2-Day"
          : "LTL Commercial Freight with Liftgate",
      shippingTotal: shippingCost,
      paymentMethod,
      poNumber: paymentMethod === "net30" ? poNumber : undefined,
      notes: formData.notes,
    });

    if (res.ok) {
      router.push(`/account/orders/${res.orderId}`);
    } else {
      setIsPlacingOrder(false);
      setOrderError(res.error || "An error occurred while placing your order.");
    }
  };

  if (lines.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <Package className="size-16 text-gray-400 mx-auto" />
        <h2 className="text-2xl font-black uppercase text-gray-950">Your Cart is Empty</h2>
        <p className="text-sm text-gray-600">
          You don&apos;t have any commercial luminaires in your cart to checkout.
        </p>
        <div className="pt-2">
          <Link
            href="/collections/all"
            className="inline-flex items-center gap-2 bg-[#8B1812] hover:bg-[#70130e] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition-colors"
          >
            Browse Products &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Checkout Breadcrumb Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-8">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#8B1812] block">
            The Lightning Lab Secure Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight">
            Order Checkout
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Lock className="size-4 text-emerald-600" />
          <span className="hidden sm:inline">256-Bit Encrypted Checkout</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column (7 cols): Customer, Shipping, & Payment */}
        <div className="lg:col-span-7 space-y-8">
          {orderError && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm p-4 rounded-xl flex items-center gap-3">
              <AlertCircle className="size-5 shrink-0 text-red-600" />
              <span>{orderError}</span>
            </div>
          )}

          {/* 1. Contact Information */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h2 className="text-base font-black uppercase tracking-wider text-gray-950 flex items-center gap-2">
                <span className="size-6 rounded-full bg-[#8B1812] text-white flex items-center justify-center text-xs">
                  1
                </span>
                Contact &amp; Contractor Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contractor@company.com"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Phone (for Delivery Appointment) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 000-0000"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h2 className="text-base font-black uppercase tracking-wider text-gray-950 flex items-center gap-2">
                <span className="size-6 rounded-full bg-[#8B1812] text-white flex items-center justify-center text-xs">
                  2
                </span>
                Job-Site / Shipping Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Company / Contractor Name (Optional)
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Apex Electrical Contractors LLC"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.address1}
                onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                placeholder="1234 Industrial Way"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  State / Province *
                </label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Postal / ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

          {/* 3. Shipping Method */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h2 className="text-base font-black uppercase tracking-wider text-gray-950 flex items-center gap-2">
                <span className="size-6 rounded-full bg-[#8B1812] text-white flex items-center justify-center text-xs">
                  3
                </span>
                Shipping Method
              </h2>
            </div>

            <div className="space-y-3 pt-1">
              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === "standard"
                    ? "border-[#8B1812] bg-red-50/20 ring-1 ring-[#8B1812]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "standard"}
                    onChange={() => setShippingMethod("standard")}
                    className="size-4 text-[#8B1812] focus:ring-[#8B1812]"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-gray-950 block">
                      Standard Commercial Ground (1–4 Business Days)
                    </span>
                    <span className="text-xs text-gray-500">
                      FedEx / UPS Ground with direct job-site tracking
                    </span>
                  </div>
                </div>
                <span className="font-black text-xs sm:text-sm text-gray-900">
                  {taxableSubtotal >= 9900 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    "$9.95"
                  )}
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === "expedited"
                    ? "border-[#8B1812] bg-red-50/20 ring-1 ring-[#8B1812]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "expedited"}
                    onChange={() => setShippingMethod("expedited")}
                    className="size-4 text-[#8B1812] focus:ring-[#8B1812]"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-gray-950 block">
                      Job-Site Priority 2-Day Air
                    </span>
                    <span className="text-xs text-gray-500">
                      Guaranteed 2-day delivery window for urgent installations
                    </span>
                  </div>
                </div>
                <span className="font-black text-xs sm:text-sm text-gray-900">$24.95</span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === "ltl"
                    ? "border-[#8B1812] bg-red-50/20 ring-1 ring-[#8B1812]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "ltl"}
                    onChange={() => setShippingMethod("ltl")}
                    className="size-4 text-[#8B1812] focus:ring-[#8B1812]"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-gray-950 block">
                      Heavy LTL Motor Freight (With Liftgate)
                    </span>
                    <span className="text-xs text-gray-500">
                      Consolidated pallet shipping with delivery appointment &amp; liftgate
                    </span>
                  </div>
                </div>
                <span className="font-black text-xs sm:text-sm text-gray-900">
                  {taxableSubtotal >= 50000 ? (
                    <span className="text-emerald-600 font-bold">FREE ($500+)</span>
                  ) : (
                    "$45.00"
                  )}
                </span>
              </label>
            </div>
          </div>

          {/* 4. Payment Selection */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h2 className="text-base font-black uppercase tracking-wider text-gray-950 flex items-center gap-2">
                <span className="size-6 rounded-full bg-[#8B1812] text-white flex items-center justify-center text-xs">
                  4
                </span>
                Payment Method
              </h2>
            </div>

            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-[#8B1812] bg-red-50/20 ring-1 ring-[#8B1812]"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="size-4 text-[#8B1812] focus:ring-[#8B1812]"
                  />
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-4 text-gray-700" />
                    <span className="font-bold text-xs sm:text-sm text-gray-950">
                      Credit / Debit Card
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "net30"
                      ? "border-[#8B1812] bg-red-50/20 ring-1 ring-[#8B1812]"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "net30"}
                    onChange={() => setPaymentMethod("net30")}
                    className="size-4 text-[#8B1812] focus:ring-[#8B1812]"
                  />
                  <div className="flex items-center gap-2">
                    <Building className="size-4 text-gray-700" />
                    <span className="font-bold text-xs sm:text-sm text-gray-950">
                      Net 30 Commercial Terms
                    </span>
                  </div>
                </label>
              </div>

              {paymentMethod === "card" ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      defaultValue="4242 •••• •••• 4242"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        defaultValue="12/28"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                        CVC Code
                      </label>
                      <input
                        type="text"
                        placeholder="CVC"
                        defaultValue="888"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden font-mono"
                      />
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="size-3.5 text-emerald-600" />
                    Payments processed securely via PCI-DSS compliant Stripe gateway.
                  </span>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Purchase Order (PO) Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      placeholder="e.g. PO-2026-9481"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden font-medium"
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    Net 30 invoice will be generated and issued upon warehouse dispatch.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Order Summary with Interactive Steppers & Live Price Updates! */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h2 className="text-base font-black uppercase tracking-wider text-gray-950">
                Order Items ({lines.reduce((s, i) => s + i.quantity, 0)})
              </h2>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                Live Pricing Active
              </span>
            </div>

            {/* Line items with interactive +/- quantity steppers */}
            <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto pr-1">
              {lines.map((line) => (
                <div key={line.id} className="py-4 flex items-start gap-3">
                  <div className="size-14 rounded-lg bg-gray-50 border border-gray-100 p-1 relative shrink-0">
                    <Image
                      src={line.image}
                      alt={line.title}
                      fill
                      sizes="56px"
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-gray-950 line-clamp-1">
                      {line.title}
                    </h4>
                    {line.variantTitle && (
                      <p className="text-[11px] text-gray-500 truncate">
                        {line.variantTitle}
                      </p>
                    )}
                    <span className="text-[10px] text-gray-400 block font-mono">
                      SKU: {line.sku}
                    </span>

                    {/* Interactive Quantity Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(line.id, -1)}
                          className="size-7 flex items-center justify-center hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-900">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(line.id, 1)}
                          className="size-7 flex items-center justify-center hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      {/* Live Calculated Line Total */}
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-black text-gray-950 block">
                          {formatPrice(line.lineTotal)}
                        </span>
                        {line.quantity > 1 && (
                          <span className="text-[10px] text-gray-500 block">
                            {formatPrice(line.unitPrice)} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown Totals */}
            <div className="space-y-3 pt-3 border-t border-gray-100 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-950">{formatPrice(subtotal)}</span>
              </div>

              {discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Contractor Discount</span>
                  <span>-{formatPrice(discountTotal)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Shipping &amp; Logistics</span>
                <span className="font-bold text-gray-950">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Estimated Sales Tax (6.5%)</span>
                <span className="font-bold text-gray-950">{formatPrice(taxTotal)}</span>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between text-base sm:text-lg font-black text-gray-950 pt-3 border-t border-gray-200">
                <span>Total Amount</span>
                <span className="text-[#8B1812] text-xl font-black">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPlacingOrder || lines.length === 0}
              className="w-full bg-[#8B1812] hover:bg-[#70130e] text-white py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isPlacingOrder ? (
                <span className="inline-block animate-spin size-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <Lock className="size-4" /> Place Commercial Order &rarr;
                </>
              )}
            </button>

            {/* Security Guarantee Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-gray-500 text-center">
              <div className="border border-gray-100 rounded-lg p-2 bg-gray-50/50">
                <ShieldCheck className="size-4 text-emerald-600 mx-auto mb-0.5" />
                <span className="font-bold text-gray-900 block">5-Year Warranty</span>
                <span>Manufacturer backing</span>
              </div>
              <div className="border border-gray-100 rounded-lg p-2 bg-gray-50/50">
                <Truck className="size-4 text-[#8B1812] mx-auto mb-0.5" />
                <span className="font-bold text-gray-900 block">Fast Freight</span>
                <span>Fully insured transit</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
