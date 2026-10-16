'use client';

import React, { useState } from 'react';
import { X, Star, ShoppingCart, CheckCircle2, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';
import { Product } from '../types/store';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, cct?: string, wattage?: string) => void;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart
}: QuickViewModalProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedCct, setSelectedCct] = useState<string>('5000K Daylight');
  const [selectedWattage, setSelectedWattage] = useState<string>('Standard');
  const [added, setAdded] = useState<boolean>(false);

  if (!product) return null;

  const cctOptions = ['3000K Warm', '4000K Neutral', '5000K Daylight', '6500K Cool White'];
  const wattageOptions = ['30W (Economy)', '45W (Standard)', '60W (High Output)', '72W (Maximum Lumens)'];

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedCct, selectedWattage);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Image Area */}
            <div className="p-8 bg-gray-50 flex items-center justify-center relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto max-h-80 object-contain"
              />
              <span className="absolute top-4 left-4 bg-[#B32318] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded">
                {product.badge}
              </span>
            </div>

            {/* Right Product Details Area */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  {product.category}
                </span>

                <h3 className="text-lg sm:text-xl font-black text-gray-900 mt-1 leading-snug">
                  {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-800">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviewsCount} contractor reviews)</span>
                </div>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#B32318]">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    In Stock • Ready to Ship
                  </span>
                </div>

                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  {product.description}
                </p>

                {/* CCT Selector */}
                <div className="mt-4">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-1.5">
                    Select Color Temperature:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {cctOptions.map((cct) => (
                      <button
                        key={cct}
                        type="button"
                        onClick={() => setSelectedCct(cct)}
                        className={`text-xs py-1.5 px-2 rounded-lg font-semibold border transition-all text-center ${
                          selectedCct === cct
                            ? 'border-[#B32318] bg-red-50 text-[#B32318] font-bold shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {cct}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Multi-wattage Selector */}
                <div className="mt-4">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-1.5">
                    Multi-Wattage Driver Mode:
                  </label>
                  <select
                    value={selectedWattage}
                    onChange={(e) => setSelectedWattage(e.target.value)}
                    className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B32318]"
                  >
                    {wattageOptions.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quantity and Add to Cart action */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2.5 hover:bg-gray-100 text-gray-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2.5 hover:bg-gray-100 text-gray-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                      added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#B32318] hover:bg-[#991b11] text-white active:scale-98'
                    }`}
                  >
                    {added ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Added To Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" /> Add To Cart • ${(product.price * quantity).toFixed(2)}
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#B32318]" /> 5-Year DLC Warranty</span>
                  <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-[#B32318]" /> Ships in 24 Hours</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
