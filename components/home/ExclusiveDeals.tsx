"use client";

import { restaurants } from "@/lib/data";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, Flame } from "lucide-react";
import { SlideUp, FadeIn } from "@/components/animations/MotionWrappers";
import { useState } from "react";

const filters = ["All", "Vegan", "Sushi", "Pizza & Fast food", "Burgers", "Chicken"];

export default function ExclusiveDeals() {
  const [activeFilter, setActiveFilter] = useState("All");
  const dealsRestaurants = restaurants.filter((r) => r.discount);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <FadeIn>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl font-heading font-black text-navy">
              Up to -40% 🔥{" "}
              <span className="text-primary">Order.pk exclusive deals</span>
            </h2>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {filters.map((f) => (
                <motion.button
                  key={f}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(f)}
                  className={`whitespace-nowrap text-xs font-bold px-4 py-2 rounded-pill transition-all flex-shrink-0 ${
                    activeFilter === f
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-navy hover:bg-gray-200"
                  }`}
                >
                  {f}
                </motion.button>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealsRestaurants.map((r, idx) => (
            <SlideUp key={r.id} delay={idx * 0.08}>
              <Link href={`/restaurants/${r.id}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary transition-all shadow-card cursor-pointer group"
                >
                  <div className="relative h-44 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.coverImage}
                      alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3 bg-primary text-white text-sm font-black px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Flame size={14} /> {r.discount}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-pill">
                      Restaurant
                    </div>
                  </div>
                  <div className="bg-white p-4">
                    <h3 className="font-heading font-bold text-navy text-lg">{r.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{r.cuisine}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-600 font-medium">
                      <span className="flex items-center gap-1"><Star size={12} className="text-warning fill-warning" />{r.rating}</span>
                      <span className="flex items-center gap-1"><Clock size={12} className="text-primary" />{r.deliveryTime}</span>
                    </div>
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
