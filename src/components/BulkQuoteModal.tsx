'use client';

import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle2, Phone, Building } from 'lucide-react';
import { storeInfo } from '../data/storeData';

interface BulkQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BulkQuoteModal({ isOpen, onClose }: BulkQuoteModalProps) {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: 'Commercial Office Retrofit',
    fixtureCount: '50-100 units',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
          
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Quote Request Submitted!</h3>
              <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">
                Our commercial lighting sales engineers in Norcross, GA will review your specifications and contact you within 2 business hours with wholesale pallet pricing.
              </p>
            </div>
          ) : (
            <>
              <div className="text-left mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B32318] tracking-widest uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Wholesale Contractor Pricing</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Request Commercial Bulk Quote
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Need pallet quantities or custom contractor bidding? Fill out the details below or call us directly at <strong className="text-gray-800">{storeInfo.phoneDisplay}</strong>.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Miller"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B32318]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Company / Electrical Co. *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Electric LLC"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B32318]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Business Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B32318]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B32318]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Project Type</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B32318]"
                    >
                      <option>Commercial Office Retrofit</option>
                      <option>Warehouse / Industrial</option>
                      <option>Outdoor Parking Lot / Gas Station</option>
                      <option>Hospitality / Backlight Onyx</option>
                      <option>Electrical Contractor Reseller</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Estimated Fixture Count</label>
                    <select
                      value={formData.fixtureCount}
                      onChange={(e) => setFormData({ ...formData, fixtureCount: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B32318]"
                    >
                      <option>10 - 50 Fixtures</option>
                      <option>50 - 150 Fixtures</option>
                      <option>150 - 500 Fixtures</option>
                      <option>Full Truckload / Pallets (500+)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Fixture Specifications / Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Enter troffer sizes (2x4 or 2x2), wattage preferences, CCT requirements, jobsite ZIP code..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B32318]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#B32318] hover:bg-[#991b11] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Commercial Quote Request</span>
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
