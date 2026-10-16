'use client';

import React, { useState } from 'react';
import { X, Tag, Copy, Check } from 'lucide-react';

export default function SideCouponTab() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-coupon-modal', handleOpen);
    return () => window.removeEventListener('open-coupon-modal', handleOpen);
  }, []);

  if (!isVisible) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText('SAVE10LED');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Vertical Left Tab */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 flex items-center">
        <div className="relative group">
          {/* Close button above or at top edge */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px] hover:bg-gray-800 z-50 shadow"
            title="Dismiss"
          >
            <X className="w-2.5 h-2.5" />
          </button>

          {/* Vertical Red Banner */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="bg-[#8B1812] hover:bg-[#70130e] text-white py-4 px-2.5 rounded-r-lg shadow-xl cursor-pointer flex items-center justify-center transition-all group-hover:pl-3"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            <span className="font-extrabold text-xs tracking-wider uppercase select-none">
              GET 10% OFF!
            </span>
          </button>
        </div>
      </div>

      {/* Coupon Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 text-[#8B1812] rounded-full flex items-center justify-center mx-auto mb-3">
                <Tag className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-black text-gray-900">
                Unlock 10% Off Your Order
              </h3>
              <p className="text-xs text-gray-600 mt-2">
                Use this exclusive coupon code at checkout to claim 10% off your entire order on all commercial &amp; residential LED luminaires!
              </p>

              {/* Promo code badge */}
              <div className="mt-5 p-3 bg-gray-50 border-2 border-dashed border-[#8B1812] rounded-xl flex items-center justify-between">
                <span className="font-mono font-black text-lg tracking-widest text-[#8B1812]">
                  SAVE10LED
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#8B1812] hover:bg-[#70130e] text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-6 w-full bg-black hover:bg-gray-900 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider"
              >
                Apply &amp; Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
