"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FadeIn, SlideUp } from "@/components/animations/MotionWrappers";
import { useModal } from "@/context/ModalContext";

export default function Hero() {
  const { openModal } = useModal();
  const router = useRouter();
  const [postcode, setPostcode] = useState("");

  const handleSearch = () => {
    if (postcode.trim()) {
      openModal("POSTCODE");
    } else {
      openModal("POSTCODE");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="w-full bg-background pt-8 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-[#F3F4F6] rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center border border-gray-200">
          
          {/* Left Content */}
          <div className="w-full md:w-1/2 p-8 md:p-16 z-10">
            <FadeIn>
              <p className="text-sm font-medium text-gray-500 mb-2">Order Restaurant food, takeaway and groceries.</p>
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-navy leading-tight mb-6">
                Feast Your Senses, <br/>
                <span className="text-primary">Fast and Fresh</span>
              </h1>
              
              {/* Search Bar */}
              <p className="text-sm font-medium text-gray-600 mb-4">Enter a postcode to see what we deliver</p>
              <div className="flex flex-col sm:flex-row gap-0 max-w-md">
                <div className="flex-grow bg-white rounded-t-pill sm:rounded-t-none sm:rounded-l-pill border border-gray-300 px-6 py-4">
                  <input 
                    type="text" 
                    placeholder="e.g. EC4R 3TE" 
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                    onKeyDown={handleKeyDown}
                    className="w-full outline-none text-foreground font-medium bg-transparent"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-primary text-white font-bold px-8 py-4 rounded-b-pill sm:rounded-b-none sm:rounded-r-pill hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  Search
                </button>
              </div>

              {/* Quick links */}
              <div className="flex flex-wrap gap-2 mt-5">
                {["🍔 Burgers", "🍕 Pizza", "🍗 Chicken", "🌮 Mexican", "☕ Cafe"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => router.push("/menu")}
                    className="bg-white border border-gray-200 text-navy text-sm font-medium px-4 py-2 rounded-pill hover:border-primary hover:text-primary transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right Image area */}
          <div className="w-full md:w-1/2 h-[400px] md:h-[600px] relative bg-primary rounded-bl-[150px] md:rounded-bl-full md:rounded-tl-none overflow-hidden">
             {/* The hero image */}
             <div className="absolute inset-0 flex items-center justify-center pt-10">
                 {/* Replace this with actual generated image later */}
                 <div className="w-[80%] h-[80%] bg-white/20 rounded-full blur-3xl absolute"></div>
                 <img src="/images/hero_eating_pizza.png" alt="Eating Pizza" className="relative z-10 object-contain h-full w-auto drop-shadow-2xl" />
             </div>

             {/* Floating Notification Cards */}
             <SlideUp delay={0.2} className="absolute top-[20%] left-[5%] md:left-[-10%] z-20 bg-white rounded-xl shadow-card p-3 flex items-center gap-3 w-[220px]">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-2xl">🍔</div>
                <div>
                  <p className="text-xs text-primary font-bold">Order Confirmed</p>
                  <p className="text-[10px] text-gray-500 font-medium">Your food is being prepared</p>
                </div>
             </SlideUp>

             <SlideUp delay={0.4} className="absolute bottom-[25%] right-[10%] z-20 bg-white rounded-xl shadow-card p-3 flex items-center gap-3 w-[240px]">
                <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center text-2xl">🛵</div>
                <div>
                  <p className="text-xs text-success font-bold">On the Way</p>
                  <p className="text-[10px] text-gray-500 font-medium">Arriving in 15 mins</p>
                </div>
             </SlideUp>
          </div>
          
        </div>
      </div>
    </section>
  );
}
