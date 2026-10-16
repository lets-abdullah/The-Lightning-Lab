'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  Gift, 
  RotateCcw, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Check 
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().includes('@')) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full text-white">
      
      {/* 1. Value Prop Top Ribbon matching Screenshot 4: Pure Black with Red Icons */}
      <div className="bg-black py-7 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          
          <div className="flex items-center justify-center gap-3">
            <Truck className="w-6 h-6 text-[#b32318] shrink-0" />
            <span className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-white font-montserrat">
              FREE SHIPPING ON ORDERS $99+
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Gift className="w-6 h-6 text-[#b32318] shrink-0" />
            <span className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-white font-montserrat">
              AUTOMATIC VOLUME DISCOUNT
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <RotateCcw className="w-6 h-6 text-[#b32318] shrink-0" />
            <span className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-white font-montserrat">
              EASY &amp; FREE RETURNS
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#b32318] shrink-0" />
            <span className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-white font-montserrat">
              SAFE &amp; SECURE CHECKOUT
            </span>
          </div>

        </div>
      </div>

      {/* 2. Main 5-Column Footer matching Screenshot 4 */}
      <div className="bg-[#161616] py-14 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-xs text-gray-300">
          
          {/* Column 1: THE LIGHTING LAB BIO & CONTACT */}
          <div className="space-y-4">
            <div className="mb-3">
              <img
                src="/images/the-lighting-lab-logo.png"
                alt="The Lighting Lab"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>
            <p className="text-gray-400 leading-relaxed text-xs">
              Has transformed the way we illuminate our world, inspiring brighter, more energy-efficient, and environmentally conscious lighting experience.
            </p>
            <div className="space-y-2 text-xs">
              <p>
                <span className="text-gray-400">Address: </span>
                <span className="underline text-gray-200">6455 Jimmy Carter Blvd, Norcross, GA 30071, USA</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400">Call us: </span>
                <a href="tel:4709390782" className="underline font-bold text-white hover:text-red-400">
                  (470)-939-0782
                </a>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400">Email: </span>
                <a href="mailto:support@switchtoled.com" className="underline font-medium text-white hover:text-red-400">
                  support@switchtoled.com
                </a>
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Pinterest">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.057.24-.19.291-.439.175-1.644-.766-2.67-3.168-2.67-5.101 0-4.155 3.018-7.971 8.709-7.971 4.572 0 8.125 3.258 8.125 7.612 0 4.544-2.864 8.2-6.84 8.2-1.336 0-2.592-.695-3.022-1.515l-.823 3.136c-.297 1.135-1.102 2.559-1.641 3.424 1.227.378 2.529.584 3.877.584 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" /></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="TikTok">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>
          </div>

          {/* Column 2: SHOP BY */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider font-montserrat">
              SHOP BY
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#panels" className="text-gray-300 hover:text-white">LED Lights</a></li>
              <li><a href="#residential" className="text-gray-300 hover:text-white">Smart Lights</a></li>
              <li><a href="#outdoor" className="text-gray-300 hover:text-white">Outdoor Lights</a></li>
              <li><a href="#residential" className="text-gray-300 hover:text-white">LED Can Lights</a></li>
              <li><a href="#commercial" className="text-gray-300 hover:text-white">LED Shop Lights</a></li>
              <li><a href="#commercial" className="text-gray-300 hover:text-white">Commercial Lights</a></li>
              <li><a href="#warehouse" className="text-gray-300 hover:text-white">Warehouse Lighting</a></li>
              <li><a href="#panels" className="text-gray-300 hover:text-white">LED Flat Panel Lights</a></li>
            </ul>
          </div>

          {/* Column 3: INFORMATION */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider font-montserrat">
              INFORMATION
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="#faqs" className="text-gray-300 hover:text-white">FAQs</a></li>
              <li><a href="#blogs" className="text-gray-300 hover:text-white">Blogs</a></li>
              <li><a href="#sitemap" className="text-gray-300 hover:text-white">Sitemap</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="#speciality" className="text-gray-300 hover:text-white">Speciality</a></li>
              <li><a href="#certifications" className="text-gray-300 hover:text-white">Certifications</a></li>
            </ul>
          </div>

          {/* Column 4: CUSTOMER SERVICE */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider font-montserrat">
              CUSTOMER SERVICE
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#shipping" className="text-gray-300 hover:text-white">Shipping</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white">Contact Us</a></li>
              <li><a href="#track" className="text-gray-300 hover:text-white">Track Order</a></li>
              <li><a href="#privacy" className="text-gray-300 hover:text-white">Private Policy</a></li>
              <li><a href="#warranty" className="text-gray-300 hover:text-white">Warranty Claim</a></li>
              <li><a href="#quote" className="text-gray-300 hover:text-white">Bulk Sale Inquiry</a></li>
              <li><a href="#returns" className="text-gray-300 hover:text-white">Returns &amp; Refunds</a></li>
              <li><a href="#tax" className="text-gray-300 hover:text-white">Tax Exemption Request</a></li>
            </ul>
          </div>

          {/* Column 5: SIGN UP FOR OUR NEWSLETTER */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider font-montserrat">
              SIGN UP FOR OUR NEWSLETTER
            </h4>
            <p className="text-xs text-gray-300">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-coupon-modal'))}
                className="hover:underline text-left cursor-pointer"
              >
                Get <strong className="text-white underline font-bold">10% off</strong> when you sign up for emails! (Click to view code)
              </button>
            </p>

            {submitted ? (
              <div className="bg-emerald-950/70 border border-emerald-600 p-3 rounded text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Thank you! Your coupon code is <strong>SAVE10LED</strong></span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <input
                  type="email"
                  required
                  placeholder="enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-xs px-3.5 py-2.5 rounded-none border border-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-[#b32318] hover:bg-[#8B1812] text-white py-2.5 px-4 rounded-none font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Submit
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* 3. Bottom Copyright & Payment Strip matching Screenshot 4 */}
      <div className="bg-[#242424] py-4 px-4 sm:px-6 lg:px-8 text-xs text-gray-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <p className="text-xs text-gray-300 text-center sm:text-left">
            Copyright &copy; 2026 Switchtoled.Com. All Rights Reserved.
          </p>

          {/* Payment Card Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 select-none">
            {/* VISA */}
            <span className="bg-[#1a1f71] text-white font-black italic px-2 py-0.5 rounded text-[11px] tracking-wider">
              VISA
            </span>
            {/* Mastercard */}
            <span className="bg-[#222] px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1 border border-white/20">
              <span className="w-2.5 h-2.5 rounded-full bg-[#eb001b] inline-block -mr-1.5" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f79e1b] inline-block" />
            </span>
            {/* Maestro */}
            <span className="bg-[#222] px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1 border border-white/20">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00a2e5] inline-block -mr-1.5" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#eb001b] inline-block" />
            </span>
            {/* AMEX */}
            <span className="bg-[#007bc1] text-white font-extrabold px-1.5 py-0.5 rounded text-[10px]">
              AMEX
            </span>
            {/* Apple Pay */}
            <span className="bg-white text-black font-semibold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
              Pay
            </span>
            {/* Discover */}
            <span className="bg-[#ff6000] text-white font-black px-1.5 py-0.5 rounded text-[10px]">
              DISCOVER
            </span>
            {/* Google Pay */}
            <span className="bg-white text-gray-700 font-bold px-2 py-0.5 rounded text-[10px] border border-gray-300">
              GPay
            </span>
          </div>

        </div>
      </div>

    </footer>
  );
}
