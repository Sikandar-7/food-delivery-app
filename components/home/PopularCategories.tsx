"use client";

import { categories } from "@/lib/data";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SlideUp, FadeIn } from "@/components/animations/MotionWrappers";
import { useState } from "react";

export default function PopularCategories() {
  const router = useRouter();
  const [active, setActive] = useState(categories[0].name);

  return (
    <section className="py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-heading font-black text-navy mb-8">
            Order.pk Popular Categories 😍
          </h2>
        </FadeIn>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <SlideUp key={cat.name} delay={idx * 0.06}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setActive(cat.name);
                  router.push("/restaurants");
                }}
                className={`w-full flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  active === cat.name
                    ? "border-primary bg-navy text-white shadow-lg"
                    : "border-transparent bg-white hover:border-primary text-navy shadow-card"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                    active === cat.name ? "bg-white/10" : cat.color
                  }`}
                >
                  {cat.emoji}
                </div>
                <div className="text-center">
                  <p className={`font-bold text-sm leading-tight ${active === cat.name ? "text-white" : "text-navy"}`}>
                    {cat.name}
                  </p>
                  <p className={`text-xs mt-0.5 ${active === cat.name ? "text-primary" : "text-gray-400"}`}>
                    {cat.count} items
                  </p>
                </div>
              </motion.button>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}
