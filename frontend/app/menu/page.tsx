"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { menuByRestaurant, restaurants } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";
import { FadeIn, SlideUp } from "@/components/animations/MotionWrappers";
import Link from "next/link";
import { toast } from "sonner";

// Flatten all menu items 
const allItems = Object.entries(menuByRestaurant).flatMap(([restaurantId, categories]) =>
  categories.flatMap((cat) =>
    cat.products.map((p) => ({
      ...p,
      restaurantId,
      categoryTitle: cat.title,
      restaurantName: restaurants.find((r) => r.id === restaurantId)?.name || "",
    }))
  )
);

const categoryFilters = ["All", ...Array.from(new Set(allItems.map((i) => i.categoryTitle)))];

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { dispatch } = useCart();

  const filtered = allItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.restaurantName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "All" || item.categoryTitle === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleAdd = (item: typeof allItems[0]) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { 
        id: `${item.id}-${Date.now()}`, // Force unique ID so duplicates can be added if needed, or rely on CartContext grouping
        name: item.name, 
        price: item.price, 
        quantity: 1 
      },
    });
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-navy text-white py-14 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-heading font-black mb-4">Browse All Menu Items</h1>
            <p className="text-white/70 text-lg mb-8">
              {allItems.length} items from {restaurants.length} restaurants
            </p>

            {/* Search */}
            <div className="max-w-lg mx-auto flex bg-white rounded-pill overflow-hidden shadow-xl">
              <div className="flex items-center gap-2 flex-1 px-5">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search food, restaurant..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 py-4 outline-none text-navy font-medium bg-transparent placeholder:text-gray-400"
                />
              </div>
              <button className="bg-primary text-white px-7 font-bold hover:bg-primary/90 transition">
                Search
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      <main className="flex-grow">
        {/* Filter tabs */}
        <section className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
            {categoryFilters.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-pill text-sm font-bold transition flex-shrink-0 ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-navy hover:bg-gray-200"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-navy font-medium">
              <span className="font-black">{filtered.length}</span> items found
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-xl font-bold text-navy">No items found</p>
              <p className="text-gray-500 mt-2">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((item, idx) => (
                <SlideUp key={item.id} delay={idx * 0.03}>
                  <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                    <div className="relative h-44 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <Link
                        href={`/restaurants/${item.restaurantId}`}
                        className="text-xs text-primary font-bold hover:underline mb-1"
                      >
                        {item.restaurantName}
                      </Link>
                      <h3 className="font-bold text-navy text-sm leading-tight flex-1">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-black text-navy text-lg">
                          Rs.{item.price.toFixed(2)}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAdd(item)}
                          className="bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-primary/90 shadow-md transition"
                        >
                          <Plus size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </SlideUp>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
