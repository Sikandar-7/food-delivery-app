"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Star, Clock, ShoppingBag, ChevronLeft, ChevronRight, Plus, Minus, Truck } from "lucide-react";
import { restaurants, menuByRestaurant, reviews, deliverySchedule, Restaurant, MenuCategory } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { useModal } from "@/context/ModalContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reviews } from "@/components/restaurant-detail/Reviews";
import { SimilarRestaurants } from "@/components/restaurant-detail/SimilarRestaurants";
import { DeliveryInfo } from "@/components/restaurant-detail/DeliveryInfo";
import { MapSection } from "@/components/restaurant-detail/MapSection";
import { FadeIn, SlideUp } from "@/components/animations/MotionWrappers";

const STAR_CHARS = [1, 2, 3, 4, 5];

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {STAR_CHARS.map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(rating) ? "text-warning fill-warning" : "text-gray-300 fill-gray-200"}
        />
      ))}
    </span>
  );
}

export default function RestaurantDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const restaurant: Restaurant | undefined = restaurants.find((r) => r.id === id);
  const menuData: MenuCategory[] = menuByRestaurant[id] || [];

  const [activeCategory, setActiveCategory] = useState(menuData[0]?.title || "");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "collection">("delivery");
  const [coupon, setCoupon] = useState("");
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { state, dispatch } = useCart();
  const { openModal } = useModal();

  const MINIMUM_ORDER = restaurant?.minOrder || 12;
  const remaining = Math.max(0, MINIMUM_ORDER - state.subTotal);

  const scrollToCategory = (title: string) => {
    setActiveCategory(title);
    const el = categoryRefs.current[title];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAdd = (product: { id: string; name: string; price: number }) => {
    dispatch({ type: "ADD_ITEM", payload: { id: product.id, name: product.name, price: product.price, quantity: 1 } });
    setQuantities((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
  };

  const handleRemove = (productId: string) => {
    const item = state.items.find((i) => i.id === productId);
    if (item && item.quantity > 0) {
      dispatch({ type: "REMOVE_ITEM", payload: productId });
      setQuantities((prev) => {
        const next = { ...prev };
        if (next[productId] > 0) next[productId]--;
        return next;
      });
    }
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4">🍽️</p>
            <h1 className="text-2xl font-heading font-bold text-navy">Restaurant Not Found</h1>
            <Link href="/restaurants" className="mt-4 inline-block text-primary hover:underline font-medium">
              ← Back to Restaurants
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Restaurant Header Banner */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-4 left-4 flex items-center gap-2 text-white/80 text-sm">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight size={14} />
          <Link href="/restaurants" className="hover:text-white">Restaurants</Link>
          <ChevronRight size={14} />
          <span className="text-white font-medium truncate">{restaurant.name}</span>
        </div>

        {/* Restaurant Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-heading font-black text-white drop-shadow-lg">
              {restaurant.name}
            </h1>
            <p className="text-white/80 mt-1 font-medium">{restaurant.cuisine}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="bg-white/20 backdrop-blur-sm text-white text-sm font-bold px-4 py-1.5 rounded-pill flex items-center gap-2">
                <Truck size={14} />
                Min Order: Rs.{restaurant.minOrder}
              </div>
              <div className="bg-white/20 backdrop-blur-sm text-white text-sm font-bold px-4 py-1.5 rounded-pill flex items-center gap-2">
                <Clock size={14} />
                {restaurant.deliveryTime}
              </div>
              <div className="bg-success text-white text-sm font-bold px-4 py-1.5 rounded-pill">
                Open until {restaurant.closeTime}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
              <p className="text-4xl font-black text-white">{restaurant.rating}</p>
              <StarRating rating={restaurant.rating} />
              <p className="text-white/70 text-xs mt-1">({restaurant.reviewCount.toLocaleString()} reviews)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tab Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-2">
            <button
              onClick={() => openModal("MEAL_DEAL")}
              className="whitespace-nowrap px-5 py-2 rounded-pill text-sm font-bold bg-primary/10 text-primary border border-primary/20 flex-shrink-0 hover:bg-primary hover:text-white transition"
            >
              🔥 Offers
            </button>
            {menuData.map((cat) => (
              <button
                key={cat.title}
                onClick={() => scrollToCategory(cat.title)}
                className={`whitespace-nowrap px-5 py-2 rounded-pill text-sm font-bold transition-all flex-shrink-0 ${
                  activeCategory === cat.title
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-navy hover:bg-gray-200"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── Left: Menu Sidebar + Products ── */}
            <div className="w-full lg:w-[68%]">
              {/* Menu sidebar for desktop */}
              <div className="hidden lg:flex gap-6">
                {/* Category sidebar */}
                <div className="w-44 flex-shrink-0">
                  <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-3 sticky top-24">
                    <p className="font-bold text-xs text-gray-400 uppercase tracking-wider px-3 mb-3">🍽️ Menu</p>
                    {menuData.map((cat) => (
                      <button
                        key={cat.title}
                        onClick={() => scrollToCategory(cat.title)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          activeCategory === cat.title
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-navy hover:bg-gray-50"
                        }`}
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Products */}
                <div className="flex-1 space-y-10">
                  {menuData.map((category) => (
                    <div
                      key={category.title}
                      ref={(el) => { categoryRefs.current[category.title] = el; }}
                      id={`cat-${category.title}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-heading font-black text-navy flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${category.color}`} />
                          {category.title}
                        </h2>
                      </div>
                      <div className="space-y-4">
                        {category.products.map((product, idx) => (
                          <SlideUp key={product.id} delay={idx * 0.05}>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex gap-4">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-28 h-24 object-cover rounded-xl flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-navy text-base leading-snug">{product.name}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                  <StarRating rating={product.rating || 4.5} size={11} />
                                  <span className="text-xs text-gray-400">({product.rating || 4.5})</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>

                                {/* Sizes */}
                                {product.sizes && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {product.sizes.map((size) => (
                                      <button
                                        key={size.label}
                                        onClick={() => handleAdd({ ...product, price: size.price, name: `${product.name} (${size.label})` })}
                                        className="text-xs border-2 border-primary text-primary font-bold px-3 py-1 rounded-pill hover:bg-primary hover:text-white transition"
                                      >
                                        {size.label} Rs.{size.price.toFixed(2)}
                                      </button>
                                    ))}
                                  </div>
                                )}

                                <div className="flex items-center justify-between mt-3">
                                  <span className="font-black text-navy text-lg">Rs.{product.price.toFixed(2)}</span>
                                  {/* Qty controls */}
                                  {quantities[product.id] ? (
                                    <div className="flex items-center gap-2 bg-navy rounded-pill px-2 py-1">
                                      <button onClick={() => handleRemove(product.id)} className="text-white hover:text-primary transition">
                                        <Minus size={16} />
                                      </button>
                                      <span className="text-white font-bold w-5 text-center">{quantities[product.id]}</span>
                                      <button onClick={() => handleAdd(product)} className="text-white hover:text-primary transition">
                                        <Plus size={16} />
                                      </button>
                                    </div>
                                  ) : (
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleAdd(product)}
                                      className="bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-primary/90 shadow-md"
                                    >
                                      <Plus size={18} />
                                    </motion.button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </SlideUp>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile: No sidebar, just products */}
              <div className="lg:hidden space-y-8">
                {menuData.map((category) => (
                  <div key={category.title}>
                    <h2 className="text-xl font-heading font-black text-navy mb-4 flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${category.color}`} />
                      {category.title}
                    </h2>
                    <div className="space-y-3">
                      {category.products.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-navy text-sm">{product.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-black text-navy">Rs.{product.price.toFixed(2)}</span>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleAdd(product)} className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center">
                                <Plus size={16} />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Cart Sidebar ── */}
            <div className="hidden lg:block w-full lg:w-[32%] sticky top-24">
              <FadeIn delay={0.2}>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
                  {/* Header */}
                  <div className="bg-success text-white p-4 flex items-center gap-3">
                    <div className="text-2xl">🛒</div>
                    <h3 className="font-heading font-black text-xl">My Basket</h3>
                  </div>

                  {/* Items */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                    {state.items.length === 0 ? (
                      <div className="py-12 text-center text-gray-400">
                        <p className="text-4xl mb-2">🛒</p>
                        <p className="font-medium">Your basket is empty</p>
                        <p className="text-sm">Add items from the menu</p>
                      </div>
                    ) : (
                      state.items.map((item) => (
                        <div key={item.id} className="flex gap-3 p-4">
                          <div className="bg-primary text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            {item.quantity}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-navy text-sm">{item.name}</p>
                            {item.customization && <p className="text-xs text-gray-400">{item.customization}</p>}
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="font-bold text-success text-sm">Rs.{(item.price * item.quantity).toFixed(2)}</span>
                            <button onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })} className="text-gray-300 hover:text-error transition">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Totals */}
                  {state.items.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-2 text-sm font-medium">
                      <div className="flex justify-between text-navy"><span>Sub Total</span><span>Rs.{state.subTotal.toFixed(2)}</span></div>
                      {state.discount > 0 && <div className="flex justify-between text-error"><span>Discounts</span><span>-Rs.{state.discount.toFixed(2)}</span></div>}
                      <div className="flex justify-between text-navy"><span>Delivery Fee</span><span>Rs.{state.deliveryFee.toFixed(2)}</span></div>
                    </div>
                  )}

                  {/* Coupon */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Apply Coupon Code here"
                        className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-primary transition"
                      />
                      <button className="bg-primary text-white px-4 rounded-xl hover:bg-primary/90 transition text-sm font-bold">
                        →
                      </button>
                    </div>
                  </div>

                  {/* Delivery / Collection Tabs */}
                  <div className="px-4 pb-2">
                    <div className="grid grid-cols-2 bg-gray-100 rounded-pill p-1">
                      {(["delivery", "collection"] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setDeliveryMode(mode)}
                          className={`py-2 rounded-pill text-sm font-bold capitalize transition-all ${
                            deliveryMode === mode ? "bg-white text-navy shadow-sm" : "text-gray-500"
                          }`}
                        >
                          {mode === "delivery" ? "🛵 Delivery" : "🏪 Collection"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Minimum warning */}
                  <AnimatePresence>
                    {state.subTotal > 0 && remaining > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mx-4 mb-3"
                      >
                        <div className="bg-navy text-white text-xs font-medium p-3 rounded-xl flex items-start gap-2">
                          <span className="mt-0.5">⚠️</span>
                          <span>
                            Minimum delivery is Rs.{MINIMUM_ORDER}. You must spend{" "}
                            <span className="text-primary font-bold">Rs.{remaining.toFixed(2)} more</span> for checkout!
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Checkout Button */}
                  <div className="p-4 pt-1">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => openModal("ORDER_NOW")}
                      disabled={state.items.length === 0 || remaining > 0}
                      className="w-full bg-primary text-white font-black py-4 rounded-xl text-base flex items-center justify-center gap-2 hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                    >
                      → Checkout! · Rs.{state.total.toFixed(2)}
                    </motion.button>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* Below sections */}
        <DeliveryInfo />
        <MapSection />
        <Reviews />
        <SimilarRestaurants currentId={id} />
      </main>

      {/* Mobile Sticky Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-2xl">
        {state.items.length > 0 ? (
          <button
            onClick={() => openModal("ORDER_NOW")}
            className="w-full bg-primary text-white font-black py-4 rounded-xl text-base flex items-center justify-between px-5"
          >
            <span className="bg-white/20 rounded-pill px-3 py-1 text-sm">{state.items.length} items</span>
            <span>View Basket</span>
            <span>Rs.{state.total.toFixed(2)}</span>
          </button>
        ) : (
          <p className="text-center text-gray-400 font-medium text-sm py-2">Add items to start your order</p>
        )}
      </div>

      <Footer />
    </div>
  );
}
