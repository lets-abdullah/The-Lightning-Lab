"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2, Phone, Mail, FileText, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuoteRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    projectType: "Warehouse / Industrial",
    fixtures: "",
    quantity: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Simple & Clean Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-block text-[11px] font-black tracking-widest uppercase text-[#8B1812] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
            Commercial Volume Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
            Bulk &amp; Contractor Quotes
          </h1>
          <p className="text-sm text-gray-600">
            Direct wholesale pricing for electrical contractors, facility managers, and commercial retrofits. RFQ turnaround within 2 hours.
          </p>
        </div>

        {/* Volume Discount Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Job Staging</p>
              <p className="text-base font-bold text-gray-900">10 – 25 Fixtures</p>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              12% OFF
            </span>
          </div>

          <div className="bg-white rounded-xl p-4 border-2 border-[#8B1812] shadow-xs flex items-center justify-between relative">
            <span className="absolute -top-2.5 right-4 bg-[#8B1812] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
              POPULAR
            </span>
            <div>
              <p className="text-xs text-[#8B1812] font-semibold uppercase">Commercial Build</p>
              <p className="text-base font-bold text-gray-900">26 – 100 Fixtures</p>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              20% OFF
            </span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Enterprise Package</p>
              <p className="text-base font-bold text-gray-900">100+ Fixtures</p>
            </div>
            <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
              UP TO 35% OFF
            </span>
          </div>
        </div>

        {/* Grid: RFQ Form + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="size-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="text-2xl font-black text-gray-950 uppercase">Quote Request Received!</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Thank you, <strong>{formData.name || "Contractor"}</strong>. A commercial lighting specialist is reviewing your project details and will send your discounted line-item proposal within 2 business hours.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="font-bold text-xs uppercase tracking-wider"
                >
                  Submit Another Quote
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-lg font-bold text-gray-900">Project &amp; Contact Details</h2>
                  <p className="text-xs text-gray-500">Fill out the form below to receive your customized contractor bid.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Miller"
                      className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Company / Contractor Name</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Miller Electric LLC"
                      className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@millerelectric.com"
                      className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 012-3456"
                      className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Project Type</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden bg-white"
                    >
                      <option>Warehouse / Industrial</option>
                      <option>Commercial Office</option>
                      <option>Retail / Showroom</option>
                      <option>Outdoor / Parking Lot</option>
                      <option>Multi-Family / Hospitality</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Estimated Fixture Count *</label>
                    <input
                      type="text"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="e.g. 48 fixtures"
                      className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Fixtures / Part Numbers</label>
                  <input
                    type="text"
                    value={formData.fixtures}
                    onChange={(e) => setFormData({ ...formData, fixtures: e.target.value })}
                    placeholder="e.g. 150W UFO High Bays, 2x4 Flat Panels, or attach requirements"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Project Notes or Requirements</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Provide any specific voltage, CCT preferences, mounting heights, or timeline requirements..."
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#8B1812] hover:bg-[#70130e] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="size-4" /> Submit RFQ for Contractor Pricing
                </Button>
              </form>
            )}
          </div>

          {/* Clean Quick Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Direct Contractor Support
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Need immediate pricing or photometric layout review? Contact our commercial engineering desk directly.
              </p>
              <div className="space-y-3 pt-2">
                <a
                  href="tel:8005555483"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 text-gray-900"
                >
                  <div className="size-8 rounded-lg bg-red-50 text-[#8B1812] flex items-center justify-center shrink-0">
                    <Phone className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Toll-Free Phone</p>
                    <p className="text-xs font-bold">(800) 555-LITE</p>
                  </div>
                </a>

                <a
                  href="mailto:quotes@thelightninglab.com"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 text-gray-900"
                >
                  <div className="size-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Estimating Email</p>
                    <p className="text-xs font-bold">quotes@thelightninglab.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-900">
                  <div className="size-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Clock className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Estimating Desk</p>
                    <p className="text-xs font-bold">Mon – Fri: 7am – 7pm EST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Contractor Terms</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Net 30 terms, job-site staged deliveries, and tax-exempt contractor accounts available on all approved bids.
              </p>
              <Link
                href="/collections/all"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-red-400 transition-colors pt-1"
              >
                Browse all commercial fixtures <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
