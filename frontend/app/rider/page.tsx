'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { MapPin, Navigation, PhoneCall, CheckCircle2, AlertTriangle, ShieldCheck, Bike } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRiderState();
    // Poll for order if online and no active order
    const interval = setInterval(() => {
      if (isOnline) loadRiderState();
    }, 15000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const loadRiderState = async () => {
    try {
      // 1. Get profile/status to check if online
      const profileRes = await api.get('/rider/earnings'); // We can use earnings or profile endpoint to get rider data
      // Actually we don't have a GET /api/rider/profile yet, let's just assume we manage online state via toggle
      // Wait we have active order endpoint
      const orderRes = await api.get('/rider/current-order');
      if (orderRes.data.data) {
        setActiveOrder(orderRes.data.data);
        setIsOnline(true);
      } else {
        setActiveOrder(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOnline = async () => {
    try {
      const newState = !isOnline;
      await api.put('/rider/status', { isOnline: newState });
      setIsOnline(newState);
      toast.success(newState ? "You are now ONLINE" : "You are now OFFLINE");
    } catch (e) {
      toast.error('Failed to change status');
    }
  };

  const updateDeliveryStatus = async (status: string) => {
    try {
      if (!activeOrder) return;
      await api.put(`/orders/${activeOrder.id}/status`, { status });
      toast.success(`Order marked as ${status.replace('_', ' ')}`);
      loadRiderState();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="pb-10">
      {/* Header Profile / Status Toggle */}
      <div className="bg-navy px-6 pt-12 pb-6 text-white rounded-b-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black font-heading">Rider App</h1>
            <p className="text-white/60 text-sm flex items-center gap-1 mt-1">
              <ShieldCheck size={14} className="text-success" /> Verified Partner
            </p>
          </div>
          <button 
            onClick={toggleOnline}
            className={`w-16 h-8 rounded-full flex items-center p-1 transition-colors ${
              isOnline ? 'bg-success' : 'bg-white/20'
            }`}
          >
            <motion.div 
              animate={{ x: isOnline ? 32 : 0 }} 
              className="w-6 h-6 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>
        
        <div className="bg-white/10 p-4 rounded-2xl flex items-center justify-between backdrop-blur-md border border-white/10">
          <div>
            <p className="text-xs text-white/60 mb-1 uppercase tracking-wider font-bold">Current Status</p>
            <p className={`font-black text-lg ${isOnline ? 'text-success' : 'text-gray-400'}`}>
              {isOnline ? 'ONLINE & READY' : 'OFFLINE'}
            </p>
          </div>
          {isOnline && (
            <div className="w-3 h-3 bg-success rounded-full animate-ping" />
          )}
        </div>
      </div>

      <div className="p-6">
        {/* State: Offline */}
        {!isOnline && (
          <div className="mt-10 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bike size={40} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-black text-navy mb-2">You&apos;re Offline</h2>
            <p className="text-gray-500 text-sm">Go online to start receiving delivery requests and earning money.</p>
            <button 
              onClick={toggleOnline}
              className="mt-8 bg-black text-white px-8 py-3.5 rounded-full font-bold shadow-xl shadow-black/20"
            >
              GO ONLINE NOW
            </button>
          </div>
        )}

        {/* State: Online & Searching */}
        {isOnline && !activeOrder && (
          <div className="mt-16 text-center px-4">
             <div className="relative w-32 h-32 mx-auto mb-6">
               <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping"></div>
               <div className="absolute inset-2 border-4 border-primary/40 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
               <div className="absolute inset-4 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 z-10">
                  <Navigation size={40} />
               </div>
             </div>
             <h2 className="text-2xl font-black text-navy mb-2">Finding Orders...</h2>
             <p className="text-gray-500 text-sm">Stay near popular restaurants to get requests faster.</p>
          </div>
        )}

        {/* State: Active Order */}
        <AnimatePresence>
          {isOnline && activeOrder && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              className="space-y-4"
            >
              {activeOrder.status === 'READY' && (
                <div className="bg-orange-50 text-orange-800 p-4 rounded-2xl flex gap-3 text-sm font-bold border border-orange-200 shadow-sm animate-pulse">
                  <AlertTriangle size={20} className="shrink-0" />
                  <p>Order is READY at the restaurant. Please proceed to pickup immediately.</p>
                </div>
              )}

              {/* Pickup Details */}
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="flex items-center gap-2 mb-1 text-blue-500 font-bold tracking-wide text-xs uppercase">
                  <MapPin size={14} /> Pickup Point
                </div>
                <h3 className="text-xl font-black text-navy">{activeOrder.restaurant.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{activeOrder.restaurant.addressLine1}</p>
                <div className="flex gap-2 mt-4">
                  <a href={`tel:${activeOrder.restaurant.phone}`} className="flex-1 bg-gray-50 hover:bg-gray-100 text-navy font-bold py-2.5 rounded-xl text-center text-sm transition flex items-center justify-center gap-2">
                    <PhoneCall size={16} /> Restaurant
                  </a>
                  <a href={`https://maps.google.com/?q=${activeOrder.restaurant.addressLine1}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-2.5 rounded-xl text-center text-sm transition flex items-center justify-center gap-2">
                    <Navigation size={16} /> Direction
                  </a>
                </div>
              </div>

              {/* Dropoff Details */}
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-success"></div>
                <div className="flex items-center gap-2 mb-1 text-success font-bold tracking-wide text-xs uppercase">
                  <MapPin size={14} /> Customer Dropoff
                </div>
                <h3 className="text-xl font-black text-navy">{activeOrder.customer.fullName}</h3>
                <p className="text-gray-500 text-sm mt-1">{activeOrder.deliveryAddress?.line1}, {activeOrder.deliveryAddress?.city}</p>
                <div className="flex gap-2 mt-4">
                  <a href={`tel:${activeOrder.customer.phone}`} className="flex-1 bg-gray-50 hover:bg-gray-100 text-navy font-bold py-2.5 rounded-xl text-center text-sm transition flex items-center justify-center gap-2">
                    <PhoneCall size={16} /> Call Customer
                  </a>
                </div>
              </div>

              {/* Order Info & Collect Money */}
              <div className="bg-gray-900 text-white p-5 rounded-3xl shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Order Total</p>
                    <p className="text-2xl font-black text-primary">Rs.{activeOrder.total}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Payment</p>
                    <p className="font-bold">{activeOrder.paymentMethod === 'CASH' ? 'Collect Cash' : 'Paid Online'}</p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 mb-4">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-2">Order Items ({activeOrder.items.length})</p>
                  <div className="space-y-1">
                    {activeOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-2 text-sm justify-between">
                        <span className="text-white"><span className="text-primary font-bold mr-1">{item.quantity}x</span> {item.menuItem.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  {['PENDING', 'ACCEPTED', 'PREPARING', 'READY'].includes(activeOrder.status) && (
                    <button 
                      onClick={() => updateDeliveryStatus('ON_THE_WAY')}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black py-4 rounded-xl transition shadow-lg shadow-blue-500/20"
                    >
                      MARK AS PICKED UP
                    </button>
                  )}
                  {activeOrder.status === 'ON_THE_WAY' && (
                    <button 
                      onClick={() => updateDeliveryStatus('DELIVERED')}
                      className="w-full bg-success hover:bg-[#00a850] text-white font-black py-4 rounded-xl transition shadow-lg shadow-success/20 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={24} /> MARK DELIVERED
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
