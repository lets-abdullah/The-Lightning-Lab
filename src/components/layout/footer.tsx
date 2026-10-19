import Link from "next/link";
import Image from "next/image";
import { Truck, Gift, RotateCcw, ShieldCheck, Phone, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full text-white">
      {/* 1. Value Prop Top Ribbon matching screenshot: Pure Black with Red Icons */}
      <div className="bg-black py-7 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <Truck className="w-6 h-6 text-[#b32318] shrink-0" />
            <span className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-white">
              FREE SHIPPING ON ORDERS $99+
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Gift className="w-6 h-6 text-[#b32318] shrink-0" />
            <span className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-white">
              AUTOMATIC VOLUME DISCOUNT
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <RotateCcw className="w-6 h-6 text-[#b32318] shrink-0" />
            <span className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-white">
              EASY &amp; FREE RETURNS
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#b32318] shrink-0" />
            <span className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-white">
              SAFE &amp; SECURE CHECKOUT
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main 5-Column Footer */}
      <div className="bg-[#161616] py-14 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-xs text-gray-300">
          {/* Column 1: Bio & Contact */}
          <div className="space-y-4">
            <div className="relative h-10 w-[162px]">
              <Image
                src="/images/the-lighting-lab-logo.png"
                alt="The Lighting Lab"
                fill
                sizes="162px"
                className="object-contain object-left"
              />
            </div>
            <p className="text-gray-400 leading-relaxed text-xs">
              Has transformed the way we illuminate our world, inspiring brighter, more energy-efficient, and environmentally conscious lighting experience.
            </p>
            <div className="space-y-2 text-xs">
              <p>
                <span className="text-gray-400">Address: </span>
                <span className="text-gray-200">6455 Jimmy Carter Blvd, Norcross, GA 30071, USA</span>
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
          </div>

          {/* Column 2: SHOP BY */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              SHOP BY
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/collections/led-panel-lights" className="text-gray-300 hover:text-white">LED Panels</Link></li>
              <li><Link href="/collections/led-strip-lights" className="text-gray-300 hover:text-white">LED Strip Lights</Link></li>
              <li><Link href="/collections/commercial-industrial" className="text-gray-300 hover:text-white">High Bay &amp; Industrial</Link></li>
              <li><Link href="/collections/outdoor-lighting" className="text-gray-300 hover:text-white">Outdoor Commercial</Link></li>
              <li><Link href="/collections/led-downlights" className="text-gray-300 hover:text-white">LED Downlights</Link></li>
              <li><Link href="/collections/emergency-exit" className="text-gray-300 hover:text-white">Emergency &amp; Exit</Link></li>
              <li><Link href="/collections/smart-lighting" className="text-gray-300 hover:text-white">Smart Lighting</Link></li>
              <li><Link href="/collections/accessories" className="text-gray-300 hover:text-white">Drivers &amp; Accessories</Link></li>
            </ul>
          </div>

          {/* Column 3: INFORMATION */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              INFORMATION
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link href="/collections/all" className="text-gray-300 hover:text-white">Shop All</Link></li>
              <li><Link href="/policies/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/policies/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 4: CUSTOMER SERVICE */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              CUSTOMER SERVICE
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/policies/shipping" className="text-gray-300 hover:text-white">Shipping Information</Link></li>
              <li><Link href="/pages/warranty" className="text-gray-300 hover:text-white">Warranty Claims</Link></li>
              <li><Link href="/track-order" className="text-gray-300 hover:text-white">Track Order</Link></li>
              <li><Link href="/quote-request" className="text-gray-300 hover:text-white">Bulk &amp; Contractor Quotes</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 5: SIGN UP FOR OUR NEWSLETTER */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              SIGN UP FOR OUR NEWSLETTER
            </h4>
            <p className="text-xs text-gray-300">
              Get <strong className="text-white underline font-bold">10% off</strong> your first commercial project order!
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="enter your email address"
                className="w-full bg-white text-xs text-gray-900 placeholder:opacity-50 px-3.5 py-2.5 rounded-none border border-transparent focus:outline-hidden"
              />
              <button
                type="button"
                className="w-full bg-[#b32318] hover:bg-[#8B1812] text-white py-2.5 px-4 rounded-none font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright & Payment Strip */}
      <div className="bg-[#242424] py-4 px-4 sm:px-6 lg:px-8 text-xs text-gray-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-300 text-center sm:text-left">
            Copyright &copy; {currentYear} The Lighting Lab. All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1.5 select-none">
            <span className="bg-[#1a1f71] text-white font-black italic px-2 py-0.5 rounded text-[11px] tracking-wider">
              VISA
            </span>
            <span className="bg-[#222] px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1 border border-white/20">
              <span className="w-2.5 h-2.5 rounded-full bg-[#eb001b] inline-block -mr-1.5" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f79e1b] inline-block" />
            </span>
            <span className="bg-[#007bc1] text-white font-extrabold px-1.5 py-0.5 rounded text-[10px]">
              AMEX
            </span>
            <span className="bg-white text-black font-semibold px-2 py-0.5 rounded text-[10px]">
              Apple Pay
            </span>
            <span className="bg-[#ff6000] text-white font-black px-1.5 py-0.5 rounded text-[10px]">
              DISCOVER
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
