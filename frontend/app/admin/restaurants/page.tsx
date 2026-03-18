"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { CheckCircle2, XCircle, MoreVertical } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  city: string;
  isActive: string | boolean;
  isOpen: boolean;
  owner: {
    fullName: string;
    email: string;
  };
  _count: {
    orders: number;
  };
  createdAt: string;
}

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const res = await api.get('/admin/restaurants');
      if (res.data.success) {
        setRestaurants(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean | string) => {
    try {
      const action = currentStatus ? 'suspend' : 'activate';
      const res = await api.put(`/admin/restaurants/${id}/${action}`);
      if (res.data.success) {
        fetchRestaurants(); // Refresh list
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading restaurants...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-heading font-bold text-navy text-lg">Manage Restaurants</h3>
        <button className="bg-navy text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-navy/90 transition">
          + Add Restaurant
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-page-bg text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Restaurant</th>
              <th className="px-6 py-4 font-medium">Owner</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Orders</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {restaurants.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <p className="font-bold text-navy">{req.name}</p>
                  <p className="text-xs text-gray-500">/{req.slug}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-navy">{req.owner?.fullName}</p>
                  <p className="text-xs text-gray-500">{req.owner?.email}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{req.city}</td>
                <td className="px-6 py-4 text-sm font-bold text-navy">{req._count?.orders || 0}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    req.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {req.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {req.isActive ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => toggleStatus(req.id, req.isActive)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                      req.isActive 
                        ? 'border-orange-200 text-orange-600 hover:bg-orange-50' 
                        : 'border-green-200 text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {req.isActive ? 'Suspend' : 'Activate'}
                  </button>
                  <button className="ml-2 text-gray-400 hover:text-navy transition p-1">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
            
            {restaurants.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No restaurants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
