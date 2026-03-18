"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Package, CheckCircle2, Clock, Truck, MapPin, ChevronRight } from "lucide-react";
import { FadeIn, SlideUp } from "@/components/animations/MotionWrappers";
import Link from "next/link";

const ORDER_STATUSES = [
  { id: "placed", label: "Order Placed", icon: "📋", description: "We've received your order!", time: "12:05 PM" },
  { id: "accepted", label: "Order Accepted", icon: "✅", description: "The restaurant has accepted your order.", time: "12:08 PM" },
  { id: "preparing", label: "Being Prepared", icon: "👨‍🍳", description: "The chef is preparing your delicious meal!", time: "12:15 PM" },
  { id: "onway", label: "Out for Delivery", icon: "🛵", description: "Your rider is on the way!", time: "12:32 PM" },
  { id: "delivered", label: "Delivered", icon: "🎉", description: "Enjoy your meal!", time: "" },
];

const DEMO_ORDER = {
  id: "ORD-00124",
  restaurant: "McDonald's Gulberg Lahore",
  items: [
    { name: "Royal Cheese Burger", qty: 1, price: 23.10 },
    { name: "Large Fries", qty: 2, price: 4.50 },
    { name: "Coca Cola", qty: 2, price: 2.50 },
  ],
  total: 37.10,
  rider: { name: "Ahmed K.", rating: 4.8, vehicle: "Honda CB500" },
  eta: "12:45 PM",
};

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [tracking, setTracking] = useState(true);
  const [currentStep, setCurrentStep] = useState(3); // 0-indexed

  const handleTrack = () => {
    if (orderNumber.trim() || true) { // Demo: always show tracking
      setTracking(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-navy text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <div className="text-5xl mb-4">🛵</div>
            <h1 className="text-4xl md:text-5xl font-heading font-black mb-3">Track Your Order</h1>
            <p className="text-white/70 text-lg">Enter your order number to see real-time updates</p>
          </FadeIn>
        </div>
      </section>

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-10">

          {/* Search bar */}
          <FadeIn>
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-8">
              <label className="block font-bold text-navy mb-2">Order Number</label>
              <div className="flex gap-3">
                <input
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. ORD-00124"
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 font-mono text-navy focus:border-primary outline-none transition"
                />
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleTrack}
                  className="bg-primary text-white font-black px-8 rounded-xl hover:bg-primary/90 transition"
                >
                  Track
                </motion.button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Try our demo: click <strong>Track</strong> to see a live order status example
              </p>
            </div>
          </FadeIn>

          <AnimatePresence>
            {tracking && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Order header card */}
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Order ID</p>
                      <p className="font-mono font-black text-navy text-xl">{DEMO_ORDER.id}</p>
                      <p className="text-sm text-gray-500 mt-1">{DEMO_ORDER.restaurant}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 font-medium">Estimated Arrival</p>
                      <p className="text-3xl font-black text-primary">{DEMO_ORDER.eta}</p>
                    </div>
                  </div>
                </div>

                {/* Status stepper */}
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-6">
                  <h2 className="font-heading font-black text-navy text-xl mb-6">Order Progress</h2>
                  <div className="relative">
                    {/* Progress line */}
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />
                    <div
                      className="absolute left-5 top-0 w-0.5 bg-primary transition-all duration-1000"
                      style={{ height: `${(currentStep / (ORDER_STATUSES.length - 1)) * 100}%` }}
                    />

                    <div className="space-y-6">
                      {ORDER_STATUSES.map((status, idx) => {
                        const isComplete = idx <= currentStep;
                        const isCurrent = idx === currentStep;
                        return (
                          <SlideUp key={status.id} delay={idx * 0.1}>
                            <div className="flex items-start gap-5 pl-1 relative">
                              {/* Dot */}
                              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all ${
                                isComplete ? "bg-primary shadow-lg shadow-primary/30" : "bg-gray-100"
                              } ${isCurrent ? "ring-4 ring-primary/30" : ""}`}>
                                {isComplete ? (idx < currentStep ? <CheckCircle2 size={16} className="text-white" /> : <span>{status.icon}</span>) : <span className="text-gray-400 text-xs">{idx + 1}</span>}
                              </div>
                              <div className={`flex-1 pb-1 ${isComplete ? "" : "opacity-40"}`}>
                                <div className="flex items-center justify-between">
                                  <p className={`font-bold text-sm ${isCurrent ? "text-primary" : "text-navy"}`}>{status.label}</p>
                                  {status.time && <p className="text-xs text-gray-400">{status.time}</p>}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{status.description}</p>
                              </div>
                            </div>
                          </SlideUp>
                        );
                      })}
                    </div>
                  </div>

                  {/* Advance demo button */}
                  {currentStep < ORDER_STATUSES.length - 1 && (
                    <button
                      onClick={() => setCurrentStep((s) => Math.min(s + 1, ORDER_STATUSES.length - 1))}
                      className="mt-6 w-full text-xs text-gray-400 hover:text-primary transition font-medium border border-dashed border-gray-200 rounded-xl py-2"
                    >
                      Simulate next step →
                    </button>
                  )}
                </div>

                {/* Rider card */}
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-6">
                  <h2 className="font-heading font-black text-navy text-lg mb-4">Your Rider</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center text-2xl">🏍️</div>
                    <div className="flex-1">
                      <p className="font-bold text-navy">{DEMO_ORDER.rider.name}</p>
                      <p className="text-xs text-gray-500">{DEMO_ORDER.rider.vehicle}</p>
                      <div className="flex items-center gap-1 mt-1 text-warning">
                        {"★".repeat(5)} <span className="text-xs text-gray-500 ml-1">{DEMO_ORDER.rider.rating}</span>
                      </div>
                    </div>
                    <a href="tel:+44000000000" className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition">
                      Call Rider
                    </a>
                  </div>
                </div>

                {/* Order summary */}
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-6">
                  <h2 className="font-heading font-black text-navy text-lg mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    {DEMO_ORDER.items.map((item) => (
                      <div key={item.name} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.qty}x {item.name}</span>
                        <span className="font-bold text-navy">Rs.{(item.qty * item.price).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-navy">
                      <span>Total</span>
                      <span>Rs.{DEMO_ORDER.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Link href="/restaurants">
                  <motion.div whileHover={{ scale: 1.01 }} className="bg-navy text-white rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:bg-navy/90 transition">
                    <div>
                      <p className="font-bold">Order Again?</p>
                      <p className="text-sm text-white/60">Browse all restaurants</p>
                    </div>
                    <ChevronRight className="text-primary" size={24} />
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
