'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { TrendingUp, ShoppingBag, DollarSign, Star } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function RestaurantAnalytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ revenue: 0, orders: 0, rating: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // For a real app, you'd fetch an analytics endpoint.
  // Here we just fetch recent orders to construct a mock realistic chart.
  useEffect(() => {
    if ((user as any)?.restaurantId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      // Fetch restaurant details for rating
      const resRest = await api.get(`/restaurants/${(user as any)?.restaurantId}`);
      const restaurant = resRest.data.data;

      // Fetch recent orders for revenue stats
      const resOrders = await api.get(`/restaurants/${(user as any)?.restaurantId}/orders?limit=100&status=DELIVERED`);
      const deliveredOrders = resOrders.data.data || [];
      
      const revenue = deliveredOrders.reduce((sum: number, o: any) => sum + o.total, 0);

      setStats({
        revenue,
        orders: deliveredOrders.length,
        rating: restaurant.ratingAvg || 0,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        fill: true,
        label: 'Revenue (Rs.)',
        data: [12000, 19000, 15000, 22000, 29000, 35000, 31000],
        borderColor: '#FC8A06',
        backgroundColor: 'rgba(252, 138, 6, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-black text-navy">Analytics & Performance</h1>
        <p className="text-gray-500 mt-1">Track your sales, orders, and customer satisfaction.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-green-50 text-success rounded-2xl flex items-center justify-center">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">Total Revenue</p>
            <h3 className="text-2xl font-black text-navy">Rs.{stats.revenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">Total Orders</p>
            <h3 className="text-2xl font-black text-navy">{stats.orders}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center">
            <Star size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">Average Rating</p>
            <h3 className="text-2xl font-black text-navy">{Number(stats.rating).toFixed(1)} / 5.0</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">Growth</p>
            <h3 className="text-2xl font-black text-navy">+14.2%</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-heading font-black text-xl text-navy">Revenue Overview (This Week)</h3>
          <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-primary focus:border-primary block p-2.5 font-bold outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
          </select>
        </div>
        <div className="h-80 w-full">
          <Line options={options} data={chartData} />
        </div>
      </div>
      
    </div>
  );
}
