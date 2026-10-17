import { Sliders, SunMedium, Wrench, ShieldCheck, DollarSign } from "lucide-react";

export function ProductFeatureBanners() {
  return (
    <section className="space-y-8 my-10" aria-label="Product Commercial Highlights">
      {/* 3 Callout Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: 3-CCT Tunable */}
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="size-11 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Sliders className="size-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              3-CCT Field Selectable Switch
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Toggle effortlessly between 3500K (Warm Neutral), 4000K (Cool White), and 5000K (Daylight) via the built-in slide switch before or during installation.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200/60 text-[11px] font-semibold text-gray-700">
            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded">3500K</span>
            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded">4000K</span>
            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded">5000K</span>
          </div>
        </div>

        {/* Card 2: Optical PMMA Lens */}
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="size-11 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <SunMedium className="size-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Anti-Glare PMMA Optical Diffuser
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Architectural non-yellowing PMMA frosted micro-prism lens provides uniform light distribution with UGR &lt; 19 visual comfort for long office hours.
            </p>
          </div>
          <div className="pt-2 border-t border-gray-200/60 text-[11px] font-semibold text-gray-700">
            <span>UGR &lt; 19 · Zero Hotspots · 120° Beam</span>
          </div>
        </div>

        {/* Card 3: 3-in-1 Mounting */}
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="size-11 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Wrench className="size-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              3-Way Contractor Mounting
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Standard T-bar drop ceiling lay-in with built-in seismic earthquake clips. Also compatible with drywall surface mount frames and suspension aircraft cables.
            </p>
          </div>
          <div className="pt-2 border-t border-gray-200/60 text-[11px] font-semibold text-gray-700">
            <span>Grid Lay-In · Surface Frame · Suspension</span>
          </div>
        </div>
      </div>

      {/* DLC Rebate Banner */}
      <div className="bg-black text-white rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-red-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded tracking-wide uppercase">
            DLC 5.1 Premium Qualified
          </div>
          <h4 className="text-xl sm:text-2xl font-black">
            Get Up To $40 In Utility Cash Rebates Per Fixture
          </h4>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
            This luminaire is listed on the DesignLights Consortium (DLC) Qualified Products List. Most electric utilities offer commercial rebates covering up to 60% of total project fixture cost.
          </p>
        </div>
        <div className="shrink-0 text-center sm:text-right">
          <span className="text-xs text-neutral-400 block mb-1">Estimated ROI</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400">&lt; 8 Months</span>
        </div>
      </div>
    </section>
  );
}
