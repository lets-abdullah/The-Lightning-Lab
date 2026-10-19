import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, UserCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | The Lightning Lab",
  description: "Learn how The Lightning Lab protects commercial contractor data and order information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50/50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Simple & Clean Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-block text-[11px] font-black tracking-widest uppercase text-[#8B1812] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
            Data Protection
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500">
            Last updated: January 2026 • The Lightning Lab Commercial Lighting
          </p>
        </div>

        {/* 4 Clean Principle Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-2">
            <div className="size-9 rounded-lg bg-red-50 text-[#8B1812] flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">What We Collect</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We collect contractor contact names, business email, shipping destination, and order lines strictly to generate quotes, process orders, and fulfill shipments.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-2">
            <div className="size-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Lock className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Payment Security</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Payments are encrypted and tokenized via PCI-DSS Level 1 compliant processors (Stripe). We never store raw credit card numbers or security CVVs on our servers.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-2">
            <div className="size-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <EyeOff className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">No Selling of Data</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We do not sell, rent, or trade your company data, contractor information, or job-site addresses to third parties or advertising brokers under any circumstances.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-2">
            <div className="size-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <UserCheck className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Contractor Control</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              You may review, update, or request deletion of your account profile, addresses, and order history at any time through your contractor portal or by emailing support.
            </p>
          </div>
        </div>

        {/* Clean Summary Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-gray-900">Questions About Your Commercial Data?</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            If you have inquiries regarding how project data is processed or need a signed Data Processing Addendum (DPA) for institutional project procurement, contact our compliance team:
          </p>
          <a
            href="mailto:privacy@thelightninglab.com"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#8B1812] hover:underline pt-1"
          >
            <Mail className="size-4" /> privacy@thelightninglab.com
          </a>
        </div>
      </div>
    </div>
  );
}
