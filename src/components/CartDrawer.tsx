'use client';

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types/store';
import { storeInfo } from '../data/storeData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem
}: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [checkoutComplete, setCheckoutComplete] = useState<boolean>(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Volume discount: 5% over $250, 10% over $500
  let volumeDiscountRate = 0;
  if (subtotal >= 500) {
    volumeDiscountRate = 0.10;
  } else if (subtotal >= 250) {
    volumeDiscountRate = 0.05;
  }
  const discountAmount = subtotal * volumeDiscountRate;
  const finalTotal = subtotal - discountAmount;

  // Free shipping progress
  const freeShippingTarget = storeInfo.freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingTarget) * 100));
  const amountRemaining = Math.max(0, freeShippingTarget - subtotal);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B32318]" />
              <h2 className="text-base font-black text-gray-900 tracking-tight uppercase">
                Your Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-black rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="p-4 bg-red-50/60 border-b border-red-100">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800 mb-1.5">
              <Truck className="w-4 h-4 text-[#B32318]" />
              {amountRemaining > 0 ? (
                <span>
                  Add <strong className="text-[#B32318]">${amountRemaining.toFixed(2)}</strong> more for <strong className="uppercase">FREE SHIPPING</strong>!
                </span>
              ) : (
                <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> You qualify for FREE SHIPPING!
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  progressPercent >= 100 ? 'bg-emerald-500' : 'bg-[#B32318]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Checkout Completed Confirmation */}
          {checkoutComplete ? (
            <div className="p-8 text-center my-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Order Placed Successfully!</h3>
              <p className="text-xs text-gray-500 mt-2">
                A confirmation with your commercial invoice has been dispatched to your email address.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCheckoutComplete(false);
                  onClose();
                }}
                className="mt-6 bg-[#B32318] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                    <ShoppingBag className="w-12 h-12 stroke-1 mb-3 text-gray-300" />
                    <p className="text-sm font-bold text-gray-700">Your cart is currently empty</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs">
                      Browse our high bays, troffers, and backlight sheets to get started.
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-5 bg-[#232323] hover:bg-[#B32318] text-white text-xs font-bold px-5 py-2.5 rounded-xl uppercase tracking-wider transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className="py-4 flex gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-extrabold text-gray-900 truncate">
                          {item.product.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-black text-[#B32318]">
                            ${item.product.price.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-gray-400">each</span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 text-gray-600"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 text-gray-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer / Subtotal & Checkout */}
              {items.length > 0 && (
                <div className="p-5 border-t border-gray-100 bg-gray-50/80 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>

                    {volumeDiscountRate > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Tier Volume Discount ({volumeDiscountRate * 100}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span>Estimated Shipping</span>
                      <span className="font-bold text-emerald-700">
                        {amountRemaining === 0 ? 'FREE' : 'Calculated at checkout'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-black text-gray-900">
                      <span>Total Amount</span>
                      <span className="text-base text-[#B32318]">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-[#B32318] hover:bg-[#991b11] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20 active:scale-98 disabled:opacity-75"
                  >
                    {isCheckingOut ? (
                      <span>Processing Secure Checkout...</span>
                    ) : (
                      <>
                        <span>Proceed To Secure Checkout</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-gray-400">
                    Taxes & contractor freight credentials handled in next step.
                  </p>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
