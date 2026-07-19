"use client";

import { useState, useEffect, useMemo } from "react";
import api from "@/lib/api";
import { restaurants as mockRestaurants } from "@/lib/data";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, Flame } from "lucide-react";
import { SlideUp, FadeIn } from "@/components/animations/MotionWrappers";

interface DealRestaurant {
  id: string;
  name: string;
  slug: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  coverImage: string | null;
  isFeatured: boolean;
}

// Fallback so the section never renders empty if the API is unreachable
const fallbackDeals: DealRestaurant[] = mockRestaurants.slice(0, 3).map((r) => ({
  id: r.id,
  name: r.name,
  slug: r.slug,
  cuisine: r.cuisine,
  rating: r.rating,
  deliveryTime: r.deliveryTime,
  coverImage: r.coverImage,
  isFeatured: true,
}));

export default function ExclusiveDeals() {
  const [deals, setDeals] = useState<DealRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/restaurants");
        if (res.data.success && res.data.data.length > 0) {
          setDeals(
            res.data.data.map((r: Record<string, unknown>) => ({
              id: r.id as string,
              name: r.name as string,
              slug: r.slug as string,
              cuisine: Array.isArray(r.categories) ? (r.categories as string[]).join(" • ") : "Restaurant",
              rating: (r.ratingAvg as number) ?? 0,
              deliveryTime: `${(r.deliveryTimeMins as number) ?? 30} min`,
              coverImage: (r.bannerUrl as string) || (r.logoUrl as string) || null,
              isFeatured: Boolean(r.isFeatured),
            }))
          );
        } else {
          setDeals(fallbackDeals);
        }
      } catch (err) {
        console.error("Failed to load deals, using fallback", err);
        setDeals(fallbackDeals);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Build filter chips from the cuisines actually present
  const filters = useMemo(() => {
    const cuisines = new Set<string>();
    deals.forEach((d) => d.cuisine.split(" • ").forEach((c) => c && cuisines.add(c.trim())));
    return ["All", ...Array.from(cuisines).slice(0, 5)];
  }, [deals]);

  // The chips now actually filter (previously they were decorative)
  const visible = useMemo(
    () => (activeFilter === "All" ? deals : deals.filter((d) => d.cuisine.includes(activeFilter))),
    [deals, activeFilter]
  );

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <FadeIn>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl font-heading font-black text-navy">
              🔥 <span className="text-primary">Order.pk featured restaurants</span>
            </h2>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {filters.map((f) => (
                <motion.button
                  key={f}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(f)}
                  className={`whitespace-nowrap text-xs font-bold px-4 py-2 rounded-pill transition-all flex-shrink-0 ${
                    activeFilter === f ? "bg-primary text-white" : "bg-gray-100 text-navy hover:bg-gray-200"
                  }`}
                >
                  {f}
                </motion.button>
              ))}
            </div>
          </div>
        </FadeIn>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
                <div className="h-44 skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-2/3 skeleton rounded" />
                  <div className="h-3 w-1/2 skeleton rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="text-gray-500 text-sm py-10 text-center">No restaurants match this filter yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((r, idx) => (
              <SlideUp key={r.id} delay={idx * 0.08}>
                <Link href={`/restaurants/${r.slug}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary transition-all shadow-card cursor-pointer group bg-white"
                  >
                    <div className="relative h-44 overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.coverImage || "/images/hero_eating_pizza.png"}
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      {r.isFeatured && (
                        <div className="absolute top-3 left-3 bg-primary text-white text-sm font-black px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <Flame size={14} /> Featured
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-pill">
                        Restaurant
                      </div>
                    </div>
                    <div className="bg-white p-4">
                      <h3 className="font-heading font-bold text-navy text-lg">{r.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{r.cuisine}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-600 font-medium">
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-warning fill-warning" />
                          {r.rating > 0 ? r.rating.toFixed(1) : "New"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-primary" />
                          {r.deliveryTime}
                        </span>
                      </div>
                    </div>
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
