"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Product Specification",
    message: "",
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
          <span className="inline-block text-[11px] font-black tracking-widest uppercase text-[#8B1812] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
            Commercial Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
            Contact Us
          </h1>
          <p className="text-sm text-gray-600">
            Speak directly with our commercial lighting specialists, estimators, and order desk.
          </p>
        </div>

        {/* 3 Clean Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="tel:8005555483"
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs hover:border-gray-300 transition-colors flex items-start gap-3.5"
          >
            <div className="size-10 rounded-lg bg-red-50 text-[#8B1812] flex items-center justify-center shrink-0">
              <Phone className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Toll-Free Phone</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">(800) 555-LITE</p>
              <p className="text-[11px] text-gray-500 mt-1">Mon – Fri: 7am – 7pm EST</p>
            </div>
          </a>

          <a
            href="mailto:support@thelightninglab.com"
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs hover:border-gray-300 transition-colors flex items-start gap-3.5"
          >
            <div className="size-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Mail className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Email Support</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">support@thelightninglab.com</p>
              <p className="text-[11px] text-gray-500 mt-1">Avg reply: under 2 hrs</p>
            </div>
          </a>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex items-start gap-3.5">
            <div className="size-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <MapPin className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Warehouse &amp; HQ</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">Duluth, GA 30096</p>
              <p className="text-[11px] text-gray-500 mt-1">Contractor Will-Call Available</p>
            </div>
          </div>
        </div>

        {/* Clean Message Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xs">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="size-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-950 uppercase">Message Sent!</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Thank you, <strong>{formData.name || "Customer"}</strong>. Your inquiry has been routed to our lighting support desk. We will respond to <strong>{formData.email}</strong> shortly.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="font-bold text-xs uppercase tracking-wider"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900">Send Us a Direct Message</h2>
                <p className="text-xs text-gray-500">Need photometric specs, freight scheduling, or order assistance?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. David Ross"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="david@company.com"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 345-6789"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden bg-white"
                  >
                    <option>Product Specifications</option>
                    <option>Order Status &amp; Freight</option>
                    <option>Returns &amp; Warranty</option>
                    <option>Commercial Account Setup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our lighting specialists help with your project?"
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#8B1812] focus:ring-1 focus:ring-[#8B1812] outline-hidden resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#8B1812] hover:bg-[#70130e] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="size-4" /> Send Message
              </Button>
            </form>
          )}
        </div>

        {/* Contractor RFQ Link */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need pricing for 10+ fixtures?{" "}
            <Link href="/quote-request" className="text-[#8B1812] font-bold hover:underline">
              Request a Bulk Contractor Quote &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
