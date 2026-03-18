"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

export function AdminHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard Overview";
    const pathParts = pathname.split("/").filter(Boolean);
    if (pathParts.length > 1) {
      const mainPath = pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1);
      return mainPath;
    }
    return "Admin Panel";
  };

  return (
    <header className="bg-white border-b border-gray-100 h-20 px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <h2 className="text-2xl font-bold text-navy font-heading">{getPageTitle()}</h2>
      
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 text-sm transition"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-white"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-navy">{user?.fullName || "Admin"}</p>
            <p className="text-xs text-gray-500">{user?.role || "SUPER_ADMIN"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold">
            {user?.fullName?.charAt(0) || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
