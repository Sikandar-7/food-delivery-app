'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Wallet, TrendingUp, History, DollarSign, Calendar } from 'lucide-react';

type Earnings = {
  totalEarned: number;
  completedDeliveries: number;
  history: any[];
};

export default function RiderEarnings() {
  const [earnings, setEarnings] = useState<Earnings>({ totalEarned: 0, completedDeliveries: 0, history: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const res = await api.get('/rider/earnings');
      setEarnings(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading earnings...</div>;

  return (
    <div className="pb-10">
      <div className="bg-navy px-6 pt-12 pb-6 text-white rounded-b-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black font-heading">Earnings</h1>
          <Wallet className="text-primary" />
        </div>
        
        <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/10 text-center">
          <p className="text-xs text-white/60 mb-1 uppercase tracking-wider font-bold">Total Earned</p>
          <h2 className="text-4xl font-black text-primary">Rs.{earnings.totalEarned.toLocaleString()}</h2>
          <div className="flex justify-center items-center gap-4 mt-6">
            <div>
              <p className="text-xs text-white/50 mb-1">Deliveries</p>
              <p className="font-bold text-lg">{earnings.completedDeliveries}</p>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div>
              <p className="text-xs text-white/50 mb-1">This Week</p>
              <p className="font-bold text-lg text-success flex items-center gap-1"><TrendingUp size={14} /> +12%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-heading font-black text-lg text-navy mb-4 flex items-center gap-2">
          <History size={20} className="text-primary" /> Recent Transactions
        </h3>
        
        <div className="space-y-3">
          {earnings.history.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">No recent earnings history.</div>
          ) : (
            earnings.history.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 text-success flex items-center justify-center">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy text-sm">Delivery Payout</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Calendar size={10} /> {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-success">+Rs.{item.amount}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
