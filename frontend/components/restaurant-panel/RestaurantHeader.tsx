'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RestaurantHeader() {
  const { user } = useAuth();
  
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 lg:hidden">
        <button className="p-2 text-navy hover:bg-gray-50 rounded-xl">
          <Menu size={24} />
        </button>
        <span className="font-heading font-black text-xl text-navy">Owner Panel</span>
      </div>

      <div className="hidden lg:flex items-center gap-4 bg-gray-50 px-4 py-2.5 rounded-2xl w-96 border border-gray-100 focus-within:border-primary/30 focus-within:bg-white transition">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search orders, menu items..." 
          className="bg-transparent border-none outline-none w-full text-sm text-navy placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-400 hover:text-navy transition">
          <Bell size={24} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary border-2 border-white rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-navy">{user?.fullName}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role.replace('_', ' ').toLowerCase()}</p>
          </div>
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.fullName?.charAt(0) || 'O'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
