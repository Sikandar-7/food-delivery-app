"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Copy } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: string;
  discountValue: number;
  minOrderValue: number;
  validTo: string;
  timesUsed: number;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/admin/coupons');
      if (res.data.success) {
        setCoupons(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading coupons...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-heading font-bold text-navy text-lg">Discount Coupons</h3>
        <button className="bg-navy text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-navy/90 transition">
          + Create Coupon
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-page-bg text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">Type & Value</th>
              <th className="px-6 py-4 font-medium">Min Order</th>
              <th className="px-6 py-4 font-medium">Expiry</th>
              <th className="px-6 py-4 font-medium">Used</th>
              <th className="px-6 py-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/20">
                      {coupon.code}
                    </span>
                    <button className="text-gray-400 hover:text-navy p-1 transition" title="Copy Code">
                      <Copy size={16} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-navy">
                    {coupon.type === 'PERCENTAGE' ? `${coupon.discountValue}%` : `Rs. ${coupon.discountValue}`}
                  </p>
                  <p className="text-xs text-gray-500">{coupon.type}</p>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-600">
                  {coupon.minOrderValue > 0 ? `Rs. ${coupon.minOrderValue}` : 'None'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                   {new Date(coupon.validTo).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-navy">
                  {coupon.timesUsed}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {coupon.isActive ? 'Active' : 'Expired'}
                  </span>
                </td>
              </tr>
            ))}
            
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No coupons created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
