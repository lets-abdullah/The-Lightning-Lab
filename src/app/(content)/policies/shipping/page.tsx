import type { Metadata } from "next";
import Link from "next/link";
import { Truck, Clock, ShieldCheck, Box, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Shipping Information | The Lightning Lab",
  description: "Fast commercial shipping, free freight over $99, and same-day dispatch for electrical contractors.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-gray-50/50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Simple & Clean Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block text-[11px] font-black tracking-widest uppercase text-[#8B1812] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
            Commercial Logistics
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
            Shipping Information
          </h1>
          <p className="text-sm text-gray-600">
            Fast, reliable nationwide shipping tailored for commercial contractors and job sites.
          </p>
        </div>

        {/* 4 Clean Key Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex items-start gap-3.5">
            <div className="size-10 rounded-lg bg-red-50 text-[#8B1812] flex items-center justify-center shrink-0">
              <Truck className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Free Freight Over $99</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Free standard ground delivery on qualifying orders over $99 within the 48 contiguous US states.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex items-start gap-3.5">
            <div className="size-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Same-Day Dispatch</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                In-stock commercial fixtures ordered by 2:00 PM EST ship same business day from our regional hubs.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex items-start gap-3.5">
            <div className="size-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Box className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Palletized LTL Freight</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Bulk high bay and panel orders are shrink-wrapped and shipped on pallets with liftgate service included.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex items-start gap-3.5">
            <div className="size-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">100% Transit Protection</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Every shipment is insured. In the rare event of transit damage, replacement units are expedited immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Clean Shipping Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Estimated Delivery Rates &amp; Transit</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-5">Shipping Method</th>
                  <th className="py-3 px-5">Carrier</th>
                  <th className="py-3 px-5">Transit Time</th>
                  <th className="py-3 px-5 text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                <tr>
                  <td className="py-3 px-5 font-bold text-gray-900">Standard Commercial Ground</td>
                  <td className="py-3 px-5">FedEx / UPS Ground</td>
                  <td className="py-3 px-5">1 – 4 Business Days</td>
                  <td className="py-3 px-5 text-right text-emerald-700 font-bold">FREE ($99+) / $14.95</td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-bold text-gray-900">Priority Expedited</td>
                  <td className="py-3 px-5">FedEx 2Day / Air</td>
                  <td className="py-3 px-5">2 Business Days</td>
                  <td className="py-3 px-5 text-right">$39.00</td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-bold text-gray-900">Palletized LTL Freight</td>
                  <td className="py-3 px-5">R+L / Old Dominion / Estes</td>
                  <td className="py-3 px-5">2 – 5 Business Days</td>
                  <td className="py-3 px-5 text-right text-emerald-700 font-bold">FREE ($500+) / $125</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Clean Bottom Actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900">Already placed an order?</h4>
            <p className="text-xs text-gray-500 mt-0.5">Track live dispatch and freight status with your order number.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="text-xs font-bold uppercase tracking-wider">
              <Link href="/track-order">Track Order</Link>
            </Button>
            <Button asChild className="bg-[#8B1812] hover:bg-[#70130e] text-white text-xs font-bold uppercase tracking-wider">
              <Link href="/contact">Contact Logistics <ArrowRight className="size-3.5 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
