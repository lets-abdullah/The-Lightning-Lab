"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Award, Wrench, CheckCircle2, Send, Phone, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WarrantyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    partNumber: "",
    quantity: "1",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Simple & Clean Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block text-[11px] font-black tracking-widest uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            Contractor Guarantee
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
            Warranty Claims
          </h1>
          <p className="text-sm text-gray-600">
            5-Year standard commercial coverage with rapid advanced replacement for minimal job-site downtime.
          </p>
        </div>

        {/* 3 Quick Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs text-center space-y-2">
            <div className="size-10 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
              <Award className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">5-Year Full Coverage</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Covers drivers, LED arrays, and enclosures against defects and lumen depreciation.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs text-center space-y-2">
            <div className="size-10 rounded-full bg-red-50 text-[#8B1812] mx-auto flex items-center justify-center">
              <Wrench className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Advanced Replacement</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Approved claims ship replacement fixtures immediately without waiting for returns.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs text-center space-y-2">
            <div className="size-10 rounded-full bg-blue-50 text-blue-700 mx-auto flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Zero Labor Delays</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Pre-wired disconnect plugs enable quick swap-outs in under 5 minutes per unit.
            </p>
          </div>
        </div>

        {/* Claim Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xs">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="size-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-950 uppercase">Claim Submitted Successfully</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Your claim for order <strong>{formData.orderNumber || "Commercial Order"}</strong> has been assigned to our warranty desk. A technician will email you with your replacement tracking within 4 business hours.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="font-bold text-xs uppercase tracking-wider"
              >
                File Another Claim
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900">File a Commercial Warranty Claim</h2>
                <p className="text-xs text-gray-500">Provide the affected fixture and order details below.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Order # or Invoice # *</label>
                  <input
                    type="text"
                    required
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="e.g. LL-10842"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contractor / Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mike Evans"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="mike@contracting.com"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fixture Model / Part Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.partNumber}
                    onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                    placeholder="e.g. LL-HB-150W-5K"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Quantity Affected *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description of Issue *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the failure symptom (e.g. driver flickering, diode outage, mechanical damage)..."
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#8B1812] hover:bg-[#70130e] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="size-4" /> Submit Warranty Claim
              </Button>
            </form>
          )}
        </div>

        {/* Clean Contact Strip */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">Need immediate replacement assistance?</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:8005555483" className="flex items-center gap-1.5 font-bold text-gray-900 hover:text-[#8B1812]">
              <Phone className="size-3.5 text-[#8B1812]" /> (800) 555-LITE
            </a>
            <a href="mailto:warranty@thelightninglab.com" className="flex items-center gap-1.5 font-bold text-gray-900 hover:text-[#8B1812]">
              <Mail className="size-3.5 text-[#8B1812]" /> warranty@thelightninglab.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
