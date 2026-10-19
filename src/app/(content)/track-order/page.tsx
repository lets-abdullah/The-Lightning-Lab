"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState("");
  const [emailQuery, setEmailQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 400);
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Simple & Clean Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block text-[11px] font-black tracking-widest uppercase text-[#8B1812] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
            Real-Time Logistics
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
            Track Order
          </h1>
          <p className="text-sm text-gray-600">
            Enter your order confirmation number to check live dispatch and carrier tracking status.
          </p>
        </div>

        {/* Clean Lookup Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xs">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Order Number *</label>
                <input
                  type="text"
                  required
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="e.g. LL-10842 or 940011"
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email or Phone</label>
                <input
                  type="text"
                  value={emailQuery}
                  onChange={(e) => setEmailQuery(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden font-medium"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B1812] hover:bg-[#70130e] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Search className="size-4" />
              {loading ? "Locating Shipment..." : "Track My Shipment"}
            </Button>
          </form>

          {/* Results State */}
          {searched && (
            <div className="mt-8 pt-8 border-t border-gray-100 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-gray-500">Order:</span>
                    <span className="text-sm font-black text-gray-900">{orderQuery.toUpperCase()}</span>
                    <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      In Transit
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Carrier: <strong>FedEx Ground Commercial</strong> • PRO #782941092</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-gray-500 font-medium">Estimated Delivery:</span>
                  <p className="text-sm font-black text-gray-900">Tomorrow by 4:30 PM</p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="space-y-1.5">
                  <div className="size-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <p className="text-[11px] font-bold text-gray-900">Confirmed</p>
                </div>
                <div className="space-y-1.5">
                  <div className="size-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
                    <Package className="size-4" />
                  </div>
                  <p className="text-[11px] font-bold text-gray-900">Staged</p>
                </div>
                <div className="space-y-1.5">
                  <div className="size-8 rounded-full bg-[#8B1812] text-white flex items-center justify-center mx-auto shadow-xs">
                    <Truck className="size-4" />
                  </div>
                  <p className="text-[11px] font-bold text-[#8B1812]">In Transit</p>
                </div>
                <div className="space-y-1.5">
                  <div className="size-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center mx-auto">
                    <MapPin className="size-4" />
                  </div>
                  <p className="text-[11px] font-medium text-gray-500">Delivered</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clean Quick Support Box */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-3">
          <div>
            <p className="font-bold text-gray-900">Need delivery changes or liftgate scheduling?</p>
            <p className="text-gray-500 mt-0.5">Contact dispatch directly with your order number.</p>
          </div>
          <Button asChild variant="outline" size="sm" className="font-bold text-xs uppercase tracking-wider shrink-0">
            <Link href="/contact">Contact Dispatch</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
