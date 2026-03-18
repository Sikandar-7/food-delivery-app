"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  Users, 
  Ticket, 
  Bike, 
  Settings, 
  LogOut 
} from "lucide-react";

const NAV_LINKS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Restaurants", href: "/admin/restaurants", icon: Store },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Riders", href: "/admin/riders", icon: Bike },
  { name: "Coupons", href: "/admin/coupons", icon: Ticket },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-navy text-white h-screen fixed top-0 left-0 flex flex-col z-50">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-heading font-extrabold tracking-tight">
          <span className="text-primary">Order</span>.pk
        </h1>
        <p className="text-xs text-white/50 tracking-wider uppercase mt-1">Super Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin');
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive 
                  ? "bg-primary text-white font-bold" 
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-400 hover:bg-red-400/10 transition font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
