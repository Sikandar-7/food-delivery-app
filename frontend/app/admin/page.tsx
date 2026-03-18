"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  ShoppingBag, 
  CircleDollarSign, 
  Store, 
  Bike 
} from "lucide-react";

interface AdminStats {
  totalOrdersToday: number;
  revenueToday: number;
  totalRestaurants: number;
  pendingApprovals: number;
  totalUsers: number;
  activeRiders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl h-32"></div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Orders",
      value: stats.totalOrdersToday.toString(),
      icon: ShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Today's Revenue",
      value: `Rs. ${stats.revenueToday.toLocaleString()}`,
      icon: CircleDollarSign,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: "Pending Restaurants",
      value: stats.pendingApprovals.toString(),
      icon: Store,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      title: "Active Riders",
      value: stats.activeRiders.toString(),
      icon: Bike,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold font-heading text-navy">{card.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.bg} ${card.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold font-heading text-navy">Revenue Overview</h3>
          <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1 outline-none">
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
        
        <div className="h-64 w-full flex items-end justify-between gap-2 px-4 pb-4 border-b border-gray-100 relative">
          {/* Simple CSS Bar Chart Mockup */}
          {Array.from({ length: 7 }).map((_, i) => {
            const height = Math.floor(Math.random() * 80) + 20; // 20% to 100%
            const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            return (
              <div key={i} className="w-full flex justify-center group relative">
                <div 
                  className="w-full max-w-[40px] bg-primary/20 group-hover:bg-primary transition-colors rounded-t-sm"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="absolute -bottom-6 text-xs text-gray-400 font-medium">{days[i]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
