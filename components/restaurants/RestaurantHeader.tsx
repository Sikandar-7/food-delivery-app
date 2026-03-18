"use client";

import { Search } from "lucide-react";

export function RestaurantHeader() {
  const tabs = ["Offers", "Burgers", "Fries", "Snacks", "Salads", "Cold drinks", "Happy Meal®", "Desserts", "Hot drinks", "Sauces", "Orbit®"];
  
  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-40 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col gap-4">
        
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-heading font-bold text-navy">McDonald&apos;s Gulberg Lahore</h1>
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-pill px-4 py-2 w-72 focus-within:border-primary transition-colors">
                <Search size={20} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search from menu..." 
                  className="bg-transparent border-none outline-none ml-2 w-full text-foreground"
                />
            </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 hidescrollbar">
            {tabs.map((tab, idx) => (
                <button 
                  key={tab} 
                  className={`whitespace-nowrap px-6 py-2 rounded-pill font-bold text-sm transition-colors ${
                      idx === 0 
                      ? "bg-navy text-white" 
                      : "bg-gray-100 text-navy hover:bg-gray-200"
                  }`}
                >
                    {tab}
                </button>
            ))}
        </div>

      </div>
    </div>
  );
}
