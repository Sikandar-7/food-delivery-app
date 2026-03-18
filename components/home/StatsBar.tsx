"use client";

import { SlideUp } from "@/components/animations/MotionWrappers";

const stats = [
  { id: 1, number: "546+", label: "Registered Riders" },
  { id: 2, number: "789,900+", label: "Orders Delivered" },
  { id: 3, number: "690+", label: "Restaurants Partnered" },
  { id: 4, number: "17,457+", label: "Food items" },
];

export default function StatsBar() {
  return (
    <section className="w-full bg-primary relative overflow-hidden">
      {/* Background overlapping pattern effect can be added here */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-white/20">
          {stats.map((stat, index) => (
            <SlideUp key={stat.id} delay={index * 0.1} className="flex flex-col items-center justify-center text-center">
              <h3 className="text-3xl md:text-5xl font-heading font-bold text-white mb-2">{stat.number}</h3>
              <p className="text-white/90 font-bold uppercase tracking-wider text-xs md:text-sm">{stat.label}</p>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}
