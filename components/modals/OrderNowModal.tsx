"use client";

import { useModal } from "@/context/ModalContext";
import { ArrowRight } from "lucide-react";

export function OrderNowModal() {
  const { openModal, closeModal } = useModal();

  return (
    <div className="p-8 md:p-12 text-center max-w-md mx-auto w-full">
      <h2 className="text-3xl font-heading font-bold text-navy mb-8">How would you like to receive your order?</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <button className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-4 hover:border-primary hover:bg-primary/5 transition group">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                🛵
             </div>
             <div>
                <h3 className="font-bold text-navy">Delivery</h3>
                <p className="text-xs text-gray-500 mt-1">Delivered to your door</p>
             </div>
         </button>

         <button className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-4 hover:border-primary hover:bg-primary/5 transition group">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                🛍️
             </div>
             <div>
                <h3 className="font-bold text-navy">Collection</h3>
                <p className="text-xs text-gray-500 mt-1">Pick up from store</p>
             </div>
         </button>
      </div>

      <button 
        onClick={() => {
          closeModal();
          // Short timeout to allow first modal to close smoothly before opening checkout
          setTimeout(() => {
            openModal("CHECKOUT");
          }, 300);
        }}
        className="w-full bg-success text-white font-bold py-4 rounded-xl hover:bg-success/90 transition-colors mt-8 flex items-center justify-center gap-2"
      >
        Proceed to Payment <ArrowRight size={20} />
      </button>
    </div>
  );
}
