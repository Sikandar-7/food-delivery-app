"use client";

import { restaurants } from "@/lib/data";
import Link from "next/link";
import { motion } from "framer-motion";
import { SlideUp } from "@/components/animations/MotionWrappers";

export function SimilarRestaurants({ currentId }: { currentId?: string }) {
  const similar = restaurants.filter((r) => r.id !== currentId).slice(0, 6);

  return (
    <section className="py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <h2 className="text-3xl font-heading font-black text-navy mb-8">
          Similar Restaurants
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {similar.map((r, idx) => (
            <SlideUp key={r.id} delay={idx * 0.06}>
              <Link href={`/restaurants/${r.id}`}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="flex flex-col items-center gap-3 group cursor-pointer"
                >
                  <div
                    className="w-full aspect-square rounded-2xl flex items-center justify-center text-4xl shadow-card group-hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                    style={{ backgroundColor: r.backgroundColor }}
                  >
                    <img src={r.logo} alt={r.name} className="w-20 h-20 object-contain drop-shadow-md" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-navy text-sm leading-tight">{r.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.deliveryTime}</p>
                  </div>
                </motion.div>
              </Link>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}
