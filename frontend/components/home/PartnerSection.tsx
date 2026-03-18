"use client";

import { SlideUp } from "@/components/animations/MotionWrappers";

export default function PartnerSection() {
  return (
    <section className="w-full bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Become a Partner */}
          <SlideUp delay={0.1}>
            <div className="relative w-full h-[350px] rounded-3xl overflow-hidden bg-cover bg-center shadow-lg group cursor-pointer" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop')" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 group-hover:from-black/90 transition-all duration-300"></div>
              
              <div className="absolute top-6 left-6 bg-white text-navy font-bold px-4 py-2 rounded-lg text-sm z-10">
                Earn more with lower fees
              </div>

              <div className="absolute bottom-8 left-8 right-8 z-10 space-y-4">
                <p className="text-primary font-bold text-sm tracking-wide uppercase">Signup as a business</p>
                <h3 className="text-white font-heading font-bold text-4xl leading-tight">Partner with us</h3>
                <button className="bg-primary text-white font-bold px-8 py-3 rounded-pill hover:bg-primary/90 transition-colors mt-2">
                  Get Started
                </button>
              </div>
            </div>
          </SlideUp>

          {/* Ride with us */}
          <SlideUp delay={0.2}>
            <div className="relative w-full h-[350px] rounded-3xl overflow-hidden bg-cover bg-center shadow-lg group cursor-pointer" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?q=80&w=1000&auto=format&fit=crop')" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 group-hover:from-black/90 transition-all duration-300"></div>
              
              <div className="absolute top-6 left-6 bg-white text-navy font-bold px-4 py-2 rounded-lg text-sm z-10">
                Avail exclusive perks
              </div>

              <div className="absolute bottom-8 left-8 right-8 z-10 space-y-4">
                <p className="text-primary font-bold text-sm tracking-wide uppercase">Signup as a rider</p>
                <h3 className="text-white font-heading font-bold text-4xl leading-tight">Ride with us</h3>
                <button className="bg-primary text-white font-bold px-8 py-3 rounded-pill hover:bg-primary/90 transition-colors mt-2">
                  Get Started
                </button>
              </div>
            </div>
          </SlideUp>

        </div>
      </div>
    </section>
  );
}
