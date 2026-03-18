"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, ShoppingBag, ChevronRight, Search, Filter, Flame } from "lucide-react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FadeIn, SlideUp } from "@/components/animations/MotionWrappers";

const cuisineFilters = ["All", "Burgers", "Pizza", "Chicken", "Wraps", "Dessert", "Pakistani"];

interface ApiRestaurant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  categories: string[];
  minOrderValue: number;
  deliveryTimeMins: number;
  isOpen: boolean;
  ratingAvg: number;
  isFeatured: boolean;
}

export default function RestaurantsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<ApiRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get('/restaurants'); // Assuming public route
        if (res.data.success) {
          setRestaurants(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter((r) => {
    const categoriesStr = r.categories.join(", ").toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoriesStr.includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      categoriesStr.includes(activeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-navy text-white py-14 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <FadeIn>
            <p className="text-primary font-bold text-sm uppercase tracking-wider mb-2">
              🍽️ Order.pk
            </p>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Find Your Favourite Restaurant
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Browse hundreds of restaurants and takeaways in your area
            </p>

            {/* Search bar */}
            <div className="max-w-lg mx-auto flex gap-0 bg-white rounded-pill overflow-hidden shadow-xl">
              <div className="flex items-center gap-2 flex-1 px-5">
                <Search size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search restaurants, cuisine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 py-4 outline-none text-navy font-medium placeholder:text-gray-400 bg-transparent"
                />
              </div>
              <button className="bg-primary text-white px-7 font-bold hover:bg-primary/90 transition flex-shrink-0">
                Search
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      <main className="flex-grow">
        {/* Cuisine Filter Pills */}
        <section className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
            {cuisineFilters.map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                whileTap={{ scale: 0.95 }}
                className={`whitespace-nowrap px-5 py-2 rounded-pill text-sm font-bold transition-all flex-shrink-0 ${
                  activeFilter === filter
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-navy hover:bg-gray-200"
                }`}
              >
                {filter}
              </motion.button>
            ))}
            <button className="flex items-center gap-2 ml-auto whitespace-nowrap px-5 py-2 rounded-pill text-sm font-bold bg-gray-100 text-navy hover:bg-gray-200 flex-shrink-0">
              <Filter size={14} />
              Filters
            </button>
          </div>
        </section>

        {/* Restaurant Grid */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold text-navy">
              {loading ? "Loading..." : `${filtered.length} Restaurant${filtered.length !== 1 ? "s" : ""} near you`}
            </h2>
            <p className="text-sm text-gray-500">Sorted by: <span className="font-bold text-navy">Popularity</span></p>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                   <div key={i} className="bg-gray-200 rounded-2xl h-72"></div>
                ))}
             </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-xl font-bold text-navy">No restaurants found</p>
              <p className="mt-2">Try a different search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((restaurant, idx) => (
                <SlideUp key={restaurant.id} delay={idx * 0.05}>
                  <Link href={`/restaurants/${restaurant.slug}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden group cursor-pointer"
                    >
                      {/* Cover Image */}
                      <div className="relative h-44 bg-gray-100 overflow-hidden">
                        {restaurant.bannerUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={restaurant.bannerUrl}
                            alt={restaurant.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-navy/10 flex items-center justify-center text-navy font-bold">{restaurant.name}</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Featured badge */}
                        {restaurant.isFeatured && (
                          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                            <Flame size={12} />
                            Featured
                          </div>
                        )}

                        {/* Logo */}
                        <div className="absolute bottom-3 left-3 w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden border border-gray-100">
                          {restaurant.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={restaurant.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-xl font-bold text-navy">{restaurant.name.charAt(0)}</span>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-heading font-bold text-navy text-lg leading-tight">
                            {restaurant.name}
                          </h3>
                          <div className="flex items-center gap-1 text-warning flex-shrink-0 bg-warning/10 px-2 py-1 rounded-lg">
                            <Star size={12} fill="currentColor" />
                            <span className="text-xs font-black text-navy">{restaurant.ratingAvg.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {restaurant.categories.join(" • ")}
                        </p>

                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <Clock size={13} className="text-primary" />
                            {restaurant.deliveryTimeMins} mins
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <ShoppingBag size={13} className="text-primary" />
                            Min Rs.{restaurant.minOrderValue}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium ml-auto">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                restaurant.isOpen ? "bg-success" : "bg-red-500"
                              }`}
                            />
                            {restaurant.isOpen ? "Open" : "Closed"}
                          </div>
                        </div>
                      </div>

                      {/* View Menu CTA */}
                      <div className="px-4 pb-4">
                        <div className="flex items-center justify-center gap-2 bg-navy/5 group-hover:bg-primary group-hover:text-white text-navy rounded-xl py-2.5 font-bold text-sm transition-all">
                          View Menu <ChevronRight size={16} />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </SlideUp>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
