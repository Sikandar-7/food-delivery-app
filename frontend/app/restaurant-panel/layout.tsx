'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import RestaurantSidebar from '@/components/restaurant-panel/RestaurantSidebar';
import RestaurantHeader from '@/components/restaurant-panel/RestaurantHeader';

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in
        router.push('/?login=true');
      } else if (user.role !== 'RESTAURANT_OWNER' && user.role !== 'SUPER_ADMIN') {
        // Logged in but not a restaurant owner or admin
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <RestaurantSidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <RestaurantHeader />
        <main className="flex-1 p-8 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
