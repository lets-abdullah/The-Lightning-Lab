"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { VoltRunner } from "@/components/game/volt-runner";
import { useShell } from "@/components/layout/site-shell";
import { Home, Zap } from "lucide-react";

export default function NotFound() {
  const { setIsNotFound } = useShell();

  useEffect(() => {
    setIsNotFound(true);
    document.body.classList.add("overflow-hidden");
    return () => {
      setIsNotFound(false);
      document.body.classList.remove("overflow-hidden");
    };
  }, [setIsNotFound]);

  return (
    <div
      className="fullscreen-404 fixed inset-0 z-9999 bg-[#0c0a0c] text-white flex flex-col justify-between w-screen h-screen overflow-y-auto sm:overflow-hidden p-2.5 sm:p-5 select-none"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 70% 45% at 50% 60%, rgba(185, 28, 28, 0.22) 0%, transparent 70%),
          linear-gradient(to bottom, #0c0a0c, #080708)
        `,
      }}
    >
      {/* 1. Retro Perspective Grid Floor in Lower Half */}
      <div
        className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(239, 68, 68, 0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(239, 68, 68, 0.35) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          transform: "perspective(320px) rotateX(60deg)",
          transformOrigin: "bottom center",
          maskImage: "linear-gradient(to bottom, transparent, black 40%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 40%)",
        }}
      />

      {/* 2. Glowing Electric Lightning Lines Across Horizon ("Bijli ki lines") */}
      <div className="absolute inset-x-0 top-[56%] -translate-y-1/2 pointer-events-none overflow-hidden h-36 flex items-center justify-between z-0 px-2 sm:px-6">
        {/* Left Lightning Arc */}
        <svg
          className="w-[42%] max-w-lg h-28 filter drop-shadow-[0_0_12px_rgba(239,68,68,0.95)]"
          viewBox="0 0 500 120"
          fill="none"
        >
          {/* Main jagged lightning bolt */}
          <path
            d="M0 60 L 60 55 L 100 35 L 150 72 L 190 48 L 240 68 L 280 32 L 330 65 L 370 42 L 420 70 L 460 52 L 500 58"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Bright inner white-pink lightning core */}
          <path
            d="M0 60 L 60 55 L 100 35 L 150 72 L 190 48 L 240 68 L 280 32 L 330 65 L 370 42 L 420 70 L 460 52 L 500 58"
            stroke="#fecaca"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Branch discharge 1 */}
          <path
            d="M150 72 L 175 96 L 200 88"
            stroke="#dc2626"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Branch discharge 2 */}
          <path
            d="M280 32 L 305 12 L 325 22"
            stroke="#dc2626"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Branch discharge 3 */}
          <path
            d="M370 42 L 395 20 L 415 28"
            stroke="#dc2626"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>

        {/* Right Lightning Arc */}
        <svg
          className="w-[42%] max-w-lg h-28 filter drop-shadow-[0_0_12px_rgba(239,68,68,0.95)]"
          viewBox="0 0 500 120"
          fill="none"
        >
          {/* Main jagged lightning bolt */}
          <path
            d="M0 58 L 50 62 L 90 45 L 140 70 L 180 35 L 230 65 L 270 48 L 320 72 L 360 38 L 410 65 L 450 50 L 500 60"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Bright inner white-pink lightning core */}
          <path
            d="M0 58 L 50 62 L 90 45 L 140 70 L 180 35 L 230 65 L 270 48 L 320 72 L 360 38 L 410 65 L 450 50 L 500 60"
            stroke="#fecaca"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Branch discharge 1 */}
          <path
            d="M140 70 L 165 92 L 190 85"
            stroke="#dc2626"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Branch discharge 2 */}
          <path
            d="M270 48 L 295 24 L 315 32"
            stroke="#dc2626"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Branch discharge 3 */}
          <path
            d="M360 38 L 385 15 L 405 22"
            stroke="#dc2626"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* 3. Top Navigation Bar */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 shrink-0">
        {/* Top Left: Lightning Bolt + Brand Name */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 text-white group select-none">
          <div className="size-7 sm:size-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/20 shrink-0">
            <Zap className="size-3.5 sm:size-4.5 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-xs sm:text-base font-black tracking-wider uppercase text-white truncate">
            THE LIGHTNING LAB
          </span>
        </Link>

        {/* Top Right: RETURN TO HOME Pill Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#8B1812] hover:bg-[#a11c15] text-white font-black px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-[11px] sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-red-950/60 active:scale-95 border border-red-500/40 cursor-pointer shrink-0"
        >
          <Home className="size-3.5 sm:size-4" />
          <span>RETURN TO HOME</span>
        </Link>
      </div>

      {/* 4. Main Content Area: Centered Title + Full Game Frame */}
      <div className="flex-1 min-h-0 flex flex-col justify-center items-center py-1 sm:py-3 w-full z-10 space-y-2.5 sm:space-y-4">
        {/* Centered Heading & Error Context */}
        <div className="text-center space-y-1 sm:space-y-2 max-w-2xl mx-auto px-2">
          <h1 className="text-base sm:text-2xl font-black uppercase tracking-wider text-[#d43833]">
            CIRCUIT BROKEN • PAGE NOT FOUND
          </h1>
          <p className="text-[11px] sm:text-sm text-neutral-400 leading-relaxed max-w-xl mx-auto line-clamp-2 sm:line-clamp-none">
            The page you requested does not exist. We may have been hit by a surge, or the link may be outdated. Reconnect the power grid below to fix the connection!
          </p>
        </div>

        {/* Volt Runner Game Cabinet */}
        <div className="w-full max-w-3xl px-1 sm:px-0">
          <VoltRunner />
        </div>
      </div>

      {/* Subtle Bottom Spacing for Viewport Balance */}
      <div className="h-2 sm:h-3" />
    </div>
  );
}
