"use client";

import { useCart } from "@/context/CartContext";
import { useModal } from "@/context/ModalContext";
import { FadeIn } from "@/components/animations/MotionWrappers";
import { Trash2, ArrowRight } from "lucide-react";

export function CartSidebar() {
  const { state, dispatch } = useCart();
  const { openModal } = useModal();

  const handleCheckout = () => {
    openModal("ORDER_NOW");
  };

  return (
    <FadeIn delay={0.2} className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[700px] sticky top-24">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">🛒</div>
        <h3 className="font-heading font-bold text-2xl">My Basket</h3>
      </div>

      {/* Items List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {state.items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 font-medium">
            Your basket is empty
          </div>
        ) : (
          state.items.map((item) => (
            <div key={`${item.id}-${item.customization}`} className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">
                  {item.quantity}x
                </div>
                <div>
                  <h4 className="font-bold text-navy text-sm">{item.name}</h4>
                  {item.customization && <p className="text-xs text-gray-500 mt-1">{item.customization}</p>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="font-bold text-navy">Rs.{(item.price * item.quantity).toFixed(2)}</span>
                <button 
                  onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                  className="text-gray-400 hover:text-error transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3 font-medium">
        <div className="flex justify-between text-navy">
          <span>Sub Total</span>
          <span>Rs.{state.subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-navy">
          <span>Discounts</span>
          <span>-Rs.{state.discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-navy">
          <span>Delivery Fee</span>
          <span>Rs.{state.deliveryFee.toFixed(2)}</span>
        </div>
      </div>

      {/* Total & Checkout */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="font-heading font-bold text-xl text-navy">Total to pay</span>
          <span className="font-heading font-bold text-2xl text-navy">Rs.{state.total.toFixed(2)}</span>
        </div>

        {/* Validation Warning */}
        {state.subTotal > 0 && state.subTotal < 15 && (
            <div className="bg-orange-50 text-orange-600 text-xs font-medium p-3 rounded-lg mb-4 flex items-center gap-2">
                <span>⚠️</span> You need Rs.{(15 - state.subTotal).toFixed(2)} more to reach the minimum order.
            </div>
        )}
        
        {/* Choose Delivery or Collection Button */}
        <div className="grid grid-cols-2 bg-gray-100 rounded-pill p-1 mb-4">
            <button className="bg-white text-navy font-bold rounded-pill py-2 shadow-sm text-center transition">Delivery</button>
            <button className="text-gray-500 font-medium rounded-pill py-2 text-center hover:text-navy transition">Collection</button>
        </div>

        <button 
          onClick={handleCheckout}
          disabled={state.items.length === 0 || state.subTotal < 15}
          className="w-full bg-success text-white font-bold py-4 rounded-xl hover:bg-success/90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <ArrowRight className="bg-white/20 p-1 rounded-full" size={24} />
          Checkout!
        </button>
      </div>
    </FadeIn>
  );
}
