"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";
import { SlideUp } from "@/components/animations/MotionWrappers";

interface ApiRestaurant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  deliveryTimeMins: number;
}

export default function PopularRestaurants() {
  const [restaurants, setRestaurants] = useState<ApiRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await api.get('/restaurants');
        if (res.data.success) {
          // just taking the first 6 for the homepage for now
          setRestaurants(res.data.data.slice(0, 6));
        }
      } catch (err) {
        console.error("Failed to fetch popular restaurants", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

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

        {loading ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 animate-pulse">
                {[...Array(6)].map((_, i) => (
                   <div key={i} className="bg-gray-200 aspect-square rounded-2xl w-full"></div>
                ))}
             </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {restaurants.map((restaurant, idx) => (
              <SlideUp key={restaurant.id} delay={idx * 0.07}>
                <Link href={`/restaurants/${restaurant.slug}`}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="flex flex-col items-center gap-3 group cursor-pointer"
                  >
                    <div
                      className="w-full aspect-square rounded-2xl flex items-center justify-center text-4xl shadow-card group-hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-white border border-gray-100"
                    >
                      {restaurant.logoUrl ? (
                         // eslint-disable-next-line @next/next/no-img-element
                         <img src={restaurant.logoUrl} alt={restaurant.name} className="w-20 h-20 object-contain drop-shadow-md" />
                      ) : (
                         <span className="text-4xl text-navy font-bold">{restaurant.name.charAt(0)}</span>
                      )}
                    </div>
                    <p className="font-bold text-navy text-sm text-center leading-tight">
                      {restaurant.name}
                    </p>
                    <p className="text-xs text-gray-500">{restaurant.deliveryTimeMins} mins</p>
                  </motion.div>
                </Link>
              </SlideUp>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
