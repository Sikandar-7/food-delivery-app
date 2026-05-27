'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Menu, BarChart3, Settings, LogOut, Store } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const menuItems = [
  { icon: LayoutDashboard, label: 'Live Orders', href: '/restaurant-panel/dashboard' },
  { icon: Menu, label: 'Menu Management', href: '/restaurant-panel/menu' },
  { icon: BarChart3, label: 'Analytics', href: '/restaurant-panel/analytics' },
  { icon: Settings, label: 'Settings', href: '/restaurant-panel/settings' },
];

export default function RestaurantSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Try to load restaurant status
  const loadStatus = async () => {
    try {
      if ((user as any)?.restaurantId) {
        const res = await api.get(`/restaurants/${(user as any).restaurantId}`);
        setIsOpen(res.data.data.isOpen);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if ((user as any)?.restaurantId) {
      loadStatus();
    }
  }, [user]);

  const toggleStatus = async () => {
    if (!(user as any)?.restaurantId) return;
    try {
      const res = await api.put(`/restaurants/${(user as any).restaurantId}/status`, { isOpen: !isOpen });
      setIsOpen(res.data.data.isOpen);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user || user.role !== 'RESTAURANT_OWNER') {
    return null; // Will be handled by protection wrapper
  }

  return (
    <aside className="w-64 bg-navy text-white min-h-screen flex flex-col hidden lg:flex fixed left-0 top-0">
      {/* Brand */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <Store className="text-primary" size={28} />
        <div>
          <span className="font-heading font-black text-2xl tracking-tight">Owner<span className="text-primary">.Panel</span></span>
          <p className="text-xs text-white/60">{user.fullName}</p>
        </div>
      </div>

      {/* Store Status Toggle */}
      <div className="p-6 border-b border-white/10">
        <p className="text-xs text-white/50 mb-3 font-bold uppercase tracking-wider">Restaurant Status</p>
        <button
          onClick={toggleStatus}
          className={`w-full relative flex items-center justify-between p-3 rounded-2xl transition font-bold ${
            isOpen ? 'bg-success/20 text-success border border-success/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'
          }`}
        >
          <span>{isOpen ? 'OPEN FOR ORDERS' : 'STORE CLOSED'}</span>
          <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-success animate-pulse' : 'bg-red-500'}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition group relative ${
                isActive ? 'bg-primary text-white font-bold' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div layoutId="sidebar-active" className="absolute left-0 top-0 w-1 h-full bg-white rounded-r-lg" />
              )}
              <item.icon size={20} className={isActive ? 'text-white' : 'text-white/40 group-hover:text-primary'} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition"
        >
          <LogOut size={20} />
          <span className="font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
