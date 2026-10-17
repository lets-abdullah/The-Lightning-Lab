import { Truck, Clock, RotateCcw, ShieldCheck } from "lucide-react";

export function TrustRow() {
  const items = [
    { icon: "🚚", title: "Free Shipping", desc: "On orders over $99" },
    { icon: "🛡️", title: "5-Year Warranty", desc: "Hassle-free replacement" },
    { icon: "⚡", title: "DLC 5.1 Premium", desc: "Rebate eligible fixtures" },
    { icon: "⏱️", title: "Fast Dispatch", desc: "Ships within 24-48 hours" },
    { icon: "💰", title: "Contractor Pricing", desc: "Tiered volume discounts" },
  ];

  return (
    <div className="w-full border-y border-gray-200 py-6 my-10 bg-gray-50/50 rounded-xl px-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
        {items.map((item, idx) => (
          <div
            key={item.title}
            className={`flex flex-col items-center justify-center ${
              idx === 4 ? "col-span-2 md:col-span-1" : ""
            }`}
          >
            <div className="size-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2 font-bold text-base">
              {item.icon}
            </div>
            <span className="text-xs font-bold text-gray-900">{item.title}</span>
            <span className="text-[11px] text-gray-500">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
