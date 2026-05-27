'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Bike, DollarSign, User as UserIcon } from 'lucide-react';

export default function RiderLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/?login=true');
      } else if (user.role !== 'RIDER') {
        router.push('/');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const navItems = [
    { href: '/rider', icon: Bike, label: 'Deliveries' },
    { href: '/rider/earnings', icon: DollarSign, label: 'Earnings' },
    { href: '/rider/profile', icon: UserIcon, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 md:bg-gray-200 flex justify-center">
      {/* Mobile constraint container for desktop view */}
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex flex-col items-center gap-1 p-2 ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <item.icon size={24} className={isActive ? 'fill-primary/20' : ''} />
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
      </div>
    </div>
  );
}
