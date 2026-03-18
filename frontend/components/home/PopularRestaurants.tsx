"use client";

import { restaurants } from "@/lib/data";
import Link from "next/link";
import { motion } from "framer-motion";
import { SlideUp } from "@/components/animations/MotionWrappers";

export default function PopularRestaurants() {
  return (
    <section className="py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-black text-navy">
            Popular Restaurants
          </h2>
          <Link href="/restaurants" className="text-primary font-bold hover:underline text-sm">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {restaurants.map((restaurant, idx) => (
            <SlideUp key={restaurant.id} delay={idx * 0.07}>
              <Link href={`/restaurants/${restaurant.id}`}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="flex flex-col items-center gap-3 group cursor-pointer"
                >
                  <div
                    className="w-full aspect-square rounded-2xl flex items-center justify-center text-4xl shadow-card group-hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                    style={{ backgroundColor: restaurant.backgroundColor }}
                  >
                    <img src={restaurant.logo} alt={restaurant.name} className="w-20 h-20 object-contain drop-shadow-md" />
                  </div>
                  <p className="font-bold text-navy text-sm text-center leading-tight">
                    {restaurant.name}
                  </p>
                  <p className="text-xs text-gray-500">{restaurant.deliveryTime}</p>
                </motion.div>
              </Link>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}
