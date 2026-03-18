"use client";

import { useCart } from "@/context/CartContext";
import { useModal } from "@/context/ModalContext";
import { useOrder } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBasket, CreditCard, Banknote } from "lucide-react";
import { useState } from "react";

export function CartDrawer() {
  const { state, dispatch } = useCart();
  const { closeModal, openModal } = useModal();
  const { placeOrder } = useOrder();
  const { isLoggedIn } = useAuth();
  const [form, setForm] = useState({
    house: "House 42",
    street: "Main Boulevard, Gulberg",
    zip: "54000",
    phone: "0300 1234567",
    email: "demo@order.pk",
    cardNumber: "4242 4242 4242 4242",
    expiryDate: "12/26",
    cvc: "123"
  });

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };
  const [step, setStep] = useState<"cart" | "address" | "placed">("cart");
  const [method, setMethod] = useState<"card" | "cod">("card");
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      closeModal();
      setTimeout(() => openModal("AUTH"), 200);
      return;
    }
    if (state.subTotal < 15) return;
    setStep("address");
  };

  const handlePlaceOrder = () => {
    if (!form.house || !form.street || !form.phone) {
      alert("Please fill in all required delivery details (House, Street, Phone)");
      return;
    }
    const fullAddress = `${form.house}, ${form.street}, ${form.zip ? form.zip : ''}`;
    const order = placeOrder(state.items, state.total, fullAddress);
    setPlacedOrderId(order.id);
    dispatch({ type: "CLEAR_CART" });
    setStep("placed");
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex justify-end"
        onClick={closeModal}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white flex flex-col h-full shadow-2xl"
        >
          {/* Header */}
          <div className="bg-primary px-6 py-5 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <ShoppingBasket size={24} />
              <div>
                <h2 className="font-heading font-bold text-xl">My Basket</h2>
                <p className="text-white/80 text-sm">{state.items.length} item(s)</p>
              </div>
            </div>
            <button onClick={closeModal} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
              <X size={20} />
            </button>
          </div>

          {step === "cart" && (
            <>
              {/* Items */}
              <div className="flex-grow overflow-y-auto p-5 space-y-4">
                {state.items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-16">
                    <div className="text-7xl">🛒</div>
                    <h3 className="font-heading font-bold text-navy text-2xl">Your basket is empty</h3>
                    <p className="text-gray-500">Add some delicious food first!</p>
                    <button
                      onClick={closeModal}
                      className="px-8 py-3 bg-primary text-white rounded-pill font-bold hover:bg-primary/90 transition"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  state.items.map((item) => (
                    <div key={`${item.id}-${item.customization}`} className="bg-gray-50 rounded-2xl p-4 flex gap-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-navy text-sm">{item.name}</h4>
                        {item.customization && <p className="text-xs text-gray-500 mt-1">{item.customization}</p>}
                        <p className="font-bold text-primary mt-2">Rs.{(item.price * item.quantity).toFixed(2)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center justify-between">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              dispatch({ type: "REMOVE_ITEM", payload: item.id });
                            } else {
                              dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity - 1 } });
                            }
                          }}
                          className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-navy hover:border-primary hover:text-primary transition"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-navy text-sm">{item.quantity}</span>
                        <button
                          onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity + 1 } })}
                          className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                        className="text-gray-400 hover:text-error transition self-start"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {state.items.length > 0 && (
                <div className="p-5 border-t border-gray-100 bg-white space-y-3">
                  <div className="space-y-2 text-sm font-medium">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span><span>Rs.{state.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Discount</span><span className="text-success">-Rs.{state.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span><span>Rs.{state.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-navy text-base border-t border-gray-100 pt-2">
                      <span>Total</span><span>Rs.{state.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {state.subTotal < 15 && (
                    <div className="bg-orange-50 text-orange-600 text-xs font-medium p-3 rounded-lg">
                      ⚠️ Add Rs.{(15 - state.subTotal).toFixed(2)} more to reach minimum order
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={state.subTotal < 15}
                    className="w-full bg-success text-white font-bold py-4 rounded-xl hover:bg-success/90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed to Checkout <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}

          {step === "address" && (
            <div className="flex-grow p-6 flex flex-col gap-5 overflow-y-auto">
              <h3 className="font-heading font-bold text-navy text-2xl">Checkout Details</h3>
              
              <div className="space-y-4">
                <p className="font-bold text-navy border-b border-gray-100 pb-2">Delivery Address</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">House / Apt No.*</label>
                    <input required value={form.house} onChange={(e) => handleInputChange('house', e.target.value)} type="text" placeholder="e.g. 42" className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Street / Block*</label>
                    <input required value={form.street} onChange={(e) => handleInputChange('street', e.target.value)} type="text" placeholder="e.g. Street 10, Gulberg" className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-primary text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Zip Code</label>
                    <input value={form.zip} onChange={(e) => handleInputChange('zip', e.target.value.replace(/[^0-9]/g, ''))} type="text" maxLength={5} placeholder="e.g. 54000" className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-primary text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Phone Number*</label>
                    <input required value={form.phone} onChange={(e) => handleInputChange('phone', e.target.value.replace(/[^0-9+]/g, ''))} type="tel" placeholder="+92 300 1234567" className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-primary text-sm" />
                  </div>
                </div>
              </div>

              <div className="mb-6 mt-4">
                <p className="font-bold text-navy border-b border-gray-100 pb-2 mb-4">Payment Method</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setMethod("card")}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition ${method === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}
                  >
                    <CreditCard size={20} />
                    <span className="font-bold text-xs">Credit Card</span>
                  </button>
                  <button 
                    onClick={() => setMethod("cod")}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition ${method === 'cod' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}
                  >
                    <Banknote size={20} />
                    <span className="font-bold text-xs">Cash on Delivery</span>
                  </button>
                </div>
              </div>

              {method === "card" && (
                <div className="space-y-4">
                  <p className="font-bold text-navy border-b border-gray-100 pb-2">Payment (Card)</p>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Card Number</label>
                    <input required autoComplete="cc-number" type="text" inputMode="numeric" value={form.cardNumber} onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))} placeholder="0000 0000 0000 0000" maxLength={19} className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-primary font-mono text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Expiry Date</label>
                      <input required autoComplete="cc-exp" type="text" inputMode="numeric" value={form.expiryDate} onChange={(e) => handleInputChange('expiryDate', formatExpiry(e.target.value))} placeholder="MM/YY" maxLength={5} className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-primary font-mono text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">CVC</label>
                      <input required autoComplete="off" type="text" inputMode="numeric" value={form.cvc} onChange={(e) => handleInputChange('cvc', e.target.value.replace(/[^0-9]/g, ''))} placeholder="123" maxLength={4} className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-primary font-mono text-sm" />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="font-bold text-navy mb-2">Order Summary</p>
                {state.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-bold">Rs.{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
                  <span>Total</span><span>Rs.{state.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={handlePlaceOrder}
                  disabled={!form.house || !form.street || !form.phone}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Place Order 🎉
                </button>
                <button onClick={() => setStep("cart")} className="w-full text-center text-gray-500 text-sm mt-3 hover:text-navy transition">
                  ← Back to basket
                </button>
              </div>
            </div>
          )}

          {step === "placed" && (
            <div className="flex-grow p-8 flex flex-col items-center justify-center text-center gap-5">
              <div className="text-7xl animate-bounce">🎉</div>
              <h3 className="font-heading font-bold text-navy text-3xl">Order Placed!</h3>
              <p className="text-gray-600 font-medium">Your food is being prepared. Estimated delivery: 25-35 minutes.</p>
              <div className="bg-success/10 text-success font-bold text-sm px-6 py-3 rounded-xl">
                Order ID: {placedOrderId}
              </div>
              <button
                onClick={() => { closeModal(); window.location.href = "/track"; }}
                className="px-8 py-3 bg-primary text-white rounded-pill font-bold hover:bg-primary/90 transition"
              >
                Track My Order
              </button>
              <button onClick={closeModal} className="text-gray-500 text-sm hover:text-navy transition">
                Continue Shopping
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
