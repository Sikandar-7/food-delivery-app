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
                    <img src="/vectors/order_logo.svg" alt="Order.pk" className="h-16 inline-block mr-2" />
                    ing is more
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
                 <div className="w-[300px] h-[500px] bg-white rounded-[40px] border-8 border-gray-100 shadow-2xl relative overflow-hidden flex items-center justify-center">
                     {/* Mockup Screen Content */}
                     <div className="absolute top-0 w-32 h-6 bg-gray-100 rounded-b-xl z-20"></div>
                     <div className="text-center font-heading font-bold text-gray-400">
                        App Screenshot <br/> Placeholder
                     </div>
                 </div>
             </div>

          </div>
        </SlideUp>
      </div>
    </section>
  );
}
