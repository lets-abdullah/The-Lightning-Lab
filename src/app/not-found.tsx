"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { VoltRunner } from "@/components/game/volt-runner";
import { useShell } from "@/components/layout/site-shell";
import { Home, Zap, AlertTriangle } from "lucide-react";

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
    <div className="fullscreen-404 fixed inset-0 z-[9999] bg-[#0c0a0b] text-white flex flex-col justify-between w-screen h-screen overflow-hidden p-3 sm:p-6 select-none">
      {/* Top Bar: 404 Error + Single Return to Home Button */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-neutral-800/80">
        <div className="flex items-center gap-3">
          <div className="size-9 sm:size-10 rounded-xl bg-red-950/80 border border-red-500/40 text-[#ff4d40] flex items-center justify-center font-black text-sm tracking-wider shadow-lg shadow-red-950/50">
            404
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                Circuit Broken • Page Not Found
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded-full">
                <Zap className="size-3 fill-amber-400" /> 0V Line
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              The fixture or page you requested does not exist. Reconnect power with Volt Runner below!
            </p>
          </div>
        </div>

        {/* The single Return to Home button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#8B1812] hover:bg-[#a11c15] text-white font-bold px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-red-950/60 active:scale-95 border border-red-500/40 shrink-0 cursor-pointer"
        >
          <Home className="size-4" />
          <span>Return to Home</span>
        </Link>
      </div>

      {/* Main Game: Stretches across the entire screen */}
      <main className="flex-1 min-h-0 flex flex-col justify-center items-center py-2 sm:py-4 w-full">
        <VoltRunner className="shadow-2xl shadow-black/80" />
      </main>

      {/* Clean Bottom Controls Bar */}
      <div className="pt-2 text-center border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
        <span className="hidden sm:inline">CONTROLS: [SPACE] OR [UP ARROW] TO JUMP • DOUBLE JUMP ACTIVE</span>
        <span className="sm:hidden mx-auto text-neutral-400">TAP THE SCREEN TO JUMP</span>
        <span className="hidden sm:inline text-neutral-600">THE LIGHTNING LAB • OFFLINE RUNNER</span>
      </div>
    </div>
  );
}
