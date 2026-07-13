'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Check, X, Clock, ChefHat, ShoppingBag, PhoneCall, MapPin } from 'lucide-react';
import { toast } from 'sonner';

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  customer: { fullName: string; phone: string };
  createdAt: string;
  items: any[];
  specialInstructions?: string;
};

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Poll for new orders every 10 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if ((user as any)?.restaurantId) {
      loadOrders(); // Initial load
      interval = setInterval(loadOrders, 10000);
    }
    return () => clearInterval(interval);
  }, [user]);

  const loadOrders = async () => {
    if (!(user as any)?.restaurantId) return;
    try {
      // Fetch only active orders
      const res = await api.get(`/restaurants/${(user as any)?.restaurantId}/orders?limit=50`);
      // Filter out DELIVERED and CANCELLED in frontend for simplicity since we want all active
      const activeOrders = res.data.data.filter((o: Order) => !['DELIVERED', 'CANCELLED', 'ON_THE_WAY'].includes(o.status));
      setOrders(activeOrders);
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      loadOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    }
  };

  const cancelOrder = async (orderId: string) => {
    const reason = window.prompt("Reason for cancellation?");
    if (reason === null) return;
    try {
      await api.put(`/orders/${orderId}/status`, { status: 'CANCELLED', reason });
      toast.success('Order cancelled');
      loadOrders();
    } catch (err: any) {
      toast.error('Failed to cancel order');
    }
  };

  // Group orders
  const newOrders = orders.filter(o => o.status === 'PENDING');
  const preparingOrders = orders.filter(o => ['ACCEPTED', 'PREPARING'].includes(o.status));
  const readyOrders = orders.filter(o => o.status === 'READY');

  const OrderCard = ({ order, type }: { order: Order, type: 'new' | 'prep' | 'ready' }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${
        type === 'new' ? 'border-l-blue-500' : type === 'prep' ? 'border-l-yellow-500' : 'border-l-success'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-navy">#{order.orderNumber.split('-')[2]}</h4>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="text-right">
          <p className="font-black text-primary">Rs.{order.total}</p>
          <p className="text-xs font-bold text-gray-400">{order.items.length} items</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-navy"><span className="font-bold text-primary mr-2">{item.quantity}x</span> {item.menuItem.name} {item.sizeName !== 'Regular' && <span className="text-xs text-gray-500">({item.sizeName})</span>}</span>
          </div>
        ))}
        {order.specialInstructions && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-red-500 font-bold flex items-center gap-1">Note: {order.specialInstructions}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4 text-xs text-gray-600">
        <div className="flex items-center gap-1"><img src="/fallback-avatar.png" className="w-5 h-5 rounded-full" onError={(e) => e.currentTarget.style.display='none'} /> {order.customer.fullName}</div>
        <span>•</span>
        <div className="flex items-center gap-1"><PhoneCall size={12} /> {order.customer.phone || 'No phone'}</div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        {type === 'new' && (
          <>
            <button onClick={() => cancelOrder(order.id)} className="py-2.5 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-500 hover:bg-gray-100 transition flex items-center justify-center gap-2">
              <X size={16} /> Reject
            </button>
            <button onClick={() => updateStatus(order.id, 'PREPARING')} className="py-2.5 rounded-xl text-sm font-bold bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-500/30 transition flex items-center justify-center gap-2">
              <Check size={16} /> Accept & Prep
            </button>
          </>
        )}
        {type === 'prep' && (
          <>
            <div className="col-span-2">
              <button onClick={() => updateStatus(order.id, 'READY')} className="w-full py-2.5 rounded-xl text-sm font-bold bg-yellow-500 text-white hover:bg-yellow-600 shadow-md shadow-yellow-500/30 transition flex items-center justify-center gap-2">
                <ChefHat size={16} /> Mark as Ready
              </button>
            </div>
          </>
        )}
        {type === 'ready' && (
          <>
            <div className="col-span-2">
              <button disabled className="w-full py-2.5 rounded-xl text-sm font-bold border-2 border-success/30 text-success bg-success/5 flex items-center justify-center gap-2">
                <ShoppingBag size={16} /> Waiting for Rider...
              </button>
              {/* Optional: if restaurant delivers itself, they can mark DELIVERED here. But usually rider does it. */}
               <button onClick={() => updateStatus(order.id, 'DELIVERED')} className="w-full mt-2 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-navy hover:underline text-center">
                 Force Mark Delivered (Self Delivery)
               </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 focus:outline-none border-4 border-primary border-t-transparent rounded-full shadow-sm"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-black text-navy">Live Orders</h1>
          <p className="text-gray-500 mt-1">Manage current kitchen flow and active tickets.</p>
        </div>
        <div className="text-right">
           <span className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 font-bold text-navy">
             <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div> Live Sync Active
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Column 1: NEW */}
        <div className="bg-gray-100 rounded-3xl p-4 min-h-[calc(100vh-200px)]">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-heading font-black text-gray-700">New Orders</h3>
            <span className="bg-blue-500 text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center">{newOrders.length}</span>
          </div>
          <div className="space-y-4">
            <AnimatePresence>
              {newOrders.map(order => <OrderCard key={order.id} order={order} type="new" />)}
            </AnimatePresence>
            {newOrders.length === 0 && (
              <p className="text-center text-gray-400 py-10 font-medium">No new orders</p>
            )}
          </div>
        </div>

        {/* Column 2: PREPARING */}
        <div className="bg-gray-100 rounded-3xl p-4 min-h-[calc(100vh-200px)]">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-heading font-black text-gray-700">Preparing</h3>
            <span className="bg-yellow-500 text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center">{preparingOrders.length}</span>
          </div>
          <div className="space-y-4">
            <AnimatePresence>
               {preparingOrders.map(order => <OrderCard key={order.id} order={order} type="prep" />)}
            </AnimatePresence>
            {preparingOrders.length === 0 && (
              <p className="text-center text-gray-400 py-10 font-medium">Kitchen is clear</p>
            )}
          </div>
        </div>

        {/* Column 3: READY */}
        <div className="bg-gray-100 rounded-3xl p-4 min-h-[calc(100vh-200px)]">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-heading font-black text-gray-700">Ready for Pickup</h3>
            <span className="bg-success text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center">{readyOrders.length}</span>
          </div>
          <div className="space-y-4">
            <AnimatePresence>
               {readyOrders.map(order => <OrderCard key={order.id} order={order} type="ready" />)}
            </AnimatePresence>
            {readyOrders.length === 0 && (
              <p className="text-center text-gray-400 py-10 font-medium">No orders waiting</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
