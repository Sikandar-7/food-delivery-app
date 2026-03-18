"use client";

import { useModal } from "@/context/ModalContext";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Wallet, Banknote, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CheckoutModal() {
  const { closeModal } = useModal();
  const { state, dispatch } = useCart();
  const router = useRouter();
  const [method, setMethod] = useState<"card" | "cod">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.house || !form.street || !form.phone) {
      alert("Please fill in all required delivery details (House, Street, Phone)");
      return;
    }
    setIsProcessing(true);
    
    // Simulate real payment API gateway duration
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Complete the order feeling
      dispatch({ type: "CLEAR_CART" });
      
      // Auto redirect to tracking after success msg
      setTimeout(() => {
        closeModal();
        router.push('/track');
      }, 2500);
      
    }, 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-xl mx-auto w-full relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!isProcessing && !isSuccess ? (
          <motion.div
            key="checkout-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-2xl md:text-3xl font-heading font-black text-navy mb-6 text-center">Checkout</h2>
            
            <div className="mb-8 space-y-4">
              <h3 className="font-bold text-navy border-b border-gray-100 pb-2">Delivery Details</h3>
              
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

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
                <input value={form.email} onChange={(e) => handleInputChange('email', e.target.value)} type="email" placeholder="e.g. name@example.com" className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-primary text-sm" />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-navy mb-3">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setMethod("card")}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition ${method === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}
                >
                  <CreditCard size={24} />
                  <span className="font-bold text-sm">Credit Card</span>
                </button>
                <button 
                  onClick={() => setMethod("cod")}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition ${method === 'cod' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}
                >
                  <Banknote size={24} />
                  <span className="font-bold text-sm">Cash on Delivery</span>
                </button>
              </div>
            </div>

            <form onSubmit={handlePayment}>
              {method === "card" && (
                <div className="space-y-4 mb-8">
                  <h3 className="font-bold text-navy border-b border-gray-100 pb-2">Card Details</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Card Number</label>
                    <input 
                      required 
                      autoComplete="cc-number" 
                      type="text" 
                      inputMode="numeric"
                      value={form.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="0000 0000 0000 0000" 
                      maxLength={19} 
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-primary font-mono text-sm" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Expiry Date</label>
                      <input 
                        required 
                        autoComplete="cc-exp" 
                        type="text" 
                        inputMode="numeric"
                        value={form.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', formatExpiry(e.target.value))}
                        placeholder="MM/YY" 
                        maxLength={5} 
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-primary font-mono text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">CVC</label>
                      <input 
                        required 
                        autoComplete="off" 
                        type="text" 
                        inputMode="numeric"
                        value={form.cvc}
                        onChange={(e) => handleInputChange('cvc', e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="123" 
                        maxLength={4} 
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-primary font-mono text-sm" 
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 flex justify-between items-center mb-6">
                <span className="font-bold text-navy text-lg">Amount to Pay</span>
                <span className="text-2xl font-black text-navy">Rs.{state.total > 0 ? state.total.toFixed(2) : "3500.00"}</span>
              </div>

              <button 
                type="submit"
                className="w-full bg-success text-white font-black py-4 rounded-xl hover:bg-success/90 transition shadow-lg shadow-success/30 flex items-center justify-center gap-2"
              >
                Confirm & Pay <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        ) : isProcessing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="w-16 h-16 border-4 border-gray-100 border-t-primary rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-bold text-navy">Processing Payment...</h3>
            <p className="text-sm text-gray-500 mt-2">Please don't close this window</p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 text-success">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-navy mb-2">Payment Successful! 🎉</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Your order has been placed and confirmed by the restaurant. Redirecting you to track your order...</p>
            <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: "100%" }} 
                    transition={{ duration: 2.5 }}
                    className="h-full bg-primary"
                />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
