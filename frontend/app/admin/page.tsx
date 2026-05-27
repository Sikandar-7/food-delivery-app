"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  ShoppingBag, 
  CircleDollarSign, 
  Store, 
  Bike 
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AdminStats {
  totalOrdersToday: number;
  revenueToday: number;
  totalRestaurants: number;
  pendingApprovals: number;
  totalUsers: number;
  activeRiders: number;
  revenueChart: { day: string; revenue: number }[];
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

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold font-heading text-navy">Revenue Overview (Last 7 Days)</h3>
        </div>
        
        <div className="w-full h-72">
          {stats.revenueChart && stats.revenueChart.length > 0 ? (
            <Line 
              data={{
                labels: stats.revenueChart.map(point => point.day),
                datasets: [
                  {
                    label: 'Revenue (Rs.)',
                    data: stats.revenueChart.map(point => point.revenue),
                    borderColor: '#fc8a06',
                    backgroundColor: 'rgba(252, 138, 6, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#fc8a06',
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: '#f3f4f6' },
                    ticks: { callback: (value) => `Rs. ${value}` }
                  },
                  x: {
                    grid: { display: false }
                  }
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No revenue data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
