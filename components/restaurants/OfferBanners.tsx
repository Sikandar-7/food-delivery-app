"use client";

import { FadeIn, SlideUp } from "@/components/animations/MotionWrappers";

const offers = [
  { id: 1, title: "First Order Discount", discount: "-20%", bg: "bg-[url('https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop')]" },
  { id: 2, title: "Vegan Discount", discount: "-20%", bg: "bg-[url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop')]" },
  { id: 3, title: "Free ice Cream Offer", discount: "100%", bg: "bg-[url('https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=800&auto=format&fit=crop')]" },
];

export function OfferBanners() {
  return (
    <section className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, idx) => (
            <SlideUp key={offer.id} delay={idx * 0.1}>
              <div className={`relative w-full h-[250px] rounded-2xl overflow-hidden ${offer.bg} bg-cover bg-center shadow-card group cursor-pointer`}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent transition-opacity group-hover:from-black/90"></div>
                
                <div className="absolute top-4 right-4 bg-navy text-white font-bold px-4 py-2 rounded-lg z-10 shadow-lg">
                  {offer.discount}
                </div>

                <div className="absolute bottom-6 left-6 z-10 max-w-[70%]">
                  <p className="text-primary font-bold text-xs mb-1 tracking-wide uppercase bg-black/40 inline-block px-2 py-1 rounded">McDonald&apos;s Gulberg Lahore</p>
                  <h3 className="text-white font-heading font-bold text-2xl leading-tight mt-1">{offer.title}</h3>
                </div>
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}
