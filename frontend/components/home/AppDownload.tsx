"use client";

import { FadeIn, SlideUp } from "@/components/animations/MotionWrappers";
import Image from "next/image";

export default function AppDownload() {
  return (
    <section className="w-full bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SlideUp className="w-full bg-cover bg-center rounded-3xl overflow-hidden relative shadow-lg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop')" }}>
          <div className="absolute inset-0 bg-black/60 flex flex-col md:flex-row items-center justify-between p-10 md:p-16">
             
             {/* Left Text Content */}
             <div className="text-white z-10 text-center md:text-left md:w-1/2">
                <h2 className="text-5xl md:text-6xl font-heading font-bold mb-4 drop-shadow-md">
                    <span className="text-primary">Order</span>ing is more
                </h2>
                <h3 className="text-4xl md:text-5xl font-bold font-heading mb-4 drop-shadow-md">
                    <span className="text-primary underline decoration-primary underline-offset-8">Personalised</span> & Instant
                </h3>
                <p className="text-lg md:text-xl font-medium mb-8">Download the Order.pk app for faster ordering</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-[50px] cursor-pointer hover:opacity-90 transition-opacity" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-[50px] cursor-pointer hover:opacity-90 transition-opacity" />
                </div>
             </div>

             {/* Right Phone Mockup Placeholder */}
             <div className="hidden md:flex md:w-1/2 justify-end z-10 relative">
                 <div className="w-[300px] h-[500px] bg-background rounded-[40px] border-8 border-gray-100 shadow-2xl relative overflow-hidden">
                     {/* Phone notch */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
                     {/* Mini in-app order screen */}
                     <div className="pt-10 px-4 text-left">
                        <p className="font-heading font-black text-navy text-lg">Order<span className="text-primary">🔥</span></p>
                        <div className="mt-4 bg-white rounded-2xl shadow-card p-3 flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">🍔</div>
                           <div className="flex-1">
                              <p className="text-navy font-bold text-sm leading-tight">Zinger Burger</p>
                              <p className="text-gray-500 text-xs">Rs.450</p>
                           </div>
                           <div className="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">+</div>
                        </div>
                        <div className="mt-3 bg-white rounded-2xl shadow-card p-3 flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">🍕</div>
                           <div className="flex-1">
                              <p className="text-navy font-bold text-sm leading-tight">Pizza Special</p>
                              <p className="text-gray-500 text-xs">Rs.1,200</p>
                           </div>
                           <div className="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">+</div>
                        </div>
                        <div className="mt-4 bg-success text-white rounded-pill py-3 text-center font-bold text-sm">
                           Checkout · Rs.1,650
                        </div>
                        <div className="mt-3 bg-white rounded-2xl shadow-card p-3 flex items-center gap-2 text-xs">
                           <span className="text-lg">🛵</span>
                           <span className="text-navy font-bold">On the way</span>
                           <span className="text-gray-400 ml-auto">15 min</span>
                        </div>
                     </div>
                 </div>
             </div>

          </div>
        </SlideUp>
      </div>
    </section>
  );
}
