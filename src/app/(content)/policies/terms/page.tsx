import type { Metadata } from "next";
import Link from "next/link";
import { Scale, FileText, Building2, Truck, RefreshCw, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | The Lightning Lab",
  description: "Commercial purchasing terms, contractor quotes, and fulfillment policies for The Lightning Lab.",
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-gray-50/50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Simple & Clean Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block text-[11px] font-black tracking-widest uppercase text-[#8B1812] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
            Commercial Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-500">
            Effective: January 2026 • The Lightning Lab Commercial Lighting Corp.
          </p>
        </div>

        {/* 4 Clean Section Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-2">
            <div className="size-9 rounded-lg bg-red-50 text-[#8B1812] flex items-center justify-center">
              <Building2 className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">1. Commercial Specification</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              All luminaires and drivers sold by The Lightning Lab are engineered for professional commercial/industrial installation in compliance with the National Electrical Code (NEC).
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-2">
            <div className="size-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileText className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">2. Pricing &amp; Net 30 Terms</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Contractor volume quotes are valid for 30 calendar days. Approved electrical contractors may utilize Net 30 commercial terms with an authorized purchase order (PO).
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-2">
            <div className="size-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Truck className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">3. Freight &amp; Delivery</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Orders over $99 receive free standard ground freight. LTL shipments require an accessible loading dock or scheduled liftgate receiving at the job site.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-2">
            <div className="size-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <RefreshCw className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">4. Returns &amp; Restocking</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Standard unopened items in original factory packaging may be returned within 30 days of delivery with an approved RMA number. Defective units are replaced under warranty.
            </p>
          </div>
        </div>

        {/* Clean Inquiry Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-gray-900">Questions Regarding Commercial Terms?</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            For master purchasing agreements, vendor setup packets, or contractor W-9 documentation, reach out to our legal and finance team:
          </p>
          <a
            href="mailto:legal@thelightninglab.com"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#8B1812] hover:underline pt-1"
          >
            <Mail className="size-4" /> legal@thelightninglab.com
          </a>
        </div>
      </div>
    </div>
  );
}
