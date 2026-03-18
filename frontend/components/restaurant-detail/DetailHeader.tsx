"use client";

import { MapPin, Star, Clock } from "lucide-react";

export function DetailHeader() {
  return (
    <div className="w-full bg-navy text-white pb-10">
      {/* Background image overlap section */}
      <div className="h-[250px] md:h-[350px] bg-[url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center rounded-b-[40px] md:rounded-b-[80px] shadow-2xl relative">
          <div className="absolute inset-0 bg-black/60 rounded-b-[40px] md:rounded-b-[80px]"></div>
          
          <div className="max-w-7xl mx-auto px-4 lg:px-8 h-full flex flex-col justify-end pb-12 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  
                  {/* Left info */}
                  <div className="flex-1">
                      <p className="text-sm font-medium tracking-wider mb-2 text-gray-300">I&apos;m lovin&apos; it!</p>
                      <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">McDonald&apos;s Gulberg Lahore</h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                          <span className="flex items-center gap-1 border border-white/20 rounded-pill px-3 py-1"><CheckSquare size={16} className="text-success" /> Minimum Order: 15 GBP</span>
                          <span className="flex items-center gap-1 border border-white/20 rounded-pill px-3 py-1"><MapPin size={16} className="text-primary" /> Delivery in 20-25 Minutes</span>
                      </div>
                  </div>

                  {/* Right Rating */}
                  <div className="bg-primary px-8 py-6 rounded-3xl flex flex-col justify-center items-center shadow-lg">
                      <h2 className="text-4xl font-heading font-bold mb-1 text-white">3.4</h2>
                      <div className="flex gap-1 text-warning mb-2">
                          <Star size={18} fill="currentColor" />
                          <Star size={18} fill="currentColor" />
                          <Star size={18} fill="currentColor" />
                          <Star size={18} className="text-white/30" />
                          <Star size={18} className="text-white/30" />
                      </div>
                      <p className="text-white/90 text-sm font-medium">1,360 reviews</p>
                  </div>
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
          <div className="flex items-center justify-between font-medium text-sm">
             <div className="flex items-center gap-6">
                 <p className="text-white/80">Open until <span className="text-white font-bold">3:00 AM</span></p>
             </div>
          </div>
      </div>
    </div>
  );
}

// Quick helper for missing icon above
function CheckSquare({ size, className }: { size: number, className: string }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
}
