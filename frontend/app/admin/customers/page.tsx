"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { User } from "lucide-react";

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  createdAt: string;
  isActive: boolean;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/admin/users');
        if (res.data.success) {
          setCustomers(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading customers...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-heading font-bold text-navy text-lg">Platform Customers</h3>
        <p className="text-sm text-gray-500 font-medium">Total: {customers.length}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-page-bg text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium">Joined Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {customers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {user.fullName?.charAt(0) || <User size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-navy text-sm">{user.fullName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-navy">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.phone || 'No phone'}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                   {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.isActive ? 'Active' : 'Suspended'}
                  </span>
                </td>
              </tr>
            ))}
            
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
