"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  Store, 
  Bike, 
  CreditCard 
} from "lucide-react";

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  orderType: string;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  specialInstructions: string | null;
  createdAt: string;
  deliveryAddress: string;
  restaurant: {
    name: string;
    phone: string;
    addressLine1: string;
  };
  customer: {
    fullName: string;
    phone: string;
  };
  rider: {
    user: { fullName: string; phone: string; };
  } | null;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    itemTotal: number;
    menuItem: { name: string; imageUrl: string | null; };
  }>;
}

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.data);
        } else {
          setError(res.data.message);
        }
      } catch (err: any) {
        setError("Failed to load order. It may not exist.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Package size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold font-heading text-navy mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6">{error || "The requested order could not be found."}</p>
        <button 
          onClick={() => router.push('/admin/orders')}
          className="bg-navy text-white px-6 py-2 rounded-xl font-medium hover:bg-navy/90 transition"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'ON_THE_WAY': return 'bg-blue-100 text-blue-700';
      case 'PREPARING': return 'bg-orange-100 text-orange-700';
      case 'READY': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const statusProgress = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'ON_THE_WAY', 'DELIVERED'];
  const currentIndex = statusProgress.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-navy hover:bg-gray-50 transition border border-gray-100 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-heading text-navy">Order #{order.orderNumber}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <Clock size={14} />
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Timeline */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
            <h3 className="font-bold text-navy mb-6">Order Status</h3>
            {order.status === 'CANCELLED' ? (
              <div className="bg-red-50 text-red-700 font-medium p-4 rounded-xl text-center">
                This order has been cancelled.
              </div>
            ) : (
              <div className="relative flex justify-between">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-success -translate-y-1/2 z-0 transition-all duration-500"
                  style={{ width: `${(currentIndex / (statusProgress.length - 1)) * 100}%` }}
                ></div>
                
                {statusProgress.map((status, index) => (
                  <div key={status} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center bg-white
                      ${index <= currentIndex ? 'border-success' : 'border-gray-200'}
                    `}></div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block
                      ${index <= currentIndex ? 'text-navy' : 'text-gray-400'}
                    `}>
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Items & Bill */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
              <h3 className="font-bold text-navy flex items-center gap-2">
                <Package size={18} /> Order Items
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl font-bold text-gray-400">
                      {item.quantity}x
                    </div>
                    <div>
                      <p className="font-bold text-navy">{item.menuItem.name}</p>
                      <p className="text-sm text-gray-500">Rs. {item.unitPrice}</p>
                    </div>
                  </div>
                  <span className="font-bold text-navy">Rs. {item.itemTotal}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-page-bg p-6 rounded-b-2xl space-y-3">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>Rs. {order.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Delivery Fee</span>
                <span>Rs. {order.deliveryFee}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-success text-sm font-medium">
                  <span>Discount</span>
                  <span>- Rs. {order.discountAmount}</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-200 flex justify-between font-black text-navy text-lg">
                <span>Total</span>
                <span className="text-primary">Rs. {order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Info Cards */}
        <div className="space-y-6">
          
          {/* Customer Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
            <h3 className="font-bold text-navy mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
              <User size={18} className="text-gray-400" /> Customer
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Name</p>
                <p className="font-medium text-navy">{order.customer?.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1"><Phone size={12}/> Phone</p>
                <p className="font-medium text-navy">{order.customer?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1"><MapPin size={12}/> Delivery Address</p>
                <p className="text-sm text-navy">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
            <h3 className="font-bold text-navy mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
              <Store size={18} className="text-gray-400" /> Restaurant
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Name</p>
                <p className="font-medium text-navy">{order.restaurant?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1"><Phone size={12}/> Phone</p>
                <p className="font-medium text-navy">{order.restaurant?.phone || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Rider Info (If assigned) */}
          {order.rider && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
                <Bike size={18} className="text-gray-400" /> Delivery Rider
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Name</p>
                  <p className="font-medium text-navy">{order.rider.user.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1"><Phone size={12}/> Phone</p>
                  <p className="font-medium text-navy">{order.rider.user.phone || "N/A"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
            <h3 className="font-bold text-navy mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
              <CreditCard size={18} className="text-gray-400" /> Payment details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Method</span>
                <span className="font-bold text-navy bg-gray-100 px-3 py-1 rounded-lg text-xs">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`font-bold px-3 py-1 rounded-lg text-xs ${order.paymentStatus === 'PAID' ? 'bg-success/10 text-success' : 'bg-orange-100 text-orange-700'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
