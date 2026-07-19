"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/lib/api";
import { menuByRestaurant, restaurants } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { FadeIn, SlideUp } from "@/components/animations/MotionWrappers";
import Link from "next/link";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  image: string | null;
  price: number;
  categoryTitle: string;
  restaurantId: string;
  restaurantName: string;
  restaurantSlug: string;
}

// Used only if the API is unreachable, so the page never renders empty
const fallbackItems: MenuItem[] = Object.entries(menuByRestaurant).flatMap(([restaurantId, categories]) =>
  categories.flatMap((cat) =>
    cat.products.map((p) => {
      const r = restaurants.find((x) => x.id === restaurantId);
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        image: p.image,
        price: p.price,
        categoryTitle: cat.title,
        restaurantId,
        restaurantName: r?.name || "",
        restaurantSlug: r?.slug || restaurantId,
      };
    })
  )
);

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { dispatch } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/menu");
        if (res.data.success && res.data.data.length > 0) {
          setItems(res.data.data);
        } else {
          setItems(fallbackItems);
        }
      } catch (err) {
        console.error("Failed to load menu, using fallback", err);
        setItems(fallbackItems);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categoryFilters = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.categoryTitle)))],
    [items]
  );

  const restaurantCount = useMemo(
    () => new Set(items.map((i) => i.restaurantName)).size,
    [items]
  );

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const q = search.toLowerCase();
        const matchesSearch =
          item.name.toLowerCase().includes(q) ||
          (item.description || "").toLowerCase().includes(q) ||
          item.restaurantName.toLowerCase().includes(q);
        const matchesCat = activeCategory === "All" || item.categoryTitle === activeCategory;
        return matchesSearch && matchesCat;
      }),
    [items, search, activeCategory]
  );

  const handleAdd = (item: MenuItem) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: `${item.id}-${Date.now()}`,
        name: item.name,
        price: item.price,
        quantity: 1,
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
              {loading ? "Loading menu…" : `${items.length} items from ${restaurantCount} restaurants`}
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
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="h-44 skeleton" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-1/3 skeleton rounded" />
                    <div className="h-4 w-2/3 skeleton rounded" />
                    <div className="h-3 w-full skeleton rounded" />
                    <div className="h-6 w-1/3 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
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
                        <div className="relative h-44 overflow-hidden bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image || "/images/hero_eating_pizza.png"}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <Link
                            href={`/restaurants/${item.restaurantSlug}`}
                            className="text-xs text-primary font-bold hover:underline mb-1"
                          >
                            {item.restaurantName}
                          </Link>
                          <h3 className="font-bold text-navy text-sm leading-tight flex-1">{item.name}</h3>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="font-black text-navy text-lg">Rs.{item.price.toFixed(2)}</span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAdd(item)}
                              aria-label={`Add ${item.name} to cart`}
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
